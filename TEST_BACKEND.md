# Test Backend dari Browser

Buka browser console (F12) dan jalankan script ini untuk test backend:

## 1. Test Health Check

```javascript
fetch('https://werehouse-iw-up.railway.app/api/health')
  .then(r => r.json())
  .then(d => console.log('Health:', d))
  .catch(e => console.error('Error:', e));
```

## 2. Test Login (tanpa token)

```javascript
fetch('https://werehouse-iw-up.railway.app/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
})
  .then(r => r.json())
  .then(d => {
    console.log('Login response:', d);
    if (d.token) {
      localStorage.setItem('token', d.token);
      console.log('Token saved!');
    }
  })
  .catch(e => console.error('Login error:', e));
```

## 3. Clear localStorage

Jika masih error, clear localStorage dulu:

```javascript
localStorage.clear();
console.log('localStorage cleared');
```

Lalu coba login lagi.

## 4. Test dengan CURL

Dari command line:

```bash
# Test health
curl https://werehouse-iw-up.railway.app/api/health

# Test login
curl -X POST https://werehouse-iw-up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## Expected Results

**Health check:**
```json
{
  "status": "OK",
  "message": "iware API is running",
  "timestamp": "2024-..."
}
```

**Login success:**
```json
{
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "full_name": "Administrator",
    "email": "admin@iware.com",
    "role": "admin"
  }
}
```

**Login failed (wrong password):**
```json
{
  "message": "Username atau password salah"
}
```

## Troubleshooting

Jika masih error 401:
1. Pastikan backend Railway sudah running
2. Pastikan database sudah di-migrate
3. Pastikan user admin sudah ada di database
4. Check Railway logs untuk error message
