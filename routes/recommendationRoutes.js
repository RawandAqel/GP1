const express = require('express');
const { recommendProviders, recommendCompanies } = require('../controllers/recommendationController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/providers', authenticate, recommendProviders);
router.get('/companies', authenticate, recommendCompanies);

module.exports = router;