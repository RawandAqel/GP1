const express = require('express');
const { getActiveProviders, searchProviderByEmail } = require('../controllers/providerSearchController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/active', authenticate, getActiveProviders);
router.get('/', authenticate, searchProviderByEmail);

module.exports = router;