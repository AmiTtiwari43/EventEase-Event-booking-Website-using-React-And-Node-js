const mongoose = require('mongoose');
require('dotenv').config();
const Booking = require('./models/Booking');

async function run() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const result = await Booking.deleteMany({});
  console.log(`Deleted ${result.deletedCount} bookings.`);
  await mongoose.disconnect();
}

run(); 