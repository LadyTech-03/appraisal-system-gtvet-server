const { pool } = require('./src/config/database');

const debugUsers = async () => {
    try {
        const emails = ['appraiser-1@tvet.com', 'ddgms@tvet.com'];

        for (const email of emails) {
            console.log(`\nQuerying user: '${email}'`);
            const result = await pool.query('SELECT id, email, password_hash, is_active FROM users WHERE email = $1', [email]);
            if (result.rows.length === 0) {
                console.log('User NOT found.');
            } else {
                console.log('User found:', result.rows[0]);
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        pool.end();
    }
};

debugUsers();
