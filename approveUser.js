const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  password: String,
  role: String,
  block: String,
  houseNumber: String,
  approved: Boolean
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function approveUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_community');
    console.log('Connected to MongoDB');

    const result = await User.updateOne(
      { email: 'ayallapurmath@gmail.com' },
      { $set: { approved: true, role: 'admin' } }
    );

    console.log('\n✓ User approved successfully!');
    console.log('Email: ayallapurmath@gmail.com');
    console.log('Role: admin');
    console.log('Status: approved');
    console.log('\nYou can now login!\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

approveUser();
