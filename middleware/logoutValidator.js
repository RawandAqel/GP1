const { body, validationResult } = require('express-validator');

// Validation rules for logout
const validateLogout = [
    body('user_id').notEmpty().withMessage('User ID is required').isInt().withMessage('User ID must be an integer')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = { validateLogout, handleValidationErrors };