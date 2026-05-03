const Joi = require('joi');

const BRANCHES = ['CSE', 'ECE', 'EE', 'Civil', 'Meta', 'Mech', 'Chem'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

const validators = {
  // Admin login
  adminLogin: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required'
    })
  }),

  // Create admin
  createAdmin: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    branch: Joi.string().valid(...BRANCHES).required(),
    contactNumber: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
      'string.pattern.base': 'Contact number must be a 10-digit number'
    }),
    whatsappNumber: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
      'string.pattern.base': 'WhatsApp number must be a 10-digit number'
    })
  }),

  // Update admin
  updateAdmin: Joi.object({
    name: Joi.string().trim().min(2).max(100),
    contactNumber: Joi.string().pattern(/^[0-9]{10}$/),
    whatsappNumber: Joi.string().pattern(/^[0-9]{10}$/),
    isActive: Joi.boolean(),
    password: Joi.string().min(6)
  }).min(1),

  // Student order submission
  studentOrder: Joi.object({
    fullName: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().required(),
    studentId: Joi.string().trim().min(5).max(20).required(),
    branch: Joi.string().valid(...BRANCHES).required(),
    contactNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
    whatsappNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
    tshirtSize: Joi.string().valid(...SIZES).required()
  }),

  // Update student order
  updateStudentOrder: Joi.object({
    fullName: Joi.string().trim().min(2).max(100),
    contactNumber: Joi.string().pattern(/^[0-9]{10}$/),
    whatsappNumber: Joi.string().pattern(/^[0-9]{10}$/),
    tshirtSize: Joi.string().valid(...SIZES)
  }).min(1),

  // Payment confirmation
  confirmPayment: Joi.object({
    paymentAmount: Joi.number().positive().required(),
    notes: Joi.string().max(500).allow('')
  }),

  // Payment rejection
  rejectPayment: Joi.object({
    reason: Joi.string().min(5).max(500).required()
  }),

  // Form lock
  lockForm: Joi.object({
    lockReason: Joi.string().min(5).max(500).required(),
    lockAlertMessage: Joi.string().min(10).max(1000).required()
  }),

  // Update form settings
  updateFormSettings: Joi.object({
    tshirtPrice: Joi.number().positive(),
    branchPrices: Joi.array().items(Joi.object({
      branch: Joi.string().valid(...BRANCHES).required(),
      price: Joi.number().positive().required()
    })),
    registrationDeadline: Joi.date().iso()
  }).min(1),

  // Super admin update student
  superadminUpdateStudent: Joi.object({
    fullName: Joi.string().trim().min(2).max(100),
    email: Joi.string().email(),
    studentId: Joi.string().trim().min(5).max(20),
    branch: Joi.string().valid(...BRANCHES),
    contactNumber: Joi.string().pattern(/^[0-9]{10}$/),
    whatsappNumber: Joi.string().pattern(/^[0-9]{10}$/),
    tshirtSize: Joi.string().valid(...SIZES),
    paymentStatus: Joi.string().valid('pending', 'submitted', 'confirmed', 'rejected')
  }).min(1)
};

/**
 * Middleware factory to validate request body against a Joi schema.
 */
const validate = (schemaName) => (req, res, next) => {
  const schema = validators[schemaName];
  if (!schema) return next();

  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const messages = error.details.map(d => d.message);
    return res.status(400).json({ success: false, message: 'Validation error', errors: messages });
  }

  req.body = value;
  next();
};

module.exports = { validators, validate, BRANCHES, SIZES };
