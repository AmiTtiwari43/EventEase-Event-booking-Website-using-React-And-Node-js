const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkAdminUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'eventease-lite' });
    console.log('Connected to MongoDB');

    const admin = await User.findOne({ email: 'admin@eventease.com' });
    console.log('Admin User Found:', admin ? 'Yes' : 'No');
    if (admin) {
        console.log('Admin Role:', admin.role);
        console.log('Admin ID:', admin._id);
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
}

checkAdminUser();
