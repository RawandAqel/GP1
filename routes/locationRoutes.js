const express = require('express');
const { updateLocation, getLocation } = require('../controllers/locationController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.put('/', authenticate, updateLocation);
router.get('/:userId', authenticate, getLocation);

module.exports = router;