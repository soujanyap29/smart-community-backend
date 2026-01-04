const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/amenityController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, createBooking);
router.get('/user', protect, getUserBookings);
router.get('/all', protect, admin, getAllBookings);
router.put('/:id/status', protect, admin, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
