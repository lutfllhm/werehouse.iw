# Setup CORS untuk Vercel Frontend

## Masalah
Ketika frontend di-deploy di Vercel dan backend di Railway, browser akan memblokir request karena CORS (Cross-Origin Resource Sharing).

Error yang muncul:
- "Akses ditolak. Token tidak ditemukan."
- CORS policy error di browser console

## Solusi

### 1. Update Backend Environment Variables di Railway

Tambahkan environment variable berikut di Railway dashboard:

```
ALLOWED_ORIGINS=https://your-app.vercel.app
```

**Untuk support preview deployments Vercel:**
```
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-git-*.vercel.app,https://*.vercel.app
```

Ganti `your-app` dengan nama project Vercel Anda.

### 2. Tambahkan JWT_EXPIRE (jika belum ada)

```
JWT_EXPIRE=7d
```

### 3. Restart Backend

Setelah menambahkan environment variables, Railway akan restart backend otomatis.

## Cara Menambahkan Environment Variable di Railway

1. Buka Railway dashboard
2. Pilih project backend
3. Klik tab "Variables"
4. Klik "New Variable"
5. Masukkan:
   - Name: `ALLOWED_ORIGINS`
   - Value: `https://your-app.vercel.app`
6. Klik "Add"
7. Backend akan restart otomatis

## Testing

Setelah setup:

1. Buka frontend Vercel di browser
2. Buka Developer Tools (F12)
3. Pergi ke tab "Network"
4. Coba login
5. Periksa request ke backend:
   - Status harus 200 (bukan 401 atau 403)
   - Response headers harus ada `Access-Control-Allow-Origin`

## Troubleshooting

### Masih error CORS setelah setup?

1. **Clear browser cache** dan reload
2. **Periksa URL** di environment variable (tidak ada trailing slash)
3. **Periksa console** backend Railway untuk log CORS
4. **Test dengan curl**:
   ```bash
   curl -H "Origin: https://your-app.vercel.app" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        https://your-backend.railway.app/api/auth/login
   ```

### Error "Token tidak valid"

Ini bukan masalah CORS, tapi masalah JWT:
- Periksa `JWT_SECRET` sama di semua environment
- Periksa token tidak expired
- Clear localStorage di browser: `localStorage.clear()`

### Preview deployments Vercel tidak bisa login

Tambahkan wildcard di `ALLOWED_ORIGINS`:
```
ALLOWED_ORIGINS=https://your-app.vercel.app,https://*.vercel.app
```

## Konfigurasi Backend yang Sudah Diperbaiki

File `backend/server.js` sudah diupdate dengan:
- Support multiple origins
- Support regex pattern untuk wildcard
- Handle preflight OPTIONS requests
- Proper CORS headers (credentials, methods, headers)

Tidak perlu edit code lagi, cukup tambahkan environment variable di Railway.
