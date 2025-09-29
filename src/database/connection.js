const { query } = require('../config/database');

// Test database connection
const testConnection = async () => {
  try {
    const result = await query('SELECT NOW()');
    console.log('Database connection successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Check if table exists
const tableExists = async (tableName) => {
  try {
    const result = await query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      )`,
      [tableName]
    );
    return result.rows[0].exists;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
};

// Get table info
const getTableInfo = async (tableName) => {
  try {
    const result = await query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position
    `, [tableName]);
    return result.rows;
  } catch (error) {
    console.error(`Error getting table info for ${tableName}:`, error);
    return [];
  }
};

// Get all tables
const getAllTables = async () => {
  try {
    const result = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    return result.rows.map(row => row.table_name);
  } catch (error) {
    console.error('Error getting all tables:', error);
    return [];
  }
};

module.exports = {
  testConnection,
  tableExists,
  getTableInfo,
  getAllTables
};
