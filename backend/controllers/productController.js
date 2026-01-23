/**
 * CONTROLLER PRODUK
 * 
 * File ini menangani operasi terkait produk/barang:
 * - Sync Products: Sinkronisasi data produk dari Accurate Online ke database lokal
 * - Get Products: Mengambil daftar produk dengan fitur pencarian, filter, dan pagination
 * - Get Product By ID: Mengambil detail produk berdasarkan ID
 * 
 * Terintegrasi dengan Accurate Online untuk mendapatkan data produk real-time
 */

const db = require('../config/database');
const accurateService = require('../services/accurateService');

/**
 * Fungsi Sync Products
 * Sinkronisasi data produk dari Accurate Online ke database lokal
 */
exports.syncProducts = async (req, res) => {
  try {
    // Ambil data produk dari Accurate Online
    const accurateProducts = await accurateService.getProducts();
    
    let syncedCount = 0;
    
    // Jika ada data produk dari Accurate
    if (accurateProducts && accurateProducts.d) {
      // Loop setiap produk dan simpan/update ke database
      for (const product of accurateProducts.d) {
        await db.query(
          `INSERT INTO products (accurate_id, product_code, product_name, category, unit, stock_quantity, price, last_sync)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
           ON DUPLICATE KEY UPDATE 
           product_code = VALUES(product_code),
           product_name = VALUES(product_name),
           category = VALUES(category),
           unit = VALUES(unit),
           stock_quantity = VALUES(stock_quantity),
           price = VALUES(price),
           last_sync = NOW()`,
          [
            product.id,
            product.no || product.itemCode,
            product.name,
            product.itemCategoryName || 'Uncategorized',
            product.unitName || 'PCS',
            product.availableQty || 0,
            product.unitPrice || 0
          ]
        );
        syncedCount++;
      }
    }

    // Catat log sinkronisasi berhasil
    await db.query(
      'INSERT INTO accurate_sync_log (sync_type, sync_status, records_synced) VALUES (?, ?, ?)',
      ['products', 'success', syncedCount]
    );

    res.json({ message: 'Sinkronisasi produk berhasil', syncedCount });
  } catch (error) {
    console.error('Error saat sinkronisasi produk:', error);
    
    // Catat log sinkronisasi gagal
    await db.query(
      'INSERT INTO accurate_sync_log (sync_type, sync_status, error_message) VALUES (?, ?, ?)',
      ['products', 'failed', error.message]
    );
    
    res.status(500).json({ message: 'Gagal sinkronisasi produk', error: error.message });
  }
};

/**
 * Fungsi Get Products
 * Mengambil daftar produk dengan fitur pencarian, filter kategori, dan pagination
 */
exports.getProducts = async (req, res) => {
  try {
    // Ambil parameter dari query string
    const { search, category, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Query dasar untuk mengambil produk
    let query = 'SELECT * FROM products WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
    const params = [];

    // Jika ada parameter pencarian (nama atau kode produk)
    if (search) {
      query += ' AND (product_name LIKE ? OR product_code LIKE ?)';
      countQuery += ' AND (product_name LIKE ? OR product_code LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Jika ada filter kategori
    if (category) {
      query += ' AND category = ?';
      countQuery += ' AND category = ?';
      params.push(category);
    }

    // Tambahkan sorting dan pagination
    query += ' ORDER BY product_name LIMIT ? OFFSET ?';
    
    // Eksekusi query
    const [products] = await db.query(query, [...params, parseInt(limit), offset]);
    const [countResult] = await db.query(countQuery, params);

    // Kirim response dengan data dan info pagination
    res.json({
      data: products,
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Error saat mengambil produk:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Fungsi Get Product By ID
 * Mengambil detail produk berdasarkan ID
 */
exports.getProductById = async (req, res) => {
  try {
    // Cari produk berdasarkan ID
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    
    // Jika produk tidak ditemukan
    if (products.length === 0) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    // Kirim data produk
    res.json({ data: products[0] });
  } catch (error) {
    console.error('Error saat mengambil detail produk:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
