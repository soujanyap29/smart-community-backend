const express = require('express');
const router = express.Router();
const {
  getUserGamification,
  getAllGamification,
  assignBadge
} = require('../controllers/gamificationController');
const { protect, admin } = require('../middleware/auth');

router.get('/user', protect, getUserGamification);
router.get('/all', protect, admin, getAllGamification);
router.put('/badge/:userId', protect, admin, assignBadge);

module.exports = router;
