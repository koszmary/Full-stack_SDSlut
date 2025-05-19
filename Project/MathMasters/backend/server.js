require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const mathRoutes = require('./routes/math');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/math', mathRoutes);

// Połączenie z MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;


// Dodaj to przed app.listen()
app.get('/', (req, res) => {
  res.send('Math Masters Backend is running!');
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));