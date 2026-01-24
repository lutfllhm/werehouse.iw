/**
 * Script untuk mengecek user admin di database
 * Jalankan: node backend/scripts/check-admin.js
 */

const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function checkAdmin() {
  let connection;
  
  try {
    const config = {
      host: process.env.MYSQLHOST || process.env.DB_HOST,
      port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
      user: process.env.MYSQLUSER || process.env.DB_USER,
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
      database: process.env.MYSQLDATABASE || process.env.DB_NAME
    };

    console.log('📊 Database Config:');
    console.log('  Host:', config.host);
    console.log('  Port:', config.port);
    console.log('  User:', config.user);
    console.log('  Database:', config.database);
    console.log('  Password:', config.password ? '***SET***' : 'NOT SET');
    console.log('');

    console.log('Connecting to database...');
    connection = await mysql.createConnection(config);
    console.log('✅ Connected!\n');

    // Cek user admin
    const [users] = await connection.execute(
      'SELECT id, username, password, full_name, email, role, created_at FROM users WHERE username = ?',
      ['admin']
    );

    if (users.length === 0) {
      console.log('❌ User admin tidak ditemukan!');
      console.log('\nJalankan script ini untuk membuat user admin:');
      console.log('  node backend/scripts/fix-admin-password.js');
      process.exit(1);
    }

    const user = users[0];
    console.log('✅ User admin ditemukan!');
    console.log('\n📊 Data user:');
    console.log('  ID:', user.id);
    console.log('  Username:', user.username);
    console.log('  Full Name:', user.full_name);
    console.log('  Email:', user.email);
    console.log('  Role:', user.role);
    console.log('  Created:', user.created_at);
    console.log('  Password Hash:', user.password);

    // Test password
    console.log('\n🔐 Testing password "iware123"...');
    const testPassword = 'iware123';
    const isValid = await bcrypt.compare(testPassword, user.password);
    
    if (isValid) {
      console.log('✅ Password VALID! Login seharusnya berhasil.');
    } else {
      console.log('❌ Password TIDAK VALID!');
      console.log('\nPassword hash di database tidak cocok dengan "iware123"');
      console.log('Jalankan script ini untuk memperbaiki:');
      console.log('  node backend/scripts/fix-admin-password.js');
    }

    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkAdmin();
