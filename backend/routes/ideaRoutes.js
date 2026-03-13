const express = require('express');
const router = express.Router();
const { createIdea } = require('../controllers/ideaController');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/ideas
router.post('/', verifyToken, createIdea);

module.exports = router;
