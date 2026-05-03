const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required']
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin'],
    required: [true, 'Role is required']
  },
  branch: {
    type: String,
    enum: ['CSE', 'ECE', 'EE', 'Civil', 'Meta', 'Mech', 'Chem', null],
    default: null
  },
  contactNumber: {
    type: String,
    default: null
  },
  whatsappNumber: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  refreshToken: {
    type: String,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, branch: 1 });

// Instance method: compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Static method: hash password
userSchema.statics.hashPassword = async function(password) {
  return bcrypt.hash(password, 12);
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.refreshToken;
  delete user.__v;
  return user;
};

module.exports = mongoose.model('User', userSchema);
