const express = require('express');
const { sendMessage, getConversation, getConversations } = require('../controllers/chatController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, sendMessage);
router.get('/conversations', authenticate, getConversations);
router.get('/:otherUserId', authenticate, getConversation);

module.exports = router;