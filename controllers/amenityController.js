const AmenityBooking = require('../models/AmenityBooking');
const Alert = require('../models/Alert');
const Gamification = require('../models/Gamification');

// Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { amenityName, date, timeSlot, additionalInfo } = req.body;

    const booking = await AmenityBooking.create({
      userId: req.user.id,
      amenityName,
      date,
      timeSlot,
      additionalInfo
    });

    // Add points for booking
    await Gamification.findOneAndUpdate(
      { userId: req.user.id },
      { $inc: { points: 10 } }
    );

    // Create alert
    await Alert.create({
      userId: req.user.id,
      message: `Your ${amenityName} booking is pending approval`,
      type: 'booking'
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await AmenityBooking.find({ userId: req.user.id })
      .sort('-createdAt')
      .populate('userId', 'fullName email');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Bookings (Admin)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await AmenityBooking.find()
      .sort('-createdAt')
      .populate('userId', 'fullName email block houseNumber');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Booking Status (Admin)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await AmenityBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'fullName email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Create alert
    await Alert.create({
      userId: booking.userId._id,
      message: `Your ${booking.amenityName} booking has been ${status}`,
      type: 'booking'
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await AmenityBooking.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status: 'cancelled' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
