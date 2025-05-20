// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Rejestracja użytkownika
router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
  }
});

// Logowanie użytkownika
router.post('/login', async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({ error: 'Email and password required' });
    }
    
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    
    res.send({ 
      user: { 
        _id: user._id,
        email: user.email,
        bestStreak: user.bestStreak 
      }, 
      token 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(401).send({ error: 'Invalid login credentials' });
  }
});

// Pobierz swój profil
router.get('/me', auth, async (req, res) => {
  res.send(req.user);
});

module.exports = router;