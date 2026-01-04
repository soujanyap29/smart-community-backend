const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  qrCode: {
    type: String,
    required: true,
    unique: true
  },
  visitorName: {
    type: String,
    required: true
  },
  visitorPhone: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  expectedDate: {
    type: Date,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  residentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  entryTime: {
    type: Date
  },
  exitTime: {
    type: Date
  },
  verifiedBy: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Visitor', visitorSchema);
