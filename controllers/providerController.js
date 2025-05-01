const pool = require('../config/db');

// Get provider profile info
const getProfile = async (req, res) => {
    try {
        const providerId = req.provider.id;

        // Get basic profile info
        const [provider] = await pool.query(`
            SELECT 
                sp.*,
                u.first_name, u.last_name, u.email, u.image_url, u.facebook_url,
                l.zip_code, c.name AS city_name , is_available
            FROM service_provider sp
            JOIN user u ON sp.user_id = u.id
            LEFT JOIN location l ON u.location_id = l.id
            LEFT JOIN city c ON l.city_id = c.id
            WHERE sp.id = ?
        `, [providerId]);

        if (!provider.length) {
            return res.status(404).json({
                success: false,
                message: 'Provider not found'
            });
        }

        // Get accurate provider statistics
        const [stats] = await pool.query(`
            SELECT 
                COUNT(*) AS total_tasks,
                SUM(CASE WHEN t.completed = 1 THEN 1 ELSE 0 END) AS completed_tasks,
                AVG(pf.rate) AS avg_rating
            FROM task t
            LEFT JOIN provider_feedback pf ON t.service_provider_id = pf.service_provider_id 
                AND t.client_id = pf.client_id
            WHERE t.service_provider_id = ?
        `, [providerId]);

        // Get provider's positions/skills
        const [positions] = await pool.query(`
            SELECT pc.name, pc.code
            FROM position_provider pp
            JOIN position_category pc ON pp.position_category_id = pc.id
            WHERE pp.service_provider_id = ?
        `, [providerId]);

        res.status(200).json({
            success: true,
            profile: provider[0],
            stats: {
                total_tasks: stats[0].total_tasks || 0,
                completed_tasks: stats[0].completed_tasks || 0,
                avg_rating: stats[0].avg_rating ? parseFloat(stats[0].avg_rating).toFixed(1) : null
            },
            positions: positions
        });
    } catch (error) {
        console.error('Error fetching provider profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching profile'
        });
    }
};

// Update provider profile
const updateProfile = async (req, res) => {
    try {
        const providerId = req.provider.id;
        const userId = req.provider.user_id;
        const { 
            first_name, 
            last_name, 
            email,
            bio,
            hourly_rate,
            skills,
            image_url,
            facebook_url,
            zip_code,
            city_name
        } = req.body;

        // Start transaction
        await pool.query('START TRANSACTION');

        // Update user table
        await pool.query(`
            UPDATE user 
            SET first_name = ?, last_name = ?, email = ?, 
                image_url = ?, facebook_url = ?, updated = NOW()
            WHERE id = ?
        `, [first_name, last_name, email, image_url, facebook_url, userId]);

        // Update location if changed
        if (zip_code && city_name) {
            // Check if city exists
            const [city] = await pool.query('SELECT id FROM city WHERE name = ?', [city_name]);
            let cityId;
            
            if (city.length) {
                cityId = city[0].id;
            } else {
                const [newCity] = await pool.query('INSERT INTO city (name, zip_code) VALUES (?, ?)', [city_name, zip_code]);
                cityId = newCity.insertId;
            }

            // Update or create location
            const [location] = await pool.query('SELECT id FROM location WHERE zip_code = ? AND city_id = ?', [zip_code, cityId]);
            let locationId;
            
            if (location.length) {
                locationId = location[0].id;
            } else {
                const [newLocation] = await pool.query('INSERT INTO location (zip_code, city_id) VALUES (?, ?)', [zip_code, cityId]);
                locationId = newLocation.insertId;
            }

            // Update user location
            await pool.query('UPDATE user SET location_id = ? WHERE id = ?', [locationId, userId]);
        }

        // Update service_provider table
        await pool.query(`
            UPDATE service_provider
            SET bio = ?, hourly_rate = ?, skills = ?, updated = NOW()
            WHERE id = ?
        `, [bio, hourly_rate, skills, providerId]);

        await pool.query('COMMIT');

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error updating profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating profile'
        });
    }
};

// Update availability status
const updateAvailability = async (req, res) => {
    try {
        const providerId = req.provider.id;
        const { is_available } = req.body;

        await pool.query(`
            UPDATE service_provider
            SET is_available = ?, updated = NOW()
            WHERE id = ?
        `, [is_available, providerId]);

        res.status(200).json({
            success: true,
            message: 'Availability updated successfully'
        });
    } catch (error) {
        console.error('Error updating availability:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating availability'
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    updateAvailability
};