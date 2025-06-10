const express = require('express');
const router = express.Router();
const {
 getAllUsers , verifyUser , banUser
} = require('../controllers/adminController');

// User Management
router.get('/users', getAllUsers);
router.put('/users/:id/verify', verifyUser);
router.put('/users/:id/ban', banUser);


module.exports = router;