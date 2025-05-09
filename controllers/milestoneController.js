const pool = require('../config/db');

// Create new milestone
const createMilestone = async (req, res) => {
    try {
        const { project_id, name, description, due_date } = req.body;

        const [milestone] = await pool.query(
            `INSERT INTO project_milestone 
             (project_id, name, description, due_date) 
             VALUES (?, ?, ?, ?)`,
            [project_id, name, description, due_date]
        );

        res.status(201).json({
            success: true,
            milestoneId: milestone.insertId,
            message: 'Milestone created successfully'
        });
    } catch (error) {
        console.error('Error creating milestone:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating milestone'
        });
    }
};

// Get all milestones for a project
const getProjectMilestones = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        const [milestones] = await pool.query(
            `SELECT * FROM project_milestone 
             WHERE project_id = ?
             ORDER BY due_date`,
            [projectId]
        );

        res.status(200).json({
            success: true,
            count: milestones.length,
            milestones
        });
    } catch (error) {
        console.error('Error fetching milestones:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching milestones'
        });
    }
};

// Update milestone
const updateMilestone = async (req, res) => {
    try {
        const milestoneId = req.params.milestoneId;
        const updates = req.body;
        
        // Build dynamic update query
        const setClause = Object.keys(updates)
            .map(key => `${key} = ?`)
            .join(', ');
        
        const values = Object.values(updates);
        values.push(milestoneId);

        // Special handling for completion
        if (updates.completed !== undefined) {
            updates.completion_date = updates.completed ? new Date().toISOString().split('T')[0] : null;
        }

        await pool.query(
            `UPDATE project_milestone 
             SET ${setClause}, updated = NOW() 
             WHERE id = ?`,
            values
        );

        res.status(200).json({
            success: true,
            message: 'Milestone updated successfully'
        });
    } catch (error) {
        console.error('Error updating milestone:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating milestone'
        });
    }
};

// Delete milestone
const deleteMilestone = async (req, res) => {
    try {
        const milestoneId = req.params.milestoneId;
        
        await pool.query(
            'DELETE FROM project_milestone WHERE id = ?',
            [milestoneId]
        );

        res.status(200).json({
            success: true,
            message: 'Milestone deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting milestone:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting milestone'
        });
    }
};

module.exports = {
    createMilestone,
    getProjectMilestones,
    updateMilestone,
    deleteMilestone
};