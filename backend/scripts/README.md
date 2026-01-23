# Scripts untuk Database Seeding

## 📝 Daftar Script

### 1. generatePassword.js
Generate hash password untuk user baru.

```bash
npm run generate-password
```

### 2. seedTransactions.js
Menambahkan data dummy produk dan transaksi.

```bash
npm run seed
```

**Data yang ditambahkan:**
- 15 Produk (Printer Label, Kertas Label, Ribbon)
- 10 Transaksi dengan berbagai status

### 3. seedTransactionItems.js
Menambahkan detail item untuk setiap transaksi (diperlukan untuk grafik produk terlaris).

```bash
npm run seed-items
```

**Data yang ditambahkan:**
- 2-5 item random untuk setiap transaksi
- Quantity dan harga otomatis

## 🚀 Cara Penggunaan

### Setup Awal (Database Kosong)

1. **Import schema database:**
   ```bash
   mysql -u root -p iware_warehouse < database/schema.sql
   ```

2. **Seed produk dan transaksi:**
   ```bash
   cd backend
   npm run seed
   ```

3. **Seed transaction items (untuk grafik):**
   ```bash
   npm run seed-items
   ```

4. **Jalankan aplikasi:**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Login:**
   - URL: http://localhost:5173
   - Username: `admin`
   - Password: `iware123`

## 📊 Grafik Dashboard

Setelah menjalankan `seed-items`, dashboard akan menampilkan:
- ✅ Transaksi Bulanan (Line Chart)
- ✅ Pendapatan Bulanan (Bar Chart)
- ✅ Distribusi Status Transaksi (Pie Chart)
- ✅ Produk Terlaris (Horizontal Bar Chart)

## ⚠️ Catatan

- Jalankan `seed` terlebih dahulu sebelum `seed-items`
- Script `seed-items` memerlukan data transaksi dan produk yang sudah ada
- Jika grafik tidak muncul, pastikan sudah menjalankan `seed-items`
