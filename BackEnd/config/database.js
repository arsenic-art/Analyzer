const mongoose = require('mongoose');
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'Analytics_Users' });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:');
    process.exit(1);
  }
};

module.exports = connectDB;
