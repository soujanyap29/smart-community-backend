const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// User Schema (simplified)
const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  password: String,
  block: String,
  houseNumber: String,
  role: { type: String, default: 'resident' },
  approved: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ MongoDB Connected');

    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@community.com' });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        fullName: 'Admin User',
        email: 'admin@community.com',
        phone: '1234567890',
        password: hashedPassword,
        block: 'A',
        houseNumber: '101',
        role: 'admin',
        approved: true
      });
      console.log('✓ Admin user created: admin@community.com / admin123');
    } else {
      console.log('✓ Admin user already exists');
    }

    // Check if resident exists
    const residentExists = await User.findOne({ email: 'resident@community.com' });
    
    if (!residentExists) {
      const hashedPassword = await bcrypt.hash('resident123', 10);
      await User.create({
        fullName: 'John Resident',
        email: 'resident@community.com',
        phone: '9876543210',
        password: hashedPassword,
        block: 'B',
        houseNumber: '202',
        role: 'resident',
        approved: true
      });
      console.log('✓ Resident user created: resident@community.com / resident123');
    } else {
      console.log('✓ Resident user already exists');
    }

    // Check if security exists
    const securityExists = await User.findOne({ email: 'security@community.com' });
    
    if (!securityExists) {
      const hashedPassword = await bcrypt.hash('security123', 10);
      await User.create({
        fullName: 'Security Guard',
        email: 'security@community.com',
        phone: '5555555555',
        password: hashedPassword,
        block: 'Gate',
        houseNumber: '001',
        role: 'security',
        approved: true
      });
      console.log('✓ Security user created: security@community.com / security123');
    } else {
      console.log('✓ Security user already exists');
    }

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

createTestUser();
