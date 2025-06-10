const pool = require('../config/db');


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
  }
module.exports = {getAllUsers , verifyUser , banUser}