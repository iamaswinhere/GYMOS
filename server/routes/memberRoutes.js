const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const Payment = require('../models/Payment');
const jwt = require('jsonwebtoken');
const { auth, adminOnly } = require('../middleware/auth');

// Login member
router.post('/login', async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    if (!mobileNumber) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }

    const member = await Member.findOne({ mobileNumber });
    if (!member) {
      return res.status(404).json({ message: 'No member found in this mobile number' });
    }

    // Check membership status and expiry
    const today = new Date();
    const expiryDate = new Date(member.expiryDate);

    if (member.membershipStatus !== 'active' || expiryDate < today) {
        return res.status(403).json({ 
            message: 'Your membership is inactive or expired. Please renew to continue.',
            member: member // Optionally send member info if you want to show details even when expired
        });
    }

    // CREATE JWT FOR MEMBER
    const token = jwt.sign(
      { id: member._id, role: 'member' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' } // Member app usually stays logged in longer
    );

    res.json({ token, member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new member (Admin Only)
router.post('/add', auth, adminOnly, async (req, res) => {
  try {
    const { name, mobileNumber, email, dateOfBirth, membershipPlan } = req.body;
    
    // Calculate expiry date based on plan
    const joiningDate = new Date();
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + parseInt(membershipPlan.durationMonths));

    const newMember = new Member({
      name,
      mobileNumber,
      email,
      dateOfBirth,
      membershipPlan,
      expiryDate,
      joiningDate
    });

    const savedMember = await newMember.save();

    // Store initial payment in DB
    const initialPayment = new Payment({
      memberId: savedMember._id,
      amount: membershipPlan.price,
      paymentMethod: 'online', // New signups through app are considered online
      planName: membershipPlan.name,
      status: 'success'
    });
    await initialPayment.save();

    res.status(201).json(savedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all members (Admin Only)
router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const members = await Member.find().sort({ joiningDate: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update member (Admin Only)
router.put('/update/:id', auth, adminOnly, async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete member (Admin Only)
router.delete('/delete/:id', auth, adminOnly, async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const { jsPDF } = require("jspdf");
const { default: autoTable } = require("jspdf-autotable");

// Renew membership (Admin Only or Token Protected)
router.post('/renew/:id', auth, adminOnly, async (req, res) => {
  try {
    const { durationMonths, amountPaid } = req.body;
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    // Extension logic...
    const now = new Date();
    const currentExpiry = new Date(member.expiryDate);
    const startDate = currentExpiry > now ? currentExpiry : now;
    
    const newExpiry = new Date(startDate);
    newExpiry.setMonth(newExpiry.getMonth() + parseInt(durationMonths));
    
    member.expiryDate = newExpiry;
    member.membershipStatus = 'active';
    member.lastRenewalDate = now;
    
    await member.save();

    // 0. STORE PAYMENT IN DATABASE
    const newPayment = new Payment({
      memberId: member._id,
      amount: amountPaid || member.membershipPlan.price,
      paymentMethod: 'online',
      planName: member.membershipPlan.name,
      status: 'success'
    });
    await newPayment.save();

    // 1. REAL-TIME DASHBOARD UPDATE
    req.io.emit('paymentUpdate', {
      memberId: member._id,
      memberName: member.name,
      amount: amountPaid || member.membershipPlan.price,
      date: now,
      plan: member.membershipPlan.name,
      type: 'renewal'
    });

    // 2. GENERATE PDF BILL
    const doc = new jsPDF();
    
    // Design matching GYMOS elite style
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
    doc.text("PAYMENT RECEIPT", 15, 60);

    const tableData = [
      ["Receipt No:", `REC-${Date.now().toString().slice(-6)}`],
      ["Date:", now.toLocaleDateString()],
      ["Member Name:", member.name],
      ["Mobile:", member.mobileNumber],
      ["Plan:", member.membershipPlan.name],
      ["Duration:", `${durationMonths} Month(s)`],
      ["New Expiry:", newExpiry.toLocaleDateString()],
      ["Amount Paid:", `INR ${amountPaid || member.membershipPlan.price}`]
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
      member, 
      pdf: pdfBase64,
      message: 'Renewal successful',
      newExpiry: member.expiryDate
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
