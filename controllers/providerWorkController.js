const pool = require('../config/db');

// Get all jobs assigned to provider
const getMyJobs = async (req, res) => {
    try {
        const providerId = req.provider.id;

        const [jobs] = await pool.query(`
            SELECT 
                j.*,
                ja.company_id,
                c.name AS company_name,
                c.image_url AS company_logo,
                pj.created AS assigned_date
            FROM provider_job pj
            JOIN job_application ja ON pj.job_application_id = ja.id
            JOIN job j ON ja.job_id = j.id
            JOIN company c ON ja.company_id = c.id
            WHERE pj.provider_id = ?
            ORDER BY pj.created DESC
        `, [providerId]);

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });
    } catch (error) {
        console.error('Error fetching provider jobs:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching jobs'
        });
    }
};

// Get all projects assigned to provider
const getMyProjects = async (req, res) => {
    try {
        const providerId = req.provider.id;

        const [projects] = await pool.query(`
            SELECT 
                p.*,
                t.name AS team_name,
                c.name AS company_name,
                c.image_url AS company_logo,
                CONCAT(u.first_name, ' ', u.last_name) AS client_name
            FROM project p
            JOIN team t ON p.team_id = t.id
            JOIN company c ON t.company_id = c.id
            JOIN provider_team pt ON t.id = pt.team_id
            JOIN client cl ON p.client_id = cl.id
            JOIN user u ON cl.user_id = u.id
            WHERE pt.service_provider_id = ?
            ORDER BY p.created DESC
        `, [providerId]);

        res.status(200).json({
            success: true,
            count: projects.length,
            projects
        });
    } catch (error) {
        console.error('Error fetching provider projects:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching projects'
        });
    }
};

// Get all teams the provider belongs to
const getMyTeams = async (req, res) => {
    try {
        const providerId = req.provider.id;

        const [teams] = await pool.query(`
            SELECT 
                t.*,
                c.name AS company_name,
                c.image_url AS company_logo,
                COUNT(DISTINCT pt2.service_provider_id) AS member_count
            FROM provider_team pt
            JOIN team t ON pt.team_id = t.id
            JOIN company c ON t.company_id = c.id
            LEFT JOIN provider_team pt2 ON t.id = pt2.team_id
            WHERE pt.service_provider_id = ?
            GROUP BY t.id
            ORDER BY t.created DESC
        `, [providerId]);

        // Get team members for each team
        for (let team of teams) {
            const [members] = await pool.query(`
                SELECT 
                    u.id, 
                    CONCAT(u.first_name, ' ', u.last_name) AS name,
                    u.image_url,
                    pc.name AS position
                FROM provider_team pt
                JOIN service_provider sp ON pt.service_provider_id = sp.id
                JOIN user u ON sp.user_id = u.id
                LEFT JOIN position_provider pp ON sp.id = pp.service_provider_id
                LEFT JOIN position_category pc ON pp.position_category_id = pc.id
                WHERE pt.team_id = ?
            `, [team.id]);
            team.members = members;
        }

        res.status(200).json({
            success: true,
            count: teams.length,
            teams
        });
    } catch (error) {
        console.error('Error fetching provider teams:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching teams'
        });
    }
};

// Get company details the provider works for
const getMyCompanies = async (req, res) => {
    try {
        const providerId = req.provider.id;

        const [companies] = await pool.query(`
            SELECT DISTINCT
                c.*,
                COUNT(DISTINCT t.id) AS team_count,
                COUNT(DISTINCT sp.id) AS provider_count
            FROM provider_team pt
            JOIN team t ON pt.team_id = t.id
            JOIN company c ON t.company_id = c.id
            JOIN service_provider sp ON pt.service_provider_id = sp.id
            WHERE pt.service_provider_id = ?
            GROUP BY c.id
        `, [providerId]);

        res.status(200).json({
            success: true,
            count: companies.length,
            companies
        });
    } catch (error) {
        console.error('Error fetching provider companies:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching companies'
        });
    }
};

module.exports = {
    getMyJobs,
    getMyProjects,
    getMyTeams,
    getMyCompanies
};