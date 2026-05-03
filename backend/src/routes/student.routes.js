const router = require('express').Router();
const { submitOrder, getFormStatus, checkExisting, getBranchAdmin } = require('../controllers/student.controller');
const { checkFormOpen } = require('../middlewares/formLock.middleware');
const { validate } = require('../utils/validators');
const { apiLimiter } = require('../middlewares/rateLimiter');

// Public routes (no auth required for students)
router.get('/form-status', getFormStatus);
router.get('/check/:identifier', checkExisting);
router.get('/branch-admin/:branch', getBranchAdmin);

// Form submission (check if form is open first)
router.post('/order', apiLimiter, checkFormOpen, validate('studentOrder'), submitOrder);

module.exports = router;
