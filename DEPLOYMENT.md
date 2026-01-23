# 📦 Panduan Deployment iWare Warehouse Management System

Panduan lengkap dan detail untuk deploy aplikasi iWare ke berbagai platform: Railway (PaaS), VPS, dan Vercel + Railway. Dokumentasi ini mencakup setup MySQL/phpMyAdmin secara menyeluruh.

---

## 🎯 Arsitektur Aplikasi

```
┌─────────────┐      ┌─────────────┐      ┌──────────────────┐
│  Frontend   │─────▶│   Backend   │─────▶│  MySQL Database  │
│  (Vite)     │      │  (Node.js)  │      │  + phpMyAdmin    │
│  Port: 5173 │      │  Port: 5000 │      │  Port: 3306/80   │
└─────────────┘      └─────────────┘      └──────────────────┘
```

**Tech Stack:**
- Frontend: React + Vite + TailwindCSS
- Backend: Node.js + Express + JWT
- Database: MySQL 8.0+ dengan phpMyAdmin untuk management
- External API: Accurate Online (optional)

**Database Schema:**
- 8 Tables: users, company_info, products, transactions, transaction_items, schedules, accurate_sync_log
- Relational structure dengan foreign keys
- Support untuk role-based access (admin, superadmin)
- Automatic timestamps dan audit trail

---

## 🚀 Metode 1: Deploy ke Railway (Recommended)

Railway adalah platform PaaS yang mudah digunakan dengan auto-deployment dari GitHub.

### Langkah 1: Persiapan Akun Railway

1. Buka https://railway.app
2. Klik **"Start a New Project"**
3. Login dengan **GitHub account**
4. Authorize Railway untuk akses repository

### Langkah 2: Deploy MySQL Database

1. Di Railway dashboard, klik **"New Project"**
2. Pilih **"Provision MySQL"**
3. Tunggu hingga MySQL service aktif
4. Railway otomatis generate credentials:
   - `MYSQLHOST`
   - `MYSQLPORT` 
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`
   - `MYSQL_URL`

### Langkah 3: Import Database Schema

Railway MySQL tidak menyediakan phpMyAdmin secara default, tapi Anda bisa import schema dengan beberapa cara:

**Opsi A: Menggunakan Railway CLI (Recommended)**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link ke project
railway link

# Connect ke MySQL
railway connect MySQL

# Import schema (di MySQL prompt)
source database/schema.sql
# atau
\. database/schema.sql

# Verify tables created
SHOW TABLES;
SHOW CREATE TABLE users;
SELECT * FROM company_info;

# Exit
EXIT;
```

**Opsi B: Menggunakan MySQL Client dari Local**

```bash
# Ambil credentials dari Railway dashboard
# Variables tab: MYSQLHOST, MYSQLPORT, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE

# Import schema
mysql -h <MYSQLHOST> -P <MYSQLPORT> -u <MYSQLUSER> -p<MYSQLPASSWORD> <MYSQLDATABASE> < database/schema.sql

# Verify
mysql -h <MYSQLHOST> -P <MYSQLPORT> -u <MYSQLUSER> -p<MYSQLPASSWORD> <MYSQLDATABASE> -e "SHOW TABLES;"
```

**Opsi C: Menggunakan MySQL Workbench (GUI)**

