const bcrypt = require('bcryptjs');

// Test password hashing
const plainPassword = 'mudamba';
bcrypt.hash(plainPassword, 10, (err, hashedPassword) => {
    if (err) throw err;
    console.log('Hashed Password:', hashedPassword);

    // Test password comparison
    bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
        if (err) throw err;
        console.log('Password comparison result:', result);  // Should output true
    });
});
