-- Script untuk memastikan user admin ada dengan password yang benar
-- Password: iware123

-- Hapus user admin jika ada
DELETE FROM users WHERE username = 'admin';

-- Insert user admin baru dengan password hash yang benar
INSERT INTO users (username, password, full_name, email, role) 
VALUES (
  'admin', 
  '$2a$10$D/s19.cu7IjgZrv6gaKqHOR7nXo773uC1zSpzusGFonMbD1ToXfYm', 
  'Administrator', 
  'admin@iware.com', 
  'superadmin'
);

-- Verifikasi user berhasil dibuat
SELECT id, username, full_name, email, role, created_at FROM users WHERE username = 'admin';
