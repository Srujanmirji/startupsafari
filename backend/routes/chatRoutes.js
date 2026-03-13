const express = require('express');
const router = express.Router();
const { chatWithExpert, sharkTankSession } = require('../controllers/chatController');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/chat/expert
router.post('/expert', verifyToken, chatWithExpert);
router.post('/shark-tank', sharkTankSession);

module.exports = router;
