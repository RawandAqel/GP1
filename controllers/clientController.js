const pool = require('../config/db');

// 1. Get client profile info
const getClientProfile = async (req, res) => {
    try {
        const clientId = req.user.id;

        const [client] = await pool.query(`
            SELECT 
                u.*,
                loc.zip_code,
                city.name AS city_name
            FROM client c
            JOIN user u ON c.user_id = u.id
            LEFT JOIN location loc ON u.location_id = loc.id
            LEFT JOIN city ON loc.city_id = city.id
            WHERE u.id = ?
        `, [clientId]);

        if (!client.length) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        res.status(200).json({
            success: true,
            client: client[0]
        });
    } catch (error) {
        console.error('Error fetching client profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching client profile'
        });
    }
};

// 2. Update client profile
const updateClientProfile = async (req, res) => {
    try {
        const clientId = req.user.id;
        const updates = req.body;

        // Build dynamic update query for user table
        const userUpdates = {};
        const allowedUserFields = ['first_name', 'last_name', 'email', 'phone', 'image_url', 'facebook_url'];
        
        Object.keys(updates).forEach(key => {
            if (allowedUserFields.includes(key)) {
                userUpdates[key] = updates[key];
            }
        });

        // Start transaction for location updates if needed
        if (updates.city || updates.zip_code) {
            await pool.query('START TRANSACTION');

            // Get current location
            const [user] = await pool.query('SELECT location_id FROM user WHERE id = ?', [clientId]);
            const locationId = user[0].location_id;

            if (locationId) {
                // Update existing location
                await pool.query(
                    'UPDATE location SET zip_code = ?, city_id = (SELECT id FROM city WHERE name = ? LIMIT 1) WHERE id = ?',
                    [updates.zip_code, updates.city, locationId]
                );
            } else {
                // Create new location
                const [city] = await pool.query('SELECT id FROM city WHERE name = ?', [updates.city]);
                let cityId = city.length ? city[0].id : null;
                
                if (!cityId) {
                    const [newCity] = await pool.query('INSERT INTO city (name, zip_code) VALUES (?, ?)', 
                        [updates.city, updates.zip_code]);
                    cityId = newCity.insertId;
                }

                const [location] = await pool.query('INSERT INTO location (zip_code, city_id) VALUES (?, ?)', 
                    [updates.zip_code, cityId]);
                
                await pool.query('UPDATE user SET location_id = ? WHERE id = ?', 
                    [location.insertId, clientId]);
            }

            await pool.query('COMMIT');
        }

        // Update user info if there are fields to update
        if (Object.keys(userUpdates).length > 0) {
            const setClause = Object.keys(userUpdates)
                .map(key => `${key} = ?`)
                .join(', ');
            
            const values = Object.values(userUpdates);
            values.push(clientId);

            console.log('Executing user update:', `UPDATE user SET ${setClause} WHERE id = ?`, values);
            
            await pool.query(
                `UPDATE user SET ${setClause}, updated = NOW() WHERE id = ?`,
                values
            );
        }

        res.status(200).json({
            success: true,
            message: 'Client profile updated successfully'
        });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error updating client profile:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating client profile'
        });
    }
};

// 3. Filter available companies and providers
const filterAvailable = async (req, res) => {
    try {
        const { type, city, minRating, category } = req.query;
        
        if (type === 'companies') {
            // Filter available companies
            const [companies] = await pool.query(`
                SELECT 
                    c.*,
                    COALESCE(AVG(cf.rate), 0) AS avg_rating,
                    loc.zip_code,
                    city.name AS city_name
                FROM company c
                LEFT JOIN company_feedback cf ON c.id = cf.company_id
                LEFT JOIN location loc ON c.location_id = loc.id
                LEFT JOIN city ON loc.city_id = city.id
                WHERE (? IS NULL OR city.name = ?)
                AND (? IS NULL OR (
                    SELECT AVG(rate) FROM company_feedback 
                    WHERE company_id = c.id
                ) >= ?)
                GROUP BY c.id
                ORDER BY avg_rating DESC
            `, [city, city, minRating, minRating]);

            res.status(200).json({
                success: true,
                count: companies.length,
                results: companies
            });
        } else if (type === 'providers') {
            // Filter available providers
            const [providers] = await pool.query(`
                SELECT 
                    sp.*,
                    u.first_name, u.last_name, u.email, u.image_url,
                    COALESCE(AVG(pf.rate), 0) AS avg_rating,
                    pc.name AS category_name,
                    loc.zip_code,
                    city.name AS city_name
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
                ORDER BY avg_rating DESC
            `, [city, city, category, category, minRating, minRating]);

            res.status(200).json({
                success: true,
                count: providers.length,
                results: providers
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid type parameter. Use "companies" or "providers"'
            });
        }
    } catch (error) {
        console.error('Error filtering available:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while filtering'
        });
    }
};

