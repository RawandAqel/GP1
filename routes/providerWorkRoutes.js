const express = require('express');
const { 
    getMyJobs,
    getMyProjects,
    getMyTeams,
    getMyCompanies
} = require('../controllers/providerWorkController');
const { authenticate, authorizeProvider } = require('../middleware/authMiddleware');

const router = express.Router();

// Provider work-related endpoints
router.get('/jobs', authenticate, authorizeProvider, getMyJobs);
router.get('/projects', authenticate, authorizeProvider, getMyProjects);
router.get('/teams', authenticate, authorizeProvider, getMyTeams);
router.get('/companies', authenticate, authorizeProvider, getMyCompanies);

module.exports = router;