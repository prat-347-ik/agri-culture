import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import axios from 'axios';

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        // --- FIX 1: User.findById() takes the ID string directly ---
            const user = await User.findById(req.user.userId).select('-password');        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // --- FIX 2: Get coordinates from the nested 'location' object ---
        
        // 2a. Check if the location object and coordinates exist
        if (!user.location || !user.location.coordinates || user.location.coordinates.length < 2) {
            return res.status(400).json({ msg: 'Set your location in Profile to see weather.' });
        }

        // 2b. Destructure the coordinates in the correct order: [longitude, latitude]
        const [longitude, latitude] = user.location.coordinates;

        // 3. Get API key from environment
        const API_KEY = process.env.OPENWEATHER_API_KEY;
        if (!API_KEY) {
            console.error('OPENWEATHER_API_KEY not set on server');
            return res.status(500).json({ msg: 'Server configuration error' });
        }

        // 4. Call OpenWeatherMap API
        // This part is now correct because 'latitude' and 'longitude' are defined
        const API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
        
        const weatherResponse = await axios.get(API_URL);

        // 5. Send response to client
        res.json(weatherResponse.data);

    } catch (err) {
        if (err.response && err.response.status === 401) {
            console.error('Invalid OpenWeatherMap API Key on server');
            return res.status(500).json({ msg: 'Server error' });
        }
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;