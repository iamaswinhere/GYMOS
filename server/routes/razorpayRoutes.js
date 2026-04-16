const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Member = require('../models/Member');
const Payment = require('../models/Payment');
const { auth } = require('../middleware/auth');
const { jsPDF } = require("jspdf");
const { default: autoTable } = require("jspdf-autotable");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { amount, currency = 'INR' } = req.body;
    
    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency,
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Verify Payment and Renew Membership
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      memberId,
      durationMonths,
      amountPaid
    } = req.body;

    // 1. SIGNATURE VERIFICATION
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // 2. MEMBERSHIP RENEWAL LOGIC
    const member = await Member.findById(memberId);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    const now = new Date();
    const currentExpiry = new Date(member.expiryDate);
    const startDate = currentExpiry > now ? currentExpiry : now;
    
    const newExpiry = new Date(startDate);
    newExpiry.setMonth(newExpiry.getMonth() + parseInt(durationMonths));
    
    member.expiryDate = newExpiry;
    member.membershipStatus = 'active';
    member.lastRenewalDate = now;
    
    await member.save();

    // 3. STORE PAYMENT IN DATABASE
    const newPayment = new Payment({
      memberId: member._id,
      amount: amountPaid,
      paymentMethod: 'online',
      transactionId: razorpay_payment_id,
      planName: member.membershipPlan.name,
      status: 'success'
    });
    await newPayment.save();

    // 4. REAL-TIME DASHBOARD UPDATE
    if (req.io) {
        req.io.emit('paymentUpdate', {
          memberId: member._id,
          memberName: member.name,
          amount: amountPaid,
          date: now,
          plan: member.membershipPlan.name,
          type: 'renewal'
        });
    }

    // 5. GENERATE PDF BILL
    const doc = new jsPDF();
    
    doc.setFillColor(0, 0, 0);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 196, 0);
    doc.setFontSize(30);
    doc.setFont("helvetica", "bold");
    doc.text("GYMOS", 15, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text("ELITE MANAGEMENT PORTAL", 15, 32);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text("PAYMENT RECEIPT (ONLINE)", 15, 60);

    const tableData = [
      ["Receipt No:", `REC-${Date.now().toString().slice(-6)}`],
      ["Transaction ID:", razorpay_payment_id],
      ["Date:", now.toLocaleDateString()],
      ["Member Name:", member.name],
      ["Mobile:", member.mobileNumber],
      ["Plan:", member.membershipPlan.name],
      ["Duration:", `${durationMonths} Month(s)`],
      ["New Expiry:", newExpiry.toLocaleDateString()],
      ["Amount Paid:", `INR ${amountPaid}`]
    ];

    autoTable(doc, {
      startY: 70,
      body: tableData,
      theme: 'striped',
      styles: { fontSize: 12, cellPadding: 8 },
      columnStyles: { 0: { fontStyle: 'bold', width: 50 } }
    });

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 150;
    doc.text("Thank you for being a part of GYMOS!", 105, finalY + 30, { align: "center" });

    const pdfBase64 = doc.output('datauristring');

    res.json({ 
      success: true,
      member, 
      pdf: pdfBase64,
      message: 'Renewal successful',
      newExpiry: member.expiryDate
    });

  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
