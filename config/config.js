// Configuration file for the Agri-Culture project
// This file reads environment variables and provides them to the application

const path = require('path');
const fs = require('fs');

// Load environment variables from .env file if it exists
function loadEnvFile() {
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const envVars = {};
        
        envContent.split('\n').forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const [key, ...valueParts] = trimmedLine.split('=');
                if (key && valueParts.length > 0) {
                    envVars[key.trim()] = valueParts.join('=').trim();
                }
            }
        });
        
        return envVars;
    }
    return {};
}

// Load environment variables
const envVars = loadEnvFile();

// Configuration object
const config = {
    // HERE Maps API Configuration
    HERE_MAPS_API_KEY: envVars.HERE_MAPS_API_KEY || process.env.HERE_MAPS_API_KEY || '',
    
    // API Configuration
    ENROLL_API_BASE: envVars.ENROLL_API_BASE || process.env.ENROLL_API_BASE || 'http://localhost:5000',
    
    // Server Configuration
    PORT: envVars.PORT || process.env.PORT || 3000,
    
    // Database Configuration (if needed later)
    DATABASE_URL: envVars.DATABASE_URL || process.env.DATABASE_URL || '',
    
    // JWT Secret (if needed later)
    JWT_SECRET: envVars.JWT_SECRET || process.env.JWT_SECRET || '',
};

// Validate required configuration
function validateConfig() {
    const required = ['HERE_MAPS_API_KEY'];
    const missing = required.filter(key => !config[key]);
    
    if (missing.length > 0) {
        console.warn(`Warning: Missing required environment variables: ${missing.join(', ')}`);
        console.warn('Please create a .env file in the project root with the required variables.');
    }
}

// Export configuration
module.exports = {
    config,
    validateConfig,
    loadEnvFile
};
