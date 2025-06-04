const pool = require('../config/db');

// Get all notifications for user
const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        const [notifications] = await pool.query(`
            SELECT * FROM notification
            WHERE user_id = ?
            ORDER BY created DESC
            LIMIT 50
        `, [userId]);

        res.status(200).json({
            success: true,
            notifications
        });
    } catch (error) {
        console.error('Error getting notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while getting notifications'
        });
    }
};

// Mark notification as read
const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;

        await pool.query(`
            UPDATE notification 
            SET is_read = 1, updated = NOW()
            WHERE id = ?
        `, [notificationId]);

        res.status(200).json({
            success: true,
            message: 'Notification marked as read'
        });
    } catch (error) {
        console.error('Error marking notification:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while marking notification'
        });
    }
};

// Create notification helper (for other controllers to use)
const createNotification = async (req, res) => {
    const {userId, message, type, relatedId } = req.body;
     try {
         await pool.query(`
        INSERT INTO notification 
        (user_id, message, type , related_id)
        VALUES (?, ?, ?, ?)
    `, [userId, message, type, relatedId]);

        res.status(200).json({
            success: true,
            message: 'Notification has been created'
        });
    } catch (error) {
        console.error('Error create notification:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while create notification'
        });
    }
};

module.exports = { getNotifications, markAsRead, createNotification };