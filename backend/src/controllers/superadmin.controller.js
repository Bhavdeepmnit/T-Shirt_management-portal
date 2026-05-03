const User = require('../models/User.model');
const Student = require('../models/Student.model');
const FormSettings = require('../models/FormSettings.model');
const asyncHandler = require('../utils/asyncHandler');
const { getIO } = require('../config/socket');
const { createBulkNotifications } = require('../services/notification.service');

/**
 * GET /api/superadmin/dashboard
 * Fetch aggregate dashboard statistics
 */
const getDashboard = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    totalConfirmed,
    students,
    admins,
    formSettings
  ] = await Promise.all([
    Student.countDocuments(),
    Student.countDocuments({ paymentStatus: 'confirmed' }),
    Student.find().lean(),
    User.find({ role: 'admin' }).select('-passwordHash -refreshToken').lean(),
    FormSettings.findOne({ key: 'global' }).lean()
  ]);

  // Calculate total amount collected
  const totalAmountCollected = students
    .filter(s => s.paymentStatus === 'confirmed')
    .reduce((sum, s) => sum + (s.paymentAmount || 0), 0);

  // Branch breakdown
  const branches = ['CSE', 'ECE', 'EE', 'Civil', 'Meta', 'Mech', 'Chem'];
  const branchBreakdown = branches.map(branch => {
    const branchStudents = students.filter(s => s.branch === branch);
    const confirmed = branchStudents.filter(s => s.paymentStatus === 'confirmed');
    return {
      branch,
      total: branchStudents.length,
      confirmed: confirmed.length,
      pending: branchStudents.length - confirmed.length,
      amount: confirmed.reduce((sum, s) => sum + (s.paymentAmount || 0), 0)
    };
  });

  // Admin stats
  const adminStats = admins.map(admin => {
    const managed = students.filter(s => s.branch === admin.branch);
    const confirmedCount = managed.filter(s => s.paymentStatus === 'confirmed').length;
    return {
      adminName: admin.name,
      branch: admin.branch,
      email: admin.email,
      isActive: admin.isActive,
      studentsManaged: managed.length,
      confirmed: confirmedCount
    };
  });

  // Size breakdown
  const sizeBreakdown = {};
  students.forEach(s => {
    sizeBreakdown[s.tshirtSize] = (sizeBreakdown[s.tshirtSize] || 0) + 1;
  });

  res.json({
    success: true,
    data: {
      totalStudents,
      totalConfirmed,
      totalPending: totalStudents - totalConfirmed,
      totalAmountCollected,
      formStatus: formSettings?.isFormOpen ? 'open' : 'locked',
      branchBreakdown,
      adminStats,
      sizeBreakdown
    }
  });
});

/**
 * POST /api/superadmin/admin
 * Create a new branch Admin account
 */
const createAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, branch, contactNumber, whatsappNumber } = req.body;

  // Check if email already exists
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email already registered' });
  }

  // Check if branch already has an admin
  const branchAdmin = await User.findOne({ role: 'admin', branch, isActive: true });
  if (branchAdmin) {
    return res.status(409).json({
      success: false,
      message: `Branch ${branch} already has an active admin: ${branchAdmin.name}`
    });
  }

  const passwordHash = await User.hashPassword(password);

  const admin = await User.create({
    name,
    email,
    passwordHash,
    role: 'admin',
    branch,
    contactNumber,
    whatsappNumber,
    createdBy: req.user.id
  });

  res.status(201).json({
    success: true,
    message: 'Admin account created successfully',
    admin: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      branch: admin.branch
    }
  });
});

/**
 * GET /api/superadmin/admins
 * Get all admin accounts
 */
const getAdmins = asyncHandler(async (req, res) => {
  const admins = await User.find({ role: 'admin' })
    .select('-passwordHash -refreshToken')
    .sort({ branch: 1 })
    .lean();

  // Attach student counts per admin
  const enriched = await Promise.all(admins.map(async (admin) => {
    const studentsCount = await Student.countDocuments({ branch: admin.branch });
    return { ...admin, studentsCount };
  }));

  res.json({ success: true, admins: enriched });
});

/**
 * PUT /api/superadmin/admin/:adminId
 * Update admin account details
 */
