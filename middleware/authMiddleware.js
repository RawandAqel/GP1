const pool = require('../config/db');
const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Check if token exists in database
        const [tokenRecord] = await pool.query(
            'SELECT * FROM auth WHERE token = ? AND user_id = ?',
            [token, decoded.userId]
        );

        if (!tokenRecord.length) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        // Get user information
        const [user] = await pool.query('SELECT * FROM user WHERE id = ?', [decoded.userId]);

        if (!user.length) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Attach user and token to request
        req.user = user[0];
        req.token = token;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({
            success: false,
            message: 'Please authenticate'
        });
    }
};

// Middleware to authorize only service providers
const authorizeProvider = async (req, res, next) => {
    try {
        const [provider] = await pool.query(
            'SELECT * FROM service_provider WHERE user_id = ?', 
            [req.user.id]
        );

        if (!provider.length) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized as a service provider'
            });
        }

        // Attach the complete provider record to the request
        req.provider = provider[0];
        next();
    } catch (error) {
        console.error('Provider authorization error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during provider authorization'
        });
    }
};

const authorizeCompanyOwner = async (req, res, next) => {
    try {
        // Check if user owns the company they're trying to modify
        if (req.params.companyId) {
            const [company] = await pool.query(
                'SELECT * FROM company WHERE id = ? AND user_id = ?',
                [req.params.companyId, req.user.id]
            );

            if (!company.length) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized as company owner'
                });
            }
        }
        
        next();
    } catch (error) {
        console.error('Company owner authorization error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during company owner authorization'
        });
    }
};
const authorizeClient = async (req, res, next) => {
    try {
        const [client] = await pool.query(
            'SELECT * FROM client WHERE user_id = ?', 
            [req.user.id]
        );

        if (!client.length) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized as a service client'
            });
        }

        // Attach the complete client record to the request
        req.client = client[0];
        next();
    } catch (error) {
        console.error('client authorization error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during client authorization'
        });
    }
};
module.exports = {
    authenticate,
    authorizeProvider,
    authorizeCompanyOwner,
    authorizeClient
};