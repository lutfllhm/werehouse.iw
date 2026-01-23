#!/usr/bin/env node

/**
 * Generate JWT Secret untuk Railway
 * 
 * Script ini generate random string yang aman untuk JWT_SECRET
 * Jalankan: node scripts/generate-jwt-secret.js
 */

const crypto = require('crypto');

console.log('\n🔐 JWT Secret Generator\n');
console.log('Copy secret ini ke Railway environment variables:\n');
console.log('━'.repeat(80));
console.log(crypto.randomBytes(64).toString('hex'));
console.log('━'.repeat(80));
console.log('\nVariable name: JWT_SECRET\n');
