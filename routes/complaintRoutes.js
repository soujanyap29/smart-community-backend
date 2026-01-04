const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  updateComplaintStatus
} = require('../controllers/complaintController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, createComplaint);
router.get('/user', protect, getUserComplaints);
router.get('/all', protect, admin, getAllComplaints);
router.put('/:id/status', protect, admin, updateComplaintStatus);

module.exports = router;