1. Download dan install [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
2. Buka MySQL Workbench
3. Klik **"+"** untuk Create New Connection
4. Masukkan credentials dari Railway:
   - Connection Name: `Railway iWare`
   - Hostname: `<MYSQLHOST>`
   - Port: `<MYSQLPORT>`
   - Username: `<MYSQLUSER>`
   - Password: Klik "Store in Keychain" → masukkan `<MYSQLPASSWORD>`
5. Test Connection → OK
6. Double-click connection untuk connect
7. File → Open SQL Script → pilih `database/schema.sql`
8. Klik Execute (⚡ icon)
9. Verify: Klik "Schemas" tab → refresh → lihat tables

**Opsi D: Menggunakan phpMyAdmin (Setup Sendiri)**

Railway tidak menyediakan phpMyAdmin, tapi Anda bisa deploy phpMyAdmin sebagai service terpisah:

```bash
# Di Railway project, tambah service baru
# New Service → Docker Image

# Image: phpmyadmin/phpmyadmin:latest

# Environment Variables:
PMA_HOST=${{MySQL.MYSQLHOST}}
PMA_PORT=${{MySQL.MYSQLPORT}}
PMA_USER=${{MySQL.MYSQLUSER}}
PMA_PASSWORD=${{MySQL.MYSQLPASSWORD}}

# Generate domain untuk akses phpMyAdmin
# Settings → Networking → Generate Domain
```

Setelah phpMyAdmin running:
1. Akses URL phpMyAdmin
2. Login dengan credentials MySQL
3. Pilih database
4. Import → Choose File → `schema.sql` → Go

### Langkah 4: Deploy Backend Service

1. Di Railway project, klik **"New Service"**
2. Pilih **"GitHub Repo"**
3. Pilih repository **`werehouse.iw`**
4. Klik **"Add Service"**


**Configure Backend Service:**

1. Klik service yang baru dibuat
2. Go to **Settings** → **Service Settings**
3. Set **Root Directory**: `backend`
4. Set **Start Command**: `node server.js` (optional, auto-detect)

**Set Environment Variables:**

Go to **Variables** tab, tambahkan:

```env
# Server
PORT=${{PORT}}
NODE_ENV=production

# Database - Reference dari MySQL service
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=${{MySQL.MYSQLDATABASE}}

# JWT - Generate secret baru!
JWT_SECRET=<paste-generated-secret-here>
JWT_EXPIRE=7d

# Accurate API (Optional - isi jika punya akun)
ACCURATE_API_URL=https://public-api.accurate.id/api
ACCURATE_CLIENT_ID=
ACCURATE_CLIENT_SECRET=
ACCURATE_ACCESS_TOKEN=
ACCURATE_DATABASE_ID=
```

**Generate JWT Secret:**

```bash
# Di terminal lokal
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy output dan paste ke `JWT_SECRET`.

**Generate Public Domain:**

1. Go to **Settings** → **Networking**
2. Klik **"Generate Domain"**
3. Copy URL (contoh: `backend-production-abc123.up.railway.app`)
4. **Simpan URL ini untuk frontend!**

### Langkah 5: Deploy Frontend Service

1. Di Railway project yang sama, klik **"New Service"**
2. Pilih **"GitHub Repo"**
3. Pilih repository **`werehouse.iw`** (sama dengan backend)
4. Klik **"Add Service"**

**Configure Frontend Service:**

1. Klik service yang baru dibuat
2. Go to **Settings** → **Service Settings**
3. Set **Root Directory**: `frontend`
4. Set **Build Command**: `npm run build` (auto-detect)
5. Set **Start Command**: `npm run preview` (auto-detect)

**Set Environment Variables:**

Go to **Variables** tab, tambahkan:

```env
# Backend API URL - ganti dengan URL backend Railway
VITE_API_URL=https://backend-production-abc123.up.railway.app/api
```

**Atau gunakan Railway reference (lebih dinamis):**

```env
VITE_API_URL=https://${{Backend.RAILWAY_PUBLIC_DOMAIN}}/api
```

**Generate Public Domain:**

1. Go to **Settings** → **Networking**
2. Klik **"Generate Domain"**
3. Copy URL (contoh: `frontend-production-xyz789.up.railway.app`)

### Langkah 6: Verifikasi Deployment

**Test Backend API:**

```bash
# Health check
curl https://backend-production-abc123.up.railway.app/api/health

# Test login endpoint
curl -X POST https://backend-production-abc123.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your_password"}'
```

**Test Frontend:**

1. Buka browser
2. Akses `https://frontend-production-xyz789.up.railway.app`
3. Coba login dengan credentials yang ada di database

### Langkah 7: Setup Auto-Deployment

Railway otomatis deploy saat ada push ke GitHub:

```bash
# Di local
git add .
git commit -m "Update feature"
git push origin main

# Railway akan otomatis:
# 1. Detect changes
# 2. Build ulang
# 3. Deploy otomatis
```

### Langkah 8: Monitoring & Logs

**View Logs:**
- Klik service → **Deployments** → pilih deployment → **View Logs**

**View Metrics:**
- Klik service → **Metrics** untuk CPU, Memory, Network usage

**Railway CLI:**

```bash
# View logs real-time
railway logs --service backend

# View logs frontend
railway logs --service frontend
```

---

## 🖥️ Metode 2: Deploy ke VPS (Ubuntu)

Untuk kontrol penuh dan custom configuration.

### Langkah 1: Persiapan Server

**Minimum Requirements:**
- Ubuntu 20.04 LTS atau 22.04 LTS
- 2 CPU cores
- 2GB RAM
- 20GB Storage
- Public IP address

**SSH ke Server:**

```bash
ssh root@your-server-ip
```

### Langkah 2: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # v18.x.x
npm --version   # 9.x.x

# Install MySQL 8.0
sudo apt install -y mysql-server

# Secure MySQL installation
sudo mysql_secure_installation
# - Set root password
# - Remove anonymous users: Y
# - Disallow root login remotely: Y
# - Remove test database: Y
# - Reload privilege tables: Y

# Install Nginx
sudo apt install -y nginx

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

### Langkah 3: Setup MySQL Database

**Install MySQL 8.0:**

```bash
# Update package list
sudo apt update

# Install MySQL Server
sudo apt install -y mysql-server

# Check MySQL status
sudo systemctl status mysql

# Enable MySQL on boot
sudo systemctl enable mysql

# Verify installation
mysql --version  # mysql  Ver 8.0.x
```

**Secure MySQL Installation:**

```bash
sudo mysql_secure_installation

# Pertanyaan yang akan muncul:
# 1. VALIDATE PASSWORD COMPONENT? → Y (recommended)
# 2. Password validation policy → 1 (MEDIUM) atau 2 (STRONG)
# 3. Set root password → Masukkan password yang kuat
# 4. Remove anonymous users? → Y
# 5. Disallow root login remotely? → Y (untuk security)
# 6. Remove test database? → Y
# 7. Reload privilege tables? → Y
```

**Konfigurasi MySQL untuk Production:**

```bash
# Edit MySQL config
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

Tambahkan/edit konfigurasi berikut:

```ini
[mysqld]
# Basic Settings
user                    = mysql
pid-file                = /var/run/mysqld/mysqld.pid
socket                  = /var/run/mysqld/mysqld.sock
port                    = 3306
datadir                 = /var/lib/mysql

# Character Set
character-set-server    = utf8mb4
collation-server        = utf8mb4_unicode_ci

# Connection Settings
max_connections         = 200
max_connect_errors      = 100
connect_timeout         = 10
wait_timeout            = 600
max_allowed_packet      = 64M

# Query Cache (disabled in MySQL 8.0+, but good to know)
# query_cache_type      = 1
# query_cache_size      = 32M

# InnoDB Settings
innodb_buffer_pool_size = 256M  # 70% of RAM for dedicated DB server
innodb_log_file_size    = 64M
innodb_flush_method     = O_DIRECT
innodb_file_per_table   = 1

# Logging
log_error               = /var/log/mysql/error.log
slow_query_log          = 1
slow_query_log_file     = /var/log/mysql/slow-query.log
long_query_time         = 2

# Binary Logging (untuk backup/replication)
log_bin                 = /var/log/mysql/mysql-bin.log
expire_logs_days        = 7
max_binlog_size         = 100M

# Security
local_infile            = 0
```

```bash
# Restart MySQL untuk apply config
sudo systemctl restart mysql

# Check status
sudo systemctl status mysql
```

**Buat Database dan User:**

```bash
# Login ke MySQL sebagai root
sudo mysql -u root -p
# Masukkan password root yang tadi dibuat
```

Di MySQL prompt:

```sql
-- Buat database dengan charset utf8mb4
CREATE DATABASE iware_warehouse 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

-- Buat user khusus untuk aplikasi
CREATE USER 'iware_user'@'localhost' 
  IDENTIFIED BY 'StrongPassword123!@#';

-- Grant privileges (hanya yang diperlukan)
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX, ALTER 
  ON iware_warehouse.* 
  TO 'iware_user'@'localhost';

-- Jika backend di server berbeda, buat user untuk remote access
CREATE USER 'iware_user'@'%' 
  IDENTIFIED BY 'StrongPassword123!@#';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX, ALTER 
  ON iware_warehouse.* 
  TO 'iware_user'@'%';

-- Apply changes
FLUSH PRIVILEGES;

-- Verify user created
SELECT User, Host FROM mysql.user WHERE User = 'iware_user';

-- Verify database created
SHOW DATABASES LIKE 'iware%';

-- Exit
EXIT;
```

**Test Connection:**

```bash
# Test dengan user baru
mysql -u iware_user -p iware_warehouse
# Masukkan password: StrongPassword123!@#

# Di MySQL prompt, test:
SHOW TABLES;  # Masih kosong
SELECT DATABASE();  # iware_warehouse
EXIT;
```

**Allow Remote Connection (jika diperlukan):**

```bash
# Edit MySQL config
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Comment atau ubah bind-address
# bind-address = 127.0.0.1  # Hanya local
bind-address = 0.0.0.0      # Allow remote

# Restart MySQL
sudo systemctl restart mysql

# Allow port di firewall
sudo ufw allow 3306/tcp
```

⚠️ **Security Warning:** Hanya allow remote connection jika benar-benar diperlukan. Gunakan firewall rules untuk restrict IP yang bisa akses.

### Langkah 4: Install dan Setup phpMyAdmin

phpMyAdmin adalah web interface untuk manage MySQL database dengan mudah.

**Install phpMyAdmin:**

```bash
# Install phpMyAdmin
sudo apt install -y phpmyadmin

# Saat instalasi, akan muncul beberapa pertanyaan:
# 1. Web server to configure: pilih "apache2" (tekan Space, Enter)
#    Jika pakai Nginx, pilih "None" (kita config manual)
# 2. Configure database with dbconfig-common? → No
```

**Konfigurasi phpMyAdmin untuk Nginx:**

```bash
# Create symbolic link
sudo ln -s /usr/share/phpmyadmin /var/www/phpmyadmin

# Install PHP dan extensions yang diperlukan
sudo apt install -y php-fpm php-mysql php-mbstring php-zip php-gd php-json php-curl

# Check PHP version
php -v  # PHP 8.x

# Enable PHP extensions
sudo phpenmod mbstring

# Restart PHP-FPM
sudo systemctl restart php8.1-fpm  # Sesuaikan dengan versi PHP Anda
```

**Konfigurasi Nginx untuk phpMyAdmin:**

```bash
# Buat config untuk phpMyAdmin
sudo nano /etc/nginx/sites-available/phpmyadmin
```

Paste konfigurasi berikut:

```nginx
server {
    listen 80;
    server_name pma.yourdomain.com;  # Ganti dengan subdomain Anda
    
    root /usr/share/phpmyadmin;
    index index.php index.html index.htm;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/phpmyadmin_access.log;
    error_log /var/log/nginx/phpmyadmin_error.log;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;  # Sesuaikan versi PHP
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }

    # Disable access to setup directory
    location ~ ^/setup/ {
        deny all;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/phpmyadmin /etc/nginx/sites-enabled/

# Test nginx config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

**Konfigurasi phpMyAdmin:**

```bash
# Backup config original
sudo cp /etc/phpmyadmin/config.inc.php /etc/phpmyadmin/config.inc.php.backup

# Edit config
sudo nano /etc/phpmyadmin/config.inc.php
```

Tambahkan/edit konfigurasi:

```php
<?php
// Blowfish secret untuk cookie encryption (32 karakter random)
$cfg['blowfish_secret'] = 'GENERATE_32_CHAR_RANDOM_STRING_HERE';

// Server configuration
$i = 0;
$i++;
$cfg['Servers'][$i]['auth_type'] = 'cookie';
$cfg['Servers'][$i]['host'] = 'localhost';
$cfg['Servers'][$i]['compress'] = false;
$cfg['Servers'][$i]['AllowNoPassword'] = false;

// Directories
$cfg['UploadDir'] = '';
$cfg['SaveDir'] = '';

// Security settings
$cfg['LoginCookieValidity'] = 3600;  // 1 hour
$cfg['LoginCookieStore'] = 0;
$cfg['LoginCookieDeleteAll'] = true;

// UI settings
$cfg['MaxRows'] = 50;
$cfg['ProtectBinary'] = 'blob';
$cfg['DefaultLang'] = 'en';
$cfg['ServerDefault'] = 1;
$cfg['VersionCheck'] = false;

// Import/Export settings
$cfg['ExecTimeLimit'] = 300;
$cfg['MemoryLimit'] = '512M';
?>
```

**Generate Blowfish Secret:**

```bash
# Generate 32 char random string
openssl rand -base64 32

# Copy output dan paste ke config.inc.php
```

**Set Permissions:**

```bash
# Set proper permissions
sudo chown -R www-data:www-data /usr/share/phpmyadmin
sudo chmod -R 755 /usr/share/phpmyadmin

# Secure config file
sudo chmod 640 /etc/phpmyadmin/config.inc.php
sudo chown root:www-data /etc/phpmyadmin/config.inc.php
```

**Test phpMyAdmin:**

1. Buka browser
2. Akses `http://pma.yourdomain.com` atau `http://your-server-ip/phpmyadmin`
3. Login dengan:
   - Username: `iware_user`
   - Password: `StrongPassword123!@#`
4. Atau login sebagai root untuk full access

**Secure phpMyAdmin dengan Password Protection (Optional tapi Recommended):**

```bash
# Install apache2-utils untuk htpasswd
sudo apt install -y apache2-utils

# Create password file
sudo htpasswd -c /etc/nginx/.htpasswd phpmyadmin_user
# Masukkan password

# Edit nginx config
sudo nano /etc/nginx/sites-available/phpmyadmin
```

Tambahkan di dalam `server` block:

```nginx
    location / {
        auth_basic "Restricted Access";
        auth_basic_user_file /etc/nginx/.htpasswd;
        try_files $uri $uri/ =404;
    }
```

```bash
# Restart nginx
sudo systemctl restart nginx
```

Sekarang phpMyAdmin akan meminta username/password tambahan sebelum bisa akses login page.

### Langkah 5: Clone Repository

```bash
# Buat directory untuk aplikasi
sudo mkdir -p /var/www
cd /var/www

# Clone repository
sudo git clone https://github.com/lutfllhm/werehouse.iw.git
cd werehouse.iw

# Set ownership
sudo chown -R $USER:$USER /var/www/werehouse.iw
```

### Langkah 6: Import Database Schema

**Opsi A: Via Command Line (Recommended)**

```bash
cd /var/www/werehouse.iw

# Import schema
mysql -u iware_user -p iware_warehouse < database/schema.sql
# Masukkan password: StrongPassword123!@#

# Verify tables created
mysql -u iware_user -p iware_warehouse -e "SHOW TABLES;"

# Expected output:
# +----------------------------+
# | Tables_in_iware_warehouse  |
# +----------------------------+
# | accurate_sync_log          |
# | company_info               |
# | products                   |
# | schedules                  |
# | transaction_items          |
# | transactions               |
# | users                      |
# +----------------------------+

# Check default data
mysql -u iware_user -p iware_warehouse -e "SELECT * FROM company_info;"
mysql -u iware_user -p iware_warehouse -e "SELECT username, role FROM users;"
```

**Opsi B: Via phpMyAdmin (GUI)**

1. Buka phpMyAdmin di browser
2. Login dengan `iware_user`
3. Klik database `iware_warehouse` di sidebar kiri
4. Klik tab **"Import"**
5. Klik **"Choose File"** → pilih `database/schema.sql`
6. Scroll ke bawah, klik **"Go"**
7. Tunggu hingga selesai (akan muncul pesan sukses)
8. Klik tab **"Structure"** untuk verify tables
9. Klik table **"users"** → **"Browse"** untuk lihat default admin user

**Verify Database Structure:**

Di phpMyAdmin:
- **Structure tab**: Lihat semua tables (7 tables)
- **SQL tab**: Jalankan query test:
  ```sql
  SELECT COUNT(*) as total_tables 
  FROM information_schema.tables 
  WHERE table_schema = 'iware_warehouse';
  -- Expected: 7
  
  SELECT * FROM company_info;
  -- Expected: 1 row dengan data iware
  
  SELECT username, email, role FROM users;
  -- Expected: 1 row (admin user)
  ```

### Langkah 7: Setup Backend

```bash
cd /var/www/werehouse.iw/backend

# Install dependencies
npm install --production

# Setup environment variables
cp .env.example .env
nano .env
```

**Edit `.env` file:**

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=iware_user
DB_PASSWORD=StrongPassword123!@#
DB_NAME=iware_warehouse

# Database Connection Pool Settings (optional, tapi recommended)
DB_CONNECTION_LIMIT=10
DB_QUEUE_LIMIT=0

# JWT Configuration
JWT_SECRET=<paste-generated-secret-here>
JWT_EXPIRE=7d

# Accurate API Configuration (Optional - isi jika punya akun)
ACCURATE_API_URL=https://public-api.accurate.id/api
ACCURATE_CLIENT_ID=
ACCURATE_CLIENT_SECRET=
ACCURATE_ACCESS_TOKEN=
ACCURATE_DATABASE_ID=

# Logging (optional)
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

**Generate JWT Secret:**

```bash
# Method 1: Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Method 2: OpenSSL
openssl rand -hex 64

# Method 3: Menggunakan script yang sudah ada
cd /var/www/werehouse.iw/scripts
node generate-jwt-secret.js

# Copy output dan paste ke JWT_SECRET di .env
```

**Test Database Connection:**

Buat file test sederhana:

```bash
nano test-db.js
```

```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    console.log('✅ Database connection successful!');
    
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log('✅ Users count:', rows[0].count);
    
    await connection.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
```

```bash
# Run test
node test-db.js

# Expected output:
# ✅ Database connection successful!
# ✅ Users count: 1

# Jika berhasil, hapus file test
rm test-db.js
```

**Test Backend Server:**

```bash
# Test run
node server.js

# Expected output:
# Server running on port 5000
# Database connected successfully

# Test API endpoint (buka terminal baru)
curl http://localhost:5000/api/health

# Expected response:
# {"status":"ok","timestamp":"2026-01-23T..."}

# Jika OK, stop dengan Ctrl+C
```

**Start dengan PM2:**

```bash
# Install PM2 globally (jika belum)
sudo npm install -g pm2

# Start backend dengan PM2
pm2 start server.js --name iware-backend

# Expected output:
# ┌─────┬──────────────────┬─────────┬─────────┬──────────┐
# │ id  │ name             │ mode    │ status  │ cpu      │
# ├─────┼──────────────────┼─────────┼─────────┼──────────┤
# │ 0   │ iware-backend    │ fork    │ online  │ 0%       │
# └─────┴──────────────────┴─────────┴─────────┴──────────┘

# Save PM2 configuration
pm2 save

# Setup PM2 startup script (auto-start on reboot)
pm2 startup
# Copy dan jalankan command yang muncul, contoh:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u username --hp /home/username

# Verify PM2 status
pm2 status

# View logs
pm2 logs iware-backend --lines 50

# Monitor real-time
pm2 monit
```

**PM2 Useful Commands:**

```bash
# Restart
pm2 restart iware-backend

# Stop
pm2 stop iware-backend

# Delete
pm2 delete iware-backend

# View logs
pm2 logs iware-backend

# Clear logs
pm2 flush

# Show process info
pm2 show iware-backend

# Monitor CPU/Memory
pm2 monit
```

### Langkah 7: Setup Frontend

```bash
cd /var/www/werehouse.iw/frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
nano .env
```

**Edit `.env` file:**

```env
# Gunakan domain atau IP server
VITE_API_URL=http://your-domain.com/api
# atau
VITE_API_URL=http://your-server-ip/api
```

**Build Frontend:**

```bash
# Build production
npm run build

# Copy build ke nginx directory
sudo mkdir -p /var/www/iware-frontend
sudo cp -r dist/* /var/www/iware-frontend/

# Set permissions
sudo chown -R www-data:www-data /var/www/iware-frontend
```

### Langkah 8: Configure Nginx

```bash
# Buat nginx config
sudo nano /etc/nginx/sites-available/iware
```

**Paste configuration berikut:**

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;  # Ganti dengan domain Anda

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;  # Ganti dengan domain Anda
    
    root /var/www/iware-frontend;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests ke backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Enable site dan restart Nginx:**

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/iware /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx

# Enable nginx on boot
sudo systemctl enable nginx
```

### Langkah 9: Setup Firewall

```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP & HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check status
sudo ufw status
```

### Langkah 10: Setup SSL dengan Let's Encrypt (Optional tapi Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose redirect HTTP to HTTPS: Yes

# Test auto-renewal
sudo certbot renew --dry-run

# Certbot akan otomatis renew setiap 90 hari
```

### Langkah 11: Verifikasi Deployment

**Test Backend:**

```bash
# Local test
curl http://localhost:5000/api/health

# Public test
curl http://yourdomain.com/api/health
# atau
curl https://api.yourdomain.com/health
```

**Test Frontend:**

1. Buka browser
2. Akses `http://yourdomain.com` atau `https://yourdomain.com`
3. Test login

---

## ☁️ Metode 3: Deploy Frontend ke Vercel + Backend ke Railway

Kombinasi terbaik: Frontend di Vercel (CDN global), Backend di Railway.

### Langkah 1: Deploy Backend ke Railway

Ikuti **Metode 1** langkah 1-4 untuk deploy backend dan database ke Railway.

### Langkah 2: Deploy Frontend ke Vercel

**Persiapan:**

1. Buka https://vercel.com
2. Sign up dengan GitHub account
3. Install Vercel CLI (optional):

```bash
npm i -g vercel
```

**Deploy via Vercel Dashboard:**

1. Klik **"Add New Project"**
2. Import repository **`werehouse.iw`**
3. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add Environment Variables:
   ```
   VITE_API_URL=https://backend-production-abc123.up.railway.app/api
   ```

5. Klik **"Deploy"**

**Deploy via Vercel CLI:**

```bash
cd frontend

# Login
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Y
# - Which scope? (pilih account Anda)
# - Link to existing project? N
# - Project name? iware-frontend
# - Directory? ./
# - Override settings? N

# Set environment variable
vercel env add VITE_API_URL production
# Paste: https://backend-production-abc123.up.railway.app/api

# Deploy to production
vercel --prod
```

**Custom Domain (Optional):**

1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records sesuai instruksi Vercel

---

## 🔧 Post-Deployment Tasks

### 1. Seed Data Awal (Optional)

**Railway:**

```bash
railway link
railway run node backend/scripts/seedTransactions.js
railway run node backend/scripts/seedTransactionItems.js
```

**VPS:**

```bash
cd /var/www/werehouse.iw/backend
node scripts/seedTransactions.js
node scripts/seedTransactionItems.js
```

### 2. Buat User Admin

```bash
# Generate password hash
cd backend
node scripts/generatePassword.js YourPassword123

# Insert ke database
mysql -u iware_user -p iware_warehouse

INSERT INTO users (username, password, role, created_at) 
VALUES ('admin', '<hashed-password>', 'admin', NOW());
```

### 3. Test Accurate API Integration (Optional)

Jika menggunakan Accurate Online:

1. Login ke https://accurate.id
2. Generate API credentials
3. Update environment variables
4. Test connection:

```bash
curl -X GET https://your-backend.com/api/accurate/test \
  -H "Authorization: Bearer <your-jwt-token>"
```

---

## 📊 Monitoring & Maintenance

### Railway Monitoring

**View Metrics:**
- Dashboard → Service → Metrics
- CPU, Memory, Network usage
- Request count & response time

**View Logs:**

```bash
railway logs --service backend
railway logs --service frontend
```

**Alerts:**
- Settings → Notifications
- Setup email/Slack alerts

### VPS Monitoring

**PM2 Monitoring:**

```bash
# Status semua process
pm2 status

# Logs real-time
pm2 logs iware-backend

# Monitoring dashboard
pm2 monit

# Web dashboard (optional)
pm2 install pm2-server-monit
```

**System Monitoring:**

```bash
# CPU & Memory
htop

# Disk usage
df -h

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# MySQL logs
sudo tail -f /var/log/mysql/error.log
```

**Setup Monitoring Tools (Optional):**

```bash
# Install Netdata (real-time monitoring)
bash <(curl -Ss https://my-netdata.io/kickstart.sh)

# Access: http://your-server-ip:19999
```

### Database Backup

**Railway:**

```bash
# Manual backup
railway run mysqldump iware_warehouse > backup_$(date +%Y%m%d).sql

# Backup dengan compression
railway run mysqldump iware_warehouse | gzip > backup_$(date +%Y%m%d).sql.gz

# Restore
railway run mysql iware_warehouse < backup_20260123.sql

# Restore dari compressed
gunzip < backup_20260123.sql.gz | railway run mysql iware_warehouse
```

**VPS - Setup Automated Backup:**

Lihat section **"MySQL & phpMyAdmin Management → Backup Database"** di atas untuk automated backup script lengkap.

**Backup via phpMyAdmin:**

1. Login ke phpMyAdmin
2. Pilih database `iware_warehouse`
3. Tab **"Export"**
4. Method: **Custom**
5. Format: **SQL**
6. Options:
   - ✅ Add DROP TABLE / VIEW / PROCEDURE / FUNCTION / EVENT / TRIGGER
   - ✅ Add IF NOT EXISTS
   - ✅ Add AUTO_INCREMENT value
7. Klik **"Go"**

**Backup Strategy (Best Practice):**

```bash
# Daily backup (keep 7 days)
0 2 * * * /usr/local/bin/backup-iware-db.sh

# Weekly backup (keep 4 weeks)
0 3 * * 0 mysqldump -u iware_user -p$DB_PASS iware_warehouse | gzip > /var/backups/iware/weekly/backup_$(date +\%Y\%m\%d).sql.gz

# Monthly backup (keep 12 months)
0 4 1 * * mysqldump -u iware_user -p$DB_PASS iware_warehouse | gzip > /var/backups/iware/monthly/backup_$(date +\%Y\%m\%d).sql.gz
```

**Offsite Backup (Recommended):**

```bash
# Backup to remote server via SCP
scp /var/backups/iware/backup_$(date +%Y%m%d).sql.gz user@backup-server:/backups/iware/

# Backup to cloud storage (AWS S3)
aws s3 cp /var/backups/iware/backup_$(date +%Y%m%d).sql.gz s3://my-backup-bucket/iware/

# Backup to cloud storage (Google Drive) using rclone
rclone copy /var/backups/iware/ gdrive:iware-backups/
```

### Update Aplikasi

**Railway (Auto-deploy):**

```bash
# Di local
git add .
git commit -m "Update feature"
git push origin main

# Railway otomatis deploy
```

**VPS (Manual):**

```bash
cd /var/www/werehouse.iw

# Pull latest code
git pull origin main

# Update backend
cd backend
npm install --production
pm2 restart iware-backend

# Update frontend
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/iware-frontend/

# Restart nginx (jika perlu)
sudo systemctl restart nginx
```

---

## �️ MySQL & phpMyAdmin Management

### Backup Database

**Manual Backup via Command Line:**

```bash
# Backup single database
mysqldump -u iware_user -p iware_warehouse > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup dengan compression
mysqldump -u iware_user -p iware_warehouse | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Backup specific tables
mysqldump -u iware_user -p iware_warehouse users transactions > backup_users_trans.sql

# Backup structure only (no data)
mysqldump -u iware_user -p --no-data iware_warehouse > schema_only.sql

# Backup data only (no structure)
mysqldump -u iware_user -p --no-create-info iware_warehouse > data_only.sql
```

**Manual Backup via phpMyAdmin:**

1. Login ke phpMyAdmin
2. Pilih database `iware_warehouse`
3. Klik tab **"Export"**
4. **Quick method**: Export semua tables dengan default settings
5. **Custom method** (recommended):
   - Format: SQL
   - Tables: Select All
   - Output: Save output to file
   - Format-specific options:
     - ✅ Add DROP TABLE
     - ✅ Add IF NOT EXISTS
     - ✅ Add AUTO_INCREMENT value
   - Data dump options:
     - Structure: ✅ Add CREATE TABLE
     - Data: ✅ Complete inserts
6. Klik **"Go"**
7. File akan di-download

**Automated Backup Script:**

```bash
# Buat backup script
sudo nano /usr/local/bin/backup-iware-db.sh
```

```bash
#!/bin/bash

# Configuration
BACKUP_DIR="/var/backups/iware"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="iware_warehouse"
DB_USER="iware_user"
DB_PASS="StrongPassword123!@#"
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
echo "Starting backup at $(date)"
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Check if backup successful
if [ $? -eq 0 ]; then
    echo "✅ Backup completed: backup_$DATE.sql.gz"
    
    # Delete old backups (older than RETENTION_DAYS)
    find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete
    echo "✅ Old backups cleaned (retention: $RETENTION_DAYS days)"
else
    echo "❌ Backup failed!"
    exit 1
fi

# Show backup size
du -h $BACKUP_DIR/backup_$DATE.sql.gz

echo "Backup finished at $(date)"
```

```bash
# Make executable
sudo chmod +x /usr/local/bin/backup-iware-db.sh

# Test run
sudo /usr/local/bin/backup-iware-db.sh

# Setup cron job (daily at 2 AM)
sudo crontab -e

# Add line:
0 2 * * * /usr/local/bin/backup-iware-db.sh >> /var/log/iware-backup.log 2>&1

# Verify cron job
sudo crontab -l
```

### Restore Database

**Restore via Command Line:**

```bash
# Restore from uncompressed backup
mysql -u iware_user -p iware_warehouse < backup_20260123_020000.sql

# Restore from compressed backup
gunzip < backup_20260123_020000.sql.gz | mysql -u iware_user -p iware_warehouse

# Restore to new database
mysql -u root -p -e "CREATE DATABASE iware_warehouse_restore;"
mysql -u iware_user -p iware_warehouse_restore < backup_20260123_020000.sql
```

**Restore via phpMyAdmin:**

1. Login ke phpMyAdmin
2. Pilih database `iware_warehouse`
3. Klik tab **"Import"**
4. Klik **"Choose File"** → pilih backup file (.sql atau .sql.gz)
5. Format: SQL
6. Klik **"Go"**
7. Tunggu hingga selesai

**Restore dengan Drop Database (Full Restore):**

```bash
# Backup current database first!
mysqldump -u iware_user -p iware_warehouse > backup_before_restore.sql

# Drop and recreate database
mysql -u root -p -e "DROP DATABASE iware_warehouse;"
mysql -u root -p -e "CREATE DATABASE iware_warehouse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Restore
mysql -u iware_user -p iware_warehouse < backup_20260123_020000.sql

# Verify
mysql -u iware_user -p iware_warehouse -e "SHOW TABLES;"
```

### Database Maintenance

**Optimize Tables:**

```bash
# Via command line
mysql -u iware_user -p iware_warehouse -e "OPTIMIZE TABLE users, products, transactions, transaction_items, schedules;"
```

Via phpMyAdmin:
1. Pilih database
2. Check tables yang ingin di-optimize
3. Dropdown "With selected:" → Optimize table

**Analyze Tables:**

```bash
mysql -u iware_user -p iware_warehouse -e "ANALYZE TABLE users, products, transactions;"
```

**Check Tables:**

```bash
mysql -u iware_user -p iware_warehouse -e "CHECK TABLE users, products, transactions;"
```

**Repair Tables (jika corrupt):**

```bash
mysql -u iware_user -p iware_warehouse -e "REPAIR TABLE users;"
```

**View Table Sizes:**

```sql
-- Via MySQL prompt atau phpMyAdmin SQL tab
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)',
    table_rows AS 'Rows'
FROM information_schema.TABLES
WHERE table_schema = 'iware_warehouse'
ORDER BY (data_length + index_length) DESC;
```

### Database Monitoring

**Check Database Size:**

```bash
mysql -u iware_user -p -e "
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'iware_warehouse'
GROUP BY table_schema;
"
```

**Monitor Active Connections:**

```bash
# Show current connections
mysql -u root -p -e "SHOW PROCESSLIST;"

# Count connections
mysql -u root -p -e "SHOW STATUS LIKE 'Threads_connected';"

# Max connections
mysql -u root -p -e "SHOW VARIABLES LIKE 'max_connections';"
```

**Monitor Slow Queries:**

```bash
# Enable slow query log (jika belum)
mysql -u root -p -e "SET GLOBAL slow_query_log = 'ON';"

# View slow queries
sudo tail -f /var/log/mysql/slow-query.log

# Analyze slow queries
sudo mysqldumpslow /var/log/mysql/slow-query.log
```

**Check MySQL Status:**

```bash
# Service status
sudo systemctl status mysql

# MySQL uptime and stats
mysql -u root -p -e "STATUS;"

# Show all status variables
mysql -u root -p -e "SHOW STATUS;"

# Show important metrics
mysql -u root -p -e "
SHOW STATUS WHERE Variable_name IN (
    'Threads_connected',
    'Threads_running',
    'Questions',
    'Slow_queries',
    'Uptime'
);
"
```

### phpMyAdmin Tips & Tricks

**1. Execute Multiple Queries:**
- SQL tab → paste multiple queries → klik "Go"
- Queries dipisahkan dengan semicolon (;)

**2. Export Filtered Data:**
- Browse table → Apply filters
- Export → akan export hanya filtered data

**3. Search Across Tables:**
- Database → Search tab
- Masukkan keyword → pilih tables → Search

**4. Import Large Files:**

Jika file backup besar (>2MB), edit PHP settings:

```bash
sudo nano /etc/php/8.1/fpm/php.ini
```

```ini
upload_max_filesize = 128M
post_max_size = 128M
max_execution_time = 300
max_input_time = 300
memory_limit = 512M
```

```bash
sudo systemctl restart php8.1-fpm
sudo systemctl restart nginx
```

**5. Bookmark Frequent Queries:**
- SQL tab → Execute query
- Klik "Bookmark this SQL query"
- Access via "Bookmarks" dropdown

**6. Designer View (ER Diagram):**
- Database → Designer tab
- Visual representation of table relationships

**7. Track Changes:**
- Settings → Features → Tracking
- Enable tracking untuk audit trail

### Security Best Practices

**1. Restrict phpMyAdmin Access by IP:**

Edit nginx config:

```nginx
location / {
    # Allow specific IPs only
    allow 192.168.1.100;  # Your office IP
    allow 10.0.0.0/8;     # Your VPN range
    deny all;
    
    try_files $uri $uri/ =404;
}
```

**2. Change phpMyAdmin URL:**

```bash
# Rename directory
sudo mv /usr/share/phpmyadmin /usr/share/secret-admin-panel

# Update nginx config
sudo nano /etc/nginx/sites-available/phpmyadmin

# Change root path:
root /usr/share/secret-admin-panel;

# Restart nginx
sudo systemctl restart nginx

# Access via: http://yourdomain.com/secret-admin-panel
```

**3. Disable Root Login:**

```bash
sudo nano /etc/phpmyadmin/config.inc.php
```

```php
$cfg['Servers'][$i]['AllowRoot'] = false;
```

**4. Enable Two-Factor Authentication:**

```bash
# Install required package
sudo apt install -y php-tcpdf

# Enable in phpMyAdmin
# Settings → Features → Two-factor authentication
```

**5. Regular Updates:**

```bash
# Update phpMyAdmin
sudo apt update
sudo apt upgrade phpmyadmin

# Check version
dpkg -l | grep phpmyadmin
```

---

## 🐛 Troubleshooting

### Backend tidak bisa connect ke database

**Cek environment variables:**

```bash
# Railway
railway variables

# VPS
cat backend/.env
```

**Test database connection:**

```bash
# Railway
railway run mysql -h $MYSQLHOST -P $MYSQLPORT -u $MYSQLUSER -p$MYSQLPASSWORD

# VPS - Test dengan mysql client
mysql -u iware_user -p iware_warehouse

# Test dengan telnet (check port)
telnet localhost 3306
```

**Common issues:**

1. **Password salah**
   ```bash
   # Reset password
   sudo mysql -u root -p
   ALTER USER 'iware_user'@'localhost' IDENTIFIED BY 'NewPassword123!';
   FLUSH PRIVILEGES;
   ```

2. **Database name salah**
   ```bash
   # Check database exists
   mysql -u root -p -e "SHOW DATABASES LIKE 'iware%';"
   ```

3. **MySQL service tidak running**
   ```bash
   sudo systemctl status mysql
   sudo systemctl start mysql
   sudo systemctl enable mysql
   ```

4. **Firewall blocking port 3306**
   ```bash
   # Check if port open
   sudo netstat -tlnp | grep 3306
   
   # Allow port
   sudo ufw allow 3306/tcp
   ```

5. **Connection limit reached**
   ```bash
   # Check current connections
   mysql -u root -p -e "SHOW PROCESSLIST;"
   
   # Kill stuck connections
   mysql -u root -p -e "KILL <process_id>;"
   
   # Increase max connections
   sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
   # max_connections = 200
   sudo systemctl restart mysql
   ```

6. **User tidak punya privileges**
   ```bash
   mysql -u root -p
   SHOW GRANTS FOR 'iware_user'@'localhost';
   GRANT ALL PRIVILEGES ON iware_warehouse.* TO 'iware_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

### phpMyAdmin Issues

**1. Cannot access phpMyAdmin (404 Not Found)**

```bash
# Check if phpMyAdmin installed
dpkg -l | grep phpmyadmin

# Check symbolic link
ls -la /var/www/phpmyadmin
ls -la /usr/share/phpmyadmin

# Recreate link if missing
sudo ln -s /usr/share/phpmyadmin /var/www/phpmyadmin

# Check nginx config
sudo nginx -t
sudo systemctl restart nginx
```

**2. phpMyAdmin shows blank page**

```bash
# Check PHP-FPM status
sudo systemctl status php8.1-fpm

# Check PHP error log
sudo tail -f /var/log/php8.1-fpm.log

# Check nginx error log
sudo tail -f /var/log/nginx/error.log

# Restart services
sudo systemctl restart php8.1-fpm
sudo systemctl restart nginx
```

**3. "The configuration file now needs a secret passphrase (blowfish_secret)"**

```bash
# Generate blowfish secret
openssl rand -base64 32

# Edit config
sudo nano /etc/phpmyadmin/config.inc.php

# Add/update:
$cfg['blowfish_secret'] = '<paste-generated-secret>';

# Clear browser cache and reload
```

**4. "Cannot log in to the MySQL server"**

```bash
# Check MySQL running
sudo systemctl status mysql

# Test MySQL login
mysql -u iware_user -p

# Check phpMyAdmin config
sudo nano /etc/phpmyadmin/config.inc.php

# Verify:
$cfg['Servers'][$i]['host'] = 'localhost';  # or '127.0.0.1'
$cfg['Servers'][$i]['auth_type'] = 'cookie';
```

**5. "Access denied for user 'root'@'localhost'"**

```bash
# MySQL 8.0+ uses auth_socket for root by default
# Login as root without password:
sudo mysql

# Change auth method:
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'YourRootPassword';
FLUSH PRIVILEGES;
EXIT;

# Now you can login with password
mysql -u root -p
```

**6. Upload file size limit**

```bash
# Check current limits
php -i | grep upload_max_filesize
php -i | grep post_max_size

# Edit PHP config
sudo nano /etc/php/8.1/fpm/php.ini

# Update:
upload_max_filesize = 128M
post_max_size = 128M
max_execution_time = 300

# Restart PHP-FPM
sudo systemctl restart php8.1-fpm
```

**7. "Error during session start"**

```bash
# Check session directory permissions
ls -la /var/lib/php/sessions

# Fix permissions
sudo chown -R www-data:www-data /var/lib/php/sessions
sudo chmod 700 /var/lib/php/sessions

# Clear old sessions
sudo find /var/lib/php/sessions -type f -delete
```

### MySQL Performance Issues

**1. Slow queries**

```bash
# Enable slow query log
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Add:
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow-query.log
long_query_time = 2

# Restart MySQL
sudo systemctl restart mysql

# Analyze slow queries
sudo mysqldumpslow /var/log/mysql/slow-query.log

# Add indexes to slow tables
mysql -u root -p iware_warehouse

# Example: Add index on frequently queried column
CREATE INDEX idx_transaction_date ON transactions(transaction_date);
CREATE INDEX idx_customer_name ON transactions(customer_name);
CREATE INDEX idx_product_name ON products(product_name);
```

**2. High memory usage**

```bash
# Check MySQL memory usage
ps aux | grep mysql

# Optimize InnoDB buffer pool
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Set to 70% of available RAM for dedicated DB server
# For 2GB RAM server:
innodb_buffer_pool_size = 1G

# For shared server (with web server):
innodb_buffer_pool_size = 512M

# Restart MySQL
sudo systemctl restart mysql
```

**3. Too many connections**

```bash
# Check current connections
mysql -u root -p -e "SHOW PROCESSLIST;"

# Check max connections
mysql -u root -p -e "SHOW VARIABLES LIKE 'max_connections';"

# Increase max connections
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Add/update:
max_connections = 200

# Restart MySQL
sudo systemctl restart mysql

# Kill idle connections
mysql -u root -p

SELECT 
    id, 
    user, 
    host, 
    db, 
    command, 
    time, 
    state 
FROM information_schema.processlist 
WHERE command = 'Sleep' 
AND time > 300;

-- Kill specific connection
KILL <id>;
```

**4. Disk space full**

```bash
# Check disk usage
df -h

# Check MySQL data directory size
sudo du -sh /var/lib/mysql

# Check binary logs size
sudo du -sh /var/log/mysql

# Purge old binary logs
mysql -u root -p

SHOW BINARY LOGS;
PURGE BINARY LOGS BEFORE '2026-01-01 00:00:00';

# Or purge all except last 3 days
PURGE BINARY LOGS BEFORE DATE_SUB(NOW(), INTERVAL 3 DAY);

# Disable binary logging if not needed
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Comment out:
# log_bin = /var/log/mysql/mysql-bin.log

# Restart MySQL
sudo systemctl restart mysql
```

### Database Corruption

**1. Check for corrupted tables**

```bash
mysql -u root -p iware_warehouse

CHECK TABLE users;
CHECK TABLE products;
CHECK TABLE transactions;
CHECK TABLE transaction_items;

-- If status is not OK, repair:
REPAIR TABLE users;
```

**2. InnoDB crash recovery**

```bash
# Backup data first!
sudo cp -r /var/lib/mysql /var/lib/mysql.backup

# Edit MySQL config
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

# Add under [mysqld]:
innodb_force_recovery = 1

# Restart MySQL
sudo systemctl restart mysql

# Export data
mysqldump -u root -p iware_warehouse > recovery_backup.sql

# Remove force recovery
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
# Remove or comment: innodb_force_recovery = 1

# Restart MySQL
sudo systemctl restart mysql

# If needed, restore from backup
mysql -u root -p iware_warehouse < recovery_backup.sql
```

### Migration Issues

**1. Character set problems (emoji, special chars)**

```bash
# Check current charset
mysql -u root -p iware_warehouse -e "
SELECT 
    table_name,
    table_collation 
FROM information_schema.tables 
WHERE table_schema = 'iware_warehouse';
"

# Convert to utf8mb4
mysql -u root -p iware_warehouse

ALTER DATABASE iware_warehouse 
    CHARACTER SET = utf8mb4 
    COLLATE = utf8mb4_unicode_ci;

ALTER TABLE users 
    CONVERT TO CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

ALTER TABLE products 
    CONVERT TO CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

-- Repeat for all tables
```

**2. Foreign key constraint errors**

```bash
mysql -u root -p iware_warehouse

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Run your import/update queries
SOURCE backup.sql;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Verify constraints
SELECT 
    TABLE_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'iware_warehouse'
AND REFERENCED_TABLE_NAME IS NOT NULL;
```

### Frontend tidak bisa hit API

**Cek VITE_API_URL:**

```bash
# Railway
railway variables --service frontend

# VPS
cat frontend/.env
```

**Test API endpoint:**

```bash
curl https://your-backend.com/api/health
```

**Common issues:**
- URL salah (missing `/api` atau `https://`)
- CORS error: cek backend CORS settings
- Backend service down
- Network/firewall issue

### Railway deployment gagal

**Cek logs:**

```bash
railway logs --service backend
railway logs --service frontend
```

**Common issues:**
- `railway.json` tidak ada atau salah
- Node.js version mismatch: cek `package.json` engines
- Build command gagal: cek dependencies
- Environment variables kurang

**Fix:**

```bash
# Redeploy
railway up

# Atau via dashboard: Deployments → Redeploy
```

### PM2 process crash (VPS)

**Cek logs:**

```bash
pm2 logs iware-backend --lines 100
```

**Restart process:**

```bash
pm2 restart iware-backend

# Atau restart semua
pm2 restart all
```

**Common issues:**
- Port 5000 sudah dipakai: `sudo lsof -i :5000`
- Memory habis: `free -h`
- Database connection error
- Missing environment variables

### Nginx 502 Bad Gateway

**Cek backend running:**

```bash
pm2 status
curl http://localhost:5000/api/health
```

**Cek nginx error log:**

```bash
sudo tail -f /var/log/nginx/error.log
```

**Common issues:**
- Backend tidak running
- Port salah di nginx config
- Firewall blocking
- SELinux blocking (CentOS): `sudo setenforce 0`

**Restart services:**

```bash
pm2 restart iware-backend
sudo systemctl restart nginx
```

### SSL Certificate Error

**Renew certificate:**

```bash
sudo certbot renew

# Force renew
sudo certbot renew --force-renewal
```

**Check certificate:**

```bash
sudo certbot certificates
```

### Database Migration Issues

**Check current schema:**

```bash
mysql -u iware_user -p iware_warehouse -e "SHOW TABLES;"
```

**Re-import schema (DANGER: akan hapus data):**

```bash
# Backup dulu!
mysqldump -u iware_user -p iware_warehouse > backup_before_reimport.sql

# Drop dan recreate
mysql -u iware_user -p -e "DROP DATABASE iware_warehouse; CREATE DATABASE iware_warehouse;"

# Import ulang
mysql -u iware_user -p iware_warehouse < database/schema.sql
```

---

## 📝 Checklist Deployment

### Pre-Deployment

- [ ] Repository sudah di GitHub
- [ ] `.gitignore` sudah benar (exclude `.env`, `node_modules`)
- [ ] `.env.example` sudah lengkap dan up-to-date
- [ ] Database schema (`schema.sql`) sudah final dan tested
- [ ] JWT secret sudah di-generate (64 char hex)
- [ ] Test aplikasi di local environment
- [ ] Semua dependencies di `package.json` sudah benar
- [ ] Backend API endpoints sudah tested
- [ ] Frontend build berhasil (`npm run build`)

### Railway Deployment

- [ ] MySQL service deployed dan running
- [ ] MySQL credentials tersimpan (MYSQLHOST, MYSQLPORT, dll)
- [ ] Database schema imported successfully
- [ ] Verify tables created (7 tables)
- [ ] Verify default data (company_info, users)
- [ ] Backend service deployed
- [ ] Backend environment variables set lengkap
- [ ] Backend domain generated dan accessible
- [ ] Backend health check endpoint working (`/api/health`)
- [ ] Frontend service deployed
- [ ] Frontend environment variables set (VITE_API_URL)
- [ ] Frontend domain generated dan accessible
- [ ] Test login berhasil dengan default admin user
- [ ] Test CRUD operations (create, read, update, delete)
- [ ] Check browser console untuk errors
- [ ] Test responsive design (mobile, tablet, desktop)

### VPS Deployment

**Server Setup:**
- [ ] Ubuntu 20.04/22.04 LTS installed
- [ ] Server updated (`apt update && apt upgrade`)
- [ ] Node.js 18.x installed dan verified
- [ ] MySQL 8.0 installed dan running
- [ ] Nginx installed dan running
- [ ] PM2 installed globally
- [ ] Git installed
- [ ] Firewall (UFW) configured

**MySQL Setup:**
- [ ] MySQL secure installation completed
- [ ] MySQL configuration optimized (`mysqld.cnf`)
- [ ] Database `iware_warehouse` created
- [ ] User `iware_user` created dengan proper privileges
- [ ] Database schema imported
- [ ] Verify tables dan default data
- [ ] Test database connection dari backend
- [ ] phpMyAdmin installed (optional)
- [ ] phpMyAdmin configured dan accessible
- [ ] phpMyAdmin secured (password protection, IP restriction)

**Backend Setup:**
- [ ] Repository cloned ke `/var/www/werehouse.iw`
- [ ] Dependencies installed (`npm install --production`)
- [ ] `.env` file configured dengan correct values
- [ ] JWT secret generated dan set
- [ ] Database connection tested
- [ ] Backend server tested (`node server.js`)
- [ ] PM2 process started dan running
- [ ] PM2 saved dan startup configured
- [ ] Backend logs checked (no errors)

**Frontend Setup:**
- [ ] Dependencies installed
- [ ] `.env` file configured dengan backend URL
- [ ] Production build created (`npm run build`)
- [ ] Build files copied ke `/var/www/iware-frontend`
- [ ] Permissions set correctly (www-data:www-data)

**Nginx Setup:**
- [ ] Nginx config created untuk backend API
- [ ] Nginx config created untuk frontend
- [ ] phpMyAdmin config created (if installed)
- [ ] Configs enabled (symlink ke sites-enabled)
- [ ] Nginx config tested (`nginx -t`)
- [ ] Nginx restarted
- [ ] Test frontend accessible
- [ ] Test backend API accessible
- [ ] Test API proxy working (`/api` routes)

**SSL Setup:**
- [ ] Domain DNS configured (A record pointing to server IP)
- [ ] Certbot installed
- [ ] SSL certificates generated untuk semua domains
- [ ] HTTPS redirect configured
- [ ] SSL auto-renewal tested (`certbot renew --dry-run`)

**Security:**
- [ ] Firewall rules configured (SSH, HTTP, HTTPS)
- [ ] MySQL root remote login disabled
- [ ] Strong passwords used untuk semua accounts
- [ ] `.env` files secured (not in git, proper permissions)
- [ ] phpMyAdmin secured (if installed)
- [ ] Fail2ban installed (optional, recommended)

**Backup:**
- [ ] Backup script created dan tested
- [ ] Cron job configured untuk automated backup
- [ ] Backup retention policy set
- [ ] Test restore dari backup
- [ ] Offsite backup configured (optional, recommended)

**Monitoring:**
- [ ] PM2 monitoring working
- [ ] MySQL slow query log enabled
- [ ] Nginx access/error logs configured
- [ ] Disk space monitoring setup
- [ ] Uptime monitoring setup (optional)

### Post-Deployment

- [ ] Seed data imported (if needed)
- [ ] User admin created atau verified
- [ ] Test semua fitur utama:
  - [ ] Login/Logout
  - [ ] Dashboard loading
  - [ ] Products (Stok Barang) CRUD
  - [ ] Transactions (Transaksi) CRUD
  - [ ] Schedule management
  - [ ] Rekap/Reports
  - [ ] Company info update
- [ ] Test Accurate API integration (if configured)
- [ ] Performance testing (load time, response time)
- [ ] Security testing (SQL injection, XSS, CSRF)
- [ ] Browser compatibility testing
- [ ] Mobile responsiveness testing
- [ ] Documentation updated
- [ ] Team notified dan trained
- [ ] Credentials shared securely (password manager)
- [ ] Monitoring alerts configured
- [ ] Backup verified dan tested

### Maintenance Checklist (Weekly/Monthly)

**Weekly:**
- [ ] Check application logs untuk errors
- [ ] Check disk space usage
- [ ] Check database size
- [ ] Verify backups running successfully
- [ ] Check SSL certificate expiry
- [ ] Review slow query log
- [ ] Check for security updates

**Monthly:**
- [ ] Update dependencies (`npm audit`, `npm update`)
- [ ] Update system packages (`apt update && apt upgrade`)
- [ ] Optimize database tables
- [ ] Review and clean old logs
- [ ] Test backup restore procedure
- [ ] Review user access dan permissions
- [ ] Performance audit
- [ ] Security audit

---

## 🎓 Best Practices

### Security

**Database Security:**
1. **Gunakan strong passwords** (min 12 char, kombinasi upper/lower/number/symbol)
2. **Jangan commit `.env` file** ke git
3. **Limit database user privileges** (hanya yang diperlukan)
4. **Disable MySQL root remote login**
5. **Use prepared statements** di backend (prevent SQL injection)
6. **Enable MySQL SSL** untuk remote connections
7. **Regular security updates** untuk MySQL
8. **Backup encryption** untuk sensitive data
9. **Monitor failed login attempts**
10. **Use firewall** untuk restrict database access

**Application Security:**
1. **Generate JWT secret yang panjang dan random** (64+ characters)
2. **Enable SSL/HTTPS** di production (mandatory)
3. **Set secure HTTP headers** (X-Frame-Options, CSP, HSTS)
4. **Implement rate limiting** di backend API
5. **Validate dan sanitize** semua user input
6. **Use CORS properly** (whitelist specific origins)
7. **Keep dependencies updated** (`npm audit fix`)
8. **Disable directory listing** di web server
9. **Hide server version** di HTTP headers
10. **Implement proper error handling** (don't expose stack traces)

**phpMyAdmin Security:**
1. **Change default URL** (rename directory)
2. **Add HTTP basic auth** (htpasswd)
3. **Restrict access by IP** (whitelist)
4. **Disable root login** di phpMyAdmin config
5. **Enable two-factor authentication**
6. **Use HTTPS only**
7. **Set strong blowfish secret**
8. **Regular updates**
9. **Monitor access logs**
10. **Consider alternatives** (Adminer, DBeaver) untuk production

**Server Security:**
1. **Use SSH keys** instead of passwords
2. **Disable root SSH login**
3. **Change default SSH port** (optional)
4. **Enable firewall** (UFW) dengan minimal rules
5. **Install fail2ban** untuk prevent brute force
6. **Regular system updates** (`apt update && apt upgrade`)
7. **Disable unused services**
8. **Use non-root user** untuk aplikasi
9. **Enable automatic security updates**
10. **Regular security audits**

### Performance

**Database Performance:**
1. **Add indexes** pada frequently queried columns
   ```sql
   CREATE INDEX idx_transaction_date ON transactions(transaction_date);
   CREATE INDEX idx_customer_name ON transactions(customer_name);
   CREATE INDEX idx_product_code ON products(product_code);
   CREATE INDEX idx_accurate_id ON products(accurate_id);
   ```

2. **Optimize InnoDB buffer pool** (70% of RAM untuk dedicated DB server)
   ```ini
   innodb_buffer_pool_size = 1G  # For 2GB RAM server
   ```

3. **Enable query cache** (MySQL 5.7, deprecated in 8.0)
   ```ini
   query_cache_type = 1
   query_cache_size = 32M
   ```

4. **Use connection pooling** di backend
   ```javascript
   const pool = mysql.createPool({
     connectionLimit: 10,
     host: process.env.DB_HOST,
     user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     database: process.env.DB_NAME
   });
   ```

5. **Regular table optimization**
   ```bash
   mysqlcheck -u root -p --optimize --all-databases
   ```

6. **Monitor slow queries** dan optimize
7. **Use EXPLAIN** untuk analyze query performance
8. **Avoid SELECT *** (select only needed columns)
9. **Use LIMIT** untuk pagination
10. **Archive old data** (move to separate tables/database)

**Application Performance:**
1. **Enable gzip compression** di Nginx
   ```nginx
   gzip on;
   gzip_vary on;
   gzip_min_length 1024;
   gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
   ```

2. **Cache static assets**
   ```nginx
   location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

3. **Use CDN** untuk frontend (Vercel, Cloudflare)
4. **Minimize bundle size** (code splitting, tree shaking)
5. **Lazy load images** dan components
6. **Use PM2 cluster mode** untuk multi-core
   ```bash
   pm2 start server.js -i max --name iware-backend
   ```

7. **Implement API response caching**
8. **Optimize images** (compress, WebP format)
9. **Use HTTP/2** (automatic dengan SSL)
10. **Monitor performance** (response time, load time)

**Frontend Performance:**
1. **Code splitting** dengan React.lazy()
2. **Memoization** dengan React.memo, useMemo, useCallback
3. **Virtual scrolling** untuk large lists
4. **Debounce** search inputs
5. **Optimize re-renders**
6. **Use production build** (`npm run build`)
7. **Minimize CSS** (remove unused styles)
8. **Preload critical resources**
9. **Use service workers** untuk offline support
10. **Lighthouse audit** untuk identify issues

### Reliability

**Backup Strategy:**
1. **Automated daily backups** (keep 7 days)
2. **Weekly backups** (keep 4 weeks)
3. **Monthly backups** (keep 12 months)
4. **Offsite backups** (cloud storage, remote server)
5. **Test restore procedure** regularly (monthly)
6. **Backup verification** (check file integrity)
7. **Document backup process**
8. **Multiple backup locations**
9. **Backup encryption** untuk sensitive data
10. **Backup monitoring** dan alerts

**Monitoring:**
1. **Application logs** (PM2, backend logs)
2. **Database logs** (slow queries, errors)
3. **Web server logs** (Nginx access/error)
4. **System metrics** (CPU, memory, disk)
5. **Uptime monitoring** (UptimeRobot, Pingdom)
6. **Error tracking** (Sentry, Rollbar)
7. **Performance monitoring** (New Relic, DataDog)
8. **Security monitoring** (fail2ban logs)
9. **Backup monitoring** (verify backups running)
10. **Alert setup** (email, Slack, SMS)

**High Availability:**
1. **Use load balancer** (Nginx, HAProxy)
2. **Database replication** (master-slave)
3. **Auto-scaling** (Railway, AWS Auto Scaling)
4. **Health checks** dan auto-restart (PM2)
5. **Graceful shutdown** handling
6. **Zero-downtime deployment**
7. **Failover strategy**
8. **Disaster recovery plan**
9. **Regular testing** (chaos engineering)
10. **Documentation** (runbooks, playbooks)

**Code Quality:**
1. **Use TypeScript** untuk type safety
2. **ESLint** untuk code linting
3. **Prettier** untuk code formatting
4. **Unit tests** (Jest, Vitest)
5. **Integration tests** (Supertest)
6. **E2E tests** (Cypress, Playwright)
7. **Code reviews** (pull requests)
8. **Git workflow** (feature branches, main/production)
9. **Semantic versioning**
10. **Changelog maintenance**

---

## 📊 Monitoring Tools

### Free/Open Source

**Application Monitoring:**
- **PM2 Plus** (free tier): Process monitoring, logs
- **Netdata**: Real-time system monitoring
- **Grafana + Prometheus**: Metrics visualization
- **ELK Stack**: Log aggregation dan analysis

**Uptime Monitoring:**
- **UptimeRobot** (free tier): 50 monitors, 5-min interval
- **StatusCake** (free tier): Uptime monitoring
- **Freshping**: Free uptime monitoring

**Database Monitoring:**
- **phpMyAdmin**: Built-in monitoring
- **MySQL Workbench**: Performance dashboard
- **Percona Monitoring**: MySQL performance
- **pt-query-digest**: Slow query analysis

**Error Tracking:**
- **Sentry** (free tier): Error tracking, performance
- **Rollbar** (free tier): Error monitoring
- **Bugsnag** (free tier): Error reporting

### Paid (Recommended untuk Production)

- **New Relic**: Full-stack monitoring
- **DataDog**: Infrastructure monitoring
- **Pingdom**: Uptime dan performance
- **PagerDuty**: Incident management
- **LogRocket**: Frontend monitoring

---

## 🔄 Update & Maintenance

### Update Aplikasi

**Railway (Auto-deploy):**

```bash
# Di local
git add .
git commit -m "feat: add new feature"
git push origin main

# Railway otomatis:
# 1. Detect changes
# 2. Build ulang
# 3. Deploy otomatis
# 4. Health check
# 5. Switch traffic
```

**VPS (Manual):**

```bash
# 1. Backup dulu!
cd /var/www/werehouse.iw
mysqldump -u iware_user -p iware_warehouse > backup_before_update.sql

# 2. Pull latest code
git pull origin main

# 3. Update backend
cd backend
npm install --production

# 4. Run migrations (jika ada)
# mysql -u iware_user -p iware_warehouse < migrations/001_add_column.sql

# 5. Restart backend
pm2 restart iware-backend

# 6. Check logs
pm2 logs iware-backend --lines 50

# 7. Update frontend
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/iware-frontend/

# 8. Restart nginx (jika perlu)
sudo systemctl restart nginx

# 9. Test aplikasi
curl http://localhost:5000/api/health
curl http://yourdomain.com

# 10. Monitor logs
pm2 logs iware-backend
sudo tail -f /var/log/nginx/error.log
```

### Database Migrations

**Create Migration File:**

```bash
# Di local
mkdir -p database/migrations
nano database/migrations/001_add_user_phone.sql
```

```sql
-- Migration: Add phone column to users table
-- Date: 2026-01-23
-- Author: Your Name

-- Up migration
ALTER TABLE users 
ADD COLUMN phone VARCHAR(20) AFTER email;

-- Rollback (jika perlu)
-- ALTER TABLE users DROP COLUMN phone;
```

**Apply Migration:**

```bash
# VPS
mysql -u iware_user -p iware_warehouse < database/migrations/001_add_user_phone.sql

# Verify
mysql -u iware_user -p iware_warehouse -e "DESCRIBE users;"
```

**Railway:**

```bash
railway link
railway run mysql iware_warehouse < database/migrations/001_add_user_phone.sql
```

### System Updates

**Ubuntu/Debian:**

```bash
# Update package list
sudo apt update

# List upgradable packages
apt list --upgradable

# Upgrade packages
sudo apt upgrade -y

# Upgrade distribution (major version)
sudo apt dist-upgrade -y

# Remove unused packages
sudo apt autoremove -y

# Reboot if kernel updated
sudo reboot
```

**Node.js Update:**

```bash
# Check current version
node --version

# Update to latest LTS
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version
npm --version

# Rebuild native modules
cd /var/www/werehouse.iw/backend
npm rebuild

# Restart application
pm2 restart iware-backend
```

**MySQL Update:**

```bash
# Backup first!
mysqldump -u root -p --all-databases > backup_all_before_update.sql

# Update MySQL
sudo apt update
sudo apt upgrade mysql-server

# Check version
mysql --version

# Run mysql_upgrade (if needed)
sudo mysql_upgrade -u root -p

# Restart MySQL
sudo systemctl restart mysql
```

**Nginx Update:**

```bash
# Update Nginx
sudo apt update
sudo apt upgrade nginx

# Test config
sudo nginx -t

# Restart
sudo systemctl restart nginx
```

---

## 📞 Support & Resources

## 📞 Support & Resources

### Getting Help

**Jika ada masalah:**

1. **Check dokumentasi ini** - Baca section troubleshooting
2. **Check logs** untuk error details:
   ```bash
   # Backend logs
   pm2 logs iware-backend
   
   # Nginx logs
   sudo tail -f /var/log/nginx/error.log
   
   # MySQL logs
   sudo tail -f /var/log/mysql/error.log
   ```

3. **Search error message** di Google/Stack Overflow
4. **Check GitHub Issues** - Mungkin sudah ada yang report
5. **Buka issue baru** di GitHub repository dengan:
   - Deskripsi masalah yang jelas
   - Steps to reproduce
   - Error messages/logs
   - Environment info (OS, Node version, MySQL version)
   - Screenshots (jika applicable)

6. **Contact team developer** via:
   - Email: dev@iware.com
   - Slack: #iware-support
   - WhatsApp: +62xxx (internal team only)

### Useful Commands Cheatsheet

**PM2:**
```bash
pm2 status                    # Show all processes
pm2 logs iware-backend        # View logs
pm2 restart iware-backend     # Restart process
pm2 stop iware-backend        # Stop process
pm2 delete iware-backend      # Delete process
pm2 monit                     # Monitor dashboard
pm2 save                      # Save process list
pm2 startup                   # Setup auto-start
```

**MySQL:**
```bash
# Login
mysql -u iware_user -p iware_warehouse

# Common queries
SHOW DATABASES;
SHOW TABLES;
DESCRIBE users;
SELECT COUNT(*) FROM transactions;
SHOW PROCESSLIST;
SHOW STATUS;

# Backup
mysqldump -u iware_user -p iware_warehouse > backup.sql

# Restore
mysql -u iware_user -p iware_warehouse < backup.sql
```

**Nginx:**
```bash
sudo nginx -t                 # Test config
sudo systemctl restart nginx  # Restart
sudo systemctl status nginx   # Check status
sudo tail -f /var/log/nginx/access.log  # View access log
sudo tail -f /var/log/nginx/error.log   # View error log
```

**System:**
```bash
df -h                         # Disk usage
free -h                       # Memory usage
htop                          # Process monitor
netstat -tlnp                 # Open ports
sudo systemctl status mysql   # Service status
sudo ufw status               # Firewall status
```

**Git:**
```bash
git status                    # Check status
git pull origin main          # Pull latest
git log --oneline -10         # View commits
git diff                      # View changes
git stash                     # Stash changes
git stash pop                 # Apply stash
```

### Documentation Links

**Official Documentation:**
- [Railway Documentation](https://docs.railway.app) - Railway platform guide
- [Vercel Documentation](https://vercel.com/docs) - Vercel deployment guide
- [Nginx Documentation](https://nginx.org/en/docs/) - Nginx web server
- [PM2 Documentation](https://pm2.keymetrics.io/docs/) - Process manager
- [MySQL Documentation](https://dev.mysql.com/doc/) - MySQL database
- [phpMyAdmin Documentation](https://docs.phpmyadmin.net/) - phpMyAdmin guide
- [Node.js Documentation](https://nodejs.org/docs/) - Node.js runtime
- [Express.js Documentation](https://expressjs.com/) - Express framework
- [React Documentation](https://react.dev/) - React library
- [Vite Documentation](https://vitejs.dev/) - Vite build tool

**Tutorials & Guides:**
- [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials) - Server setup guides
- [MySQL Tutorial](https://www.mysqltutorial.org/) - MySQL learning
- [Nginx Beginner's Guide](https://nginx.org/en/docs/beginners_guide.html) - Nginx basics
- [Let's Encrypt Guide](https://letsencrypt.org/docs/) - SSL certificates

**Tools:**
- [MySQL Workbench](https://dev.mysql.com/downloads/workbench/) - MySQL GUI client
- [DBeaver](https://dbeaver.io/) - Universal database tool
- [Postman](https://www.postman.com/) - API testing
- [VS Code](https://code.visualstudio.com/) - Code editor

**Community:**
- [Stack Overflow](https://stackoverflow.com/) - Q&A community
- [Reddit r/node](https://reddit.com/r/node) - Node.js community
- [Reddit r/mysql](https://reddit.com/r/mysql) - MySQL community
- [Dev.to](https://dev.to/) - Developer community

### Quick Reference

**Default Credentials:**
```
Admin User:
- Username: admin
- Password: iware123 (CHANGE THIS!)
- Email: admin@iware.com

Database:
- Host: localhost
- Port: 3306
- Database: iware_warehouse
- User: iware_user
- Password: (set during installation)
```

**Important Paths:**
```
Application:
- Backend: /var/www/werehouse.iw/backend
- Frontend: /var/www/werehouse.iw/frontend
- Frontend Build: /var/www/iware-frontend

Configuration:
- Backend .env: /var/www/werehouse.iw/backend/.env
- Nginx config: /etc/nginx/sites-available/iware
- MySQL config: /etc/mysql/mysql.conf.d/mysqld.cnf
- phpMyAdmin config: /etc/phpmyadmin/config.inc.php

Logs:
- PM2 logs: ~/.pm2/logs/
- Nginx access: /var/log/nginx/access.log
- Nginx error: /var/log/nginx/error.log
- MySQL error: /var/log/mysql/error.log
- MySQL slow query: /var/log/mysql/slow-query.log

Backups:
- Database backups: /var/backups/iware/
```

**Port Numbers:**
```
- Frontend (dev): 5173
- Backend: 5000
- MySQL: 3306
- Nginx HTTP: 80
- Nginx HTTPS: 443
- phpMyAdmin: 80 (via Nginx)
```

**Environment Variables:**
```
Backend (.env):
- PORT=5000
- NODE_ENV=production
- DB_HOST=localhost
- DB_PORT=3306
- DB_USER=iware_user
- DB_PASSWORD=<your-password>
- DB_NAME=iware_warehouse
- JWT_SECRET=<64-char-hex>
- JWT_EXPIRE=7d

Frontend (.env):
- VITE_API_URL=http://yourdomain.com/api
```

---

## 📋 Glossary

**Terms & Definitions:**

- **PaaS**: Platform as a Service - Cloud platform yang manage infrastructure
- **VPS**: Virtual Private Server - Virtual machine di cloud
- **CDN**: Content Delivery Network - Distributed server network untuk fast delivery
- **SSL/TLS**: Secure Sockets Layer/Transport Layer Security - Encryption protocol
- **JWT**: JSON Web Token - Authentication token format
- **CORS**: Cross-Origin Resource Sharing - HTTP header-based mechanism
- **PM2**: Process Manager 2 - Production process manager untuk Node.js
- **Nginx**: High-performance web server dan reverse proxy
- **MySQL**: Open-source relational database management system
- **phpMyAdmin**: Web-based MySQL administration tool
- **InnoDB**: MySQL storage engine dengan transaction support
- **Reverse Proxy**: Server yang forward requests ke backend servers
- **Load Balancer**: Distribute traffic across multiple servers
- **Firewall**: Network security system yang monitor traffic
- **SSH**: Secure Shell - Encrypted network protocol
- **Cron**: Time-based job scheduler di Unix-like systems
- **Dump**: Database backup file
- **Migration**: Database schema change script
- **Rollback**: Revert changes to previous state
- **Uptime**: Time system has been running
- **Latency**: Time delay in data transmission
- **Throughput**: Amount of data processed in time period

---

## 📄 License & Credits

**iWare Warehouse Management System**

- **Version**: 1.0.0
- **Last Updated**: January 2026
- **Maintainer**: iWare Development Team
- **License**: Proprietary (Internal Use Only)

**Built With:**
- React + Vite + TailwindCSS
- Node.js + Express
- MySQL + phpMyAdmin
- Railway + Vercel
- Nginx + PM2

**Special Thanks:**
- Railway team untuk excellent PaaS platform
- Vercel team untuk fast CDN deployment
- MySQL team untuk robust database
- phpMyAdmin team untuk great admin tool
- Open source community

---

## 📝 Changelog

### Version 1.0.0 (January 2026)
- ✅ Initial deployment documentation
- ✅ Railway deployment guide
- ✅ VPS deployment guide (Ubuntu)
- ✅ Vercel + Railway hybrid deployment
- ✅ MySQL setup dan configuration
- ✅ phpMyAdmin installation dan setup
- ✅ Comprehensive troubleshooting section
- ✅ Database backup/restore procedures
- ✅ Security best practices
- ✅ Performance optimization tips
- ✅ Monitoring setup guide
- ✅ Maintenance procedures
- ✅ Complete checklist

### Future Updates
- [ ] Docker deployment guide
- [ ] Kubernetes deployment guide
- [ ] AWS deployment guide
- [ ] Azure deployment guide
- [ ] Database replication setup
- [ ] Load balancer configuration
- [ ] CI/CD pipeline setup
- [ ] Automated testing guide

---

**🎉 Selamat! Anda telah menyelesaikan deployment iWare Warehouse Management System.**

Jika ada pertanyaan atau masalah, jangan ragu untuk menghubungi tim development atau buka issue di GitHub repository.

**Happy Deploying! 🚀**
