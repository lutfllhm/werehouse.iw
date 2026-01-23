# Backend Scripts

Kumpulan utility scripts untuk backend iware Warehouse Management System.

## 🔄 Migration Scripts

### migrate.js

**Auto-Migration Script** - Membuat semua tabel database secara otomatis.

**Fitur:**
- ✅ Otomatis dijalankan saat server start
- ✅ Idempotent (aman dijalankan berkali-kali)
- ✅ Skip jika tabel sudah ada
- ✅ Logging progress dan hasil
- ✅ Error handling yang baik

**Cara Kerja:**
1. Membaca file `database/schema.sql`
2. Parse SQL statements
3. Skip CREATE DATABASE dan USE statements
4. Eksekusi setiap CREATE TABLE statement
5. Ignore error "table already exists"
6. Verify jumlah tabel yang berhasil dibuat

**Manual Run:**
```bash
node scripts/migrate.js
```

**Test Migration:**
```bash
node scripts/test-migrate.js
```

### test-migrate.js

Script untuk test migration secara standalone tanpa menjalankan server.

**Usage:**
```bash
cd backend
node scripts/test-migrate.js
```

## 🔐 Security Scripts

### generatePassword.js

Generate bcrypt hash untuk password.

**Usage:**
```bash
node scripts/generatePassword.js
# Masukkan password saat diminta
# Output: bcrypt hash yang bisa disimpan di database
```

**Example:**
```bash
$ node scripts/generatePassword.js
Enter password: iware123
Hashed password: $2a$10$5gF4iUqdF/nnFKjlkz7U8O9awEl3LPuKVjuk9gOFHgYtmzDTHcJCy
```

## 📊 Seeding Scripts

### seedTransactions.js

Generate sample transaction data untuk testing.

**Usage:**
```bash
node scripts/seedTransactions.js
```

**Output:**
- Membuat 10 sample transactions
- Random dates dalam 30 hari terakhir
- Random customer names
- Random amounts
- Random status

### seedTransactionItems.js

Generate sample transaction items untuk testing.

**Usage:**
```bash
node scripts/seedTransactionItems.js
```

**Output:**
- Membuat items untuk setiap transaction
- Random products dari database
- Random quantities
- Calculated subtotals

**Catatan:** Jalankan `seedTransactions.js` terlebih dahulu sebelum `seedTransactionItems.js`

## 🔧 Utility Scripts (Root Level)

### ../scripts/generate-jwt-secret.js

Generate random JWT secret untuk production.

**Usage:**
```bash
node ../scripts/generate-jwt-secret.js
```

**Output:**
```
Generated JWT Secret:
9557793ecf8c57f698c1ff3bcab5301908d8666bba586e91d049bd05d7c8a9bbb4ba7a6951780a3ce6153a63cea85bdde6c4042d877dfbceb459483b38ad542

Copy this to your .env file:
JWT_SECRET=9557793ecf8c57f698c1ff3bcab5301908d8666bba586e91d049bd05d7c8a9bbb4ba7a6951780a3ce6153a63cea85bdde6c4042d877dfbceb459483b38ad542
```

## 📝 Best Practices

### Development

1. **First Time Setup:**
   ```bash
   # 1. Setup database
   mysql -u root -p
   CREATE DATABASE iware_warehouse;
   EXIT;
   
   # 2. Configure .env
   cp .env.example .env
   nano .env
   
   # 3. Start server (migration runs automatically)
   npm start
   ```

2. **Adding Sample Data:**
   ```bash
   node scripts/seedTransactions.js
   node scripts/seedTransactionItems.js
   ```

### Production

1. **Railway/VPS Deployment:**
   - Migration runs automatically on first deploy
   - No manual schema import needed
   - Check logs to verify migration success

2. **Manual Migration (if needed):**
   ```bash
   # Via Railway CLI
   railway run node scripts/migrate.js
   
   # Via SSH on VPS
   cd /var/www/werehouse.iw/backend
   node scripts/migrate.js
   ```

3. **Verify Migration:**
   ```bash
   # Check tables
   mysql -u user -p database -e "SHOW TABLES;"
   
   # Check table count
   mysql -u user -p database -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'iware_warehouse';"
   ```

## 🐛 Troubleshooting

### Migration Failed

**Error: "Cannot find module '../config/database'"**
```bash
# Make sure you're in backend directory
cd backend
node scripts/migrate.js
```

**Error: "Access denied for user"**
```bash
# Check .env file
# Verify DB_USER, DB_PASSWORD, DB_NAME
nano .env
```

**Error: "Unknown database"**
```bash
# Create database first
mysql -u root -p
CREATE DATABASE iware_warehouse;
EXIT;
```

### Seeding Failed

**Error: "No products found"**
```bash
# Make sure products table has data
# Either sync from Accurate or insert manually
mysql -u root -p iware_warehouse
INSERT INTO products (product_name, stock_quantity, price) VALUES ('Sample Product', 100, 50000);
EXIT;
```

## 📚 Related Documentation

- [Main README](../../README.md) - Project overview
- [Deployment Guide](../../DEPLOYMENT.md) - Deployment instructions
- [Changelog](../../CHANGELOG.md) - Version history
- [Database Schema](../../database/schema.sql) - Database structure

---

**Note:** Auto-migration adalah fitur baru di v1.1.0. Untuk versi sebelumnya, schema harus diimport manual.
