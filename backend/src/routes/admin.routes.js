const router = require('express').Router();
const {
  getDashboard,
  getBranchStudents,
  confirmPayment,
  rejectPayment,
  exportStudents
} = require('../controllers/admin.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { ownBranchOnly } = require('../middlewares/ownBranch.middleware');
const { validate } = require('../utils/validators');

// All routes require admin or superadmin role
router.use(verifyToken, requireRole('admin', 'superadmin'));

// Dashboard
router.get('/dashboard', getDashboard);

// Students
router.get('/students', getBranchStudents);
router.get('/students/export', exportStudents);

// Payment actions (with branch isolation)
router.put('/student/:studentId/confirm-payment', ownBranchOnly, validate('confirmPayment'), confirmPayment);
router.put('/student/:studentId/reject-payment', ownBranchOnly, validate('rejectPayment'), rejectPayment);

module.exports = router;
