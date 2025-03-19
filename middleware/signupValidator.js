const { body, validationResult } = require('express-validator');

// Validation rules for signup
const validateSignup = [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('city').notEmpty().withMessage('City is required'),
    body('zip_code').isNumeric().withMessage('Zip code must be a number'),
    body('image_url').optional().isURL().withMessage('Invalid image URL'),
    body('facebook_url').optional().isURL().withMessage('Invalid Facebook URL')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = { validateSignup, handleValidationErrors };