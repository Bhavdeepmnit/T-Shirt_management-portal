const router = require('express').Router();
const { adminLogin, refreshToken, logout, getMe } = require('../controllers/auth.controller');
const { verifyToken } = require('../middlewares/auth.middleware');
const { loginLimiter } = require('../middlewares/rateLimiter');
const { validate } = require('../utils/validators');

// Public
router.post('/admin/login', loginLimiter, validate('adminLogin'), adminLogin);
router.post('/refresh', refreshToken);

// Protected
router.post('/logout', verifyToken, logout);
router.get('/me', verifyToken, getMe);

module.exports = router;
