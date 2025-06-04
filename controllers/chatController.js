const pool = require('../config/db');

// Get all conversations for user (fixed)
const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;

        const [conversations] = await pool.query(`
            SELECT 
                other_user.id AS user_id,
                other_user.first_name,
                other_user.last_name,
                other_user.image_url,
                (SELECT msg FROM chat 
                 WHERE (sender_id = ? AND recever_id = other_user.id)
                    OR (sender_id = other_user.id AND recever_id = ?)
                 ORDER BY created DESC LIMIT 1) AS last_message,
                (SELECT created FROM chat 
                 WHERE (sender_id = ? AND recever_id = other_user.id)
                    OR (sender_id = other_user.id AND recever_id = ?)
                 ORDER BY created DESC LIMIT 1) AS last_message_time
            FROM (
                SELECT DISTINCT
                    CASE 
                        WHEN sender_id = ? THEN recever_id 
                        ELSE sender_id 
                    END AS other_user_id
                FROM chat
                WHERE sender_id = ? OR recever_id = ?
            ) AS chat_partners
            JOIN user AS other_user ON chat_partners.other_user_id = other_user.id
            ORDER BY last_message_time DESC
        `, [
            userId, userId, userId, userId,
            userId, userId, userId
        ]);

        res.status(200).json({
            success: true,
            conversations
        });
    } catch (error) {
        console.error('Error getting conversations:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while getting conversations'
        });
    }
};

// Get conversation between two users (fixed)
const getConversation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { otherUserId } = req.params;

        // Verify other user exists
        const [otherUser] = await pool.query(
            'SELECT id FROM user WHERE id = ?', 
            [otherUserId]
        );
        
        if (!otherUser.length) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const [messages] = await pool.query(`
            SELECT 
                c.*,
                CASE 
                    WHEN c.sender_id = ? THEN 'sent' 
                    ELSE 'received' 
                END AS direction,
                u_sender.first_name AS sender_first_name,
                u_sender.last_name AS sender_last_name,
                u_receiver.first_name AS receiver_first_name,
                u_receiver.last_name AS receiver_last_name
            FROM chat c
            JOIN user u_sender ON c.sender_id = u_sender.id
            JOIN user u_receiver ON c.recever_id = u_receiver.id
            WHERE (c.sender_id = ? AND c.recever_id = ?)
               OR (c.sender_id = ? AND c.recever_id = ?)
            ORDER BY c.created ASC
        `, [userId, userId, otherUserId, otherUserId, userId]);

        res.status(200).json({
            success: true,
            messages
        });
    } catch (error) {
        console.error('Error getting conversation:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while getting conversation'
        });
    }
};

// Send message (unchanged but included for completeness)
const sendMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { receiverId, message } = req.body;

        if (!message || message.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Message cannot be empty'
            });
        }

        await pool.query(`
            INSERT INTO chat 
            (msg, sender_id, recever_id, created, updated)
            VALUES (?, ?, ?, NOW(), NOW())
        `, [message.trim(), senderId, receiverId]);

        res.status(201).json({
            success: true,
            message: 'Message sent successfully'
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while sending message'
        });
    }
};

module.exports = { sendMessage, getConversation, getConversations };