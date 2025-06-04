const express = require('express');
const { getNotifications, markAsRead , createNotification } = require('../controllers/notificationController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, getNotifications);
router.put('/:notificationId/read', authenticate, markAsRead);
router.post('/', authenticate, createNotification);

module.exports = router;