const pool = require('../config/db');
// const { v4: uuidv4 } = require('uuid');
// 0. Get all companies
const getOwnerCompanies = async (req, res) => {
    try {
        const ownerId = req.user.id; // From authenticated user

        const [companies] = await pool.query(`
            SELECT 
                c.*,
                COUNT(DISTINCT t.id) AS team_count,
                COUNT(DISTINCT pt.service_provider_id) AS employee_count,
                loc.zip_code,
                city.name AS city_name
            FROM company c
            LEFT JOIN team t ON c.id = t.company_id
            LEFT JOIN provider_team pt ON t.id = pt.team_id
            LEFT JOIN location loc ON c.location_id = loc.id
            LEFT JOIN city ON loc.city_id = city.id
            WHERE c.user_id = ?
            GROUP BY c.id
            ORDER BY c.created DESC
        `, [ownerId]);

        res.status(200).json({
            success: true,
            count: companies.length,
            companies
        });
    } catch (error) {
        console.error('Error fetching owner companies:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching companies'
        });
    }
};
// 1. Create new company
const createCompany = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, description, image_url, city, zip_code } = req.body;

        // Start transaction
        await pool.query('START TRANSACTION');

        // Create or find city
        const [cityData] = await pool.query('SELECT id FROM city WHERE name = ?', [city]);
        let cityId = cityData.length ? cityData[0].id : null;
        
        if (!cityId) {
            const [newCity] = await pool.query('INSERT INTO city (name, zip_code) VALUES (?, ?)', [city, zip_code]);
            cityId = newCity.insertId;
        }

        // Create location
        const [location] = await pool.query('INSERT INTO location (zip_code, city_id) VALUES (?, ?)', [zip_code, cityId]);
        const locationId = location.insertId;

        // Create company
        const [company] = await pool.query(
            'INSERT INTO company (name, description, image_url, user_id, location_id) VALUES (?, ?, ?, ?, ?)',
            [name, description, image_url, userId, locationId]
        );

        await pool.query('COMMIT');

        res.status(201).json({
            success: true,
            companyId: company.insertId,
            message: 'Company created successfully'
        });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error creating company:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating company'
        });
    }
};

// 2. Get all teams
const getTeams = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const [teams] = await pool.query(`
            SELECT t.*, COUNT(pt.service_provider_id) AS member_count
            FROM team t
            LEFT JOIN provider_team pt ON t.id = pt.team_id
            WHERE t.company_id = ?
            GROUP BY t.id
            ORDER BY t.created DESC
        `, [companyId]);

        res.status(200).json({
            success: true,
            count: teams.length,
            teams
        });
    } catch (error) {
        console.error('Error fetching teams:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching teams'
        });
    }
};

// 3. Get one team
const getTeam = async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const [team] = await pool.query(`
            SELECT t.*, c.name AS company_name
            FROM team t
            JOIN company c ON t.company_id = c.id
            WHERE t.id = ?
        `, [teamId]);

        if (!team.length) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        // Get team members
        const [members] = await pool.query(`
            SELECT 
                sp.id AS provider_id,
                u.first_name, u.last_name, u.email, u.image_url,
                pc.name AS position
            FROM provider_team pt
            JOIN service_provider sp ON pt.service_provider_id = sp.id
            JOIN user u ON sp.user_id = u.id
            LEFT JOIN position_provider pp ON sp.id = pp.service_provider_id
            LEFT JOIN position_category pc ON pp.position_category_id = pc.id
            WHERE pt.team_id = ?
        `, [teamId]);

        res.status(200).json({
            success: true,
            team: {
                ...team[0],
                members
            }
        });
    } catch (error) {
        console.error('Error fetching team:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching team'
        });
    }
};

// 4. Add new team
const addTeam = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const { name, description } = req.body;

        const [team] = await pool.query(
            'INSERT INTO team (name, description, company_id) VALUES (?, ?, ?)',
            [name, description, companyId]
        );

        res.status(201).json({
            success: true,
            teamId: team.insertId,
            message: 'Team created successfully'
        });
    } catch (error) {
        console.error('Error creating team:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating team'
        });
    }
};

// 5. Add employee to team
const addTeamMember = async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const { providerId } = req.body;

        // Check if provider exists
        const [provider] = await pool.query('SELECT * FROM service_provider WHERE id = ?', [providerId]);
        if (!provider.length) {
            return res.status(404).json({
                success: false,
                message: 'Service provider not found'
            });
        }

        // Check if already in team
        const [existing] = await pool.query(
            'SELECT * FROM provider_team WHERE team_id = ? AND service_provider_id = ?',
            [teamId, providerId]
        );

        if (existing.length) {
            return res.status(400).json({
                success: false,
                message: 'Provider already in this team'
            });
        }

        await pool.query(
            'INSERT INTO provider_team (team_id, service_provider_id) VALUES (?, ?)',
            [teamId, providerId]
        );

        res.status(201).json({
            success: true,
            message: 'Provider added to team successfully'
        });
    } catch (error) {
        console.error('Error adding team member:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding team member'
        });
    }
};

