/**
 * ROUTER UTAMA BACKEND
 * 
 * File ini berisi semua route/endpoint API untuk aplikasi iware.
 * Route dibagi menjadi 2 kategori:
 * 1. Public routes: Tidak memerlukan autentikasi (login, info perusahaan)
 * 2. Protected routes: Memerlukan JWT token (semua route admin)
 * 
 * Semua route menggunakan prefix /api (didefinisikan di server.js)
 */

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Import semua controller
const authController = require('../controllers/authController');
const companyController = require('../controllers/companyController');
const dashboardController = require('../controllers/dashboardController');
const productController = require('../controllers/productController');
const transactionController = require('../controllers/transactionController');
const scheduleController = require('../controllers/scheduleController');
const rekapController = require('../controllers/rekapController');

// ==================== PUBLIC ROUTES ====================
// Route ini bisa diakses tanpa login

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'iware API is running',
    timestamp: new Date().toISOString()
  });
});

// Informasi perusahaan (untuk halaman publik)
router.get('/company', companyController.getCompanyInfo);

// Login (menghasilkan JWT token)
router.post('/auth/login', authController.login);

// ==================== PROTECTED ROUTES ====================
// Semua route di bawah ini memerlukan JWT token
router.use(auth);

// ----- Auth Routes -----
// Mendapatkan profil user yang sedang login
router.get('/auth/profile', authController.getProfile);

// ----- Company Routes -----
// Update informasi perusahaan (hanya admin)
router.put('/company', companyController.updateCompanyInfo);

// ----- Dashboard Routes -----
// Mendapatkan statistik untuk dashboard
router.get('/dashboard/stats', dashboardController.getDashboardStats);

// ----- Product Routes -----
// Mendapatkan daftar produk dengan pagination
router.get('/products', productController.getProducts);
// Mendapatkan detail produk berdasarkan ID
router.get('/products/:id', productController.getProductById);
// Sinkronisasi produk dari Accurate Online
router.post('/products/sync', productController.syncProducts);

// ----- Transaction Routes -----
// Mendapatkan daftar transaksi dengan filter dan pagination
router.get('/transactions', transactionController.getTransactions);
// Update status transaksi (menunggu/sebagian/terproses)
router.put('/transactions/:id/status', transactionController.updateTransactionStatus);
// Verifikasi transaksi oleh admin
router.put('/transactions/:id/verify', transactionController.verifyTransaction);
// Sinkronisasi transaksi dari Accurate Online
router.post('/transactions/sync', transactionController.syncTransactions);

// ----- Schedule Routes -----
// Mendapatkan daftar schedule
router.get('/schedules', scheduleController.getSchedules);
// Membuat schedule baru
router.post('/schedules', scheduleController.createSchedule);
// Update schedule
router.put('/schedules/:id', scheduleController.updateSchedule);
// Hapus schedule
router.delete('/schedules/:id', scheduleController.deleteSchedule);

// ----- Rekap Routes -----
// Mendapatkan data rekap transaksi terverifikasi
router.get('/rekap', rekapController.getRekapData);
// Export rekap ke Excel
router.get('/rekap/export', rekapController.exportRekapExcel);

module.exports = router;