// 4. Search providers and companies
const search = async (req, res) => {
    try {
        const { query, type } = req.query;
        
        if (type === 'companies') {
            const [companies] = await pool.query(`
                SELECT 
                    c.*,
                    COALESCE(AVG(cf.rate), 0) AS avg_rating,
                    loc.zip_code,
                    city.name AS city_name
                FROM company c
                LEFT JOIN company_feedback cf ON c.id = cf.company_id
                LEFT JOIN location loc ON c.location_id = loc.id
                LEFT JOIN city ON loc.city_id = city.id
                WHERE c.name LIKE ? OR city.name LIKE ?
                GROUP BY c.id
            `, [`%${query}%`, `%${query}%`]);

            res.status(200).json({
                success: true,
                count: companies.length,
                results: companies
            });
        } else if (type === 'providers') {
            const [providers] = await pool.query(`
                SELECT 
                    sp.*,
                    u.first_name, u.last_name, u.email, u.image_url,
                    COALESCE(AVG(pf.rate), 0) AS avg_rating,
                    pc.name AS category_name,
                    loc.zip_code,
                    city.name AS city_name
                FROM service_provider sp
                JOIN user u ON sp.user_id = u.id
                LEFT JOIN provider_feedback pf ON sp.id = pf.service_provider_id
                LEFT JOIN position_provider pp ON sp.id = pp.service_provider_id
                LEFT JOIN position_category pc ON pp.position_category_id = pc.id
                LEFT JOIN location loc ON u.location_id = loc.id
                LEFT JOIN city ON loc.city_id = city.id
                WHERE (u.first_name LIKE ? OR u.last_name LIKE ? OR pc.name LIKE ? OR city.name LIKE ?)
                AND sp.is_available = 1
                GROUP BY sp.id
            `, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]);

            res.status(200).json({
                success: true,
                count: providers.length,
                results: providers
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid type parameter. Use "companies" or "providers"'
            });
        }
    } catch (error) {
        console.error('Error searching:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while searching'
        });
    }
};

// 5. Create new task for a provider
const createTask = async (req, res) => {
    try {
        const clientId = req.user.id;
        const { 
            provider_id, 
            description, 
            estimated_distance, 
            estimated_timing, 
            initial_price, 
            max_price,
            notes
        } = req.body;

        // Verify client exists
        const [client] = await pool.query(
            'SELECT id FROM client WHERE user_id = ?',
            [clientId]
        );
        
        if (!client.length) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Verify provider exists and is available
        const [provider] = await pool.query(`
            SELECT sp.* FROM service_provider sp
            WHERE sp.id = ? AND sp.is_available = 1
        `, [provider_id]);
        
        if (!provider.length) {
            return res.status(404).json({
                success: false,
                message: 'Provider not found or not available'
            });
        }

        const [task] = await pool.query(`
            INSERT INTO task (
                service_provider_id, client_id, completed, cancelled,
                estimated_distance, estimated_timing, description,
                Initial_price, Maximum_price, notes, status
            ) VALUES (?, ?, 0, 0, ?, ?, ?, ?, ?, ?, 'pending')
        `, [
            provider_id, 
            client[0].id, 
            estimated_distance, 
            estimated_timing, 
            description,
            initial_price, 
            max_price,
            notes
        ]);

        res.status(201).json({
            success: true,
            taskId: task.insertId,
            message: 'Task created successfully'
        });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating task'
        });
    }
};

