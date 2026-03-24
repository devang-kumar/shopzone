const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/products', require('../routes/products'));
app.use('/api/cart', require('../routes/cart'));
app.use('/api/orders', require('../routes/orders'));
app.use('/api/users', require('../routes/users'));
app.use('/api/payment', require('../routes/payment'));

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

// Connect to MongoDB once (cached for serverless)
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
};

module.exports = async (req, res) => {
  await connectDB();
  app(req, res);
};
