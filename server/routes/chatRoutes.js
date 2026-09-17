const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getConversations, getMessages, sendMessage, markRead } = require('../controllers/chatController');

router.get('/conversations', protect, getConversations);
router.get('/conversations/:id/messages', protect, getMessages);
router.post('/conversations/:id/messages', protect, sendMessage);
router.put('/conversations/:id/read', protect, markRead);

module.exports = router;
