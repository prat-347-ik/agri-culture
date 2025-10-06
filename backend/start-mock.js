#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Agri-Culture Backend in MOCK MODE...\n');

// Create minimal .env file if it doesn't exist
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating minimal .env file...');
  const envContent = `# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# Database Configuration (will use mock mode if not available)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=agri_culture
DB_USER=postgres
DB_PASSWORD=your_password_here

# JWT Configuration
JWT_SECRET=mock-jwt-secret-for-testing
JWT_EXPIRES_IN=7d

# HERE Maps API (optional)
HERE_MAPS_API_KEY=your_here_maps_api_key_here

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created');
} else {
  console.log('✅ .env file already exists');
}

// Start the server
console.log('🚀 Starting server...');
require('./server.js');
