const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  branch: {
    type: String,
    enum: ['CSE', 'ECE', 'EE', 'Civil', 'Meta', 'Mech', 'Chem'],
    required: [true, 'Branch is required']
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required']
  },
  whatsappNumber: {
    type: String,
    required: [true, 'WhatsApp number is required']
  },
  tshirtSize: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    required: [true, 'T-shirt size is required']
  },

  // Payment
  paymentStatus: {
    type: String,
    enum: ['pending', 'submitted', 'confirmed', 'rejected'],
    default: 'pending'
  },
  paymentAmount: {
    type: Number,
    default: 0
  },
  paymentConfirmedAt: {
    type: Date,
    default: null
  },
  paymentConfirmedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // Form state
  formSubmitted: {
    type: Boolean,
    default: true
  },
  formSubmittedAt: {
    type: Date,
    default: Date.now
  },

  // Branch Admin reference
  adminRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

// Indexes
studentSchema.index({ branch: 1 });
studentSchema.index({ paymentStatus: 1 });
studentSchema.index({ studentId: 1 }, { unique: true });
studentSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);
