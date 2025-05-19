const express = require('express');
const { 
    getOwnerCompanies,
    createCompany,
    getTeams,
    getTeam,
    addTeam,
    addTeamMember,
    getTeamProjects,
    addProject,
    getProject,
    updateProject,
    getCompanyJobs,
    addJob,
    deleteJob,
    getJob,
    updateJob,
    getJobApplicants,
    addApplicant,
    removeApplicant
} = require('../controllers/companyOwnerController');
const { authenticate, authorizeCompanyOwner } = require('../middleware/authMiddleware');


const router = express.Router();

// Company management
router.post('/companies', authenticate, authorizeCompanyOwner, createCompany);

// Team management
router.get('/companies/:companyId/teams', authenticate, authorizeCompanyOwner, getTeams);
router.get('/teams/:teamId', authenticate, authorizeCompanyOwner, getTeam);
router.post('/companies/:companyId/teams', authenticate, authorizeCompanyOwner, addTeam);
router.post('/teams/:teamId/members', authenticate, authorizeCompanyOwner, addTeamMember);
router.get('/teams/:teamId/projects', authenticate, authorizeCompanyOwner, getTeamProjects);

// Project management
router.post('/projects', authenticate, authorizeCompanyOwner, addProject);
router.get('/projects/:projectId', authenticate, authorizeCompanyOwner, getProject);
router.put('/projects/:projectId', authenticate, authorizeCompanyOwner, updateProject);

// Job management
router.get('/companies/:companyId/jobs', authenticate, authorizeCompanyOwner, getCompanyJobs);
router.post('/jobs', authenticate, authorizeCompanyOwner, addJob);
router.delete('/jobs/:jobId', authenticate, authorizeCompanyOwner, deleteJob);
router.get('/jobs/:jobId', authenticate, authorizeCompanyOwner, getJob);
router.put('/jobs/:jobId', authenticate, authorizeCompanyOwner, updateJob);

// Applicant management
router.get('/jobs/:jobId/applicants', authenticate, authorizeCompanyOwner, getJobApplicants);
router.post('/jobs/:jobId/applicants', authenticate, authorizeCompanyOwner, addApplicant);
router.delete('/applications/:applicationId', authenticate, authorizeCompanyOwner, removeApplicant);
router.get('/my-companies', authenticate, authorizeCompanyOwner, getOwnerCompanies);

module.exports = router;