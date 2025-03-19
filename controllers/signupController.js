const pool = require('../config/db');

// Helper function to insert location and return location_id
const insertLocation = async (city, zip_code) => {
    const [cityRows] = await pool.query('SELECT id FROM city WHERE name = ?', [city]);
    let cityId;

    if (cityRows.length === 0) {
        // If city doesn't exist, insert it into the city table
        const [insertCity] = await pool.query('INSERT INTO city (name, zip_code) VALUES (?, ?)', [city, zip_code]);
        cityId = insertCity.insertId;
    } else {
        cityId = cityRows[0].id;
    }

    // Insert location into the location table
    const [insertLocation] = await pool.query('INSERT INTO location (zip_code, city_id) VALUES (?, ?)', [zip_code, cityId]);
    return insertLocation.insertId;
};

// Signup for Client
const signupClient = async (req, res) => {
    const { first_name, last_name, email, password, city, zip_code, image_url, facebook_url } = req.body;

    try {
        // Check if the email already exists
        const [userRows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
        if (userRows.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Insert location and get location_id
        const location_id = await insertLocation(city, zip_code);

        // Insert user into the user table
        const [userResult] = await pool.query(
            'INSERT INTO user (first_name, last_name, email, password, image_url, facebook_url, location_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, password, image_url, facebook_url, location_id]
        );

        const userId = userResult.insertId;

        // Insert client into the client table
        await pool.query('INSERT INTO client (user_id) VALUES (?)', [userId]);

        res.status(201).json({ message: 'Client signup successful', user_id: userId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Signup for Service Provider
const signupServiceProvider = async (req, res) => {
    const { first_name, last_name, email, password, city, zip_code, image_url, facebook_url } = req.body;

    try {
        // Check if the email already exists
        const [userRows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
        if (userRows.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Insert location and get location_id
        const location_id = await insertLocation(city, zip_code);

        // Insert user into the user table
        const [userResult] = await pool.query(
            'INSERT INTO user (first_name, last_name, email, password, image_url, facebook_url, location_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, password, image_url, facebook_url, location_id]
        );

        const userId = userResult.insertId;

        // Insert service provider into the service_provider table
        await pool.query('INSERT INTO service_provider (user_id) VALUES (?)', [userId]);

        res.status(201).json({ message: 'Service Provider signup successful', user_id: userId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { signupClient, signupServiceProvider };