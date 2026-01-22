const { pool } = require('./src/config/database');
const bcrypt = require('bcryptjs');

const resetPassword = async () => {
    try {
        const email = 'appraiser-1@tvet.com';
        const newPassword = 'admin123';

        console.log(`Generating new hash for '${newPassword}'...`);
        const newHash = await bcrypt.hash(newPassword, 10);
        console.log('New Hash:', newHash);

        console.log(`Updating password for '${email}'...`);
        const result = await pool.query('UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING email', [newHash, email]);

        if (result.rows.length > 0) {
            console.log(`Successfully updated password for ${result.rows[0].email}`);
        } else {
            console.log('User not found!');
        }

    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
};

resetPassword();
