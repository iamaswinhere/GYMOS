const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Member = require('../models/Member');
const Payment = require('../models/Payment');
const { auth } = require('../middleware/auth');

// Helper to init Razorpay conditionally so server doesn't crash on boot without keys
const getRazorpayInstance = () => {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new Error("Razorpay API keys are missing in the environment (.env)");
    }
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
};

// 1. Create a Payment Link (Protected: Member Only)
router.post('/create-link', auth, async (req, res) => {
    try {
        const durationMonths = req.body.durationMonths || 1;
        const member = await Member.findById(req.user);

        if (!member) return res.status(404).json({ message: "Member not found" });

        const amount = member.membershipPlan.price * 100; // Razorpay expects amount in paise (1 INR = 100 paise)

        const rzp = getRazorpayInstance();

        const paymentLinkRequest = {
            amount: amount,
            currency: "INR",
            accept_partial: false,
            description: `GYMOS Renewal - ${durationMonths} Month(s)`,
            customer: {
                name: member.name,
                contact: `+91${member.mobileNumber.replace(/\D/g, '').slice(-10)}`, // Ensure standard format
            },
            notify: {
                sms: true, // Razorpay can auto-send the link via SMS
                email: false
            },
            reminder_enable: true,
            notes: {
                memberId: member._id.toString(),
                durationMonths: durationMonths.toString(),
                planName: member.membershipPlan.name
            },
            callback_url: "https://gymos-mobile.vercel.app", // Redirect back to app after payment
            callback_method: "get"
        };

        const paymentLinkResponse = await rzp.paymentLink.create(paymentLinkRequest);

        res.json({
            success: true,
            paymentLink: paymentLinkResponse.short_url,
            orderId: paymentLinkResponse.id
        });

    } catch (error) {
        console.error("Razorpay link creation failed: ", error);
        res.status(500).json({ message: error.message || "Failed to create payment link" });
    }
});

// 2. Webhook to handle successful payments automatically
router.post('/webhook', async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!secret) return res.status(400).send("Webhook secret missing");

        const signature = req.headers['x-razorpay-signature'];
        
        // Re-stringify the mapped body to verify signature
        const shasum = crypto.createHmac('sha256', secret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest('hex');

        if (digest !== signature) {
            return res.status(400).send("Invalid signature");
        }

        const event = req.body;

        if (event.event === 'payment_link.paid') {
            const paymentLink = event.payload.payment_link.entity;
            const notes = paymentLink.notes;
            const memberId = notes.memberId;
            const durationMonths = parseInt(notes.durationMonths, 10);
            const planName = notes.planName;
            
            const member = await Member.findById(memberId);
            if (member) {
                 const now = new Date();
                 const currentExpiry = new Date(member.expiryDate);
                 const startDate = currentExpiry > now ? currentExpiry : now;
                 
                 const newExpiry = new Date(startDate);
                 newExpiry.setMonth(newExpiry.getMonth() + durationMonths);
                 
                 member.expiryDate = newExpiry;
                 member.membershipStatus = 'active';
                 member.lastRenewalDate = now;
                 
                 await member.save();

                 const newPayment = new Payment({
                    memberId: member._id,
                    amount: paymentLink.amount / 100,
                    paymentMethod: 'online',
                    transactionId: paymentLink.id,
                    planName: planName,
                    status: 'success'
                 });
                 await newPayment.save();

                 // Log verification in console
                 console.log(`✅ Automated Renewal Success: ${member.name} (${memberId})`);

                 if (req.io) {
                     req.io.emit('paymentUpdate', {
                        memberId: member._id,
                        memberName: member.name,
                        amount: paymentLink.amount / 100,
                        date: now,
                        plan: planName,
                        type: 'renewal'
                     });
                 }
            }
        }

        res.status(200).send('OK');
    } catch (error) {
        console.error("Webhook Error: ", error);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