const updateAdmin = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  const updates = { ...req.body };

  // If password is being updated, hash it
  if (updates.password) {
    updates.passwordHash = await User.hashPassword(updates.password);
    delete updates.password;
  }

  const admin = await User.findByIdAndUpdate(adminId, updates, { new: true })
    .select('-passwordHash -refreshToken');

  if (!admin) {
    return res.status(404).json({ success: false, message: 'Admin not found' });
  }

  res.json({ success: true, message: 'Admin updated successfully', admin });
});

/**
 * DELETE /api/superadmin/admin/:adminId
 * Delete admin account
 */
const deleteAdmin = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  const admin = await User.findByIdAndDelete(adminId);

  if (!admin) {
    return res.status(404).json({ success: false, message: 'Admin not found' });
  }

  res.json({ success: true, message: 'Admin deleted successfully' });
});

/**
 * GET /api/superadmin/students
 * Get all students with optional filters
 */
const getAllStudents = asyncHandler(async (req, res) => {
  const { branch, paymentStatus, search, page = 1, limit = 20 } = req.query;

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
 * PUT /api/superadmin/student/:studentId
 * Edit any student's information
 */
const updateStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const student = await Student.findByIdAndUpdate(studentId, req.body, { new: true });
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  res.json({ success: true, message: 'Student record updated', student });
});

/**
 * DELETE /api/superadmin/student/:studentId
 * Delete a student record
 */
const deleteStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const student = await Student.findByIdAndDelete(studentId);

  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }

  res.json({ success: true, message: 'Student record deleted' });
});

/**
 * POST /api/superadmin/form/lock
 * Permanently lock the form
 */
const lockForm = asyncHandler(async (req, res) => {
  const { lockReason, lockAlertMessage } = req.body;

  const settings = await FormSettings.findOne({ key: 'global' });
  if (settings && !settings.isFormOpen) {
    return res.status(400).json({ success: false, message: 'Form is already locked.' });
  }

  const updatedSettings = await FormSettings.findOneAndUpdate(
    { key: 'global' },
    {
      isFormOpen: false,
      lockedAt: new Date(),
      lockedBy: req.user.id,
      lockReason,
      lockAlertMessage,
      updatedBy: req.user.id
    },
    { upsert: true, new: true }
  );

  // Broadcast lock event to all connected admin sockets
  try {
    const io = getIO();
    io.emit('form_locked', {
      message: lockAlertMessage,
      lockedAt: updatedSettings.lockedAt
    });
  } catch (e) {
    console.warn('Socket.io not available for form lock broadcast');
  }

  // Create notifications for unconfirmed students
  const unconfirmedStudents = await Student.find({ paymentStatus: { $ne: 'confirmed' } });
  if (unconfirmedStudents.length > 0) {
    const notifications = unconfirmedStudents.map(s => ({
      recipientId: s._id,
      type: 'form_locked',
      title: '⚠️ Form Permanently Closed',
      message: lockAlertMessage,
      triggeredBy: req.user.id
    }));
    await createBulkNotifications(notifications);
  }

  res.json({
    success: true,
    message: 'Form permanently locked',
    lockedAt: updatedSettings.lockedAt
  });
});

/**
 * GET /api/superadmin/form/settings
 * Get current form settings
 */
const getFormSettings = asyncHandler(async (req, res) => {
  let settings = await FormSettings.findOne({ key: 'global' });
  if (!settings) {
    settings = await FormSettings.create({ key: 'global' });
  }

  res.json({
    success: true,
    settings: {
      isFormOpen: settings.isFormOpen,
      tshirtPrice: settings.tshirtPrice,
      branchPrices: settings.branchPrices || [],
      registrationDeadline: settings.registrationDeadline,
      lockAlertMessage: settings.isFormOpen ? null : settings.lockAlertMessage,
      lockedAt: settings.lockedAt,
      lockReason: settings.lockReason
    }
  });
});

/**
 * PUT /api/superadmin/form/settings
 * Update form settings (price, deadline — NOT the lock itself)
 */
const updateFormSettings = asyncHandler(async (req, res) => {
  const updates = { ...req.body, updatedBy: req.user.id };

  const settings = await FormSettings.findOneAndUpdate(
    { key: 'global' },
    updates,
    { upsert: true, new: true }
  );

  res.json({ success: true, message: 'Form settings updated', settings });
});

module.exports = {
  getDashboard,
  createAdmin,
  getAdmins,
  updateAdmin,
  deleteAdmin,
  getAllStudents,
  updateStudent,
  deleteStudent,
  lockForm,
  getFormSettings,
  updateFormSettings
};
