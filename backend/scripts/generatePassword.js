const bcrypt = require('bcryptjs');

// Script untuk generate password hash
const password = process.argv[2] || 'admin123';

const hash = bcrypt.hashSync(password, 10);

console.log('\n=================================');
console.log('Password Hash Generator');
console.log('=================================');
console.log('Password:', password);
console.log('Hash:', hash);
console.log('=================================\n');
console.log('Copy hash di atas dan gunakan untuk update password di database');
console.log('\nContoh SQL:');
console.log(`UPDATE users SET password = '${hash}' WHERE username = 'admin';`);
console.log('\n');
