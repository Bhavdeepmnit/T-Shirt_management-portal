const mongoose = require('mongoose');

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
