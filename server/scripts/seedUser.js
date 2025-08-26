const mongoose = require('mongoose');
const User = require('../models/User');

const seedDemoUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb+srv://mss:12345@cluster0.ht6ssmc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Check if demo user already exists
    const existingUser = await User.findOne({ email: 'demo@example.com' });
    
    if (existingUser) {
      console.log('Demo user already exists');
      process.exit(0);
    }

    // Create demo user
    const demoUser = new User({
      email: 'demo@example.com',
      password: 'password123',
      firstName: 'Demo',
      lastName: 'User',
      phone: '+1234567890'
    });

    await demoUser.save();
    console.log('Demo user created successfully');
    console.log('Email: demo@example.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('Error seeding demo user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedDemoUser();
