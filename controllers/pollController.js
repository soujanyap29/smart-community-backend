const Poll = require('../models/Poll');

// Create Poll (Admin)
exports.createPoll = async (req, res) => {
  try {
    const { question, options } = req.body;

    const formattedOptions = options.map(opt => ({
      text: opt,
      votes: 0
    }));

    const poll = await Poll.create({
      question,
      options: formattedOptions
    });

    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Polls
exports.getPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort('-createdAt');
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vote on Poll
exports.votePoll = async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    if (poll.status === 'closed') {
      return res.status(400).json({ message: 'Poll is closed' });
    }

    // Check if user already voted
    if (poll.votedUsers.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have already voted' });
    }

    // Add vote
    poll.options[optionIndex].votes += 1;
    poll.votedUsers.push(req.user.id);
    await poll.save();

    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Close Poll (Admin)
exports.closePoll = async (req, res) => {
  try {
    const poll = await Poll.findByIdAndUpdate(
      req.params.id,
      { status: 'closed' },
      { new: true }
    );

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
