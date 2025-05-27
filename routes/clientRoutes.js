const express = require('express');
const { 
    getClientProfile,
    updateClientProfile,
    filterAvailable,
    search,
    createTask,
    createProject,
    processBilling,
    getProviderInfo,
    getCompanyInfo,
    getCompanyTeams,
    getClientTasks,
    updateClientTask,
    getClientProjects,
    getClientProject,
    updateClientProject
} = require('../controllers/clientController');
const { authenticate, authorizeClient } = require('../middleware/authMiddleware');

const router = express.Router();

// 1. Client profile routes
router.get('/profile', authenticate, authorizeClient, getClientProfile);
router.put('/profile', authenticate, authorizeClient, updateClientProfile);

// 2. Search and filter routes
router.get('/search', authenticate, authorizeClient, search);
router.get('/filter', authenticate, authorizeClient, filterAvailable);

// 3. Provider and company info routes
router.get('/providers/:providerId', authenticate, authorizeClient, getProviderInfo);
router.get('/companies/:companyId', authenticate, authorizeClient, getCompanyInfo);
router.get('/companies/:companyId/teams', authenticate, authorizeClient, getCompanyTeams);

// 4. Task routes
router.post('/tasks', authenticate, authorizeClient, createTask);
router.get('/tasks', authenticate, authorizeClient, getClientTasks);
router.put('/tasks/:taskId', authenticate, authorizeClient, updateClientTask);

// 5. Project routes
router.post('/projects', authenticate, authorizeClient, createProject);
router.get('/projects', authenticate, authorizeClient, getClientProjects);
router.get('/projects/:projectId', authenticate, authorizeClient, getClientProject);
router.put('/projects/:projectId', authenticate, authorizeClient, updateClientProject);

// 6. Billing route
router.post('/billing', authenticate, authorizeClient, processBilling);

module.exports = router;