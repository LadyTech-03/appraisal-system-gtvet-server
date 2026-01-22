const { pool } = require('./src/config/database');

const debugUser = async () => {
    try {
        const email = 'appraiser-1@tvet.com';
        console.log(`Querying user with email: '${email}'`);

        const result = await pool.query('SELECT id, email, password_hash, is_active FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            console.log('User NOT found.');

            // Try fuzzy search
            console.log('Attempting fuzzy search...');
            const fuzzy = await pool.query("SELECT id, email, password_hash FROM users WHERE email LIKE '%appraiser-1%'");
            if (fuzzy.rows.length > 0) {
                console.log('Found similar users:', fuzzy.rows);
            } else {
                console.log('No similar users found.');
            }

        } else {
            console.log('User found:', result.rows[0]);
        }
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
};

debugUser();
