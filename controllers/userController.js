// Set Payable Amount for Resident (Admin) and generate QR
exports.setPayableAmount = async (req, res) => {
  try {
    const { amount } = req.body;
    if (typeof amount !== 'number' || amount < 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    // UPI QR generation logic
    const UPI_ID = process.env.SOCIETY_UPI_ID || 'mysociety@okicici';
    const UPI_NAME = process.env.SOCIETY_UPI_NAME || 'Smart Community';
    const note = 'Society Payment';
    const upiString = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    const upiQrUrl = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${encodeURIComponent(upiString)}`;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { payableAmount: amount, upiQrUrl },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Payable amount and QR set successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const User = require('../models/User');

// Get All Users (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve User (Admin)
exports.approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { approved: true, denied: false, rejectionReason: null },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User approved successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deny User (Admin)
exports.denyUser = async (req, res) => {
  try {
    console.log('Deny request received for user:', req.params.id);
    const { reason } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { 
        denied: true, 
        approved: false, 
        rejectionReason: reason || 'Your application was denied by the administrator' 
      },
      { new: true }
    ).select('-password');

    if (!user) {
      console.log('User not found:', req.params.id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User denied successfully:', user._id);
    res.json({ message: 'User denied successfully', user });
  } catch (error) {
    console.error('Error denying user:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, block, houseNumber, paymentDescription } = req.body;
    
    // If admin is updating another user, use params.id, else use req.user.id
    const userId = req.params.id || req.user.id;

    const updateData = { fullName, phone, block, houseNumber };
    
    // Only admin can update paymentDescription
    if (paymentDescription !== undefined && req.user.role === 'admin') {
      updateData.paymentDescription = paymentDescription;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
