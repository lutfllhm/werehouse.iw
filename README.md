# 🏭 iWare Warehouse Management System

Sistem manajemen gudang modern yang terintegrasi dengan Accurate Online untuk mengelola stok barang, transaksi penjualan, dan penjadwalan pengiriman.

## ✨ Fitur Utama

- 🔐 **Autentikasi & Otorisasi** - Login dengan JWT, role-based access (admin/superadmin)
- 📦 **Manajemen Stok Barang** - Sinkronisasi otomatis dengan Accurate Online
- 🛒 **Manajemen Transaksi** - Pesanan penjualan dengan status tracking
- � **Penjadwalan** - Schedule pengiriman barang
- 📊 **Dashboard & Rekap** - Visualisasi data dan laporan
- 🔄 **Auto-Migration** - Database tables dibuat otomatis saat pertama kali running

## �️ Tech Stack

**Frontend:**
- React.js 18 + Vite
- TailwindCSS untuk styling
- Axios untuk HTTP client
- React Router untuk routing
- Context API untuk state management

**Backend:**
- Node.js + Express.js
- MySQL 8.0+ dengan auto-migration
- JWT untuk authentication
- bcrypt untuk password hashing
- Accurate Online API integration

## 📋 Prerequisites

- Node.js 18.x atau lebih tinggi
- MySQL 8.0 atau lebih tinggi
- npm atau yarn
- Git

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/lutfllhm/werehouse.iw.git
cd werehouse.iw
```

### 2. Setup Database

```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE iware_warehouse;
EXIT;
```

**✨ NEW: Auto-Migration!**

Anda tidak perlu import schema manual lagi! Backend akan otomatis membuat semua tabel saat pertama kali dijalankan.

Jika ingin import manual:
```bash
mysql -u root -p iware_warehouse < database/schema.sql
```

### 3. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env dengan konfigurasi Anda
# Minimal yang perlu diisi:
# - DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
# - JWT_SECRET (generate dengan: node ../scripts/generate-jwt-secret.js)

# Start server
npm start
```

Backend akan:
- ✅ Otomatis membuat tabel jika belum ada
- ✅ Menjalankan server di port 5000
- ✅ Siap menerima request dari frontend

### 4. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

### 5. Login

Default credentials:
- Username: `admin`
- Password: `iware123`

⚠️ **Penting:** Ganti password default setelah login pertama!

## 📁 Struktur Project

```
werehouse.iw/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth middleware
│   ├── routes/          # API routes
│   ├── scripts/         # Utility scripts & migration
│   │   ├── migrate.js   # ✨ Auto-migration script
│   │   └── ...
│   ├── services/        # External API services
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context
│   │   ├── layouts/     # Layout components
│   │   ├── pages/       # Page components
│   │   └── utils/       # Utility functions
│   └── ...
├── database/
│   └── schema.sql       # Database schema
└── scripts/             # Root-level scripts
```

## 🔧 Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=iware_warehouse

# JWT
JWT_SECRET=your_generated_secret
JWT_EXPIRE=7d

# Accurate API (Optional)
ACCURATE_API_URL=https://public-api.accurate.id/api
ACCURATE_CLIENT_ID=
ACCURATE_CLIENT_SECRET=
ACCURATE_ACCESS_TOKEN=
ACCURATE_DATABASE_ID=
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

## 📚 API Documentation

### Authentication

```bash
# Login
POST /api/auth/login
Body: { "username": "admin", "password": "iware123" }

# Get current user
GET /api/auth/me
Headers: { "Authorization": "Bearer <token>" }
```

### Products

```bash
# Get all products
GET /api/products

# Sync from Accurate
POST /api/products/sync
```

### Transactions

```bash
# Get all transactions
GET /api/transactions

# Get transaction by ID
GET /api/transactions/:id

# Sync from Accurate
POST /api/transactions/sync
```

Dokumentasi lengkap: Lihat file di `backend/routes/`

## 🚢 Deployment

### Railway (Recommended)

1. Push code ke GitHub
2. Connect Railway dengan repository
3. Deploy MySQL service
4. Deploy backend service (root: `backend`)
5. Deploy frontend service (root: `frontend`)
6. Set environment variables
7. ✨ Backend akan otomatis membuat tabel saat pertama kali running!

Panduan lengkap: [DEPLOYMENT.md](DEPLOYMENT.md)

### VPS

1. Setup MySQL
2. Clone repository
3. Install dependencies
4. Setup PM2 untuk backend
5. Setup Nginx untuk frontend
6. ✨ Backend akan otomatis membuat tabel saat pertama kali running!

Panduan lengkap: [DEPLOYMENT.md](DEPLOYMENT.md)

## 🧪 Testing

```bash
# Test backend
cd backend
npm test

# Test migration
node scripts/test-migrate.js

# Test database connection
node -e "require('./config/database').query('SELECT 1').then(() => console.log('✅ Connected')).catch(e => console.log('❌ Failed:', e.message))"
```

## 🔄 Database Migration

**✨ Fitur Baru: Auto-Migration**

Backend sekarang dilengkapi dengan auto-migration yang akan:
- ✅ Otomatis membuat semua tabel saat server start
- ✅ Skip jika tabel sudah ada (idempotent)
- ✅ Menampilkan log progress di console
- ✅ Tidak perlu import manual lagi!

**Manual Migration (jika diperlukan):**

```bash
# Import schema
mysql -u root -p iware_warehouse < database/schema.sql

# Atau jalankan script migration
cd backend
node scripts/migrate.js
```

## 📝 Scripts

```bash
# Generate JWT secret
node scripts/generate-jwt-secret.js

# Seed transactions (sample data)
cd backend
node scripts/seedTransactions.js
node scripts/seedTransactionItems.js

# Generate password hash
node scripts/generatePassword.js
```

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 👥 Team

Developed with ❤️ by iware Development Team

## 📧 Support

- 📖 Documentation: Check [DEPLOYMENT.md](DEPLOYMENT.md) and [CONTRIBUTING.md](CONTRIBUTING.md)
- 🐛 Issues: Create an issue in the repository
- 💬 Contact: support@iware.com

## 🔗 Links

- [Changelog](CHANGELOG.md) - Version history
- [TODO](TODO.md) - Planned features
- [Deployment Guide](DEPLOYMENT.md) - Detailed deployment instructions

---

**Made with ❤️ using React.js, Express.js, and MySQL**
