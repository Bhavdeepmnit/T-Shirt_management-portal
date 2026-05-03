require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User.model');
const FormSettings = require('../src/models/FormSettings.model');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if super admin already exists
    const existing = await User.findOne({ role: 'superadmin' });
    if (existing) {
      console.log('ℹ️  Super Admin already exists:', existing.email);
    } else {
      const passwordHash = await User.hashPassword(process.env.SUPER_ADMIN_PASSWORD || 'SuperSecure@MNIT2024');

      await User.create({
        name: process.env.SUPER_ADMIN_NAME || 'Super Admin MNIT',
        email: process.env.SUPER_ADMIN_EMAIL || 'superadmin@mnit.ac.in',
        passwordHash,
        role: 'superadmin',
        branch: null
      });

      console.log('✅ Super Admin created:', process.env.SUPER_ADMIN_EMAIL || 'superadmin@mnit.ac.in');
    }

    // Ensure formSettings exists
    const settings = await FormSettings.findOne({ key: 'global' });
    if (!settings) {
      await FormSettings.create({ key: 'global', isFormOpen: true, tshirtPrice: 350 });
      console.log('✅ FormSettings initialized');
    } else {
      console.log('ℹ️  FormSettings already exists');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();
