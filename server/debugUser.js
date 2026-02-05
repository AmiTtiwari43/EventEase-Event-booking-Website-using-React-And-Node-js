const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkUser() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'eventease-lite' });
  const user = await User.findOne({ email: 'admin@eventease.com' });
  console.log('User found:', user);
  if (user) {
    console.log('User ID:', user._id);
    console.log('User ID type:', typeof user._id);
  }
  mongoose.connection.close();
}
checkUser();
