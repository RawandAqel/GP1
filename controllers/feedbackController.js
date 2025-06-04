const pool = require('../config/db');

// Rate and review a provider
const rateProvider = async (req, res) => {
    try {
        const clientId = req.user.id;
        const { providerId, rating, feedback } = req.body;

        // Check if client has completed tasks with this provider
        const [tasks] = await pool.query(`
            SELECT id FROM task
            WHERE client_id = (SELECT id FROM client WHERE user_id = ?)
            AND service_provider_id = ?
            AND completed = 1
            LIMIT 1
        `, [clientId, providerId]);

        if (!tasks.length) {
            return res.status(400).json({
                success: false,
                message: 'You must complete at least one task with this provider before rating'
            });
        }

        // Check if already rated
        const [existing] = await pool.query(`
            SELECT id FROM provider_feedback
            WHERE client_id = (SELECT id FROM client WHERE user_id = ?)
            AND service_provider_id = ?
            LIMIT 1
        `, [clientId, providerId]);

        if (existing.length) {
            return res.status(400).json({
                success: false,
                message: 'You have already rated this provider'
            });
        }

        await pool.query(`
            INSERT INTO provider_feedback
            (client_id, service_provider_id, feedback, rate)
            VALUES (
                (SELECT id FROM client WHERE user_id = ?),
                ?, ?, ?
            )
        `, [clientId, providerId, feedback, rating]);

        res.status(201).json({
            success: true,
            message: 'Provider rated successfully'
        });
    } catch (error) {
        console.error('Error rating provider:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while rating provider'
        });
    }
};

// Rate and review a company
const rateCompany = async (req, res) => {
    try {
        const clientId = req.user.id;
        const { companyId, rating, feedback } = req.body;

        // Check if client has completed projects with this company
        const [projects] = await pool.query(`
            SELECT id FROM project
            WHERE client_id = (SELECT id FROM client WHERE user_id = ?)
            AND team_id IN (SELECT id FROM team WHERE company_id = ?)
            LIMIT 1
        `, [clientId, companyId]);

        if (!projects.length) {
            return res.status(400).json({
                success: false,
                message: 'You must complete at least one project with this company before rating'
            });
        }

        // Check if already rated
        const [existing] = await pool.query(`
            SELECT id FROM company_feedback
            WHERE client_id = (SELECT id FROM client WHERE user_id = ?)
            AND company_id = ?
            LIMIT 1
        `, [clientId, companyId]);

        if (existing.length) {
            return res.status(400).json({
                success: false,
                message: 'You have already rated this company'
            });
        }

        await pool.query(`
            INSERT INTO company_feedback
            (client_id, company_id, feedback, rate)
            VALUES (
                (SELECT id FROM client WHERE user_id = ?),
                ?, ?, ?
            )
        `, [clientId, companyId, feedback, rating]);

        res.status(201).json({
            success: true,
            message: 'Company rated successfully'
        });
    } catch (error) {
        console.error('Error rating company:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while rating company'
        });
    }
};

module.exports = { rateProvider, rateCompany };