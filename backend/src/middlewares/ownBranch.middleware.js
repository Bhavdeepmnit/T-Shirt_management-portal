const Student = require('../models/Student.model');

/**
 * Branch isolation guard.
 * Admins can only access students from their own branch.
 * Super admins bypass this check.
 */
const ownBranchOnly = async (req, res, next) => {
  try {
    // Super admins can access any branch
    if (req.user.role === 'superadmin') return next();

    const studentId = req.params.studentId;
    if (studentId) {
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }
      if (student.branch !== req.user.branch) {
        return res.status(403).json({ success: false, message: 'Access denied: not your branch' });
      }
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { ownBranchOnly };
