const pool = require('../config/db');
const saltRounds = 10;

  // Get all users (clients, providers, companies)
  const getAllUsers = async (req, res) => {
    try {
      const [users] = await pool.query(`
SELECT 
  u.id, 
  u.first_name, 
  u.last_name, 
  u.email, 
  u.created,
  CASE 
    WHEN c.id IS NOT NULL AND sp.id IS NOT NULL AND co.id IS NOT NULL THEN 'client+provider+owner'
    WHEN c.id IS NOT NULL AND sp.id IS NOT NULL THEN 'client+provider'
    WHEN c.id IS NOT NULL AND co.id IS NOT NULL THEN 'client+owner'
    WHEN sp.id IS NOT NULL AND co.id IS NOT NULL THEN 'provider+owner'
    WHEN c.id IS NOT NULL THEN 'client'
    WHEN sp.id IS NOT NULL THEN 'provider'
    WHEN co.id IS NOT NULL THEN 'company owner'
    ELSE 'unknown'
  END AS user_type,
  u.is_verified, 
  u.is_banned
FROM user u
LEFT JOIN client c ON u.id = c.user_id
LEFT JOIN service_provider sp ON u.id = sp.user_id
LEFT JOIN company co ON u.id = co.user_id
GROUP BY u.id  -- This eliminates duplicates
ORDER BY u.created DESC
      `);
      res.json({ success: true, users });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' + error});
    }
  };

  // Verify a user
  const verifyUser =  async (req, res) => {
    try {
      await pool.query('UPDATE user SET is_verified = 1 WHERE id = ?', [req.params.id]);
      res.json({ success: true, message: 'User verified' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Verification failed' });
    }
  };

  // Ban a user
  const banUser = async (req, res) => {
    try {
      await pool.query('UPDATE user SET is_banned = 1 WHERE id = ?', [req.params.id]);
      res.json({ success: true, message: 'User banned' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Ban failed' });
    }
  };

// Unban User API
const unbanUser = async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE user SET is_banned = 0 WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, message: 'User unbanned successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// Unverify User API
const unverifyUser = async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE user SET is_verified = 0 WHERE id = ?',
      [req.params.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, message: 'User unverified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// Add New User API
const addUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, user_type } = req.body;
    
    // Validate input
    if (!first_name || !last_name || !email || !password || !user_type) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
        
    // Start transaction
    await pool.query('START TRANSACTION');
    
    // Insert into user table
    const [userResult] = await pool.query(
      'INSERT INTO user (first_name, last_name, email, password, is_verified, is_banned) VALUES (?, ?, ?, ?, 0, 0)',
      [first_name, last_name, email, password]
    );
    
    const userId = userResult.insertId;
    
    // Insert into specific role table based on user_type
    switch (user_type.toLowerCase()) {
      case 'provider':
        await pool.query('INSERT INTO service_provider (user_id) VALUES (?)', [userId]);
        break;
      case 'company owner':
        await pool.query('INSERT INTO company (user_id, name) VALUES (?, ?)', [userId, `${first_name} ${last_name}'s Company`]);
        break;
      case 'client':
        await pool.query('INSERT INTO client (user_id) VALUES (?)', [userId]);
        break;
      default:
        await pool.query('ROLLBACK');
        return res.status(400).json({ success: false, message: 'Invalid user type' });
    }
    
    await pool.query('COMMIT');
    res.status(201).json({ success: true, message: 'User created successfully', userId });
  } catch (error) {
    await pool.query('ROLLBACK');
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }
    
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// Get All Tasks API
const getAllTasks = async (req, res) => {
  try {
    const [tasks] = await pool.query(`
      SELECT 
        t.id, 
        t.description,
        t.status,
        t.Initial_price,
        t.Maximum_price,
        t.actual_price,
        t.created,
        t.updated,
        CONCAT(u1.first_name, ' ', u1.last_name) AS client_name,
        CONCAT(u2.first_name, ' ', u2.last_name) AS provider_name,
        c1.id AS client_id,
        sp.id AS provider_id
      FROM task t
      LEFT JOIN client c ON t.client_id = c.id
      LEFT JOIN user u1 ON c.user_id = u1.id
      LEFT JOIN service_provider sp ON t.service_provider_id = sp.id
      LEFT JOIN user u2 ON sp.user_id = u2.id
      LEFT JOIN client c1 ON t.client_id = c1.id
      ORDER BY t.created DESC
    `);
    
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};

// Get All Projects API
const getAllProjects = async (req, res) => {
  try {
    const [projects] = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.Initial_price,
        p.max_price,
        p.actual_price,
        p.start_date,
        p.end_date,
        p.created,
        p.updated,
        CONCAT(u.first_name, ' ', u.last_name) AS client_name,
        t.name AS team_name,
        c.name AS company_name,
        COUNT(pm.id) AS milestone_count
      FROM project p
      LEFT JOIN client cl ON p.client_id = cl.id
      LEFT JOIN user u ON cl.user_id = u.id
      LEFT JOIN team t ON p.team_id = t.id
      LEFT JOIN company c ON t.company_id = c.id
      LEFT JOIN project_milestone pm ON p.id = pm.project_id
      GROUP BY p.id
      ORDER BY p.created DESC
    `);
    
    res.json({ success: true, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error: ' + error.message });
  }
};


module.exports = 
{
getAllUsers , 
verifyUser ,
banUser,
unbanUser,
unverifyUser,
addUser,
getAllTasks,
getAllProjects
}