// 6. Create new project for a company team
const createProject = async (req, res) => {
    try {
        const clientId = req.user.id;
        const { 
            name, 
            team_id, 
            initial_price, 
            max_price, 
            description, 
            start_date, 
            end_date 
        } = req.body;

        // Verify client exists
        const [client] = await pool.query(
            'SELECT id FROM client WHERE user_id = ?',
            [clientId]
        );
        
        if (!client.length) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        // Verify team exists
        const [team] = await pool.query(
            'SELECT id FROM team WHERE id = ?',
            [team_id]
        );
        
        if (!team.length) {
            return res.status(404).json({
                success: false,
                message: 'Team not found'
            });
        }

        const [project] = await pool.query(`
            INSERT INTO project (
                name, client_id, team_id, Initial_price, max_price, 
                description, start_date, end_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            name, 
            client[0].id, 
            team_id, 
            initial_price, 
            max_price, 
            description, 
            start_date, 
            end_date
        ]);

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

// 7. Process billing for a task or project
const processBilling = async (req, res) => {
    try {
        const clientId = req.user.id;
        const { type, id, card_id } = req.body;

        // Verify client exists and has payment info
        const [client] = await pool.query(
            'SELECT id FROM client WHERE user_id = ?',
            [clientId]
        );
        
        if (!client.length) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        const [card] = await pool.query(
            'SELECT * FROM pay_info WHERE id = ? AND user_id = ?',
            [card_id, clientId]
        );
        
        if (!card.length) {
            return res.status(404).json({
                success: false,
                message: 'Payment method not found'
            });
        }

        if (type === 'task') {
            // Process task payment
            const [task] = await pool.query(`
                SELECT t.*, sp.user_id AS provider_user_id
                FROM task t
                JOIN service_provider sp ON t.service_provider_id = sp.id
                WHERE t.id = ? AND t.client_id = ? AND t.status = 'completed'
            `, [id, client[0].id]);
            
            if (!task.length) {
                return res.status(404).json({
                    success: false,
                    message: 'Task not found or not completed'
                });
            }

            // In a real app, you would integrate with a payment gateway here
            // For demo purposes, we'll just update the task status

            await pool.query(`
                UPDATE task 
                SET status = 'paid', updated = NOW() 
                WHERE id = ?
            `, [id]);

            res.status(200).json({
                success: true,
                message: 'Task payment processed successfully'
            });

        } else if (type === 'project') {
            // Process project payment
            const [project] = await pool.query(`
                SELECT p.*, t.company_id
                FROM project p
                JOIN team t ON p.team_id = t.id
                WHERE p.id = ? AND p.client_id = ?
            `, [id, client[0].id]);
            
            if (!project.length) {
                return res.status(404).json({
                    success: false,
                    message: 'Project not found'
                });
            }

            // In a real app, you would integrate with a payment gateway here
            // For demo purposes, we'll just update the project status

            await pool.query(`
                UPDATE project 
                SET status = 'paid', updated = NOW() 
                WHERE id = ?
            `, [id]);

            res.status(200).json({
                success: true,
                message: 'Project payment processed successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid type parameter. Use "task" or "project"'
            });
        }
    } catch (error) {
        console.error('Error processing billing:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while processing billing'
        });
    }
};

// 8. Show provider info
const getProviderInfo = async (req, res) => {
    try {
        const providerId = req.params.providerId;

        const [provider] = await pool.query(`
            SELECT 
                sp.*,
                u.first_name, u.last_name, u.email, u.phone, u.image_url,
                COALESCE(AVG(pf.rate), 0) AS avg_rating,
                COUNT(pf.id) AS review_count,
                loc.zip_code,
                city.name AS city_name
            FROM service_provider sp
            JOIN user u ON sp.user_id = u.id
            LEFT JOIN provider_feedback pf ON sp.id = pf.service_provider_id
            LEFT JOIN location loc ON u.location_id = loc.id
            LEFT JOIN city ON loc.city_id = city.id
            WHERE sp.id = ?
            GROUP BY sp.id
        `, [providerId]);

        if (!provider.length) {
            return res.status(404).json({
                success: false,
                message: 'Provider not found'
            });
        }

        // Get provider's positions/categories
        const [positions] = await pool.query(`
            SELECT pc.* 
            FROM position_provider pp
            JOIN position_category pc ON pp.position_category_id = pc.id
            WHERE pp.service_provider_id = ?
        `, [providerId]);

        // Get provider's reviews
        const [reviews] = await pool.query(`
            SELECT 
                pf.*,
                CONCAT(u.first_name, ' ', u.last_name) AS client_name,
                u.image_url AS client_image
            FROM provider_feedback pf
            JOIN client c ON pf.client_id = c.id
            JOIN user u ON c.user_id = u.id
            WHERE pf.service_provider_id = ?
        `, [providerId]);

        res.status(200).json({
            success: true,
            provider: {
                ...provider[0],
                positions,
                reviews
            }
        });
    } catch (error) {
        console.error('Error fetching provider info:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching provider info'
        });
    }
};

// 9. Show company info
const getCompanyInfo = async (req, res) => {
    try {
        const companyId = req.params.companyId;

        const [company] = await pool.query(`
            SELECT 
                c.*,
                COALESCE(AVG(cf.rate), 0) AS avg_rating,
                COUNT(cf.id) AS review_count,
                loc.zip_code,
                city.name AS city_name,
                u.first_name AS owner_first_name,
                u.last_name AS owner_last_name
            FROM company c
            LEFT JOIN company_feedback cf ON c.id = cf.company_id
            LEFT JOIN location loc ON c.location_id = loc.id
            LEFT JOIN city ON loc.city_id = city.id
            LEFT JOIN user u ON c.user_id = u.id
            WHERE c.id = ?
            GROUP BY c.id
        `, [companyId]);

        if (!company.length) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        // Get company's positions/categories
        const [positions] = await pool.query(`
            SELECT DISTINCT pc.* 
            FROM position_company pc
            WHERE pc.company_id = ?
        `, [companyId]);

        // Get company's reviews
        const [reviews] = await pool.query(`
            SELECT 
                cf.*,
                CONCAT(u.first_name, ' ', u.last_name) AS client_name,
                u.image_url AS client_image
            FROM company_feedback cf
            JOIN client c ON cf.client_id = c.id
            JOIN user u ON c.user_id = u.id
            WHERE cf.company_id = ?
        `, [companyId]);

        res.status(200).json({
            success: true,
            company: {
                ...company[0],
                positions,
                reviews
            }
        });
    } catch (error) {
        console.error('Error fetching company info:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching company info'
        });
    }
};

// 10. Show company teams
const getCompanyTeams = async (req, res) => {
    try {
        const companyId = req.params.companyId;

        const [teams] = await pool.query(`
            SELECT 
                t.*,
                COUNT(DISTINCT pt.service_provider_id) AS member_count
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
        console.error('Error fetching company teams:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching company teams'
        });
    }
};

