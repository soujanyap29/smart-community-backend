const Complaint = require('../models/Complaint');

// Create Complaint
exports.createComplaint = async (req, res) => {
  try {
    const { subject, description } = req.body;

    const complaint = await Complaint.create({
      userId: req.user.id,
      subject,
      description
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Complaints
exports.getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user.id })
      .sort('-createdAt');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Complaints (Admin)
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('userId', 'fullName email block houseNumber')
      .sort('-createdAt');
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Complaint Status (Admin)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'fullName email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
