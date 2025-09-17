// Environment configuration for the Agri-Culture project
// This file fetches configuration from the server's /api/config endpoint
// The actual API keys are stored in the .env file on the server

window.ENV = window.ENV || {};

// Function to load environment configuration from server
async function loadEnvironmentConfig() {
    try {
        const response = await fetch('/api/config');
        if (response.ok) {
            const config = await response.json();
            window.ENV.MAPS_API_KEY = config.MAPS_API_KEY;
            window.ENV.ENROLL_API_BASE = config.ENROLL_API_BASE;
            
            // Dispatch event when config is loaded
            window.dispatchEvent(new CustomEvent('envConfigLoaded', { detail: config }));
            
            console.log('Environment configuration loaded successfully');
        } else {
            console.error('Failed to load environment configuration');
        }
    } catch (error) {
        console.error('Error loading environment configuration:', error);
        // Fallback to default values
        window.ENV.MAPS_API_KEY = window.ENV.MAPS_API_KEY || "";
        window.ENV.ENROLL_API_BASE = window.ENV.ENROLL_API_BASE || "http://localhost:5000";
    }
}

// Load configuration when the script loads
loadEnvironmentConfig();



