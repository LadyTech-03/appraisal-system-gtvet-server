const bcrypt = require('bcryptjs');

const checkHash = async () => {
    const existingHash = '$2a$10$JFysvhvaR0cWZGrLTyvUGOzZp0VjdNVYIozYAo1yT7ifvNe3eQC0q';
    const password = 'admin123';

    console.log(`Checking password '${password}' against existing hash...`);
    const match = await bcrypt.compare(password, existingHash);
    console.log(`Match result: ${match}`);

    if (match) {
        console.log('The existing hash is correct for "admin123".');
    } else {
        console.log('The existing hash does NOT match "admin123". Generating new hash...');
        const newHash = await bcrypt.hash(password, 10);
        console.log(`New Hash for '${password}': ${newHash}`);
    }
};

checkHash();
