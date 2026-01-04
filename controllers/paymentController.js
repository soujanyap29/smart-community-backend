// Bulk update payment statuses by UTR (admin uploads UTR list)
exports.bulkUpdateByUtr = async (req, res) => {
  try {
    const { utrList } = req.body; // [{utr, amount, month}]
    if (!Array.isArray(utrList)) return res.status(400).json({ message: 'utrList must be an array' });
    let updated = 0;
    for (const entry of utrList) {
      const { utr, amount, month } = entry;
      // Find pending payment with matching amount and month
      const payment = await Payment.findOneAndUpdate(
        { status: 'pending', amount, month },
        { status: 'completed', utr },
        { new: true }
      );
      if (payment) updated++;
    }
    res.json({ message: `Updated ${updated} payments` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const Payment = require('../models/Payment');

// Create Payment - Now creates pending payment that requires admin verification
exports.createPayment = async (req, res) => {
  try {
    const { amount, month, utr } = req.body;

    // Generate transaction ID
    const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();

    const payment = await Payment.create({
      userId: req.user.id,
      amount,
      month,
      transactionId,
      utr: utr || '', // UTR (UPI Transaction Reference) provided by user after payment
      status: 'pending' // Changed from 'completed' to 'pending' - requires admin verification
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify Payment (Admin) - Admin verifies and approves payment
exports.verifyPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, utr } = req.body; // status can be 'completed' or 'failed'

    const payment = await Payment.findByIdAndUpdate(
      id,
      { status, utr: utr || '' },
      { new: true }
    ).populate('userId', 'fullName email block houseNumber');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Payments
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .sort('-createdAt');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Payments (Admin)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'fullName email block houseNumber')
      .sort('-createdAt');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
