/**
 * SCRIPT SEED TRANSACTION ITEMS
 * 
 * Script ini akan menambahkan item detail untuk setiap transaksi
 * sehingga grafik produk terlaris bisa ditampilkan
 * 
 * Cara menjalankan:
 * node backend/scripts/seedTransactionItems.js
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function seedTransactionItems() {
  let connection;
  
  try {
    console.log('🔄 Menghubungkan ke database...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('✅ Terhubung ke database!');
    console.log('');

    // Ambil semua transaksi
    const [transactions] = await connection.query('SELECT id, transaction_number FROM transactions ORDER BY id');
    
    // Ambil semua produk
    const [products] = await connection.query('SELECT id, product_name, price FROM products');
    
    if (transactions.length === 0) {
      console.log('❌ Tidak ada transaksi. Jalankan seedTransactions.js terlebih dahulu!');
      return;
    }
    
    if (products.length === 0) {
      console.log('❌ Tidak ada produk. Jalankan seedTransactions.js terlebih dahulu!');
      return;
    }

    console.log(`📦 Menambahkan item untuk ${transactions.length} transaksi...`);
    console.log('');
    
    let itemCount = 0;

    // Untuk setiap transaksi, tambahkan 2-5 item random
    for (const transaction of transactions) {
      const numItems = Math.floor(Math.random() * 4) + 2; // 2-5 items
      const usedProducts = new Set();
      
      console.log(`   Transaksi ${transaction.transaction_number}:`);
      
      for (let i = 0; i < numItems; i++) {
        // Pilih produk random yang belum digunakan di transaksi ini
        let product;
        let attempts = 0;
        do {
          product = products[Math.floor(Math.random() * products.length)];
          attempts++;
        } while (usedProducts.has(product.id) && attempts < 20);
        
        if (usedProducts.has(product.id)) continue;
        usedProducts.add(product.id);
        
        const quantity = Math.floor(Math.random() * 10) + 1; // 1-10 unit
        const unitPrice = parseFloat(product.price);
        const subtotal = quantity * unitPrice;
        
        await connection.query(
          `INSERT INTO transaction_items (transaction_id, product_id, product_name, quantity, unit_price, subtotal)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [transaction.id, product.id, product.product_name, quantity, unitPrice, subtotal]
        );
        
        itemCount++;
        console.log(`      ✓ ${product.product_name} x${quantity} @ Rp ${unitPrice.toLocaleString('id-ID')}`);
      }
      console.log('');
    }
    
    console.log(`✅ Berhasil menambahkan ${itemCount} item transaksi`);
    console.log('');
    
    // Tampilkan statistik
    const [stats] = await connection.query(`
      SELECT 
        COUNT(DISTINCT transaction_id) as transactions_with_items,
        COUNT(*) as total_items,
        SUM(subtotal) as total_value
      FROM transaction_items
    `);
    
    console.log('📊 STATISTIK:');
    console.log(`   • Transaksi dengan items: ${stats[0].transactions_with_items}`);
    console.log(`   • Total items: ${stats[0].total_items}`);
    console.log(`   • Total nilai: Rp ${(stats[0].total_value || 0).toLocaleString('id-ID')}`);
    console.log('');
    
    // Tampilkan top 5 produk terlaris
    const [topProducts] = await connection.query(`
      SELECT 
        p.product_name,
        SUM(ti.quantity) as total_sold,
        SUM(ti.subtotal) as total_revenue
      FROM transaction_items ti
      JOIN products p ON ti.product_id = p.id
      GROUP BY p.id, p.product_name
      ORDER BY total_sold DESC
      LIMIT 5
    `);
    
    console.log('🏆 TOP 5 PRODUK TERLARIS:');
    topProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.product_name}`);
      console.log(`      Terjual: ${product.total_sold} unit`);
      console.log(`      Revenue: Rp ${parseFloat(product.total_revenue).toLocaleString('id-ID')}`);
    });
    console.log('');
    
    console.log('🎉 Seeding transaction items selesai!');
    console.log('💡 Sekarang grafik produk terlaris akan muncul di dashboard');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('');
      console.log('🔌 Koneksi database ditutup.');
    }
  }
}

console.log('');
console.log('═══════════════════════════════════════════════════');
console.log('   🌱 SEED TRANSACTION ITEMS');
console.log('═══════════════════════════════════════════════════');
console.log('');

seedTransactionItems();
