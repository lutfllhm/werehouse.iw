/**
 * DATABASE MIGRATION SCRIPT (EMBEDDED SCHEMA)
 * 
 * Script ini akan otomatis membuat semua tabel yang diperlukan.
 * Schema SQL di-embed langsung di script untuk menghindari masalah path.
 * 
 * Dijalankan otomatis saat server start.
 */

const db = require('../config/database');

// Schema SQL embedded langsung
const SCHEMA_SQL = `
-- Table: users (admin)
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role ENUM('admin', 'superadmin') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: company_info
CREATE TABLE IF NOT EXISTS company_info (
  id INT PRIMARY KEY AUTO_INCREMENT,
  company_name VARCHAR(200) NOT NULL,
  vision TEXT,
  mission TEXT,
  description TEXT,
  business_field TEXT,
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(100),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: products (stok barang dari Accurate)
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  accurate_id VARCHAR(100) UNIQUE,
  product_code VARCHAR(50),
  product_name VARCHAR(200) NOT NULL,
  category VARCHAR(100),
  unit VARCHAR(20),
  stock_quantity INT DEFAULT 0,
  min_stock INT DEFAULT 0,
  price DECIMAL(15,2),
  last_sync TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: transactions (pesanan penjualan dari Accurate)
CREATE TABLE IF NOT EXISTS transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  accurate_id VARCHAR(100) UNIQUE,
  transaction_number VARCHAR(50) NOT NULL,
  transaction_date DATE NOT NULL,
  customer_name VARCHAR(200) NOT NULL,
  customer_id VARCHAR(100),
  description TEXT,
  total_amount DECIMAL(15,2),
  status ENUM('menunggu_proses', 'sebagian_terproses', 'terproses') DEFAULT 'menunggu_proses',
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP NULL,
  verified_by INT,
  last_sync TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (verified_by) REFERENCES users(id)
);

-- Table: transaction_items
CREATE TABLE IF NOT EXISTS transaction_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  transaction_id INT NOT NULL,
  product_id INT,
  product_name VARCHAR(200),
  quantity INT NOT NULL,
  unit_price DECIMAL(15,2),
  subtotal DECIMAL(15,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Table: schedules
CREATE TABLE IF NOT EXISTS schedules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  transaction_id INT NOT NULL,
  schedule_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
);

-- Table: accurate_sync_log
CREATE TABLE IF NOT EXISTS accurate_sync_log (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sync_type ENUM('products', 'transactions') NOT NULL,
  sync_status ENUM('success', 'failed') NOT NULL,
  records_synced INT DEFAULT 0,
  error_message TEXT,
  synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const SEED_DATA = `
-- Insert default company info
INSERT IGNORE INTO company_info (id, company_name, vision, mission, business_field) VALUES
(1, 'iware', 
 'Menjadi penyedia solusi digital terdepan yang inovatif dan terpercaya untuk mendukung pertumbuhan bisnis. Menyediakan produk teknologi yang mudah diakses (terjangkau), fungsional, dan berkualitas bagi khalayak luas, mulai dari pengguna rumahan hingga bisnis kecil.',
 'Menghadirkan teknologi terbaru untuk menjawab tantangan bisnis di masa kini dan masa depan. Menawarkan solusi menyeluruh (perangkat keras, perangkat lunak) agar operasional bisnis lebih cepat dan efisien. Menyeimbangkan kualitas yang memadai dengan harga yang terjangkau bagi pelajar, kantor kecil, dan pelaku usaha. Mengutamakan pelayanan yang baik dan berkelanjutan.',
 'Iware (sering disebut iWare atau Iware Indonesia) adalah perusahaan yang bergerak di bidang penyediaan perangkat kasir (POS - Point of Sale) dan teknologi bisnis.');

-- Insert default admin user (password: iware123)
INSERT IGNORE INTO users (id, username, password, full_name, email, role) VALUES
(1, 'admin', '$2a$10$5gF4iUqdF/nnFKjlkz7U8O9awEl3LPuKVjuk9gOFHgYtmzDTHcJCy', 'Administrator', 'admin@iware.com', 'superadmin');
`;

async function runMigration() {
  let connection;
  try {
    console.log('🔄 Checking database tables...');

    // Test connection first
    try {
      connection = await db.getConnection();
      console.log('✅ Database connection successful');
      connection.release();
    } catch (connError) {
      console.error('❌ Database connection failed:', connError.message);
      console.error('   Please check your database environment variables:');
      console.error('   - DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME');
      throw connError;
    }

    // Split SQL statements
    const statements = SCHEMA_SQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    // Eksekusi setiap statement
    for (const statement of statements) {
      try {
        await db.query(statement);
      } catch (error) {
        // Ignore error jika tabel sudah ada
        if (!error.message.includes('already exists')) {
          console.error('Error executing statement:', error.message);
        }
      }
    }

    console.log('✅ Database tables created successfully');

    // Insert seed data
    const seedStatements = SEED_DATA
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of seedStatements) {
      try {
        await db.query(statement);
      } catch (error) {
        // Ignore duplicate entry errors
        if (!error.message.includes('Duplicate entry')) {
          console.error('Error inserting seed data:', error.message);
        }
      }
    }

    console.log('✅ Seed data inserted successfully');
    
    // Verify tables
    const [tables] = await db.query('SHOW TABLES');
    console.log(`📊 Total tables: ${tables.length}`);
    
    return true;
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    return false;
  }
}

module.exports = runMigration;
