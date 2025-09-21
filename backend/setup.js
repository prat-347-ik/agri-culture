#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Agri-Culture Backend...\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  try {
    fs.copyFileSync(path.join(__dirname, 'env.example'), envPath);
    console.log('✅ .env file created successfully');
    console.log('⚠️  Please edit .env file with your database credentials\n');
  } catch (error) {
    console.error('❌ Failed to create .env file:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Dependencies installed successfully\n');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies already installed');
}

// Create upload directories
console.log('📁 Creating upload directories...');
const uploadDirs = [
  './uploads',
  './uploads/products',
  './uploads/rentals',
  './uploads/enrollments',
  './uploads/farms',
  './uploads/users'
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Edit .env file with your database credentials');
console.log('2. Create PostgreSQL database: createdb agri_culture');
console.log('3. Run: npm run dev');
console.log('4. In another terminal, run: npm run seed');
console.log('\n🔗 API will be available at: http://localhost:5000');
console.log('📊 Admin login: admin@agri-culture.com / admin123');

