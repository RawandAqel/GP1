const express = require('express');
const {
    createMilestone,
    getProjectMilestones,
    updateMilestone,
    deleteMilestone
} = require('../controllers/milestoneController');
const { authenticate, authorizeCompanyOwner } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, authorizeCompanyOwner, createMilestone);
router.get('/project/:projectId', authenticate, authorizeCompanyOwner, getProjectMilestones);
router.put('/:milestoneId', authenticate, authorizeCompanyOwner, updateMilestone);
router.delete('/:milestoneId', authenticate, authorizeCompanyOwner, deleteMilestone);

module.exports = router;