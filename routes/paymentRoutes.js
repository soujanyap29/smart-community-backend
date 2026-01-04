const express = require('express');
const router = express.Router();
const {
  createPayment,
  getUserPayments,
  getAllPayments,
  bulkUpdateByUtr,
  verifyPayment
} = require('../controllers/paymentController');

const { protect, admin } = require('../middleware/auth');
// Admin uploads UTR list for reconciliation
router.post('/reconcile', protect, admin, bulkUpdateByUtr);

router.post('/', protect, createPayment);
router.get('/user', protect, getUserPayments);
router.get('/all', protect, admin, getAllPayments);
router.put('/:id/verify', protect, admin, verifyPayment); // Admin verifies payment

module.exports = router;
