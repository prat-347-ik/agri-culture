# Agri-Culture Project Setup Guide

## Environment Configuration

This project now uses a `.env` file approach for managing environment variables, including your HERE Maps API key.

### Step 1: Create the .env file

1. In your project root directory, create a file named `.env`
2. Copy the content from `env-template.txt` into your `.env` file
3. Replace `your_actual_here_maps_api_key_here` with your real HERE Maps API key

Example `.env` file:
```
HERE_MAPS_API_KEY=abc123xyz789
ENROLL_API_BASE=http://localhost:5000
PORT=3000
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start the Server

```bash
npm start
```

Or for development with auto-restart:
```bash
npm run dev
```

## How It Works

1. **Server-side**: The Node.js server reads the `.env` file and loads environment variables
2. **API Endpoint**: The server provides a `/api/config` endpoint that serves configuration to the frontend
3. **Frontend**: The `Frontend/env.js` file fetches configuration from the server when the page loads
4. **Maps Integration**: Your map section automatically gets the API key from the environment configuration

## File Structure

```
agri-culture/
├── .env                    # Your environment variables (create this)
├── .env.example           # Template (not created due to security)
├── env-template.txt       # Template for .env file
├── config/
│   └── config.js         # Server-side configuration loader
├── Frontend/
│   ├── env.js            # Frontend configuration loader
│   ├── map.html          # Map page (uses API key)
│   └── ...               # Other frontend files
├── server.js              # Node.js server
└── package.json           # Dependencies
```

## Security Notes

- **Never commit your `.env` file** to version control
- The `.env` file is already in `.gitignore` (if not, add it)
- Your API keys are only stored locally and served through the server

## Troubleshooting

- If you see "HERE Maps API key is missing" in the console, make sure your `.env` file exists and has the correct format
- Check that the server is running on the correct port
- Verify that your `.env` file is in the project root directory
