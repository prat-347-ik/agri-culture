const express = require('express');
const axios = require('axios');
const { Farm, User, Image } = require('../models');
const { auth, optionalAuth } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

// @route   GET /api/map/farms
// @desc    Get all farms for map display
// @access  Public
router.get('/farms', optionalAuth, async (req, res) => {
  try {
    const {
      type,
      search,
      lat,
      lng,
      radius = 10 // in kilometers
    } = req.query;

    const whereClause = { status: 'active' };

    // Apply type filter
    if (type && type !== 'all') {
      whereClause.type = type;
    }

    // Apply search filter
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { crops: { [Op.iLike]: `%${search}%` } },
        { equipment: { [Op.iLike]: `%${search}%` } },
        { services: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Apply location filter if coordinates provided
    if (lat && lng) {
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      const radiusKm = parseFloat(radius);

      // Simple bounding box calculation (not precise but fast)
      const latDelta = radiusKm / 111; // Rough conversion: 1 degree ≈ 111 km
      const lngDelta = radiusKm / (111 * Math.cos(latNum * Math.PI / 180));

      whereClause.latitude = {
        [Op.between]: [latNum - latDelta, latNum + latDelta]
      };
      whereClause.longitude = {
        [Op.between]: [lngNum - lngDelta, lngNum + lngDelta]
      };
    }

    const farms = await Farm.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'fullName', 'phone', 'isVerified']
        },
        {
          model: Image,
          as: 'images',
          attributes: ['id', 'url', 'isPrimary'],
          order: [['isPrimary', 'DESC'], ['sortOrder', 'ASC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { farms }
    });
  } catch (error) {
    console.error('Get farms error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch farms',
      error: error.message
    });
  }
});

// @route   GET /api/map/farms/:id
// @desc    Get single farm by ID
// @access  Public
router.get('/farms/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const farm = await Farm.findByPk(id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'fullName', 'phone', 'email', 'isVerified']
        },
        {
          model: Image,
          as: 'images',
          attributes: ['id', 'url', 'isPrimary'],
          order: [['isPrimary', 'DESC'], ['sortOrder', 'ASC']]
        }
      ]
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found'
      });
    }

    res.json({
      success: true,
      data: { farm }
    });
  } catch (error) {
    console.error('Get farm error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch farm',
      error: error.message
    });
  }
});

// @route   POST /api/map/farms
// @desc    Create new farm
// @access  Private
router.post('/farms', auth, async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      latitude,
      longitude,
      address,
      icon,
      contactPhone,
      contactEmail,
      website,
      operatingHours,
      facilities,
      crops,
      equipment,
      services
    } = req.body;

    const farm = await Farm.create({
      user_id: req.user.id,
      name,
      description,
      type,
      latitude,
      longitude,
      address,
      icon,
      contactPhone,
      contactEmail,
      website,
      operatingHours,
      facilities,
      crops,
      equipment,
      services
    });

    res.status(201).json({
      success: true,
      message: 'Farm created successfully',
      data: { farm }
    });
  } catch (error) {
    console.error('Create farm error:', error);
    res.status(500).json({
      success: false,
      message: 'Farm creation failed',
      error: error.message
    });
  }
});

// @route   PUT /api/map/farms/:id
// @desc    Update farm
// @access  Private
router.put('/farms/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const farm = await Farm.findByPk(id);

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found'
      });
    }

    // Check ownership
    if (farm.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updatedFarm = await farm.update(req.body);

    res.json({
      success: true,
      message: 'Farm updated successfully',
      data: { farm: updatedFarm }
    });
  } catch (error) {
    console.error('Update farm error:', error);
    res.status(500).json({
      success: false,
      message: 'Farm update failed',
      error: error.message
    });
  }
});

// @route   DELETE /api/map/farms/:id
// @desc    Delete farm
// @access  Private
router.delete('/farms/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const farm = await Farm.findByPk(id);

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: 'Farm not found'
      });
    }

    // Check ownership
    if (farm.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await farm.destroy();

    res.json({
      success: true,
      message: 'Farm deleted successfully'
    });
  } catch (error) {
    console.error('Delete farm error:', error);
    res.status(500).json({
      success: false,
      message: 'Farm deletion failed',
      error: error.message
    });
  }
});

