const express = require('express');
const router = express.Router();
const { analyzeIdea, getAnalysisResult } = require('../controllers/analysisController');
const { verifyToken } = require('../middleware/authMiddleware');

// POST /api/analyze
router.post('/analyze', verifyToken, analyzeIdea);

// GET /api/results/:idea_id
router.get('/results/:idea_id', verifyToken, getAnalysisResult);

module.exports = router;
