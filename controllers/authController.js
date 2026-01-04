const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Gamification = require('../models/Gamification');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Register User
exports.register = async (req, res) => {
  try {
    const { fullName, email, phone, password, block, houseNumber } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      block,
      houseNumber
    });

    // Create gamification entry
    await Gamification.create({ userId: user._id });

    res.status(201).json({
      message: 'Registration successful. Waiting for admin approval.',
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if denied
    if (user.denied) {
      return res.status(403).json({ 
        message: user.rejectionReason || 'Your application was denied by the administrator',
        denied: true
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if approved
    if (!user.approved) {
      return res.status(403).json({ message: 'Account pending approval' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        payableAmount: user.payableAmount,
        upiQrUrl: user.upiQrUrl
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Current User
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      ...user.toObject(),
      payableAmount: user.payableAmount,
      upiQrUrl: user.upiQrUrl
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
