const express = require('express');
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
// @desc    Get weather data for a location (placeholder)
// @access  Public
router.get('/weather', async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    // This is a placeholder - in a real app, you'd integrate with a weather API
    const weatherData = {
      temperature: 25,
      humidity: 60,
      windSpeed: 10,
      condition: 'sunny',
      forecast: [
        { day: 'Today', high: 28, low: 22, condition: 'sunny' },
        { day: 'Tomorrow', high: 26, low: 20, condition: 'partly_cloudy' },
        { day: 'Day After', high: 24, low: 18, condition: 'rainy' }
      ]
    };

    res.json({
      success: true,
      data: { weather: weatherData }
    });
  } catch (error) {
    console.error('Get weather error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch weather data',
      error: error.message
    });
  }
});

module.exports = router;

