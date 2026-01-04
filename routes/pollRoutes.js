const express = require('express');
const router = express.Router();
const {
  createPoll,
  getPolls,
  votePoll,
  closePoll
} = require('../controllers/pollController');
const { protect, admin } = require('../middleware/auth');

router.post('/', protect, admin, createPoll);
router.get('/', protect, getPolls);
router.post('/:id/vote', protect, votePoll);
router.put('/:id/close', protect, admin, closePoll);

module.exports = router;
