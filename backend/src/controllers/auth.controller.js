const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const asyncHandler = require('../utils/asyncHandler');

/**
 * POST /api/auth/admin/login
 * Login for Super Admin and Admin
 */
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user by email (include passwordHash)
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Check if account is active
  if (!user.isActive) {
    return res.status(403).json({ success: false, message: 'Account has been deactivated. Contact Super Admin.' });
  }

  // Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  // Generate access token
  const token = jwt.sign(
    { id: user._id, role: user.role, branch: user.branch, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );

  // Generate refresh token
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  // Store refresh token
  user.refreshToken = refreshToken;
  await user.save();

  res.json({
    success: true,
    token,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      branch: user.branch
    }
  });
});

/**
 * POST /api/auth/refresh
 * Refresh expired JWT access token
 */
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ success: false, message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    // Generate new access token
    const newToken = jwt.sign(
      { id: user._id, role: user.role, branch: user.branch, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    res.json({ success: true, token: newToken });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
});

/**
 * POST /api/auth/logout
 * Clear refresh token
 */
const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
  res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * GET /api/auth/me
 * Get current logged-in user profile
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash -refreshToken');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, user });
});

module.exports = { adminLogin, refreshToken, logout, getMe };
