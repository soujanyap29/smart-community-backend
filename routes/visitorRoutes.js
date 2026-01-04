const express = require('express');
const router = express.Router();
const {
  generateQR,
  verifyVisitor,
  getUserVisitors,
  getAllPendingVisitors,
  checkInVisitor
} = require('../controllers/visitorController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generateQR);
router.post('/verify', protect, verifyVisitor);
router.get('/user', protect, getUserVisitors);
router.get('/pending', protect, getAllPendingVisitors);
router.put('/checkin/:id', protect, checkInVisitor);

module.exports = router;
