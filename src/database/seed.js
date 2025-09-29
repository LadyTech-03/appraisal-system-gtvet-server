const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { query } = require('../config/database');

// Create seeders table to track applied seeders
const createSeedersTable = async () => {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS seeders (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Seeders table created/verified');
  } catch (error) {
    console.error('Error creating seeders table:', error);
    throw error;
  }
};

// Get list of applied seeders
const getAppliedSeeders = async () => {
  try {
    const result = await query('SELECT filename FROM seeders ORDER BY id');
    return result.rows.map(row => row.filename);
  } catch (error) {
    console.error('Error getting applied seeders:', error);
    return [];
  }
};

// Mark seeder as applied
const markSeederApplied = async (filename) => {
  try {
    await query('INSERT INTO seeders (filename) VALUES ($1)', [filename]);
    console.log(`Seeder ${filename} marked as applied`);
  } catch (error) {
    console.error(`Error marking seeder ${filename} as applied:`, error);
    throw error;
  }
};

// Run a single seeder
const runSeeder = async (filename) => {
  try {
    const seederPath = path.join(__dirname, 'seeders', filename);
    const seederSQL = fs.readFileSync(seederPath, 'utf8');
    
    console.log(`Running seeder: ${filename}`);
    
    // Special handling for admin user seeder
    if (filename === '002_seed_admin_user.sql') {
      await seedAdminUser();
    } else {
      await query(seederSQL);
    }
    
    await markSeederApplied(filename);
    console.log(`Seeder ${filename} completed successfully`);
  } catch (error) {
    console.error(`Error running seeder ${filename}:`, error);
    throw error;
  }
};

// Seed admin user with environment variable password
const seedAdminUser = async () => {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@tvet.gov.gh';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  
  await query(`
    INSERT INTO users (
      employee_id,
      email,
      password_hash,
      name,
      role,
      division,
      position,
      is_active
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    ON CONFLICT (employee_id) DO NOTHING
  `, [
    'ADMIN001',
    adminEmail,
    hashedPassword,
    'Cynthia Baidoo',
    'System Administrator',
    'Administration',
    'System Administrator',
    true
  ]);
  
  console.log(`Admin user created with password from environment variable`);
};

// Run all pending seeders
const runSeeders = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Create seeders table
    await createSeedersTable();
    
    // Get list of seeder files
    const seedersDir = path.join(__dirname, 'seeders');
    const seederFiles = fs.readdirSync(seedersDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    // Get applied seeders
    const appliedSeeders = await getAppliedSeeders();
    
    // Run pending seeders
    const pendingSeeders = seederFiles.filter(file => !appliedSeeders.includes(file));
    
    if (pendingSeeders.length === 0) {
      console.log('No pending seeders found');
      return;
    }
    
    console.log(`Found ${pendingSeeders.length} pending seeders`);
    
    for (const seederFile of pendingSeeders) {
      await runSeeder(seederFile);
    }
    
    console.log('All seeders completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

// Main execution
if (require.main === module) {
  runSeeders()
    .then(() => {
      console.log('Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding process failed:', error);
      process.exit(1);
    });
}

module.exports = {
  runSeeders,
  runSeeder,
  getAppliedSeeders
};
