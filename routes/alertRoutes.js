const express = require('express');
const router = express.Router();
const {
  getUserAlerts,
  markAsRead,
  createAlert
} = require('../controllers/alertController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, getUserAlerts);
router.put('/:id/read', protect, markAsRead);
router.post('/', protect, admin, createAlert);

module.exports = router;
