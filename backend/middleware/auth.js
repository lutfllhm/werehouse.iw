/**
 * MIDDLEWARE AUTENTIKASI
 * 
 * File ini berisi middleware untuk memvalidasi JWT token pada setiap request
 * yang memerlukan autentikasi. Middleware ini akan:
 * 1. Mengambil token dari header Authorization
 * 2. Memvalidasi token menggunakan JWT secret
 * 3. Menyimpan data user ke req.user untuk digunakan di controller
 * 
 * Digunakan untuk melindungi route-route yang memerlukan login
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware Auth
 * Memvalidasi JWT token dan menyimpan data user ke request
 */
const auth = (req, res, next) => {
  try {
    // Ambil token dari header Authorization (format: "Bearer <token>")
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    // Jika token tidak ada, tolak akses
    if (!token) {
      return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
    }

    // Verifikasi token menggunakan JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Simpan data user dari token ke req.user
    req.user = decoded;
    
    // Lanjutkan ke controller berikutnya
    next();
  } catch (error) {
    // Jika token tidak valid atau expired
    res.status(401).json({ message: 'Token tidak valid.' });
  }
};

module.exports = auth;
