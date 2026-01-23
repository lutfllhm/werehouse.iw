# Migration Fix untuk Railway

## Masalah

Migration gagal di Railway dengan error:
```
Migration failed: ENOENT: no such file or directory, open '/database/schema.sql'
```

## Penyebab

Railway memiliki struktur folder yang berbeda saat deployment. File `database/schema.sql` tidak dapat ditemukan dengan path relatif.

## Solusi

Dibuat script migration baru dengan **embedded schema** yang tidak bergantung pada file eksternal:

### File: `backend/scripts/migrate-embedded.js`

**Keuntungan:**
- ✅ Schema SQL di-embed langsung di script
- ✅ Tidak bergantung pada file eksternal
- ✅ Bekerja di semua environment (local, Railway, VPS)
- ✅ Lebih reliable dan portable
- ✅ Include seed data (company_info & default admin)

**Fitur:**
- Membuat 7 tabel: users, company_info, products, transactions, transaction_items, schedules, accurate_sync_log
- Insert default company info
- Insert default admin user (username: admin, password: iware123)
- Menggunakan `CREATE TABLE IF NOT EXISTS` (idempotent)
- Menggunakan `INSERT IGNORE` untuk seed data (tidak error jika sudah ada)

## Deployment ke Railway

1. **Commit & Push:**
   ```bash
   git add .
   git commit -m "fix: use embedded schema for migration to fix Railway deployment"
   git push origin main
   ```

2. **Railway akan otomatis:**
   - Detect perubahan
   - Redeploy backend
   - Jalankan migration dengan embedded schema
   - Membuat semua tabel

3. **Verify di Railway:**
   - Buka Deploy Logs
   - Cari log:
     ```
     🔄 Checking database tables...
     ✅ Database tables created successfully
     ✅ Seed data inserted successfully
     📊 Total tables: 7
     ```

4. **Cek MySQL Database:**
   - Buka MySQL service di Railway
   - Klik tab "Database"
   - Seharusnya sudah ada 7 tabel

## Testing Lokal

```bash
cd backend

# Test migration standalone
node scripts/migrate-embedded.js

# Atau start server (migration otomatis)
npm start
```

## Rollback (jika diperlukan)

Jika ingin kembali ke file-based migration:

```javascript
// Di server.js, ganti:
const runMigration = require('./scripts/migrate-embedded');

// Menjadi:
const runMigration = require('./scripts/migrate');
```

## Catatan

- Script lama (`migrate.js`) masih ada sebagai backup
- Embedded migration adalah solusi yang lebih reliable untuk production
- Seed data hanya insert jika belum ada (menggunakan INSERT IGNORE)

## Troubleshooting

### Error: "Table already exists"
Ini normal dan akan di-ignore oleh script.

### Error: "Duplicate entry"
Ini normal untuk seed data dan akan di-ignore.

### Error: "Access denied"
Check environment variables di Railway:
- DB_HOST
- DB_USER
- DB_PASSWORD
- DB_NAME

### Tabel masih kosong setelah deploy
1. Check Deploy Logs untuk error
2. Restart backend service di Railway
3. Check MySQL credentials di Variables tab

## Next Steps

Setelah migration berhasil:
1. ✅ Tabel otomatis dibuat
2. ✅ Default admin user tersedia
3. ✅ Company info sudah terisi
4. 🔐 Login dengan: username `admin`, password `iware123`
5. 🔄 Sync products & transactions dari Accurate (jika sudah setup API)

---

**Update:** 23 Jan 2026
**Status:** ✅ Fixed