// @route   GET /api/map/weather
// @desc    Get weather data for a location using OpenWeatherMap API
// @access  Public
router.get('/weather', async (req, res) => {
  try {
    const { lat, lng, units = 'metric' } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    // If no API key is configured, return mock data with a notice
    if (!apiKey) {
      console.log('⚠️  OpenWeather API key not configured, returning mock weather data');
      const mockWeatherData = {
        temperature: Math.round(20 + Math.random() * 15), // 20-35°C
        humidity: Math.round(40 + Math.random() * 40), // 40-80%
        windSpeed: Math.round(Math.random() * 20), // 0-20 km/h
        condition: ['sunny', 'partly_cloudy', 'cloudy', 'rainy'][Math.floor(Math.random() * 4)],
        description: 'Weather data unavailable - API key not configured',
        location: `${parseFloat(lat).toFixed(2)}, ${parseFloat(lng).toFixed(2)}`,
        forecast: [
          { day: 'Today', high: 28, low: 22, condition: 'sunny', description: 'Clear sky' },
          { day: 'Tomorrow', high: 26, low: 20, condition: 'partly_cloudy', description: 'Partly cloudy' },
          { day: 'Day After', high: 24, low: 18, condition: 'rainy', description: 'Light rain' }
        ],
        isMockData: true
      };
      
      return res.json({
        success: true,
        data: { weather: mockWeatherData }
      });
    }

    try {
      // Fetch current weather data
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=${units}`;
      const currentResponse = await axios.get(currentWeatherUrl, { timeout: 5000 });
      const current = currentResponse.data;
      
      // Fetch 5-day forecast data
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=${units}`;
      const forecastResponse = await axios.get(forecastUrl, { timeout: 5000 });
      const forecast = forecastResponse.data;
      
      // Process forecast data - get daily averages from 5-day forecast
      const dailyForecast = [];
      const days = ['Today', 'Tomorrow', 'Day After'];
      
      for (let i = 0; i < 3 && i * 8 < forecast.list.length; i++) {
        const dayData = forecast.list.slice(i * 8, (i + 1) * 8);
        if (dayData.length > 0) {
          const temps = dayData.map(item => item.main.temp);
          const conditions = dayData.map(item => item.weather[0].main.toLowerCase());
          const descriptions = dayData.map(item => item.weather[0].description);
          
          dailyForecast.push({
            day: days[i],
            high: Math.round(Math.max(...temps)),
            low: Math.round(Math.min(...temps)),
            condition: getMostCommonCondition(conditions),
            description: descriptions[0] // Use first description of the day
          });
        }
      }
      
      const weatherData = {
        temperature: Math.round(current.main.temp),
        humidity: current.main.humidity,
        windSpeed: Math.round(current.wind?.speed * 3.6 || 0), // Convert m/s to km/h
        condition: mapWeatherCondition(current.weather[0].main),
        description: current.weather[0].description,
        location: current.name || `${parseFloat(lat).toFixed(2)}, ${parseFloat(lng).toFixed(2)}`,
        pressure: current.main.pressure,
        visibility: current.visibility ? Math.round(current.visibility / 1000) : null, // Convert m to km
        uvIndex: null, // Would need separate UV API call
        forecast: dailyForecast,
        isMockData: false,
        timestamp: new Date().toISOString()
      };
      
      res.json({
        success: true,
        data: { weather: weatherData }
      });
      
    } catch (apiError) {
      console.error('OpenWeather API error:', apiError.message);
      
      // Fallback to mock data if API fails
      const fallbackWeatherData = {
        temperature: Math.round(20 + Math.random() * 15),
        humidity: Math.round(40 + Math.random() * 40),
        windSpeed: Math.round(Math.random() * 20),
        condition: 'partly_cloudy',
        description: 'Weather API temporarily unavailable',
        location: `${parseFloat(lat).toFixed(2)}, ${parseFloat(lng).toFixed(2)}`,
        forecast: [
          { day: 'Today', high: 28, low: 22, condition: 'sunny', description: 'Data unavailable' },
          { day: 'Tomorrow', high: 26, low: 20, condition: 'partly_cloudy', description: 'Data unavailable' },
          { day: 'Day After', high: 24, low: 18, condition: 'cloudy', description: 'Data unavailable' }
        ],
        isMockData: true,
        error: 'API temporarily unavailable'
      };
      
      res.json({
        success: true,
        data: { weather: fallbackWeatherData }
      });
    }
    
  } catch (error) {
    console.error('Get weather error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather data',
      error: error.message
    });
  }
});

// Helper function to map OpenWeatherMap conditions to our internal conditions
function mapWeatherCondition(condition) {
  const conditionMap = {
    'Clear': 'sunny',
    'Clouds': 'cloudy',
    'Rain': 'rainy',
    'Drizzle': 'rainy',
    'Thunderstorm': 'stormy',
    'Snow': 'snowy',
    'Mist': 'misty',
    'Smoke': 'misty',
    'Haze': 'misty',
    'Dust': 'misty',
    'Fog': 'misty',
    'Sand': 'misty',
    'Ash': 'misty',
    'Squall': 'windy',
    'Tornado': 'stormy'
  };
  
  return conditionMap[condition] || 'partly_cloudy';
}

// Helper function to get the most common weather condition from a list
function getMostCommonCondition(conditions) {
  const counts = {};
  conditions.forEach(condition => {
    counts[condition] = (counts[condition] || 0) + 1;
  });
  
  let maxCount = 0;
  let mostCommon = 'partly_cloudy';
  
  Object.entries(counts).forEach(([condition, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = mapWeatherCondition(condition.charAt(0).toUpperCase() + condition.slice(1));
    }
  });
  
  return mostCommon;
}

module.exports = router;

