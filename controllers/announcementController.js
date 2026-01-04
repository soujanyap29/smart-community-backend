const Announcement = require('../models/Announcement');
const Alert = require('../models/Alert');
const User = require('../models/User');

// Create Announcement (Admin)
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, description } = req.body;

    const announcement = await Announcement.create({
      title,
      description,
      createdBy: req.user.id
    });

    // Create alerts for all users
    const users = await User.find({ approved: true });
    const alerts = users.map(user => ({
      userId: user._id,
      message: `New announcement: ${title}`,
      type: 'announcement'
    }));
    await Alert.insertMany(alerts);

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('createdBy', 'fullName')
      .sort('-createdAt')
      .limit(50);
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark Announcement as Read
exports.markAsRead = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    if (!announcement.readBy.includes(req.user.id)) {
      announcement.readBy.push(req.user.id);
      await announcement.save();
    }

    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
