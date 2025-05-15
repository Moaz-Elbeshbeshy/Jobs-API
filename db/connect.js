const mongoose = require('mongoose');
const Job = require('../models/Job'); // Adjust the path as needed

const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log('MongoDB connected');

    // 🔁 Make sure your compound index is created
    await Job.syncIndexes();
    console.log('Indexes synced for Job model');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // exit the app if connection fails
  }
};

module.exports = connectDB;
