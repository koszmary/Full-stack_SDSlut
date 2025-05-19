// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // 1. Pobierz token z nagłówka
    const token = req.header('Authorization').replace('Bearer ', '');
    
    // 2. Zweryfikuj token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Znajdź użytkownika
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token
    });

    if (!user) {
      throw new Error();
    }

    // 4. Dodaj użytkownika i token do requestu
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;