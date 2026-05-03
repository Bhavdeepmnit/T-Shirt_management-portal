const FormSettings = require('../models/FormSettings.model');

/**
 * Middleware to check if the global form is open.
 * Blocks student form submissions/edits when the form is locked.
 */
const checkFormOpen = async (req, res, next) => {
  try {
    const settings = await FormSettings.findOne({ key: 'global' }).lean();

    if (settings && !settings.isFormOpen) {
      return res.status(403).json({
        success: false,
        message: settings.lockAlertMessage || 'Form is permanently closed.',
        formLocked: true,
        lockedAt: settings.lockedAt
      });
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { checkFormOpen };
