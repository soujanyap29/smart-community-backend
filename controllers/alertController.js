const Alert = require('../models/Alert');

// Get User Alerts
exports.getUserAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: req.user.id })
      .sort('-createdAt')
      .limit(50);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark Alert as Read
exports.markAsRead = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create Alert (Admin) - Broadcasts to ALL users
exports.createAlert = async (req, res) => {
  try {
    const { message, type } = req.body;
    const User = require('../models/User');

    // Get all approved users (residents, admins, and security)
    const users = await User.find({ 
      approved: true,
      role: { $in: ['admin', 'resident', 'security'] }
    }).select('_id');

    // Create an alert for each user
    const alertPromises = users.map(user => 
      Alert.create({
        userId: user._id,
        message,
        type
      })
    );

    const alerts = await Promise.all(alertPromises);

    res.status(201).json({ 
      message: 'Alert broadcasted to all users',
      count: alerts.length,
      alerts 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
