const express = require('express');
const Nominee = require('../models/Nominee');
const router = express.Router();

// Get All Nominees
router.get('/', async (req, res) => {
  try {
    const nominees = await Nominee.find();
    res.status(200).json(nominees);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
