const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const Vote = require('../models/Vote');
const Nominee = require('../models/Nominee');
const router = express.Router();

// Cast Vote
router.post('/', authMiddleware, async (req, res) => {
  const { nomineeId } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      console.log('User not found for ID:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.hasVoted) {
      console.log('User has already voted:', user._id);
      return res.status(400).json({ message: 'User has already voted' });
    }

    const nominee = await Nominee.findById(nomineeId);
    if (!nominee) {
      console.log('Nominee not found:', nomineeId);
      return res.status(404).json({ message: 'Nominee not found' });
    }

    // Save the vote
    const vote = new Vote({ voterId: user.id, nomineeId });
    await vote.save();

    // Mark the user as having voted
    user.hasVoted = true;
    await user.save();

    res.status(200).json({ message: 'Vote cast successfully' });
  } catch (err) {
    console.error('Vote submission error:', {
      message: err.message,
      stack: err.stack
    });

    res.status(500).json({ 
      message: 'Internal server error', 
      error: err.message 
    });
  }
});


router.get('/results', authMiddleware, async (req, res) => {
    try {
      const results = await Vote.aggregate([
        { 
          $group: { 
            _id: '$nomineeId', 
            voteCount: { $sum: 1 } 
          } 
        },
        {
          $lookup: {
            from: 'nominees',
            localField: '_id',
            foreignField: '_id',
            as: 'nomineeDetails'
          }
        },
        {
          $unwind: '$nomineeDetails'
        },
        {
          $project: {
            nomineeName: '$nomineeDetails.name',
            voteCount: 1
          }
        },
        {
          $sort: { voteCount: -1 }
        }
      ]);
  
      res.status(200).json(results);
    } catch (error) {
      console.error('Results fetching error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

// Get Voting Status
router.get('/status', authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      res.status(200).json({ hasVoted: user.hasVoted });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });


  router.get('/user-vote', authMiddleware, async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Find the vote for the current user and populate nominee details
      const userVote = await Vote.findOne({ voterId: userId }).populate({
        path: 'nomineeId',
        select: 'name photo language', // Select only the fields you need
      });
  
      if (!userVote) {
        return res.status(404).json({ message: 'No vote found for this user' });
      }
  
      const { _id, name, photo, language } = userVote.nomineeId;
  
      res.json({
        nominee: {
          id: _id,
          name,
          photo,
          language,
        },
        votedAt: userVote.timestamp,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user vote', error: error.message });
    }
  });
  
  
  

module.exports = router;
