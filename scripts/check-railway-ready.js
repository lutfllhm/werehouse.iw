#!/usr/bin/env node

/**
 * Check Railway Deployment Readiness
 * 
 * Script ini mengecek apakah aplikasi siap untuk deploy ke Railway
 * Jalankan: node scripts/check-railway-ready.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🚂 Railway Deployment Readiness Check\n');

const checks = [];

// Check 1: Railway config files
const railwayFiles = [
  'railway.json',
  'backend/railway.json',
  'frontend/railway.json',
  'DEPLOYMENT.md',
  'RAILWAY_SETUP.md'
];

railwayFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  checks.push({
    name: `File ${file}`,
    status: exists,
    message: exists ? '✅ Found' : '❌ Missing'
  });
});

// Check 2: Package.json files
const packageFiles = [
  'backend/package.json',
  'frontend/package.json'
];

packageFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  if (exists) {
    const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), file), 'utf8'));
    const hasStart = pkg.scripts && pkg.scripts.start;
    checks.push({
      name: `${file} start script`,
      status: hasStart,
      message: hasStart ? '✅ Found' : '❌ Missing start script'
    });
  }
});

// Check 3: Database schema
const schemaExists = fs.existsSync(path.join(process.cwd(), 'database/schema.sql'));
checks.push({
  name: 'Database schema',
  status: schemaExists,
  message: schemaExists ? '✅ Found' : '❌ Missing database/schema.sql'
});

// Check 4: Environment examples
const envFiles = [
  'backend/.env.example',
  'frontend/.env.example',
  '.env.railway.example'
];

envFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  checks.push({
    name: `File ${file}`,
    status: exists,
    message: exists ? '✅ Found' : '⚠️  Missing (optional)'
  });
});

// Check 5: Gitignore
const gitignoreExists = fs.existsSync(path.join(process.cwd(), '.gitignore'));
if (gitignoreExists) {
  const gitignore = fs.readFileSync(path.join(process.cwd(), '.gitignore'), 'utf8');
  const hasEnv = gitignore.includes('.env');
  checks.push({
    name: '.gitignore includes .env',
    status: hasEnv,
    message: hasEnv ? '✅ Protected' : '⚠️  .env files not ignored'
  });
}

// Print results
console.log('Checklist:\n');
checks.forEach(check => {
  console.log(`${check.message} - ${check.name}`);
});

const allPassed = checks.filter(c => !c.status && !c.message.includes('optional')).length === 0;

console.log('\n' + '━'.repeat(60));
if (allPassed) {
  console.log('✅ Aplikasi siap untuk deploy ke Railway!');
  console.log('\nNext steps:');
  console.log('1. Push code ke GitHub');
  console.log('2. Buka railway.app dan buat project baru');
  console.log('3. Follow RAILWAY_SETUP.md untuk deployment');
} else {
  console.log('⚠️  Ada beberapa file yang perlu disiapkan');
  console.log('Lihat checklist di atas untuk detail');
}
console.log('━'.repeat(60) + '\n');
