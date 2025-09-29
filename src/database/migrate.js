const fs = require('fs');
const path = require('path');
const { query } = require('../config/database');

// Create migrations table to track applied migrations
const createMigrationsTable = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Migrations table created/verified');
  } catch (error) {
    console.error('Error creating migrations table:', error);
    throw error;
  }
};

// Get list of applied migrations
const getAppliedMigrations = async () => {
  try {
    const result = await query('SELECT filename FROM migrations ORDER BY id');
    return result.rows.map(row => row.filename);
  } catch (error) {
    console.error('Error getting applied migrations:', error);
    return [];
  }
};

// Mark migration as applied
const markMigrationApplied = async (filename) => {
  try {
    await query('INSERT INTO migrations (filename) VALUES ($1)', [filename]);
    console.log(`Migration ${filename} marked as applied`);
  } catch (error) {
    console.error(`Error marking migration ${filename} as applied:`, error);
    throw error;
  }
};

// Run a single migration
const runMigration = async (filename) => {
  try {
    const migrationPath = path.join(__dirname, 'migrations', filename);
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log(`Running migration: ${filename}`);
    await query(migrationSQL);
    await markMigrationApplied(filename);
    console.log(`Migration ${filename} completed successfully`);
  } catch (error) {
    console.error(`Error running migration ${filename}:`, error);
    throw error;
  }
};

// Run all pending migrations
const runMigrations = async () => {
  try {
    console.log('Starting database migrations...');
    
    // Create migrations table
    await createMigrationsTable();
    
    // Get list of migration files
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    // Get applied migrations
    const appliedMigrations = await getAppliedMigrations();
    
    // Run pending migrations
    const pendingMigrations = migrationFiles.filter(file => !appliedMigrations.includes(file));
    
    if (pendingMigrations.length === 0) {
      console.log('No pending migrations found');
      return;
    }
    
    console.log(`Found ${pendingMigrations.length} pending migrations`);
    
    for (const migrationFile of pendingMigrations) {
      await runMigration(migrationFile);
    }
    
    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Main execution
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migration process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration process failed:', error);
      process.exit(1);
    });
}

module.exports = {
  runMigrations,
  runMigration,
  getAppliedMigrations
};
