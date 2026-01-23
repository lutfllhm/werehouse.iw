# 🏭 iware Warehouse Management System

> Aplikasi manajemen gudang profesional dan interaktif yang terintegrasi dengan Accurate Online

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-5.7+-orange.svg)](https://www.mysql.com/)

## ✨ Fitur Utama

### 🌐 Dashboard Public
- ✅ Informasi perusahaan lengkap (Visi, Misi, Deskripsi)
- ✅ Halaman landing yang menarik dan responsive
- ✅ Form login untuk admin

### 📊 Dashboard Analytics
- ✅ Statistics cards (Total Produk, Transaksi, Stok Rendah)
- ✅ Grafik transaksi bulanan (Line Chart)
- ✅ Distribusi status transaksi (Pie Chart)
- ✅ Tabel transaksi terbaru

### 📦 Stok Barang
- ✅ Manajemen produk dengan pagination
- ✅ Sinkronisasi real-time dari Accurate Online
- ✅ Alert stok rendah
- ✅ Search dan filter produk

### 💰 Transaksi
- ✅ Pesanan penjualan dari Accurate Online
- ✅ Status management dengan color coding (🔴 🟡 🟢)
- ✅ Verifikasi transaksi
- ✅ Search dan filter

### 📅 Schedule
- ✅ Jadwal pengiriman/proses
- ✅ Visual color indicator
- ✅ Filter berdasarkan status

### 📈 Rekap
- ✅ Rekap transaksi terverifikasi
- ✅ Export ke Excel
- ✅ Filter per bulan/tahun
- ✅ Summary statistics

## 🛠 Tech Stack

### Frontend
- **React.js 18** - UI Framework
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Recharts** - Charts & Graphs
- **React Router DOM** - Routing
- **Axios** - HTTP Client

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MySQL2** - Database Driver
- **JWT** - Authentication
- **Bcrypt** - Password Hashing
- **ExcelJS** - Excel Export

### Integration
- **Accurate Online API** - ERP Integration

## 🚀 Quick Start

### Prerequisites
- Node.js v16 or higher
- MySQL 5.7 or higher
- npm or yarn

### Installation (5 minutes)

1. **Install dependencies**
```bash
npm run install-all
```

2. **Setup database**
```bash
mysql -u root -p < database/schema.sql
```

3. **Configure environment** (files already created with defaults)
```bash
# Backend: backend/.env (edit if needed)
# Frontend: frontend/.env (ready to use)
```

4. **Run application**
```bash
npm run dev
```

5. **Access application**
- Frontend: http://localhost:5173
- Login: http://localhost:5173/login
  - Username: `admin`
  - Password: `admin123`

6. **Setup Background Image & Logo (Optional)**
```bash
# Place your files at:
# frontend/public/img/bg.jpeg (background)
# frontend/public/img/logo.png (company logo)
# See BACKGROUND_IMAGE_GUIDE.md and LOGO_SETUP_GUIDE.md
```

📖 **Detailed Guide**: See [QUICK_START.md](QUICK_START.md) for step-by-step instructions

## Access
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Admin Login: http://localhost:5173/login
  - Username: `admin`
  - Password: `admin123`

## Fitur Lengkap

### Dashboard Public
- Informasi perusahaan (Visi, Misi, Deskripsi)
- Bidang usaha
- Halaman login

### Dashboard Admin
- **Dashboard Analytics**: Grafik dan diagram statistik
  - Total produk, transaksi, stok rendah
  - Grafik transaksi bulanan
  - Distribusi status transaksi
  - Transaksi terbaru
  
- **Stok Barang**: 
  - Daftar produk dengan stok
  - Sinkronisasi dari Accurate Online
  - Search dan filter produk
  - Alert stok rendah
  
- **Transaksi**:
  - Daftar pesanan penjualan
  - Sinkronisasi dari Accurate Online
  - Update status (Menunggu Proses, Sebagian Terproses, Terproses)
  - Verifikasi transaksi
  - Color coding status (Merah, Kuning, Hijau)
  
- **Schedule**:
  - Jadwal dari transaksi
  - Filter berdasarkan status
  - Visual color indicator
  
- **Rekap**:
  - Rekap transaksi terverifikasi per bulan
  - Export ke Excel
  - Summary total transaksi dan nilai

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [QUICK_START.md](QUICK_START.md) | 5-minute setup guide |
| [INSTALLATION.md](INSTALLATION.md) | Detailed installation guide |
| [API_DOCUMENTATION.md](API_DOCUMENTATION.md) | Complete API reference |
| [FEATURES.md](FEATURES.md) | Full feature list |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Production deployment guide |
| [RAILWAY_SETUP.md](RAILWAY_SETUP.md) | 🚂 Railway deployment (15 min) |
| [RAILWAY_CHEATSHEET.md](RAILWAY_CHEATSHEET.md) | Railway quick reference |
| [RAILWAY_VISUAL_GUIDE.md](RAILWAY_VISUAL_GUIDE.md) | Visual deployment guide |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Code structure overview |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |
| [CHANGELOG.md](CHANGELOG.md) | Version history |
| [TODO.md](TODO.md) | Future enhancements |
| [SUMMARY.md](SUMMARY.md) | Project summary |
| [BACKGROUND_IMAGE_GUIDE.md](BACKGROUND_IMAGE_GUIDE.md) | Background image setup |
| [LOGO_SETUP_GUIDE.md](LOGO_SETUP_GUIDE.md) | Logo setup & customization |
| [COLOR_CUSTOMIZATION_GUIDE.md](COLOR_CUSTOMIZATION_GUIDE.md) | Color theme customization |

## 🚀 Deployment

### Railway (Recommended)
Deploy aplikasi ini ke Railway dalam 15 menit:

```bash
# Check kesiapan deployment
npm run railway:check

# Generate JWT secret
npm run railway:jwt
```

📖 **Panduan Lengkap**: 
- [RAILWAY_SETUP.md](RAILWAY_SETUP.md) - Quick setup 15 menit
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Step-by-step checklist
- [DEPLOYMENT_INDEX.md](DEPLOYMENT_INDEX.md) - Index semua dokumentasi

### Manual Deployment
Lihat [DEPLOYMENT.md](DEPLOYMENT.md) untuk deployment ke VPS atau platform lain.

## 🔧 Utilities

### Generate Password Hash
```bash
cd backend
npm run generate-password your_password_here
```

### Database Backup
```bash
mysqldump -u root -p iware_warehouse > backup.sql
```

## 🎯 Project Status

- ✅ **Version**: 1.0.0
- ✅ **Status**: Production Ready
- ✅ **Last Updated**: January 22, 2024

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 👥 Team

Developed with ❤️ by iware Development Team

## 📧 Support

- 📖 Documentation: Check the docs folder
- 🐛 Issues: Create an issue in the repository
- 💬 Contact: support@iware.com

---

**Made with ❤️ using React.js, Express.js, and MySQL**
