// db.js
const mysql = require('mysql2/promise');

// Create a pool of connections for reuse
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'XmenEmailGen',
  waitForConnections: true,
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0 // Unlimited wait queue
});

async function executeQuery(query, params = []) {
  try {
    const [rows, fields] = await pool.execute(query, params);
    return { success: true, data: rows };
  } catch (err) {
    console.error('Database query error:', err);
    return { success: false, error: err.message || 'An error occurred while querying the database' };
  }
}

async function closeConnection() {
  try {
    await pool.end();
  } catch (err) {
    console.error('Error closing database connection:', err);
  }
}

module.exports = {
  executeQuery,
  closeConnection,
};
