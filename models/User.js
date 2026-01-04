const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'resident', 'security'],
    default: 'resident'
  },
  block: {
    type: String,
    required: true
  },
  houseNumber: {
    type: String,
    required: true
  },
  approved: {
    type: Boolean,
    default: false
  },
  denied: {
    type: Boolean,
    default: false
  },
  rejectionReason: {
    type: String,
    default: null
  },
  payableAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  paymentDescription: {
    type: String,
    default: ''
  },
  upiQrUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
