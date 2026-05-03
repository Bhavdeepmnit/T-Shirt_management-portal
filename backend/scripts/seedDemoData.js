require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User.model');
const Student = require('../src/models/Student.model');

const BRANCHES = ['CSE', 'ECE', 'EE', 'Civil', 'Meta', 'Mech', 'Chem'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

const firstNames = ['Arjun', 'Priya', 'Rahul', 'Sneha', 'Vikram', 'Ananya', 'Karan', 'Divya', 'Rohit', 'Meera', 'Aditya', 'Kavya', 'Nikhil', 'Pooja', 'Siddharth'];
const lastNames = ['Sharma', 'Mehta', 'Patel', 'Gupta', 'Singh', 'Kumar', 'Verma', 'Joshi', 'Agrawal', 'Chauhan', 'Tiwari', 'Yadav', 'Mishra', 'Pandey', 'Saxena'];

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomPhone = () => `9${Math.floor(100000000 + Math.random() * 900000000)}`;

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create demo admins (one per branch)
    const adminPassword = await User.hashPassword('Admin@123');
    const admins = [];

    for (const branch of BRANCHES) {
      const existing = await User.findOne({ role: 'admin', branch });
      if (existing) {
        console.log(`ℹ️  Admin for ${branch} already exists`);
        admins.push(existing);
        continue;
      }

      const admin = await User.create({
        name: `${getRandomItem(firstNames)} ${getRandomItem(lastNames)}`,
        email: `${branch.toLowerCase()}.poc@mnit.ac.in`,
        passwordHash: adminPassword,
        role: 'admin',
        branch,
        contactNumber: getRandomPhone(),
        whatsappNumber: getRandomPhone(),
        isActive: true
      });
      admins.push(admin);
      console.log(`✅ Admin created for ${branch}: ${admin.email}`);
    }

    // Create demo students (8-12 per branch)
    let studentCount = 0;
    const branchPrefixes = {
      CSE: 'UCS', ECE: 'UEC', EE: 'UEE',
      Civil: 'UCE', Meta: 'UMT', Mech: 'UME', Chem: 'UCH'
    };

    for (const branch of BRANCHES) {
      const numStudents = 8 + Math.floor(Math.random() * 5); // 8-12 students

      for (let i = 0; i < numStudents; i++) {
        const year = 2021 + Math.floor(Math.random() * 3);
        const sid = `${year}${branchPrefixes[branch]}${String(1000 + studentCount + i).slice(1)}`;
        const fname = getRandomItem(firstNames);
        const lname = getRandomItem(lastNames);
        const email = `${sid.toLowerCase()}@mnit.ac.in`;

        // Check if already exists
        const existing = await Student.findOne({ $or: [{ email }, { studentId: sid }] });
        if (existing) continue;

        const statuses = ['pending', 'pending', 'confirmed', 'confirmed', 'confirmed'];
        const paymentStatus = getRandomItem(statuses);
        const admin = admins.find(a => a.branch === branch);

        await Student.create({
          fullName: `${fname} ${lname}`,
          email,
          studentId: sid,
          branch,
          contactNumber: getRandomPhone(),
          whatsappNumber: getRandomPhone(),
          tshirtSize: getRandomItem(SIZES),
          paymentStatus,
          paymentAmount: paymentStatus === 'confirmed' ? 350 : 0,
          paymentConfirmedAt: paymentStatus === 'confirmed' ? new Date() : null,
          paymentConfirmedBy: paymentStatus === 'confirmed' ? admin?._id : null,
          formSubmitted: true,
          formSubmittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          adminRef: admin?._id
        });

        studentCount++;
      }
      console.log(`✅ Created students for ${branch}`);
    }

    console.log(`\n🎉 Demo data seeded! Total students created: ${studentCount}`);
    console.log('\n📋 Admin Credentials:');
    console.log('   Password for all admins: Admin@123');
    BRANCHES.forEach(b => {
      console.log(`   ${b}: ${b.toLowerCase()}.poc@mnit.ac.in`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seed();
