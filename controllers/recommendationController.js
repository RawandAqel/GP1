const pool = require('../config/db');

// Recommend providers based on location and category
const recommendProviders = async (req, res) => {
    try {
        const { city, category, minRating } = req.query;
        const clientId = req.user.id;

        // Get client location
        const [clientLocation] = await pool.query(`
            SELECT loc.*, city.name AS city_name 
            FROM user u
            LEFT JOIN location loc ON u.location_id = loc.id
            LEFT JOIN city ON loc.city_id = city.id
            WHERE u.id = ?
        `, [clientId]);

        const [providers] = await pool.query(`
            SELECT 
                sp.*,
                u.first_name, u.last_name, u.image_url,
                COALESCE(AVG(pf.rate), 0) AS avg_rating,
                pc.name AS category_name,
                loc.zip_code,
                city.name AS city_name,
                SQRT(
                    POW(69.1 * (loc.latitude - ?), 2) + 
                    POW(69.1 * (? - loc.longitude) * COS(latitude / 57.3), 2)
                ) AS distance_miles
            FROM service_provider sp
            JOIN user u ON sp.user_id = u.id
            LEFT JOIN provider_feedback pf ON sp.id = pf.service_provider_id
            LEFT JOIN position_provider pp ON sp.id = pp.service_provider_id
            LEFT JOIN position_category pc ON pp.position_category_id = pc.id
            LEFT JOIN location loc ON u.location_id = loc.id
            LEFT JOIN city ON loc.city_id = city.id
            WHERE sp.is_available = 1
            AND (? IS NULL OR city.name = ?)
            AND (? IS NULL OR pc.name = ?)
            AND (? IS NULL OR (
                SELECT AVG(rate) FROM provider_feedback 
                WHERE service_provider_id = sp.id
            ) >= ?)
            GROUP BY sp.id
            ORDER BY distance_miles ASC, avg_rating DESC
            LIMIT 10
        `, [
            clientLocation[0]?.latitude || 0,
            clientLocation[0]?.longitude || 0,
            city, city,
            category, category,
            minRating, minRating
        ]);

        res.status(200).json({
            success: true,
            providers
        });
    } catch (error) {
        console.error('Error recommending providers:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while recommending providers'
        });
    }
};

// Recommend companies based on location and services
const recommendCompanies = async (req, res) => {
    try {
        const { service, minRating } = req.query;
        const clientId = req.user.id;

        // Get client location
        const [clientLocation] = await pool.query(`
            SELECT loc.*, city.name AS city_name 
            FROM user u
            LEFT JOIN location loc ON u.location_id = loc.id
            LEFT JOIN city ON loc.city_id = city.id
            WHERE u.id = ?
        `, [clientId]);

        const [companies] = await pool.query(`
            SELECT 
                c.*,
                COALESCE(AVG(cf.rate), 0) AS avg_rating,
                loc.zip_code,
                city.name AS city_name,
                SQRT(
                    POW(69.1 * (loc.latitude - ?), 2) + 
                    POW(69.1 * (? - loc.longitude) * COS(latitude / 57.3), 2)
                ) AS distance_miles
            FROM company c
            LEFT JOIN company_feedback cf ON c.id = cf.company_id
            LEFT JOIN location loc ON c.location_id = loc.id
            LEFT JOIN city ON loc.city_id = city.id
            LEFT JOIN position_company pc ON c.id = pc.company_id
            LEFT JOIN position_category pcat ON pc.position_category_id = pcat.id
            WHERE (? IS NULL OR pcat.name = ?)
            AND (? IS NULL OR (
                SELECT AVG(rate) FROM company_feedback 
                WHERE company_id = c.id
            ) >= ?)
            GROUP BY c.id
            ORDER BY distance_miles ASC, avg_rating DESC
            LIMIT 10
        `, [
            clientLocation[0]?.latitude || 0,
            clientLocation[0]?.longitude || 0,
            service, service,
            minRating, minRating
        ]);

        res.status(200).json({
            success: true,
            companies
        });
    } catch (error) {
        console.error('Error recommending companies:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while recommending companies'
        });
    }
};

module.exports = { recommendProviders, recommendCompanies };