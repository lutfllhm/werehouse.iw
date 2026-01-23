/**
 * DATABASE MIGRATION SCRIPT
 * 
 * Script ini akan otomatis membuat semua tabel yang diperlukan
 * jika tabel belum ada di database.
 * 
 * Dijalankan otomatis saat server start.
 */

const db = require('../config/database');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('🔄 Checking database tables...');

    // Baca file schema.sql
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split SQL statements (pisahkan berdasarkan semicolon)
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    // Eksekusi setiap statement
    for (const statement of statements) {
      // Skip CREATE DATABASE dan USE statements
      if (statement.includes('CREATE DATABASE') || statement.includes('USE ')) {
        continue;
      }

      try {
        await db.query(statement);
      } catch (error) {
        // Ignore error jika tabel sudah ada
        if (!error.message.includes('already exists')) {
          console.error('Error executing statement:', error.message);
        }
      }
    }

    console.log('✅ Database migration completed successfully');
    
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
