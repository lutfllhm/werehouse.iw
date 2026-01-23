/**
 * SCRIPT SEED TRANSAKSI - PRINTER LABEL & KERTAS LABEL
 * 
 * Script ini akan menambahkan data dummy ke database:
 * - 15 Produk (Printer Label, Kertas Label, Ribbon)
 * - 10 Transaksi dengan berbagai status
 * 
 * Cara menjalankan:
 * node backend/scripts/seedTransactions.js
 * atau
 * npm run seed
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

// Data dummy produk - Fokus pada Printer Label dan Kertas Label
const dummyProducts = [
  {
    product_code: 'PRT-4601-BK',
    product_name: 'Printer 4601 BT BLACK',
    category: 'Printer Label',
    unit: 'UNIT',
    stock_quantity: 15,
    min_stock: 5,
    price: 3500000
  },
  {
    product_code: 'PRT-420-WH',
    product_name: 'Printer 420 BT WHITE',
    category: 'Printer Label',
    unit: 'UNIT',
    stock_quantity: 12,
    min_stock: 5,
    price: 3200000
  },
  {
    product_code: 'LBL-100x150-300',
    product_name: 'Kertas Label 100 x 150 isi 300',
    category: 'Kertas Label',
    unit: 'ROLL',
    stock_quantity: 250,
    min_stock: 50,
    price: 85000
  },
  {
    product_code: 'LBL-100x100-500',
    product_name: 'Kertas Label 100 x 100 isi 500',
    category: 'Kertas Label',
    unit: 'ROLL',
    stock_quantity: 180,
    min_stock: 50,
    price: 95000
  },
  {
    product_code: 'PRT-PI58-SII',
    product_name: 'Printer PI58 SII',
    category: 'Printer Label',
    unit: 'UNIT',
    stock_quantity: 8,
    min_stock: 3,
    price: 2800000
  },
  {
    product_code: 'LBL-80x60-500',
    product_name: 'Kertas Label 80 x 60 isi 500',
    category: 'Kertas Label',
    unit: 'ROLL',
    stock_quantity: 320,
    min_stock: 80,
    price: 65000
  },
  {
    product_code: 'LBL-50x30-1000',
    product_name: 'Kertas Label 50 x 30 isi 1000',
    category: 'Kertas Label',
    unit: 'ROLL',
    stock_quantity: 2,
    min_stock: 30,
    price: 45000
  },
  {
    product_code: 'PRT-ZD220',
    product_name: 'Printer Zebra ZD220',
    category: 'Printer Label',
    unit: 'UNIT',
    stock_quantity: 6,
    min_stock: 3,
    price: 4200000
  },
  {
    product_code: 'RBN-110x300',
    product_name: 'Ribbon Wax 110mm x 300m',
    category: 'Ribbon',
    unit: 'ROLL',
    stock_quantity: 1,
    min_stock: 20,
    price: 125000
  },
  {
    product_code: 'LBL-THERMAL-100x50',
    product_name: 'Kertas Label Thermal 100 x 50 isi 800',
    category: 'Kertas Label',
    unit: 'ROLL',
    stock_quantity: 150,
    min_stock: 40,
    price: 72000
  },
  {
    product_code: 'PRT-TSC-244',
    product_name: 'Printer TSC TTP-244 Pro',
    category: 'Printer Label',
    unit: 'UNIT',
    stock_quantity: 4,
    min_stock: 2,
    price: 3800000
  },
  {
    product_code: 'LBL-BARCODE-50x25',
    product_name: 'Kertas Label Barcode 50 x 25 isi 2000',
    category: 'Kertas Label',
    unit: 'ROLL',
    stock_quantity: 280,
    min_stock: 60,
    price: 55000
  },
  {
    product_code: 'RBN-WAX-RESIN',
    product_name: 'Ribbon Wax Resin 110mm x 300m',
    category: 'Ribbon',
    unit: 'ROLL',
    stock_quantity: 45,
    min_stock: 15,
    price: 165000
  },
  {
    product_code: 'LBL-STICKER-A4',
    product_name: 'Kertas Label Sticker A4 (100 lembar)',
    category: 'Kertas Label',
    unit: 'PACK',
    stock_quantity: 95,
    min_stock: 20,
    price: 180000
  },
  {
    product_code: 'PRT-ARGOX-CP2140',
    product_name: 'Printer Argox CP-2140',
    category: 'Printer Label',
    unit: 'UNIT',
    stock_quantity: 3,
    min_stock: 2,
    price: 4500000
  }
];

// Data dummy transaksi - Disesuaikan dengan produk printer label
// Tambahkan transaksi untuk 7 hari terakhir agar grafik harian terisi
const dummyTransactions = [
  // Transaksi 7 hari terakhir (untuk grafik harian)
  {
    transaction_number: 'SO-2024-011',
    transaction_date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customer_name: 'PT Digital Print',
    customer_id: 'CUST011',
    description: 'Order Printer Label dan Kertas',
    total_amount: 8500000,
    status: 'terproses'
  },
  {
    transaction_number: 'SO-2024-012',
    transaction_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customer_name: 'CV Maju Jaya',
    customer_id: 'CUST012',
    description: 'Pembelian Kertas Label',
    total_amount: 3200000,
    status: 'sebagian_terproses'
  },
  {
    transaction_number: 'SO-2024-013',
    transaction_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customer_name: 'Toko Barcode Plus',
    customer_id: 'CUST013',
    description: 'Order Ribbon dan Kertas Label',
    total_amount: 2800000,
    status: 'menunggu_proses'
  },
  {
    transaction_number: 'SO-2024-014',
    transaction_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customer_name: 'PT Warehouse Indo',
    customer_id: 'CUST014',
    description: 'Pembelian Printer Zebra',
    total_amount: 12500000,
    status: 'terproses'
  },
  {
    transaction_number: 'SO-2024-015',
    transaction_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customer_name: 'CV Label Solution',
    customer_id: 'CUST015',
    description: 'Order Kertas Label berbagai ukuran',
    total_amount: 5600000,
    status: 'sebagian_terproses'
  },
  {
    transaction_number: 'SO-2024-016',
    transaction_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customer_name: 'UD Sumber Rezeki',
    customer_id: 'CUST016',
    description: 'Pembelian Printer TSC',
    total_amount: 9800000,
    status: 'menunggu_proses'
  },
  {
    transaction_number: 'SO-2024-017',
    transaction_date: new Date().toISOString().split('T')[0],
    customer_name: 'PT Modern Retail',
    customer_id: 'CUST017',
    description: 'Order Printer dan Supplies',
    total_amount: 15200000,
    status: 'terproses'
  },
  // Transaksi lama (untuk data historis)
  {
    transaction_number: 'SO-2024-001',
    transaction_date: '2024-01-15',
    customer_name: 'PT Logistik Express',
    customer_id: 'CUST001',
    description: 'Pembelian Printer Label dan Kertas Label',
    total_amount: 18500000,
    status: 'terproses'
  },
  {
    transaction_number: 'SO-2024-002',
    transaction_date: '2024-01-18',
    customer_name: 'CV Warehouse Sejahtera',
    customer_id: 'CUST002',
    description: 'Order Printer 4601 BT BLACK dan Kertas Label',
    total_amount: 12000000,
    status: 'sebagian_terproses'
  },
  {
    transaction_number: 'SO-2024-003',
    transaction_date: '2024-01-20',
    customer_name: 'Toko Barcode Indonesia',
    customer_id: 'CUST003',
    description: 'Pembelian Kertas Label berbagai ukuran',
    total_amount: 4500000,
    status: 'menunggu_proses'
  },
  {
    transaction_number: 'SO-2024-004',
    transaction_date: '2024-01-22',
    customer_name: 'PT Retail Modern',
    customer_id: 'CUST004',
    description: 'Order Printer Zebra ZD220 dan Ribbon',
    total_amount: 8800000,
    status: 'terproses'
  },
  {
    transaction_number: 'SO-2024-005',
    transaction_date: '2024-01-25',
    customer_name: 'UD Sumber Makmur',
    customer_id: 'CUST005',
    description: 'Pembelian Printer PI58 SII',
    total_amount: 5600000,
    status: 'sebagian_terproses'
  },
  {
    transaction_number: 'SO-2024-006',
    transaction_date: '2024-02-01',
    customer_name: 'CV Distribusi Nusantara',
    customer_id: 'CUST006',
    description: 'Order Kertas Label Thermal dan Ribbon',
    total_amount: 3200000,
    status: 'menunggu_proses'
  },
  {
    transaction_number: 'SO-2024-007',
    transaction_date: '2024-02-05',
    customer_name: 'PT Manufaktur Jaya',
    customer_id: 'CUST007',
    description: 'Pembelian Printer TSC dan Kertas Label Barcode',
    total_amount: 15500000,
    status: 'terproses'
  },
  {
    transaction_number: 'SO-2024-008',
    transaction_date: '2024-02-10',
    customer_name: 'Toko Label Print',
    customer_id: 'CUST008',
    description: 'Order Printer 420 BT WHITE dan supplies',
    total_amount: 9800000,
    status: 'sebagian_terproses'
  },
  {
    transaction_number: 'SO-2024-009',
    transaction_date: '2024-02-12',
    customer_name: 'CV Packaging Solution',
    customer_id: 'CUST009',
    description: 'Pembelian Kertas Label Sticker A4',
    total_amount: 2700000,
    status: 'menunggu_proses'
  },
  {
    transaction_number: 'SO-2024-010',
    transaction_date: '2024-02-15',
    customer_name: 'PT Gudang Sentral',
    customer_id: 'CUST010',
    description: 'Order Printer Argox dan Kertas Label 100x150',
    total_amount: 11200000,
    status: 'terproses'
  }
];

async function seedDatabase() {
  let connection;
  
  try {
    console.log('🔄 Menghubungkan ke database...');
    
    // Buat koneksi ke database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('✅ Terhubung ke database!');
    console.log('');

    // ========== SEED PRODUCTS ==========
    console.log('📦 Menambahkan produk dummy (Printer Label & Kertas Label)...');
    let productCount = 0;
    
    for (const product of dummyProducts) {
      try {
        await connection.query(
          `INSERT INTO products (product_code, product_name, category, unit, stock_quantity, min_stock, price, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
           ON DUPLICATE KEY UPDATE 
           product_name = VALUES(product_name),
           stock_quantity = VALUES(stock_quantity),
           price = VALUES(price)`,
          [
            product.product_code,
            product.product_name,
            product.category,
            product.unit,
            product.stock_quantity,
            product.min_stock,
            product.price
          ]
        );
        productCount++;
        console.log(`   ✓ ${product.product_code} - ${product.product_name} (${product.category})`);
      } catch (error) {
        console.log(`   ✗ Error: ${product.product_code} - ${error.message}`);
      }
    }
    
    console.log(`✅ Berhasil menambahkan ${productCount} produk`);
    console.log('');

    // ========== SEED TRANSACTIONS ==========
    console.log('💰 Menambahkan transaksi dummy...');
    let transactionCount = 0;
    
    for (const transaction of dummyTransactions) {
      try {
        await connection.query(
          `INSERT INTO transactions (transaction_number, transaction_date, customer_name, customer_id, description, total_amount, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
           ON DUPLICATE KEY UPDATE 
           customer_name = VALUES(customer_name),
           total_amount = VALUES(total_amount),
           status = VALUES(status)`,
          [
            transaction.transaction_number,
            transaction.transaction_date,
            transaction.customer_name,
            transaction.customer_id,
            transaction.description,
            transaction.total_amount,
            transaction.status
          ]
        );
        transactionCount++;
        console.log(`   ✓ ${transaction.transaction_number} - ${transaction.customer_name} - Rp ${transaction.total_amount.toLocaleString('id-ID')}`);
      } catch (error) {
        console.log(`   ✗ Error: ${transaction.transaction_number} - ${error.message}`);
      }
    }
    
    console.log(`✅ Berhasil menambahkan ${transactionCount} transaksi`);
    console.log('');

    // ========== SUMMARY ==========
    console.log('📊 RINGKASAN:');
    console.log(`   • Produk ditambahkan: ${productCount}`);
    console.log(`   • Transaksi ditambahkan: ${transactionCount}`);
    console.log('');
    
    // Tampilkan statistik
    const [stats] = await connection.query(`
      SELECT 
        (SELECT COUNT(*) FROM products) as total_products,
        (SELECT COUNT(*) FROM transactions) as total_transactions,
        (SELECT COUNT(*) FROM products WHERE stock_quantity <= min_stock) as low_stock_products,
        (SELECT SUM(total_amount) FROM transactions) as total_revenue
    `);
    
    console.log('📈 STATISTIK DATABASE:');
    console.log(`   • Total Produk: ${stats[0].total_products}`);
    console.log(`   • Total Transaksi: ${stats[0].total_transactions}`);
    console.log(`   • Produk Stok Rendah: ${stats[0].low_stock_products}`);
    console.log(`   • Total Revenue: Rp ${(stats[0].total_revenue || 0).toLocaleString('id-ID')}`);
    console.log('');
    
    // Tampilkan kategori produk
    const [categories] = await connection.query(`
      SELECT category, COUNT(*) as count 
      FROM products 
      GROUP BY category
    `);
    
    console.log('📦 KATEGORI PRODUK:');
    categories.forEach(cat => {
      console.log(`   • ${cat.category}: ${cat.count} produk`);
    });
    console.log('');
    
    console.log('🎉 Seeding selesai! Database siap digunakan.');
    console.log('');
    console.log('💡 Tips:');
    console.log('   • Buka aplikasi di browser: http://localhost:5173');
    console.log('   • Login dengan username dan password yang sudah dibuat');
    console.log('   • Lihat dashboard untuk melihat data dummy');
    console.log('   • Produk fokus pada Printer Label dan Kertas Label');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('Pastikan:');
    console.error('1. MySQL server berjalan');
    console.error('2. Database sudah dibuat');
    console.error('3. File .env sudah dikonfigurasi dengan benar');
    console.error('4. Schema database sudah di-import');
  } finally {
    if (connection) {
      await connection.end();
      console.log('');
      console.log('🔌 Koneksi database ditutup.');
    }
  }
}

// Jalankan seeding
console.log('');
console.log('═══════════════════════════════════════════════════');
console.log('   🌱 SEED DATABASE - iware Warehouse System');
console.log('   📦 Printer Label & Kertas Label Edition');
console.log('═══════════════════════════════════════════════════');
console.log('');

seedDatabase();
