const Gamification = require('../models/Gamification');

// Get User Gamification
exports.getUserGamification = async (req, res) => {
  try {
    let gamification = await Gamification.findOne({ userId: req.user.id });
    
    if (!gamification) {
      gamification = await Gamification.create({ userId: req.user.id });
    }

    res.json(gamification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Gamification (Admin)
exports.getAllGamification = async (req, res) => {
  try {
    const gamifications = await Gamification.find()
      .populate('userId', 'fullName email')
      .sort('-points');
    res.json(gamifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign Badge (Admin)
exports.assignBadge = async (req, res) => {
  try {
    const { badge } = req.body;

    const gamification = await Gamification.findOneAndUpdate(
      { userId: req.params.userId },
      { badge },
      { new: true }
    ).populate('userId', 'fullName email');

    if (!gamification) {
      return res.status(404).json({ message: 'User gamification not found' });
    }

    res.json(gamification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
