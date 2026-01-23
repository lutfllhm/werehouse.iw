/**
 * KONFIGURASI DATABASE
 * 
 * File ini berisi konfigurasi koneksi ke database MySQL menggunakan mysql2.
 * Menggunakan connection pool untuk performa yang lebih baik.
 * 
 * Connection pool memungkinkan multiple request menggunakan koneksi yang sama
 * tanpa perlu membuat koneksi baru setiap kali ada request.
 */

const mysql = require('mysql2');
require('dotenv').config();

// Support both Railway (MYSQL*) and standard (DB_*) environment variables
const dbConfig = {
  host: process.env.MYSQLHOST || process.env.DB_HOST,
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  user: process.env.MYSQLUSER || process.env.DB_USER,
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.DB_NAME
};

// Log database configuration (tanpa password)
console.log('📊 Database Configuration:');
console.log('  Host:', dbConfig.host || 'NOT SET');
console.log('  Port:', dbConfig.port);
console.log('  User:', dbConfig.user || 'NOT SET');
console.log('  Database:', dbConfig.database || 'NOT SET');
console.log('  Password:', dbConfig.password ? '***SET***' : 'NOT SET');

// Buat connection pool dengan konfigurasi dari environment variables
const pool = mysql.createPool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  waitForConnections: true,            // Tunggu jika semua koneksi sedang digunakan
  connectionLimit: 10,                 // Maksimal 10 koneksi simultan
  queueLimit: 0,                       // Tidak ada limit untuk antrian request
  connectTimeout: 10000                // 10 second timeout
});

// Convert pool ke promise-based untuk menggunakan async/await
const promisePool = pool.promise();

module.exports = promisePool;
