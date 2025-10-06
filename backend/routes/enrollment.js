const express = require('express');
const { Enrollment, User, Image } = require('../models');
const { auth, adminAuth } = require('../middleware/auth');
const { Op } = require('sequelize');
// --- CHANGE 1: Import Multer middleware ---
const { upload, handleUploadError } = require('../middleware/upload');
// ------------------------------------------
const router = express.Router();

// @route   POST /api/enroll
// @desc    Submit enrollment form
// @access  Public (for now, can be made private later)

// --- CHANGE 2: Add Multer middleware to handle multipart form data ---
router.post('/', upload.array('images', 5), handleUploadError, async (req, res) => {
// ---------------------------------------------------------------------

  try {
    // Files are now in req.files, fields are in req.body
    const { type, ...data } = req.body;
    const images = req.files; // Use req.files array

    // Create enrollment record (data is already parsed from form fields)
    // NOTE: Frontend logic ensures we pass flat data for Enrollment model fields.
    const enrollment = await Enrollment.create({
      type: type,
      ...data, // This relies on form field names matching Enrollment model fields
      status: 'pending'
    });

    // Handle image uploads (metadata only, files are saved on disk by Multer)
    if (images && images.length > 0) {
      const imageRecords = images.map((file, index) => ({
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        // Path saved relative to the server upload directory
        path: file.path.replace(/\\/g, '/').replace('uploads', '/uploads'),
        url: `${req.protocol}://${req.get('host')}/uploads/enrollments/${file.filename}`, // Construct a real URL
        enrollment_id: enrollment.id,
        isPrimary: index === 0,
        sortOrder: index
      }));

      await Image.bulkCreate(imageRecords);
    }

    res.status(201).json({
      success: true,
      message: 'Enrollment submitted successfully',
      data: { enrollment }
    });
  } catch (error) {
    console.error('Enrollment submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Enrollment submission failed',
      error: error.message
    });
  }
});

// @route   GET /api/enroll
// @desc    Get all enrollments (admin only)
// @access  Private/Admin
router.get('/', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      status,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (type) whereClause.type = type;
    if (status) whereClause.status = status;
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const enrollments = await Enrollment.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phone']
        },
        {
          model: Image,
          as: 'images',
          attributes: ['id', 'url', 'isPrimary'],
          order: [['isPrimary', 'DESC'], ['sortOrder', 'ASC']]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        enrollments: enrollments.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(enrollments.count / limit),
          totalItems: enrollments.count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollments',
      error: error.message
    });
  }
});

// @route   GET /api/enroll/:id
// @desc    Get single enrollment
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phone']
        },
        {
          model: Image,
          as: 'images',
          attributes: ['id', 'url', 'isPrimary'],
          order: [['isPrimary', 'DESC'], ['sortOrder', 'ASC']]
        }
      ]
    });

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Users can only view their own enrollments unless they're admin
    if (enrollment.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { enrollment }
    });
  } catch (error) {
    console.error('Get enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollment',
      error: error.message
    });
  }
});

// @route   PUT /api/enroll/:id/status
// @desc    Update enrollment status (admin only)
// @access  Private/Admin
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    const updatedEnrollment = await enrollment.update({
      status,
      adminNotes
    });

    res.json({
      success: true,
      message: 'Enrollment status updated successfully',
      data: { enrollment: updatedEnrollment }
    });
  } catch (error) {
    console.error('Update enrollment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Status update failed',
      error: error.message
    });
  }
});

// @route   GET /api/enroll/user/:userId
// @desc    Get user's enrollments
// @access  Private
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Users can only view their own enrollments unless they're admin
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const enrollments = await Enrollment.findAll({
      where: { user_id: userId },
      include: [
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
      data: { enrollments }
    });
  } catch (error) {
    console.error('Get user enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user enrollments',
      error: error.message
    });
  }
});

module.exports = router;

