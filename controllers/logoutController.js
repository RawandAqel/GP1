const pool = require('../config/db');

const logout = async (req, res) => {
    const { user_id } = req.body;

    try {
        // Delete the token for the given user_id from the auth table
        const [result] = await pool.query('DELETE FROM auth WHERE user_id = ?', [user_id]);

        if (result.affectedRows === 0) {
            // If no token was found for the user_id
            return res.status(404).json({ message: 'No active session found for this user' });
        }

        // Return success message
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { logout };