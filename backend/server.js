/**
 * SERVER UTAMA BACKEND
 * 
 * File ini adalah entry point untuk backend aplikasi iware.
 * Menggunakan Express.js sebagai web framework.
 * 
 * Fitur:
 * - CORS enabled untuk komunikasi dengan frontend
 * - JSON body parser untuk menerima data JSON
 * - Route /api untuk semua endpoint
 * - Health check endpoint untuk monitoring
 * - Error handling middleware
 * - Network access support (0.0.0.0)
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');
const runMigration = require('./scripts/migrate');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Allow network access

// ==================== MIDDLEWARE ====================

// CORS: Mengizinkan request dari frontend (domain berbeda)
app.use(cors({
  origin: '*', // Allow all origins untuk development
  credentials: true
}));

// Body Parser: Untuk membaca JSON dari request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== ROUTES ====================

// Semua route API menggunakan prefix /api
app.use('/api', routes);

// Health check endpoint (untuk monitoring server)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'iware API is running' });
});

// ==================== ERROR HANDLING ====================

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Terjadi kesalahan server' });
});

// ==================== START SERVER ====================

// Run migration before starting server
runMigration().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`Server berjalan di port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Local: http://localhost:${PORT}`);
    
    // Tampilkan network URL jika bukan localhost
    if (HOST === '0.0.0.0') {
      const os = require('os');
      const networkInterfaces = os.networkInterfaces();
      
      Object.keys(networkInterfaces).forEach((interfaceName) => {
        networkInterfaces[interfaceName].forEach((iface) => {
          if (iface.family === 'IPv4' && !iface.internal) {
            console.log(`Network: http://${iface.address}:${PORT}`);
          }
        });
      });
    }
  });
}).catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
