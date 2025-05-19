const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Aktualizuj najlepszy streak użytkownika
router.patch('/streak', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.streak > user.bestStreak) {
      user.bestStreak = req.body.streak;
      await user.save();
    }
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;

// backend/routes/math.js
router.patch('/streak', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.streak > user.bestStreak) {
      user.bestStreak = req.body.streak;
      await user.save();
    }
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});