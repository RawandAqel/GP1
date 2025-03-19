const express = require('express');
const { login } = require('../controllers/authController');
const { signupClient, signupServiceProvider } = require('../controllers/signupController');
const { logout } = require('../controllers/logoutController');
const { validateSignup, handleValidationErrors } = require('../middleware/signupValidator');
const { validateLogout } = require('../middleware/logoutValidator');

const router = express.Router();

router.post('/login', login);
router.post('/signup/client', validateSignup, handleValidationErrors, signupClient);
router.post('/signup/provider', validateSignup, handleValidationErrors, signupServiceProvider);
router.post('/logout', validateLogout, handleValidationErrors, logout);

module.exports = router;