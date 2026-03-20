const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  memberId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Member', 
    required: true 
  },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'online', 'card'], 
    default: 'cash' 
  },
  transactionId: { type: String },
  planName: { type: String },
  status: { type: String, enum: ['success', 'pending', 'failed'], default: 'success' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
