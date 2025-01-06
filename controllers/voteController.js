const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { redisClient } = require('../config/db');

exports.submitVote = async (req, res) => {
  const { userId } = jwt.verify(req.headers.authorization.split(' ')[1], process.env.JWT_SECRET);
  const { nomineeId } = req.body;

  const user = await User.findById(userId);
  if (!user || user.hasVoted) return res.status(403).json({ message: 'Already voted' });

  await User.findByIdAndUpdate(userId, { hasVoted: true });
  redisClient.incr(`votes:${nomineeId}`);

  res.json({ message: 'Successfully voted' });
};
