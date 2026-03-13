const express = require('express');
const router = express.Router();
const { getDashboardIdeas } = require('../controllers/dashboardController');
const { verifyToken } = require('../middleware/authMiddleware');

// GET /api/dashboard
router.get('/', verifyToken, getDashboardIdeas);

module.exports = router;