// 6. Get team projects
const getTeamProjects = async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const [projects] = await pool.query(`
            SELECT 
                p.*,
                CONCAT(u.first_name, ' ', u.last_name) AS client_name,
                c.name AS company_name
            FROM project p
            JOIN client cl ON p.client_id = cl.id
            JOIN user u ON cl.user_id = u.id
            join team on team.id = p.team_id
            JOIN company c ON team.company_id = c.id
            WHERE p.team_id = ?
            ORDER BY p.created DESC
        `, [teamId]);

        res.status(200).json({
            success: true,
            count: projects.length,
            projects
        });
    } catch (error) {
        console.error('Error fetching team projects:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching team projects'
        });
    }
};

// 7. Add new project
const addProject = async (req, res) => {
    try {
        const { 
            name, 
            client_id, 
            team_id, 
            initial_price, 
            max_price, 
            description, 
            start_date, 
            end_date 
        } = req.body;

        const [project] = await pool.query(`
            INSERT INTO project (
                name, client_id, team_id, Initial_price, max_price, 
                description, start_date, end_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [name, client_id, team_id, initial_price, max_price, description, start_date, end_date]);

        res.status(201).json({
            success: true,
            projectId: project.insertId,
            message: 'Project created successfully'
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating project'
        });
    }
};

// 8. Get one project info
const getProject = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        
        // Get comprehensive project details
        const [project] = await pool.query(`
            SELECT 
                p.*,
                t.name AS team_name,
                c.name AS company_name,
                CONCAT(u.first_name, ' ', u.last_name) AS client_name,
                u.email AS client_email,
                u.phone AS client_phone,
                loc.zip_code,
                city.name AS city_name,
                p.Initial_price AS initial_price,
                p.max_price AS max_price,
                p.actual_price AS final_price,
                p.start_date,
                p.end_date,
                DATEDIFF(p.end_date, p.start_date) AS duration_days,
                p.description AS project_description
            FROM project p
            JOIN team t ON p.team_id = t.id
            JOIN company c ON t.company_id = c.id
            JOIN client cl ON p.client_id = cl.id
            JOIN user u ON cl.user_id = u.id
            LEFT JOIN location loc ON u.location_id = loc.id
            LEFT JOIN city ON loc.city_id = city.id
            WHERE p.id = ?
        `, [projectId]);

        if (!project.length) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        
        const [milestones] = await pool.query(`
            SELECT * FROM project_milestone 
            WHERE project_id = ?
            ORDER BY due_date
        `, [projectId]);

   

        res.status(200).json({
            success: true,
            project: {
                ...project[0],
                milestones
            }
        });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching project details'
        });
    }
};

// 9. Update project
const updateProject = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const updates = req.body;
        
        // Build dynamic update query
        const setClause = Object.keys(updates)
            .filter(key => key !== 'id')
            .map(key => `${key} = ?`)
            .join(', ');
        
        const values = Object.values(updates);
        values.push(projectId);

        await pool.query(
            `UPDATE project SET ${setClause}, updated = NOW() WHERE id = ?`,
            values
        );

        res.status(200).json({
            success: true,
            message: 'Project updated successfully'
        });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating project'
        });
    }
};

// 10. Get company jobs
const getCompanyJobs = async (req, res) => {
    try {
        const companyId = req.params.companyId;
        const [jobs] = await pool.query(`
            SELECT 
                j.*
            FROM job j
            LEFT JOIN job_application ja ON j.id = ja.job_id
            WHERE ja.company_id = ?
            GROUP BY j.id
            ORDER BY j.created DESC
        `, [companyId, companyId]);

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });
    } catch (error) {
        console.error('Error fetching company jobs:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching company jobs'
        });
    }
};

// 11. Add new job
const addJob = async (req, res) => {
    try {
        const { name, description, company_id } = req.body;

        // Validate company exists
        const [company] = await pool.query(
            'SELECT id FROM company WHERE id = ?',
            [company_id]
        );
        
        if (!company.length) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        // Start transaction
        await pool.query('START TRANSACTION');

        // 1. Create the job
        const [job] = await pool.query(
            'INSERT INTO job (name, description) VALUES (?, ?)',
            [name, description]
        );

        // 2. Create the initial job application
        await pool.query(
            'INSERT INTO job_application (job_id, company_id) VALUES (?, ?)',
            [job.insertId, company_id]
        );

        await pool.query('COMMIT');

        res.status(201).json({
            success: true,
            jobId: job.insertId,
            message: 'Job created successfully'
        });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error creating job:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating job'
        });
    }
};

// 12. Delete job
const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        
        await pool.query('DELETE FROM job WHERE id = ?', [jobId]);

        res.status(200).json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting job'
        });
    }
};

// 13. Get one job details
const getJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const [job] = await pool.query(`
            SELECT 
                j.*,
                c.name AS company_name,
                c.image_url AS company_logo
            FROM job j
            join job_application on job_application.job_id = j.id
            JOIN company c ON job_application.company_id = c.id
            WHERE j.id = ?
        `, [jobId]);

        if (!job.length) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Get job applications
        const [applications] = await pool.query(`
            SELECT 
                ja.*,
                CONCAT(u.first_name, ' ', u.last_name) AS applicant_name,
                u.email AS applicant_email,
                u.image_url AS applicant_image
            FROM job_application ja
            join provider_job pj on pj.job_application_id = ja.id
            JOIN service_provider sp ON pj.provider_id = sp.id
            JOIN user u ON sp.user_id = u.id
            WHERE ja.job_id = ?
        `, [jobId]);

        res.status(200).json({
            success: true,
            job: {
                ...job[0],
                applications
            }
        });
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching job'
        });
    }
};

// 14. Update job
const updateJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const { name, description } = req.body;
        
        await pool.query(
            'UPDATE job SET name = ?, description = ?, updated = NOW() WHERE id = ?',
            [name, description, jobId]
        );

        res.status(200).json({
            success: true,
            message: 'Job updated successfully'
        });
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating job'
        });
    }
};

// 15. Show job applicants
const getJobApplicants = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        
        const [applicants] = await pool.query(`
            SELECT 
                pj.*,
                sp.id AS provider_id,
                CONCAT(u.first_name, ' ', u.last_name) AS provider_name,
                u.email AS provider_email,
                u.image_url AS provider_image,
                pc.name AS position
            FROM provider_job pj
            JOIN job_application ja ON pj.job_application_id = ja.id
            JOIN service_provider sp ON pj.provider_id = sp.id
            JOIN user u ON sp.user_id = u.id
            LEFT JOIN position_provider pp ON sp.id = pp.service_provider_id
            LEFT JOIN position_category pc ON pp.position_category_id = pc.id
            WHERE ja.job_id = ?
        `, [jobId]);

        res.status(200).json({
            success: true,
            count: applicants.length,
            applicants
        });
    } catch (error) {
        console.error('Error fetching job applicants:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching job applicants'
        });
    }
};

// 16. Add new applicant
const addApplicant = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const { provider_id } = req.body;

        // First get the job_application_id for this job
        const [jobApplication] = await pool.query(
            'SELECT id FROM job_application WHERE job_id = ? LIMIT 1',
            [jobId]
        );

        if (!jobApplication.length) {
            return res.status(404).json({
                success: false,
                message: 'Job application not found'
            });
        }

        const job_application_id = jobApplication[0].id;

        // Check if provider already applied
        const [existing] = await pool.query(
            'SELECT * FROM provider_job WHERE job_application_id = ? AND provider_id = ?',
            [job_application_id, provider_id]
        );

        if (existing.length) {
            return res.status(400).json({
                success: false,
                message: 'Provider has already applied for this job'
            });
        }

        await pool.query(
            'INSERT INTO provider_job (job_application_id, provider_id) VALUES (?, ?)',
            [job_application_id, provider_id]
        );

        res.status(201).json({
            success: true,
            message: 'Applicant added successfully'
        });
    } catch (error) {
        console.error('Error adding applicant:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding applicant'
        });
    }
};

// 17. Remove applicant
const removeApplicant = async (req, res) => {
    try {
        const applicationId = req.params.applicationId;
        
        // First verify the application exists
        const [application] = await pool.query(
            'SELECT * FROM provider_job WHERE id = ?',
            [applicationId]
        );

        if (!application.length) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        await pool.query(
            'DELETE FROM provider_job WHERE id = ?',
            [applicationId]
        );

        res.status(200).json({
            success: true,
            message: 'Applicant removed successfully'
        });
    } catch (error) {
        console.error('Error removing applicant:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while removing applicant'
        });
    }
};

module.exports = {
    getOwnerCompanies,
    createCompany,
    getTeams,
    getTeam,
    addTeam,
    addTeamMember,
    getTeamProjects,
    addProject,
    getProject,
    updateProject,
    getCompanyJobs,
    addJob,
    deleteJob,
    getJob,
    updateJob,
    getJobApplicants,
    addApplicant,
    removeApplicant
};