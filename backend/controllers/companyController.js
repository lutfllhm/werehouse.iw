/**
 * CONTROLLER INFORMASI PERUSAHAAN
 * 
 * File ini menangani operasi CRUD untuk informasi perusahaan:
 * - Get Company Info: Mengambil informasi perusahaan (visi, misi, deskripsi, dll)
 * - Update Company Info: Mengupdate informasi perusahaan
 * 
 * Digunakan untuk menampilkan informasi di halaman publik dan admin
 */

const db = require('../config/database');

/**
 * Fungsi Get Company Info
 * Mengambil informasi perusahaan dari database
 */
exports.getCompanyInfo = async (req, res) => {
  try {
    // Ambil data perusahaan (hanya 1 record)
    const [rows] = await db.query('SELECT * FROM company_info LIMIT 1');
    
    // Jika data tidak ditemukan
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Informasi perusahaan tidak ditemukan' });
    }

    // Kirim data perusahaan
    res.json({ data: rows[0] });
  } catch (error) {
    console.error('Error saat mengambil info perusahaan:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};

/**
 * Fungsi Update Company Info
 * Mengupdate informasi perusahaan di database
 */
exports.updateCompanyInfo = async (req, res) => {
  try {
    // Ambil semua field dari request body
    const { company_name, vision, mission, description, business_field, address, phone, email } = req.body;

    // Update data perusahaan
    await db.query(
      `UPDATE company_info SET 
        company_name = ?, vision = ?, mission = ?, description = ?, 
        business_field = ?, address = ?, phone = ?, email = ?
      WHERE id = 1`,
      [company_name, vision, mission, description, business_field, address, phone, email]
    );

    // Kirim response sukses
    res.json({ message: 'Informasi perusahaan berhasil diupdate' });
  } catch (error) {
    console.error('Error saat update info perusahaan:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
};
