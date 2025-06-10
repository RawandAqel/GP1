const pool = require('../config/db');

// Get all active providers
const getActiveProviders = async (req, res) => {
    try {
        const [providers] = await pool.query(`
            SELECT 
                sp.id AS provider_id,
                u.id AS user_id,
                u.first_name,
                u.last_name,
                u.email,
                u.image_url,
                sp.hourly_rate,
                sp.skills,
                pc.name AS position,
                loc.zip_code,
                city.name AS city_name
            FROM service_provider sp
            JOIN user u ON sp.user_id = u.id
            LEFT JOIN position_provider pp ON sp.id = pp.service_provider_id
            LEFT JOIN position_category pc ON pp.position_category_id = pc.id
            LEFT JOIN location loc ON u.location_id = loc.id
            LEFT JOIN city ON loc.city_id = city.id
            WHERE sp.is_available = 1
            ORDER BY u.first_name ASC
        `);

        res.status(200).json({
            success: true,
            count: providers.length,
            providers
        });
    } catch (error) {
        console.error('Error fetching active providers:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching active providers'
        });
    }
};

// Search provider by email
const searchProviderByEmail = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email parameter is required'
            });
        }

        const [providers] = await pool.query(`
            SELECT 
                sp.id AS provider_id,
                u.id AS user_id,
                u.first_name,
                u.last_name,
                u.email,
                u.image_url,
                sp.hourly_rate,
                sp.skills,
                pc.name AS position
            FROM service_provider sp
            JOIN user u ON sp.user_id = u.id
            LEFT JOIN position_provider pp ON sp.id = pp.service_provider_id
            LEFT JOIN position_category pc ON pp.position_category_id = pc.id
            WHERE u.email LIKE ? AND sp.is_available = 1
            LIMIT 10
        `, [`%${email}%`]);

        res.status(200).json({
            success: true,
            count: providers.length,
            providers
        });
    } catch (error) {
        console.error('Error searching providers:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while searching providers'
        });
    }
};

module.exports = { getActiveProviders, searchProviderByEmail };