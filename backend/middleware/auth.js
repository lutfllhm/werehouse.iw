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
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    console.log('Auth middleware:', { 
      path: req.path, 
      hasAuthHeader: !!authHeader,
      hasToken: !!token 
    });
    
    // Jika token tidak ada, tolak akses
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
    }

    // Verifikasi token menggunakan JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('Token verified:', { userId: decoded.id, username: decoded.username });
    
    // Simpan data user dari token ke req.user
    req.user = decoded;
    
    // Lanjutkan ke controller berikutnya
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    // Jika token tidak valid atau expired
    res.status(401).json({ message: 'Token tidak valid.', error: error.message });
  }
};

module.exports = auth;
