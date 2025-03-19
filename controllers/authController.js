const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Fetch user from the database
        const [userRows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
        const user = userRows[0];

        // Check if user exists and password matches
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Determine user type
        let userType = null;

        // Check if the user is an admin
        const [adminRows] = await pool.query('SELECT * FROM admin WHERE user_id = ?', [user.id]);
        if (adminRows.length > 0) {
            userType = 'Admin';
        }

        // Check if the user is a client
        const [clientRows] = await pool.query('SELECT * FROM client WHERE user_id = ?', [user.id]);
        if (clientRows.length > 0) {
            userType = 'Client';
        }

        // Check if the user is a service provider
        const [providerRows] = await pool.query('SELECT * FROM service_provider WHERE user_id = ?', [user.id]);
        if (providerRows.length > 0) {
            userType = 'Provider';
        }

        // Check if the user is a company
        const [companyRows] = await pool.query('SELECT * FROM company WHERE user_id = ?', [user.id]);
        if (companyRows.length > 0) {
            userType = 'Company';
        }

        // If no user type is found, return an error
        if (!userType) {
            return res.status(403).json({ message: 'User type not found' });
        }

        // Generate a JWT token
        const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

        // Store the token in the auth table
        await pool.query('INSERT INTO auth (token, user_id) VALUES (?, ?)', [token, user.id]);

        // Return the response with user_id, token, user_type, and success message
        res.status(200).json({
            user_id: user.id,
            token,
            user_type: userType,
            message: 'Login successful'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { login };