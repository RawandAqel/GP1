const pool = require('../config/db');

// Update user location
const updateLocation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { latitude, longitude } = req.body;

        await pool.query('START TRANSACTION');

        // Get current location
        const [user] = await pool.query('SELECT location_id FROM user WHERE id = ?', [userId]);
        const locationId = user[0].location_id;

        if (locationId) {
            // Update existing location
            await pool.query(`
                UPDATE location 
                SET latitude = ?, longitude = ?, updated = NOW()
                WHERE id = ?
            `, [latitude, longitude, locationId]);
        } else {
            // Create new location
            const [location] = await pool.query(`
                INSERT INTO location (latitude, longitude)
                VALUES (?, ?)
            `, [latitude, longitude]);
            
            await pool.query(`
                UPDATE user 
                SET location_id = ?, updated = NOW()
                WHERE id = ?
            `, [location.insertId, userId]);
        }

        await pool.query('COMMIT');

        res.status(200).json({
            success: true,
            message: 'Location updated successfully'
        });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error updating location:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating location'
        });
    }
};

// Get user location
const getLocation = async (req, res) => {
    try {
        const userId = req.params.userId;

        const [location] = await pool.query(`
            SELECT loc.latitude, loc.longitude 
            FROM user u
            LEFT JOIN location loc ON u.location_id = loc.id
            WHERE u.id = ?
        `, [userId]);

        if (!location[0]?.latitude) {
            return res.status(404).json({
                success: false,
                message: 'Location not found'
            });
        }

        res.status(200).json({
            success: true,
            location: location[0]
        });
    } catch (error) {
        console.error('Error getting location:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while getting location'
        });
    }
};

module.exports = { updateLocation, getLocation };