// 11. Show client tasks
const getClientTasks = async (req, res) => {
    try {
        const clientId = req.user.id;

        const [client] = await pool.query(
            'SELECT id FROM client WHERE user_id = ?',
            [clientId]
        );
        
        if (!client.length) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        const [tasks] = await pool.query(`
            SELECT 
                t.*,
                CONCAT(u.first_name, ' ', u.last_name) AS provider_name,
                u.image_url AS provider_image,
                pc.name AS provider_category
            FROM task t
            JOIN service_provider sp ON t.service_provider_id = sp.id
            JOIN user u ON sp.user_id = u.id
            LEFT JOIN position_provider pp ON sp.id = pp.service_provider_id
            LEFT JOIN position_category pc ON pp.position_category_id = pc.id
            WHERE t.client_id = ?
            ORDER BY t.created DESC
        `, [client[0].id]);

        res.status(200).json({
            success: true,
            count: tasks.length,
            tasks
        });
    } catch (error) {
        console.error('Error fetching client tasks:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching client tasks'
        });
    }
};

// 12. Update task (client side)
const updateClientTask = async (req, res) => {
    try {
        const clientId = req.user.id;
        const taskId = req.params.taskId;
        const updates = req.body;

        // Verify client owns the task
        const [task] = await pool.query(`
            SELECT t.* FROM task t
            JOIN client c ON t.client_id = c.id
            WHERE t.id = ? AND c.user_id = ?
        `, [taskId, clientId]);
        
        if (!task.length) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or not authorized'
            });
        }

        // Only allow certain fields to be updated by client
        const allowedUpdates = ['description', 'notes', 'status'];
        const validUpdates = {};
        
        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key)) {
                validUpdates[key] = updates[key];
            }
        });

        if (Object.keys(validUpdates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update'
            });
        }

        // Build dynamic update query
        const setClause = Object.keys(validUpdates)
            .map(key => `${key} = ?`)
            .join(', ');
        
        const values = Object.values(validUpdates);
        values.push(taskId);

        await pool.query(
            `UPDATE task SET ${setClause}, updated = NOW() WHERE id = ?`,
            values
        );

        res.status(200).json({
            success: true,
            message: 'Task updated successfully'
        });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating task'
        });
    }
};

