const mongoose = require('mongoose');

const branchPriceSchema = new mongoose.Schema({
  branch: { type: String, required: true },
  price: { type: Number, required: true, default: 350 }
}, { _id: false });

const formSettingsSchema = new mongoose.Schema({
  key: {
    type: String,
    default: 'global',
    unique: true
  },
  isFormOpen: {
    type: Boolean,
    default: true
  },
  lockedAt: {
    type: Date,
    default: null
  },
  lockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  lockReason: {
    type: String,
    default: null
  },
  lockAlertMessage: {
    type: String,
    default: 'The T-Shirt order form has been permanently closed. No further submissions or edits are accepted.'
  },
  tshirtPrice: {
    type: Number,
    default: 350
  },
  branchPrices: {
    type: [branchPriceSchema],
    default: [
      { branch: 'CSE', price: 350 },
      { branch: 'ECE', price: 350 },
      { branch: 'EE', price: 350 },
      { branch: 'Civil', price: 350 },
      { branch: 'Meta', price: 350 },
      { branch: 'Mech', price: 350 },
      { branch: 'Chem', price: 350 }
    ]
  },
  registrationDeadline: {
    type: Date,
    default: null
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FormSettings', formSettingsSchema);
