const Student = require('../models/Student.model');
const User = require('../models/User.model');
const FormSettings = require('../models/FormSettings.model');
const asyncHandler = require('../utils/asyncHandler');
const { getIO } = require('../config/socket');

/**
 * POST /api/student/order
 * Submit a T-shirt order form (public - no auth required)
 */
const submitOrder = asyncHandler(async (req, res) => {
  const { fullName, email, studentId, branch, contactNumber, whatsappNumber, tshirtSize } = req.body;

  // Check if student already submitted
  const existing = await Student.findOne({
    $or: [{ email }, { studentId }]
  });
  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'An order with this email or student ID already exists. Contact your branch representative to make changes.'
    });
  }

  // Find the branch admin for contact info
  const branchAdmin = await User.findOne({ role: 'admin', branch, isActive: true })
    .select('name contactNumber whatsappNumber email')
    .lean();

  // Create student record
  const student = await Student.create({
    fullName,
    email,
    studentId: studentId.toUpperCase(),
    branch,
    contactNumber,
    whatsappNumber,
    tshirtSize,
    formSubmitted: true,
    formSubmittedAt: new Date(),
    adminRef: branchAdmin?._id || null
  });

  // Emit event to admin room for real-time notification
  try {
    const io = getIO();
    io.to(`admin_branch_${branch}`).emit('new_student_registered', {
      studentName: fullName,
      studentId: studentId.toUpperCase(),
      branch,
      tshirtSize,
      submittedAt: new Date()
    });
    io.to('superadmin_global').emit('new_student_registered', {
      studentName: fullName,
      branch,
      totalCount: await Student.countDocuments()
    });
  } catch (e) { /* Socket not available */ }

  res.status(201).json({
    success: true,
    message: 'Order submitted successfully! Please contact your branch representative for payment.',
    branchAdmin: branchAdmin ? {
      name: branchAdmin.name,
      contactNumber: branchAdmin.contactNumber,
      whatsappNumber: branchAdmin.whatsappNumber,
      email: branchAdmin.email
    } : null
  });
});

/**
 * GET /api/student/form-status
 * Check if the global form is open or closed
 */
const getFormStatus = asyncHandler(async (req, res) => {
  let settings = await FormSettings.findOne({ key: 'global' }).lean();
  if (!settings) {
    settings = { isFormOpen: true };
  }

  // Get T-shirt price
  res.json({
    isFormOpen: settings.isFormOpen,
    tshirtPrice: settings.tshirtPrice || 350,
    registrationDeadline: settings.registrationDeadline,
    lockAlertMessage: !settings.isFormOpen ? settings.lockAlertMessage : null,
    lockedAt: settings.lockedAt
  });
});

/**
 * GET /api/student/check/:identifier
 * Check if a student has already submitted (by email or studentId)
 */
const checkExisting = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  const student = await Student.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { studentId: identifier.toUpperCase() }
    ]
  }).populate('adminRef', 'name contactNumber whatsappNumber email').lean();

  if (!student) {
    return res.json({ success: true, exists: false });
  }

  res.json({
    success: true,
    exists: true,
    student: {
      fullName: student.fullName,
      studentId: student.studentId,
      branch: student.branch,
      tshirtSize: student.tshirtSize,
      paymentStatus: student.paymentStatus,
      formSubmittedAt: student.formSubmittedAt,
      branchAdmin: student.adminRef ? {
        name: student.adminRef.name,
        contactNumber: student.adminRef.contactNumber,
        whatsappNumber: student.adminRef.whatsappNumber
      } : null
    }
  });
});

/**
 * GET /api/student/branch-admin/:branch
 * Get branch admin contact info
 */
const getBranchAdmin = asyncHandler(async (req, res) => {
  const { branch } = req.params;

  const admin = await User.findOne({ role: 'admin', branch, isActive: true })
    .select('name contactNumber whatsappNumber email')
    .lean();

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: `No active admin found for branch ${branch}`
    });
  }

  res.json({ success: true, admin });
});

module.exports = { submitOrder, getFormStatus, checkExisting, getBranchAdmin };
