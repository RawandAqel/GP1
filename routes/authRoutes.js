const express = require('express');
const { login } = require('../controllers/authController');
const { signupClient, signupServiceProvider } = require('../controllers/signupController');
const { validateSignup, handleValidationErrors } = require('../middleware/signupValidator');

const router = express.Router();

router.post('/login', login);
router.post('/signup/client', validateSignup, handleValidationErrors, signupClient);
router.post('/signup/provider', validateSignup, handleValidationErrors, signupServiceProvider);

module.exports = router;