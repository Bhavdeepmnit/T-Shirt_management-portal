const router = require('express').Router();
const {
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
} = require('../controllers/superadmin.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { validate } = require('../utils/validators');

// All routes require superadmin role
router.use(verifyToken, requireRole('superadmin'));

// Dashboard
router.get('/dashboard', getDashboard);

// Admin management
router.post('/admin', validate('createAdmin'), createAdmin);
router.get('/admins', getAdmins);
router.put('/admin/:adminId', validate('updateAdmin'), updateAdmin);
router.delete('/admin/:adminId', deleteAdmin);

// Student management
router.get('/students', getAllStudents);
router.put('/student/:studentId', validate('superadminUpdateStudent'), updateStudent);
router.delete('/student/:studentId', deleteStudent);

// Form settings & lock
router.get('/form/settings', getFormSettings);
router.put('/form/settings', validate('updateFormSettings'), updateFormSettings);
router.post('/form/lock', validate('lockForm'), lockForm);

module.exports = router;
