/**
 * CONTROLLER AUTENTIKASI
 * 
 * File ini menangani semua proses autentikasi pengguna:
 * - Login: Memvalidasi kredensial dan menghasilkan JWT token
 * - Get Profile: Mengambil informasi profil pengguna yang sedang login
 * 
 * Menggunakan bcryptjs untuk enkripsi password dan jsonwebtoken untuk token
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

/**
 * Fungsi Login
 * Memvalidasi username dan password, kemudian menghasilkan JWT token
 */
exports.login = async (req, res) => {
  try {
    // Ambil username dan password dari request body
    const { username, password } = req.body;

    // Cari user berdasarkan username di database
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    
    // Jika user tidak ditemukan
    if (users.length === 0) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const user = users[0];
    
    // Validasi password menggunakan bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    // Generate JWT token dengan data user
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Kirim response dengan token dan data user
    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error saat login:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Fungsi Get Profile
 * Mengambil informasi profil user yang sedang login
 */
exports.getProfile = async (req, res) => {
  try {
    // Ambil data user berdasarkan ID dari token JWT
    const [users] = await db.query(
      'SELECT id, username, full_name, email, role FROM users WHERE id = ?',
      [req.user.id]
    );

    // Jika user tidak ditemukan
    if (users.length === 0) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Kirim data user
    res.json({ user: users[0] });
  } catch (error) {
    console.error('Error saat mengambil profil:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
