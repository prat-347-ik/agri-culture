const express = require('express');
const path = require('path');
const { config, validateConfig } = require('./config/config');

const app = express();
const PORT = config.PORT;

// Validate configuration on startup
validateConfig();

// Serve static files from Frontend directory
app.use(express.static(path.join(__dirname, 'Frontend')));

// API endpoint to provide environment variables to frontend
app.get('/api/config', (req, res) => {
    res.json({
        MAPS_API_KEY: config.HERE_MAPS_API_KEY,
        ENROLL_API_BASE: config.ENROLL_API_BASE
    });
});

// Serve the main HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

app.get('/map', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'map.html'));
});

app.get('/enroll', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'enroll.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'admin.html'));
});

app.get('/marketplace', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'marketplace.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'profile.html'));
});

app.get('/contacts', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'contacts.html'));
});

app.get('/etc', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'etc.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'home.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend', 'login.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`HERE Maps API Key: ${config.HERE_MAPS_API_KEY ? '✓ Configured' : '✗ Missing'}`);
    console.log(`API Base URL: ${config.ENROLL_API_BASE}`);
});
