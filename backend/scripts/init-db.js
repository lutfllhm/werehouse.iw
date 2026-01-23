/**
 * SIMPLE DATABASE INITIALIZATION
 * Run this manually: node backend/scripts/init-db.js
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
  let connection;
  
  try {
    // Create connection
    const config = {
      host: process.env.MYSQLHOST || process.env.DB_HOST,
      port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
      user: process.env.MYSQLUSER || process.env.DB_USER,
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
      database: process.env.MYSQLDATABASE || process.env.DB_NAME
    };

    console.log('Connecting to database...');
    console.log('Host:', config.host);
    console.log('Database:', config.database);
    
    connection = await mysql.createConnection(config);
    console.log('✅ Connected!\n');

    // Create tables one by one
    console.log('Creating tables...\n');

    // 1. Users
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        role ENUM('admin', 'superadmin') DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ users');

    // 2. Company info
    await connection.execute(`
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
      )
    `);
    console.log('✓ company_info');

    // 3. Products
    await connection.execute(`
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
      )
    `);
    console.log('✓ products');

    // 4. Transactions
    await connection.execute(`
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
      )
    `);
    console.log('✓ transactions');

    // 5. Transaction items
    await connection.execute(`
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
      )
    `);
    console.log('✓ transaction_items');

    // 6. Schedules
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS schedules (
        id INT PRIMARY KEY AUTO_INCREMENT,
        transaction_id INT NOT NULL,
        schedule_date DATE NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ schedules');

    // 7. Sync log
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS accurate_sync_log (
        id INT PRIMARY KEY AUTO_INCREMENT,
        sync_type ENUM('products', 'transactions') NOT NULL,
        sync_status ENUM('success', 'failed') NOT NULL,
        records_synced INT DEFAULT 0,
        error_message TEXT,
        synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ accurate_sync_log');

    console.log('\n✅ All tables created!\n');

    // Insert default data
    console.log('Inserting default data...\n');

    // Company info
    await connection.execute(`
      INSERT IGNORE INTO company_info (id, company_name, vision, mission, business_field) 
      VALUES (1, 'iware', 
        'Menjadi penyedia solusi digital terdepan yang inovatif dan terpercaya untuk mendukung pertumbuhan bisnis. Menyediakan produk teknologi yang mudah diakses (terjangkau), fungsional, dan berkualitas bagi khalayak luas, mulai dari pengguna rumahan hingga bisnis kecil.',
        'Menghadirkan teknologi terbaru untuk menjawab tantangan bisnis di masa kini dan masa depan. Menawarkan solusi menyeluruh (perangkat keras, perangkat lunak) agar operasional bisnis lebih cepat dan efisien. Menyeimbangkan kualitas yang memadai dengan harga yang terjangkau bagi pelajar, kantor kecil, dan pelaku usaha. Mengutamakan pelayanan yang baik dan berkelanjutan.',
        'Iware (sering disebut iWare atau Iware Indonesia) adalah perusahaan yang bergerak di bidang penyediaan perangkat kasir (POS - Point of Sale) dan teknologi bisnis.')
    `);
    console.log('✓ company_info data');

    // Admin user (password: iware123)
    await connection.execute(`
      INSERT IGNORE INTO users (id, username, password, full_name, email, role) 
      VALUES (1, 'admin', '$2a$10$5gF4iUqdF/nnFKjlkz7U8O9awEl3LPuKVjuk9gOFHgYtmzDTHcJCy', 'Administrator', 'admin@iware.com', 'superadmin')
    `);
    console.log('✓ admin user');

    console.log('\n✅ Default data inserted!\n');

    // Show tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📊 Total tables:', tables.length);
    console.log('Tables:', tables.map(t => Object.values(t)[0]).join(', '));

    console.log('\n🎉 Database initialization complete!');
    console.log('\nYou can now login with:');
    console.log('  Username: admin');
    console.log('  Password: iware123');
    
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDatabase();
