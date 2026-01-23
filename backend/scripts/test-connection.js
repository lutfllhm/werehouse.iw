/**
 * Test database connection
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  try {
    const config = {
      host: process.env.MYSQLHOST || process.env.DB_HOST,
      port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
      user: process.env.MYSQLUSER || process.env.DB_USER,
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
      database: process.env.MYSQLDATABASE || process.env.DB_NAME
    };

    console.log('Testing connection with:');
    console.log('Host:', config.host);
    console.log('Port:', config.port);
    console.log('User:', config.user);
    console.log('Database:', config.database);
    console.log('Password:', config.password ? '***SET***' : 'NOT SET');
    console.log('');

    const connection = await mysql.createConnection(config);
    console.log('✅ Connection successful!\n');

    // Check tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📊 Total tables:', tables.length);
    
    if (tables.length > 0) {
      console.log('Tables:', tables.map(t => Object.values(t)[0]).join(', '));
    } else {
      console.log('⚠️  No tables found. Run: npm run init-db');
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
