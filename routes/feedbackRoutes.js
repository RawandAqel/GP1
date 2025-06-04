const express = require('express');
const { rateProvider, rateCompany } = require('../controllers/feedbackController');
const { authenticate, authorizeClient } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/provider', authenticate, authorizeClient, rateProvider);
router.post('/company', authenticate, authorizeClient, rateCompany);

module.exports = router;