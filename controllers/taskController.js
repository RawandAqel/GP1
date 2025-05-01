const pool = require('../config/db');

// Get all active tasks for a service provider
const getActiveTasks = async (req, res) => {

    const [provider] = await pool.query(
        'SELECT id FROM service_provider WHERE user_id = ?',
        [req.user.id]
    );

    if (!provider.length) {
        return res.status(403).json({
            success: false,
            message: 'User is not a registered service provider'
        });
    }
    const providerId = provider[0].id;
    try {
        // Query to get active tasks (not completed, not cancelled)
        const [tasks] = await pool.query(`
            SELECT t.*, 
                   CONCAT(u.first_name, ' ', u.last_name) AS client_name,
                   u.email AS client_email,
                   u.image_url AS client_image
            FROM task t
            JOIN user u ON t.client_id = u.id
            WHERE t.service_provider_id = ? 
            AND t.completed = 0
            AND t.cancelled = 0
            ORDER BY t.created DESC
        `, [providerId]);

        res.status(200).json({
            success: true,
            count: tasks.length,
            tasks
        });
    } catch (error) {
        console.error('Error fetching active tasks:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching tasks'
        });
    }
};

// Get complete task details
const getTaskDetails = async (req, res) => {
    try {
        const taskId = req.params.id;
        
        // Safely get provider ID with fallback
        const providerId = req.provider?.id;
        
        if (!providerId) {
            return res.status(403).json({
                success: false,
                message: 'Provider information not found'
            });
        }

        const [task] = await pool.query(`
            SELECT t.*, 
                   CONCAT(u.first_name, ' ', u.last_name) AS client_name,
                   u.email AS client_email, u.phone AS client_phone,
                   ct.name AS client_location
            FROM task t
            JOIN user u ON t.client_id = u.id
            JOIN location l ON u.location_id = l.id
            JOIN city ct ON l.city_id = ct.id
            WHERE t.id = ? AND t.service_provider_id = ?
        `, [taskId, providerId]);

        if (!task.length) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or not assigned to you'
            });
        }

        res.status(200).json({
            success: true,
            task: task[0]
        });
    } catch (error) {
        console.error('Error fetching task details:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching task details'
        });
    }
};

// Approve a task
const approveTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const providerId = req.provider.id;

        // Verify task belongs to provider
        const [task] = await pool.query(
            'SELECT * FROM task WHERE id = ? AND service_provider_id = ?',
            [taskId, providerId]
        );

        if (!task.length) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or not assigned to you'
            });
        }

        // Update task status
        await pool.query(
            'UPDATE task SET status = "approved", updated = NOW() WHERE id = ?',
            [taskId]
        );

        res.status(200).json({
            success: true,
            message: 'Task approved successfully'
        });
    } catch (error) {
        console.error('Error approving task:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while approving task'
        });
    }
};

// Reject a task
const rejectTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const providerId = req.provider.id;
        const { reason } = req.body;

        // Verify task belongs to provider
        const [task] = await pool.query(
            'SELECT * FROM task WHERE id = ? AND service_provider_id = ?',
            [taskId, providerId]
        );

        if (!task.length) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or not assigned to you'
            });
        }

        // Update task status
        await pool.query(
            'UPDATE task SET status = "rejected", rejection_reason = ?, updated = NOW() WHERE id = ?',
            [reason, taskId]
        );

        res.status(200).json({
            success: true,
            message: 'Task rejected successfully'
        });
    } catch (error) {
        console.error('Error rejecting task:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while rejecting task'
        });
    }
};

// Update task details
const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const providerId = req.provider.id;
        const { estimated_time, notes, initial_price } = req.body;

        // Verify task belongs to provider
        const [task] = await pool.query(
            'SELECT * FROM task WHERE id = ? AND service_provider_id = ?',
            [taskId, providerId]
        );

        if (!task.length) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or not assigned to you'
            });
        }

        // Update task
        await pool.query(
            `UPDATE task 
             SET estimated_timing = ?, notes = ?, initial_price = ?, updated = NOW() 
             WHERE id = ?`,
            [estimated_time, notes, initial_price, taskId]
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

// Mark task as complete
const completeTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const providerId = req.provider.id;
        const { actual_time, actual_price } = req.body;

        // Verify task belongs to provider
        const [task] = await pool.query(
            'SELECT * FROM task WHERE id = ? AND service_provider_id = ?',
            [taskId, providerId]
        );

        if (!task.length) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or not assigned to you'
            });
        }

        // Update task
        await pool.query(
            `UPDATE task 
             SET completed = 1, actual_time = ?, actual_price = ?, 
                 status = "completed", updated = NOW() 
             WHERE id = ?`,
            [actual_time, actual_price, taskId]
        );

        res.status(200).json({
            success: true,
            message: 'Task marked as completed successfully'
        });
    } catch (error) {
        console.error('Error completing task:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while completing task'
        });
    }
};

// Get task history
const getTaskHistory = async (req, res) => {
    try {
        const providerId = req.provider.id;
        const { status, limit = 10, page = 1 } = req.query;
        const offset = (page - 1) * limit;

        let query = `
            SELECT t.*, 
                   CONCAT(u.first_name, ' ', u.last_name) AS client_name,
                   u.image_url AS client_image
            FROM task t
            JOIN user u ON t.client_id = u.id
            WHERE t.service_provider_id = ?
        `;
        const params = [providerId];

        if (status) {
            query += ' AND t.status = ?';
            params.push(status);
        }

        query += ' ORDER BY t.updated DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [tasks] = await pool.query(query, params);

        // Get total count for pagination
        const [count] = await pool.query(
            'SELECT COUNT(*) as total FROM task WHERE service_provider_id = ?',
            [providerId]
        );

        res.status(200).json({
            success: true,
            count: tasks.length,
            total: count[0].total,
            page: parseInt(page),
            tasks
        });
    } catch (error) {
        console.error('Error fetching task history:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching task history'
        });
    }
};

module.exports = {
    getActiveTasks,
    getTaskDetails,
    approveTask,
    rejectTask,
    updateTask,
    completeTask,
    getTaskHistory
};
