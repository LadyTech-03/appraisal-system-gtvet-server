const { testConnection } = require('../src/database/connection');
const { runMigrations } = require('../src/database/migrate');
const { runSeeders } = require('../src/database/seed');

// Test setup
beforeAll(async () => {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    // Run migrations
    await runMigrations();

    // Run seeders
    await runSeeders();

    console.log('Test setup completed successfully');
  } catch (error) {
    console.error('Test setup failed:', error);
    throw error;
  }
});

// Test teardown
afterAll(async () => {
  try {
    // Clean up test data if needed
    console.log('Test teardown completed');
  } catch (error) {
    console.error('Test teardown failed:', error);
  }
});
