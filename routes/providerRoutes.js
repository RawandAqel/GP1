const express = require('express');
const { 
    getProfile,
    updateProfile,
    updateAvailability
} = require('../controllers/providerController');
const { authenticate, authorizeProvider } = require('../middleware/authMiddleware');

const router = express.Router();

// Get provider profile
router.get('/', authenticate, authorizeProvider, getProfile);

// Update profile
router.put('/', authenticate, authorizeProvider, updateProfile);

// Update availability
router.put('/availability', authenticate, authorizeProvider, updateAvailability);

module.exports = router;