# 🛠️ Scripts Directory

Helper scripts untuk development dan deployment.

## Railway Deployment Scripts

### check-railway-ready.js
Mengecek kesiapan aplikasi untuk deploy ke Railway.

```bash
npm run railway:check
```

**Output:**
- ✅ Checklist file-file yang diperlukan
- ⚠️ Warning jika ada yang kurang
- Status kesiapan deployment

### generate-jwt-secret.js
Generate random JWT secret yang aman untuk production.

```bash
npm run railway:jwt
```

**Output:**
- Random 128-character hex string
- Siap copy-paste ke Railway environment variables

### compress-images.js
Script untuk mengkompress gambar dan mengoptimalkan performa web.

```bash
# Install dependency dulu
npm install sharp --save-dev

# Jalankan script
node scripts/compress-images.js
```

**Fitur:**
- Kompress JPG/PNG dengan kualitas optimal (80%)
- Generate versi WebP (lebih ringan 25-35%)
- Auto-resize gambar yang terlalu besar
- Menampilkan statistik kompresi

**Output:**
- Gambar terkompress disimpan di `frontend/public/img/optimized/`
- Versi WebP otomatis dibuat untuk setiap gambar

**Tips:**
- Background images: max 1920x1080px
- Logo images: max 500x500px
- Gunakan WebP untuk browser modern

## Root Scripts (npm commands)

Dari root directory, jalankan:

```bash
# Development
npm run dev              # Run backend + frontend concurrently
npm run server           # Run backend only
npm run client           # Run frontend only

# Installation
npm run install-all      # Install dependencies untuk semua

# Railway
npm run railway:check    # Check deployment readiness
npm run railway:jwt      # Generate JWT secret
```

## Backend Scripts

Dari `backend/` directory:

```bash
npm run dev              # Development dengan nodemon
npm start                # Production mode
npm run generate-password # Generate bcrypt password
npm run seed             # Seed transactions
npm run seed-items       # Seed transaction items
```

## Frontend Scripts

Dari `frontend/` directory:

```bash
npm run dev              # Development server (Vite)
npm run build            # Build untuk production
npm run preview          # Preview production build
npm start                # Build + preview (untuk Railway)
```

## 📝 Notes

- Semua scripts menggunakan Node.js
- Tidak perlu executable permission di Windows
- Scripts di folder ini untuk utility/helper
- Backend/frontend scripts ada di package.json masing-masing
