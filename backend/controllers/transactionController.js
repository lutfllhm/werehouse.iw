/**
 * CONTROLLER TRANSAKSI
 * 
 * File ini menangani semua operasi terkait transaksi/sales order:
 * - Sync Transactions: Sinkronisasi transaksi dari Accurate Online
 * - Get Transactions: Mengambil daftar transaksi dengan filter dan pagination
 * - Update Transaction Status: Mengubah status transaksi (menunggu/sebagian/terproses)
 * - Verify Transaction: Verifikasi transaksi oleh admin
 * 
 * Status transaksi: menunggu_proses, sebagian_terproses, terproses
 */

const db = require('../config/database');
const accurateService = require('../services/accurateService');

/**
 * Fungsi Sync Transactions
 * Sinkronisasi data sales order dari Accurate Online ke database lokal
 */
exports.syncTransactions = async (req, res) => {
  try {
    // Ambil data sales order dari Accurate Online
    const accurateOrders = await accurateService.getSalesOrders();
    
    let syncedCount = 0;
    
    // Jika ada data sales order dari Accurate
    if (accurateOrders && accurateOrders.d) {
      // Loop setiap order dan simpan/update ke database
      for (const order of accurateOrders.d) {
        await db.query(
          `INSERT INTO transactions (accurate_id, transaction_number, transaction_date, customer_name, customer_id, description, total_amount, last_sync)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
           ON DUPLICATE KEY UPDATE 
           transaction_number = VALUES(transaction_number),
           transaction_date = VALUES(transaction_date),
           customer_name = VALUES(customer_name),
           description = VALUES(description),
           total_amount = VALUES(total_amount),
           last_sync = NOW()`,
          [
            order.id,
            order.transNumber || order.number,
            order.transDate,
            order.customerName,
            order.customerId,
            order.description || '',
            order.totalAmount || 0
          ]
        );
        syncedCount++;
      }
    }

    // Catat log sinkronisasi berhasil
    await db.query(
      'INSERT INTO accurate_sync_log (sync_type, sync_status, records_synced) VALUES (?, ?, ?)',
      ['transactions', 'success', syncedCount]
    );

    res.json({ message: 'Sinkronisasi transaksi berhasil', syncedCount });
  } catch (error) {
    console.error('Error saat sinkronisasi transaksi:', error);
    
    // Catat log sinkronisasi gagal
    await db.query(
      'INSERT INTO accurate_sync_log (sync_type, sync_status, error_message) VALUES (?, ?, ?)',
      ['transactions', 'failed', error.message]
    );
    
    res.status(500).json({ message: 'Gagal sinkronisasi transaksi', error: error.message });
  }
};

/**
 * Fungsi Get Transactions
 * Mengambil daftar transaksi dengan fitur pencarian, filter status, filter tanggal, dan pagination
 */
exports.getTransactions = async (req, res) => {
  try {
    // Ambil parameter dari query string
    const { search, status, startDate, endDate, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    // Query dasar untuk mengambil transaksi
    let query = 'SELECT * FROM transactions WHERE 1=1';
    let countQuery = 'SELECT COUNT(*) as total FROM transactions WHERE 1=1';
    const params = [];

    // Jika ada parameter pencarian (nomor transaksi atau nama pelanggan)
    if (search) {
      query += ' AND (transaction_number LIKE ? OR customer_name LIKE ?)';
      countQuery += ' AND (transaction_number LIKE ? OR customer_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Jika ada filter status
    if (status) {
      query += ' AND status = ?';
      countQuery += ' AND status = ?';
      params.push(status);
    }

    // Jika ada filter tanggal mulai
    if (startDate) {
      query += ' AND transaction_date >= ?';
      countQuery += ' AND transaction_date >= ?';
      params.push(startDate);
    }

    // Jika ada filter tanggal akhir
    if (endDate) {
      query += ' AND transaction_date <= ?';
      countQuery += ' AND transaction_date <= ?';
      params.push(endDate);
    }

    // Tambahkan sorting dan pagination
    query += ' ORDER BY transaction_date DESC LIMIT ? OFFSET ?';
    
    // Eksekusi query
    const [transactions] = await db.query(query, [...params, parseInt(limit), offset]);
    const [countResult] = await db.query(countQuery, params);

    // Kirim response dengan data dan info pagination
    res.json({
      data: transactions,
      pagination: {
        total: countResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Error saat mengambil transaksi:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Fungsi Update Transaction Status
 * Mengubah status transaksi (menunggu_proses, sebagian_terproses, terproses)
 */
exports.updateTransactionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Update status transaksi
    await db.query('UPDATE transactions SET status = ? WHERE id = ?', [status, id]);

    res.json({ message: 'Status transaksi berhasil diupdate' });
  } catch (error) {
    console.error('Error saat update status transaksi:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Fungsi Verify Transaction
 * Verifikasi transaksi oleh admin (menandai transaksi sudah diproses)
 */
exports.verifyTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // Update transaksi menjadi verified dengan mencatat siapa yang verifikasi dan kapan
    await db.query(
      'UPDATE transactions SET verified = TRUE, verified_at = NOW(), verified_by = ? WHERE id = ?',
      [req.user.id, id]
    );

    res.json({ message: 'Transaksi berhasil diverifikasi' });
  } catch (error) {
    console.error('Error saat verifikasi transaksi:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
