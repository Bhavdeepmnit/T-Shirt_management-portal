const Notification = require('../models/Notification.model');

/**
 * Create a notification document and optionally emit via Socket.io
 */
const createNotification = async ({ recipientId, type, title, message, triggeredBy, io }) => {
  const notification = await Notification.create({
    recipientId,
    type,
    title,
    message,
    triggeredBy: triggeredBy || null
  });

  return notification;
};

/**
 * Create notifications for multiple students at once
 */
const createBulkNotifications = async (notifications) => {
  return Notification.insertMany(notifications);
};

module.exports = { createNotification, createBulkNotifications };
