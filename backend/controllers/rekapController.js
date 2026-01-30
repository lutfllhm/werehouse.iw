/**
 * CONTROLLER REKAP
 * 
 * File ini menangani operasi rekap transaksi yang sudah diverifikasi:
 * - Get Rekap Data: Mengambil data transaksi terverifikasi dengan filter bulan/tahun
 * - Export Rekap Excel: Export data rekap ke file Excel
 * 
 * Hanya transaksi yang sudah diverifikasi yang masuk ke rekap
 */

const db = require('../config/database');
const ExcelJS = require('exceljs');

/**
 * Fungsi Get Rekap Data
 * Mengambil data transaksi yang sudah diverifikasi dengan filter periode
 */
exports.getRekapData = async (req, res) => {
  try {
    // Ambil parameter filter bulan dan tahun
    const { month, year } = req.query;

    // Query untuk mengambil transaksi yang sudah diverifikasi
    // JOIN dengan tabel users untuk mendapatkan nama yang verifikasi
    let query = `
      SELECT t.*, u.full_name as verified_by_name
      FROM transactions t
      LEFT JOIN users u ON t.verified_by = u.id
      WHERE t.verified = TRUE
    `;
    const params = [];
 
    // Filter berdasarkan bulan dan tahun
    if (month && year) {
      query += ' AND MONTH(t.transaction_date) = ? AND YEAR(t.transaction_date) = ?';
      params.push(month, year);
    } else if (year) {
      // Jika hanya tahun, ambil semua bulan di tahun tersebut
      query += ' AND YEAR(t.transaction_date) = ?';
      params.push(year);
    }

    // Urutkan berdasarkan tanggal transaksi (terbaru dulu)
    query += ' ORDER BY t.transaction_date DESC';

    // Eksekusi query
    const [transactions] = await db.query(query, params);   

    // Hitung total nilai transaksi
    const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.total_amount || 0), 0);

    // Kirim response dengan data dan summary
    res.json({
      data: transactions,
      summary: {
        totalTransactions: transactions.length,
        totalAmount: totalAmount
      }
    });
  } catch (error) {
    console.error('Error saat mengambil data rekap:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Fungsi Export Rekap Excel
 * Export data rekap transaksi ke file Excel dengan format yang rapi
 */
exports.exportRekapExcel = async (req, res) => {
  try {
    // Ambil parameter filter bulan dan tahun
    const { month, year } = req.query;

    // Query untuk mengambil transaksi yang sudah diverifikasi
    let query = `
      SELECT t.*, u.full_name as verified_by_name
      FROM transactions t
      LEFT JOIN users u ON t.verified_by = u.id
      WHERE t.verified = TRUE
    `;
    const params = [];

    // Filter berdasarkan bulan dan tahun
    if (month && year) {
      query += ' AND MONTH(t.transaction_date) = ? AND YEAR(t.transaction_date) = ?';
      params.push(month, year);
    } else if (year) {
      query += ' AND YEAR(t.transaction_date) = ?';
      params.push(year);
    }

    query += ' ORDER BY t.transaction_date DESC';

    // Eksekusi query
    const [transactions] = await db.query(query, params);

    // Buat workbook Excel baru
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Rekap Transaksi');

    // Definisikan kolom-kolom Excel
    worksheet.columns = [
      { header: 'No. Transaksi', key: 'transaction_number', width: 20 },
      { header: 'Tanggal', key: 'transaction_date', width: 15 },
      { header: 'Pelanggan', key: 'customer_name', width: 30 },
      { header: 'Keterangan', key: 'description', width: 40 },
      { header: 'Total', key: 'total_amount', width: 15 },
      { header: 'Status', key: 'status', width: 20 },
      { header: 'Diverifikasi Oleh', key: 'verified_by_name', width: 25 },
      { header: 'Tanggal Verifikasi', key: 'verified_at', width: 20 }
    ];

    // Styling untuk header (baris pertama)
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' } // Warna biru
    };

    // Tambahkan data transaksi ke worksheet
    transactions.forEach(transaction => {
      worksheet.addRow({
        transaction_number: transaction.transaction_number,
        transaction_date: new Date(transaction.transaction_date).toLocaleDateString('id-ID'),
        customer_name: transaction.customer_name,
        description: transaction.description,
        total_amount: parseFloat(transaction.total_amount || 0),
        status: transaction.status,
        verified_by_name: transaction.verified_by_name,
        verified_at: transaction.verified_at ? new Date(transaction.verified_at).toLocaleDateString('id-ID') : ''
      });
    });

    // Hitung total nilai transaksi
    const totalAmount = transactions.reduce((sum, t) => sum + parseFloat(t.total_amount || 0), 0);
    
    // Tambahkan baris kosong dan baris total
    worksheet.addRow({});
    const totalRow = worksheet.addRow({
      transaction_number: 'TOTAL',
      total_amount: totalAmount
    });
    totalRow.font = { bold: true }; // Buat baris total menjadi bold

    // Set header untuk download file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=rekap-transaksi-${year}-${month || 'all'}.xlsx`);

    // Tulis workbook ke response
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error saat export rekap excel:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
