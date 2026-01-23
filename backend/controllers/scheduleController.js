/**
 * CONTROLLER SCHEDULE
 * 
 * File ini menangani operasi CRUD untuk penjadwalan transaksi:
 * - Get Schedules: Mengambil daftar schedule dengan filter tanggal dan status
 * - Create Schedule: Membuat schedule baru untuk transaksi
 * - Update Schedule: Mengupdate tanggal atau catatan schedule
 * - Delete Schedule: Menghapus schedule
 * 
 * Schedule digunakan untuk mengatur kapan transaksi akan diproses
 */

const db = require('../config/database');

/**
 * Fungsi Get Schedules
 * Mengambil daftar schedule dengan join ke tabel transactions
 */
exports.getSchedules = async (req, res) => {
  try {
    // Ambil parameter filter dari query string
    const { startDate, endDate, status } = req.query;

    // Query dengan JOIN ke tabel transactions untuk mendapatkan detail transaksi
    let query = `
      SELECT s.*, t.transaction_number, t.customer_name, t.status, t.transaction_date
      FROM schedules s
      JOIN transactions t ON s.transaction_id = t.id
      WHERE 1=1
    `;
    const params = [];

    // Filter berdasarkan tanggal mulai
    if (startDate) {
      query += ' AND s.schedule_date >= ?';
      params.push(startDate);
    }

    // Filter berdasarkan tanggal akhir
    if (endDate) {
      query += ' AND s.schedule_date <= ?';
      params.push(endDate);
    }

    // Filter berdasarkan status transaksi
    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }

    // Urutkan berdasarkan tanggal schedule (ascending)
    query += ' ORDER BY s.schedule_date ASC';

    // Eksekusi query
    const [schedules] = await db.query(query, params);

    res.json({ data: schedules });
  } catch (error) {
    console.error('Error saat mengambil schedule:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Fungsi Create Schedule
 * Membuat schedule baru untuk transaksi tertentu
 */
exports.createSchedule = async (req, res) => {
  try {
    const { transaction_id, schedule_date, notes } = req.body;

    // Insert schedule baru ke database
    const [result] = await db.query(
      'INSERT INTO schedules (transaction_id, schedule_date, notes) VALUES (?, ?, ?)',
      [transaction_id, schedule_date, notes]
    );

    res.status(201).json({ 
      message: 'Schedule berhasil dibuat',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error saat membuat schedule:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Fungsi Update Schedule
 * Mengupdate tanggal schedule atau catatan
 */
exports.updateSchedule = async (req, res) => {
  try {
    const { schedule_date, notes } = req.body;
    const { id } = req.params;

    // Update schedule di database
    await db.query(
      'UPDATE schedules SET schedule_date = ?, notes = ? WHERE id = ?',
      [schedule_date, notes, id]
    );

    res.json({ message: 'Schedule berhasil diupdate' });
  } catch (error) {
    console.error('Error saat update schedule:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Fungsi Delete Schedule
 * Menghapus schedule dari database
 */
exports.deleteSchedule = async (req, res) => {
  try {
    // Hapus schedule berdasarkan ID
    await db.query('DELETE FROM schedules WHERE id = ?', [req.params.id]);
    
    res.json({ message: 'Schedule berhasil dihapus' });
  } catch (error) {
    console.error('Error saat menghapus schedule:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
