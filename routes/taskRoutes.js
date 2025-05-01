const express = require('express');
const { 
    getActiveTasks,
    getTaskDetails,
    approveTask,
    rejectTask,
    updateTask,
    completeTask,
    getTaskHistory
} = require('../controllers/taskController');
const { authenticate, authorizeProvider } = require('../middleware/authMiddleware');

const router = express.Router();

// Get active tasks
router.get('/active', authenticate, authorizeProvider, getActiveTasks);

// Get task details
router.get('/:id', authenticate, authorizeProvider, getTaskDetails);

// Approve task
router.put('/:id/approve', authenticate, authorizeProvider, approveTask);

// Reject task
router.put('/:id/reject', authenticate, authorizeProvider, rejectTask);

// Update task
router.put('/:id', authenticate, authorizeProvider, updateTask);

// Complete task
router.put('/:id/complete', authenticate, authorizeProvider, completeTask);

// Get task history
router.get('/history/all', authenticate, authorizeProvider, getTaskHistory);

module.exports = router;