const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  approveUser,
  denyUser, 
  updateProfile,
  getUserById,
  setPayableAmount
} = require('../controllers/userController');

const { protect, admin } = require('../middleware/auth');
// Admin sets payable amount for a resident
router.put('/payable/:id', protect, admin, setPayableAmount);

router.get('/', protect, admin, getAllUsers);
// Specific routes before parameterized routes
router.put('/approve/:id', protect, admin, approveUser);
router.put('/deny/:id', protect, admin, denyUser);
router.put('/profile', protect, updateProfile);
router.put('/profile/:id', protect, admin, updateProfile);
router.get('/:id', protect, getUserById);

module.exports = router;
