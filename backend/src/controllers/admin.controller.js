const Student = require('../models/Student.model');
const asyncHandler = require('../utils/asyncHandler');
const { createNotification } = require('../services/notification.service');
const { generateStudentExcel } = require('../services/excel.service');
const { getIO } = require('../config/socket');

/**
 * GET /api/admin/dashboard
 * Get branch-specific dashboard statistics
 */
const getDashboard = asyncHandler(async (req, res) => {
  const branch = req.user.branch;

  const students = await Student.find({ branch }).lean();

  const totalStudents = students.length;
  const confirmed = students.filter(s => s.paymentStatus === 'confirmed').length;
  const pending = students.filter(s => s.paymentStatus === 'pending').length;
  const rejected = students.filter(s => s.paymentStatus === 'rejected').length;
  const totalAmountReceived = students
    .filter(s => s.paymentStatus === 'confirmed')
    .reduce((sum, s) => sum + (s.paymentAmount || 0), 0);

  // Size breakdown
  const sizeBreakdown = {};
  students.forEach(s => {
    sizeBreakdown[s.tshirtSize] = (sizeBreakdown[s.tshirtSize] || 0) + 1;
  });

  res.json({
    success: true,
    data: {
      branch,
      totalStudents,
      confirmed,
      pending,
      rejected,
      pendingVerification: pending,
      totalAmountReceived,
      sizeBreakdown
    }
  });
});

/**
 * GET /api/admin/students
 * Get all students in admin's own branch
 */
const getBranchStudents = asyncHandler(async (req, res) => {
  const branch = req.user.role === 'superadmin' ? req.query.branch : req.user.branch;
  const { paymentStatus, search, page = 1, limit = 20 } = req.query;

  const query = {};
  if (branch) query.branch = branch;
  if (paymentStatus) query.paymentStatus = paymentStatus;
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { studentId: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [students, total] = await Promise.all([
    Student.find(query)
      .populate('paymentConfirmedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Student.countDocuments(query)
  ]);

  res.json({
    success: true,
    total,
    page: parseInt(page),
    totalPages: Math.ceil(total / parseInt(limit)),
    students
  });
});

/**
 * PUT /api/admin/student/:studentId/confirm-payment
 * Confirm a student's payment
 */
const confirmPayment = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { paymentAmount, notes } = req.body;

  const student = await Student.findByIdAndUpdate(studentId, {
    paymentStatus: 'confirmed',
    paymentAmount,
    paymentConfirmedAt: new Date(),
    paymentConfirmedBy: req.user.id
  }, { new: true });

  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  // Create notification
  await createNotification({
    recipientId: student._id,
    type: 'payment_confirmed',
    title: 'Payment Confirmed! ✅',
    message: `Your T-Shirt payment of ₹${paymentAmount} has been confirmed.`,
    triggeredBy: req.user.id
  });

  // Emit to super admin
  try {
    const io = getIO();
    io.to('superadmin_global').emit('payment_confirmed', {
      studentName: student.fullName,
      branch: student.branch,
      amount: paymentAmount
    });
  } catch (e) { /* Socket not available */ }

  res.json({ success: true, message: `Payment confirmed for ${student.fullName}` });
});

/**
 * PUT /api/admin/student/:studentId/reject-payment
 * Reject a student's payment
 */
const rejectPayment = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { reason } = req.body;

  const student = await Student.findByIdAndUpdate(studentId, {
    paymentStatus: 'rejected'
  }, { new: true });

  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  // Create notification
  await createNotification({
    recipientId: student._id,
    type: 'payment_rejected',
    title: 'Payment Issue ❌',
    message: `Your payment was flagged: ${reason}. Please contact your branch POC.`,
    triggeredBy: req.user.id
  });

  res.json({ success: true, message: 'Payment rejected, student notified' });
});

/**
 * GET /api/admin/students/export
 * Export students to Excel
 */
const exportStudents = asyncHandler(async (req, res) => {
  const { paymentStatus } = req.query;
  const adminBranch = req.user.role === 'superadmin' ? req.query.branch : req.user.branch;

  const query = {};
  if (adminBranch) query.branch = adminBranch;
  if (paymentStatus) query.paymentStatus = paymentStatus;

  const students = await Student.find(query)
    .populate('paymentConfirmedBy', 'name')
    .sort({ branch: 1, fullName: 1 })
    .lean();

  const { buffer, filename } = generateStudentExcel(students, adminBranch);

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(buffer);
});

module.exports = {
  getDashboard,
  getBranchStudents,
  confirmPayment,
  rejectPayment,
  exportStudents
};
