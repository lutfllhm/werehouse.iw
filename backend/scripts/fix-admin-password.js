/**
 * Script untuk memperbaiki password admin
 * Jalankan: node backend/scripts/fix-admin-password.js
 */

const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function fixAdminPassword() {
  let connection;
  
  try {
    const config = {
      host: process.env.MYSQLHOST || process.env.DB_HOST,
      port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
      user: process.env.MYSQLUSER || process.env.DB_USER,
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
      database: process.env.MYSQLDATABASE || process.env.DB_NAME
    };

    console.log('Connecting to database...');
    console.log('Host:', config.host);
    console.log('Database:', config.database);
    
    connection = await mysql.createConnection(config);
    console.log('✅ Connected!\n');

    // Password hash untuk 'iware123'
    const passwordHash = '$2a$10$D/s19.cu7IjgZrv6gaKqHOR7nXo773uC1zSpzusGFonMbD1ToXfYm';

    // Cek apakah user admin sudah ada
    const [users] = await connection.execute(
      'SELECT id, username, email FROM users WHERE username = ?',
      ['admin']
    );

    if (users.length > 0) {
      // Update password
      await connection.execute(
        'UPDATE users SET password = ?, full_name = ?, email = ?, role = ? WHERE username = ?',
        [passwordHash, 'Administrator', 'admin@iware.com', 'superadmin', 'admin']
      );
      console.log('✅ Password admin berhasil diupdate!');
    } else {
      // Insert user baru
      await connection.execute(
        'INSERT INTO users (username, password, full_name, email, role) VALUES (?, ?, ?, ?, ?)',
        ['admin', passwordHash, 'Administrator', 'admin@iware.com', 'superadmin']
      );
      console.log('✅ User admin berhasil dibuat!');
    }

    // Verifikasi
    const [result] = await connection.execute(
      'SELECT id, username, full_name, email, role, created_at FROM users WHERE username = ?',
      ['admin']
    );

    console.log('\n📊 Data user admin:');
    console.log(result[0]);

    console.log('\n🎉 Selesai!');
    console.log('\nSekarang Anda bisa login dengan:');
    console.log('  Username: admin');
    console.log('  Password: iware123');
    
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

fixAdminPassword();
