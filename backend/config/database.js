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

// Buat connection pool dengan konfigurasi dari environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,           // Host database (localhost atau IP server)
  port: process.env.DB_PORT || 3306,   // Port database (default 3306)
  user: process.env.DB_USER,           // Username database
  password: process.env.DB_PASSWORD,   // Password database
  database: process.env.DB_NAME,       // Nama database
  waitForConnections: true,            // Tunggu jika semua koneksi sedang digunakan
  connectionLimit: 10,                 // Maksimal 10 koneksi simultan
  queueLimit: 0                        // Tidak ada limit untuk antrian request
});

// Convert pool ke promise-based untuk menggunakan async/await
const promisePool = pool.promise();

module.exports = promisePool;
