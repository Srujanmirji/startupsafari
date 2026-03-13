const express = require('express');
const router = express.Router();
const { chatWithExpert, sharkTankSession, getChatHistory } = require('../controllers/chatController');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/chat/expert
router.post('/expert', verifyToken, chatWithExpert);
router.post('/shark-tank', verifyToken, sharkTankSession);
router.get('/history/:idea_id/:expert_name', verifyToken, getChatHistory);

module.exports = router;

