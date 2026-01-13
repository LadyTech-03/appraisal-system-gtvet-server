const { query } = require('../config/database');

// Drop all tables in reverse order of dependencies
const dropTables = async () => {
  try {
    console.log('Dropping all tables...');
    
    const tables = [
      'access_requests',
      'annual_appraisal',
      'signatures',
      'competencies',
      'personal_info',
      'performance_planning',
      'mid_year_review',
      'end_year_review',
      'key_result_areas',
      'training_records',
      'appraisals',
      'users',
      'migrations',
      'seeders',
      'final_sections',
      'training_records',
      'appraisal_periods'
    ];
    
    for (const table of tables) {
      try {
        await query(`DROP TABLE IF EXISTS ${table} CASCADE`);
        console.log(`Dropped table: ${table}`);
      } catch (error) {
        console.log(`Table ${table} may not exist or already dropped`);
      }
    }
    
    console.log('All tables dropped successfully');
  } catch (error) {
    console.error('Error dropping tables:', error);
    throw error;
  }
};

// Reset database (drop all tables and recreate)
const resetDatabase = async () => {
  try {
    console.log('Resetting database...');
    
    // Drop all tables
    await dropTables();
    
    console.log('Database reset completed successfully');
    console.log('Run "npm run migrate" to recreate tables');
    console.log('Run "npm run seed" to populate with initial data');
  } catch (error) {
    console.error('Database reset failed:', error);
    process.exit(1);
  }
};

// Main execution
if (require.main === module) {
  resetDatabase()
    .then(() => {
      console.log('Reset process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Reset process failed:', error);
      process.exit(1);
    });
}

module.exports = {
  resetDatabase,
  dropTables
};
