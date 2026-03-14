const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { 
  upsertProfile, 
  getMyProfile, 
  browseProfiles, 
  getProfile, 
  deleteProfile 
} = require('../controllers/cofounderController');

// POST /api/co-founder/profile - Create or update profile
router.post('/profile', verifyToken, upsertProfile);

// GET /api/co-founder/profiles - Browse all profiles (with search & filters)
router.get('/profiles', browseProfiles);

// GET /api/co-founder/profile/:userId - Get own profile
router.get('/profile/:userId', getMyProfile);

// GET /api/co-founder/profiles/:id - Get a single profile by id
router.get('/profiles/:id', getProfile);

// DELETE /api/co-founder/profile/:userId - Delete own profile
router.delete('/profile/:userId', verifyToken, deleteProfile);

module.exports = router;
