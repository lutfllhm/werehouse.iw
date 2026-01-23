/**
 * CONTROLLER DASHBOARD
 * 
 * File ini menangani pengambilan data statistik untuk dashboard admin:
 * - Total produk
 * - Total transaksi
 * - Produk dengan stok rendah
 * - Breakdown status transaksi
 * - Grafik transaksi bulanan (6 bulan terakhir)
 * - Transaksi terbaru
 * 
 * Data ini digunakan untuk menampilkan overview bisnis di halaman dashboard
 */

const db = require('../config/database');

/**
 * Fungsi Get Dashboard Stats
 * Mengambil semua statistik yang diperlukan untuk dashboard
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Hitung total produk
    const [productCount] = await db.query('SELECT COUNT(*) as total FROM products');
    
    // Hitung total transaksi
    const [transactionCount] = await db.query('SELECT COUNT(*) as total FROM transactions');
    
    // Hitung transaksi berdasarkan status (menunggu, sebagian, terproses)
    const [statusStats] = await db.query(`
      SELECT status, COUNT(*) as count 
      FROM transactions 
      GROUP BY status
    `);
    
    // Hitung produk dengan stok rendah (stok <= minimum stok)
    const [lowStock] = await db.query(`
      SELECT COUNT(*) as total 
      FROM products 
      WHERE stock_quantity <= min_stock
    `);
    
    // Ambil data transaksi harian untuk 7 hari terakhir (untuk grafik)
    const [dailyTransactions] = await db.query(`
      SELECT 
        DATE_FORMAT(transaction_date, '%Y-%m-%d') as date,
        DATE_FORMAT(transaction_date, '%d %b') as label,
        COUNT(*) as count,
        SUM(total_amount) as total_amount
      FROM transactions
      WHERE transaction_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE_FORMAT(transaction_date, '%Y-%m-%d')
      ORDER BY date ASC
    `);

    // Ambil data transaksi mingguan untuk 8 minggu terakhir (untuk grafik)
    const [weeklyTransactions] = await db.query(`
      SELECT 
        CONCAT('Minggu ', WEEK(transaction_date, 1)) as week,
        DATE_FORMAT(MIN(transaction_date), '%d %b') as start_date,
        DATE_FORMAT(MAX(transaction_date), '%d %b') as end_date,
        COUNT(*) as count,
        SUM(total_amount) as total_amount
      FROM transactions
      WHERE transaction_date >= DATE_SUB(NOW(), INTERVAL 8 WEEK)
      GROUP BY YEAR(transaction_date), WEEK(transaction_date, 1)
      ORDER BY YEAR(transaction_date), WEEK(transaction_date, 1) ASC
    `);
    
    // Ambil 5 transaksi terbaru
    const [recentTransactions] = await db.query(`
      SELECT * FROM transactions 
      ORDER BY transaction_date DESC 
      LIMIT 5
    `);

    // Ambil data produk terlaris (top 5) - dengan fallback jika tidak ada transaction_items
    const [topProducts] = await db.query(`
      SELECT 
        p.product_name,
        COALESCE(SUM(ti.quantity), 0) as total_sold,
        COALESCE(SUM(ti.quantity * ti.unit_price), 0) as total_revenue
      FROM products p
      LEFT JOIN transaction_items ti ON ti.product_id = p.id
      LEFT JOIN transactions t ON ti.transaction_id = t.id AND t.transaction_date >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
      GROUP BY p.id, p.product_name
      HAVING total_sold > 0
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    // Ambil data revenue bulanan untuk 6 bulan terakhir
    const [monthlyRevenue] = await db.query(`
      SELECT 
        DATE_FORMAT(transaction_date, '%Y-%m') as month,
        SUM(total_amount) as revenue
      FROM transactions
      WHERE transaction_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY DATE_FORMAT(transaction_date, '%Y-%m')
      ORDER BY month ASC
    `);

    // Kirim semua data statistik
    console.log('Dashboard Stats:', {
      stats: {
        totalProducts: productCount[0].total,
        totalTransactions: transactionCount[0].total,
        lowStockProducts: lowStock[0].total,
        statusBreakdown: statusStats
      },
      charts: {
        dailyTransactions: dailyTransactions.length,
        weeklyTransactions: weeklyTransactions.length,
        monthlyRevenue: monthlyRevenue.length,
        topProducts: topProducts.length
      }
    });

    res.json({
      stats: {
        totalProducts: productCount[0].total,
        totalTransactions: transactionCount[0].total,
        lowStockProducts: lowStock[0].total,
        statusBreakdown: statusStats
      },
      charts: {
        dailyTransactions,
        weeklyTransactions,
        monthlyRevenue,
        topProducts
      },
      recentTransactions
    });
  } catch (error) {
    console.error('Error saat mengambil statistik dashboard:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