// 13. Show client projects
const getClientProjects = async (req, res) => {
    try {
        const clientId = req.user.id;

        const [client] = await pool.query(
            'SELECT id FROM client WHERE user_id = ?',
            [clientId]
        );
        
        if (!client.length) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        const [projects] = await pool.query(`
            SELECT 
                p.*,
                t.name AS team_name,
                c.name AS company_name,
                c.image_url AS company_logo
            FROM project p
            JOIN team t ON p.team_id = t.id
            JOIN company c ON t.company_id = c.id
            WHERE p.client_id = ?
            ORDER BY p.created DESC
        `, [client[0].id]);

        res.status(200).json({
            success: true,
            count: projects.length,
            projects
        });
    } catch (error) {
        console.error('Error fetching client projects:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching client projects'
        });
    }
};

// 14. Show project info
const getClientProject = async (req, res) => {
    try {
        const clientId = req.user.id;
        const projectId = req.params.projectId;

        const [client] = await pool.query(
            'SELECT id FROM client WHERE user_id = ?',
            [clientId]
        );
        
        if (!client.length) {
            return res.status(404).json({
                success: false,
                message: 'Client not found'
            });
        }

        const [project] = await pool.query(`
            SELECT 
                p.*,
                t.name AS team_name,
                c.name AS company_name,
                c.image_url AS company_logo
            FROM project p
            JOIN team t ON p.team_id = t.id
            JOIN company c ON t.company_id = c.id
            WHERE p.id = ? AND p.client_id = ?
        `, [projectId, client[0].id]);

        if (!project.length) {
            return res.status(404).json({
                success: false,
                message: 'Project not found or not authorized'
            });
        }

        // Get project milestones
        const [milestones] = await pool.query(`
            SELECT * FROM project_milestone 
            WHERE project_id = ?
            ORDER BY due_date
        `, [projectId]);

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
        `, [project[0].team_id]);

        res.status(200).json({
            success: true,
            project: {
                ...project[0],
                milestones,
                members
            }
        });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching project'
        });
    }
};

// 15. Update project (client side)
const updateClientProject = async (req, res) => {
    try {
        const clientId = req.user.id;
        const projectId = req.params.projectId;
        const updates = req.body;

        // Verify client owns the project
        const [project] = await pool.query(`
            SELECT p.* FROM project p
            JOIN client c ON p.client_id = c.id
            WHERE p.id = ? AND c.user_id = ?
        `, [projectId, clientId]);
        
        if (!project.length) {
            return res.status(404).json({
                success: false,
                message: 'Project not found or not authorized'
            });
        }

        // Only allow certain fields to be updated by client
        const allowedUpdates = ['description', 'notes', 'status'];
        const validUpdates = {};
        
        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key)) {
                validUpdates[key] = updates[key];
            }
        });

        if (Object.keys(validUpdates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update'
            });
        }

        // Build dynamic update query
        const setClause = Object.keys(validUpdates)
            .map(key => `${key} = ?`)
            .join(', ');
        
        const values = Object.values(validUpdates);
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

module.exports = {
    getClientProfile,
    updateClientProfile,
    filterAvailable,
    search,
    createTask,
    createProject,
    processBilling,
    getProviderInfo,
    getCompanyInfo,
    getCompanyTeams,
    getClientTasks,
    updateClientTask,
    getClientProjects,
    getClientProject,
    updateClientProject
};