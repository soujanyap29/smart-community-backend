const mongoose = require('mongoose');

const amenityBookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amenityName: {
    type: String,
    required: true,
    enum: ['Swimming Pool', 'Clubhouse', 'Gym', 'Banquet Hall', 'Guest Rooms', 'Garden Zone', 'Badminton Court', 'Parking Slots']
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'cancelled'],
    default: 'pending'
  },
  additionalInfo: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AmenityBooking', amenityBookingSchema);
