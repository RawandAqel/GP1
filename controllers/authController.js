const pool = require('../config/db');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
        const user = rows[0];

        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

        await pool.query('INSERT INTO auth (token, user_id) VALUES (?, ?)', [token, user.id]);

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { login };