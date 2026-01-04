const mongoose = require('mongoose');

const gamificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  points: {
    type: Number,
    default: 0
  },
  badge: {
    type: String,
    enum: ['None', 'Silver', 'Gold'],
    default: 'None'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Gamification', gamificationSchema);
