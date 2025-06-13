const express = require('express');
const router = express.Router();
const {
getAllUsers , 
verifyUser ,
banUser,
unbanUser,
unverifyUser,
addUser,
getAllTasks,
getAllProjects
} = require('../controllers/adminController');

// User Management
router.get('/users', getAllUsers);
router.put('/users/:id/verify', verifyUser);
router.put('/users/:id/ban', banUser);
router.put('/users/:id/unban', unbanUser);
router.put('/users/:id/unverify', unverifyUser);
router.post('/users', addUser);

// Task Management API
router.get('/tasks', getAllTasks);

// Project Management API
router.get('/projects', getAllProjects);

module.exports = router;