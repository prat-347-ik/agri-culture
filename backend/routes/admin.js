const express = require('express');
const { User, Product, Bid, Rental, Enrollment, Farm, Category } = require('../models');
const { adminAuth } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalBids,
      totalRentals,
      totalEnrollments,
      totalFarms,
      recentUsers,
      recentEnrollments
    ] = await Promise.all([
      User.count(),
      Product.count(),
      Bid.count(),
      Rental.count(),
      Enrollment.count(),
      Farm.count(),
      User.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'fullName', 'email', 'role', 'createdAt']
      }),
      Enrollment.findAll({
        limit: 5,
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'fullName', 'email']
          }
        ]
      })
    ]);

    const stats = {
      users: {
        total: totalUsers,
        verified: await User.count({ where: { isVerified: true } }),
        active: await User.count({ where: { isActive: true } })
      },
      products: {
        total: totalProducts,
        active: await Product.count({ where: { status: 'active' } }),
        bidding: await Product.count({ where: { isBidding: true } })
      },
      bids: {
        total: totalBids,
        active: await Bid.count({ where: { status: 'active' } })
      },
      rentals: {
        total: totalRentals,
        available: await Rental.count({ where: { availabilityStatus: 'available' } })
      },
      enrollments: {
        total: totalEnrollments,
        pending: await Enrollment.count({ where: { status: 'pending' } }),
        approved: await Enrollment.count({ where: { status: 'approved' } })
      },
      farms: {
        total: totalFarms,
        active: await Farm.count({ where: { status: 'active' } })
      }
    };

    res.json({
      success: true,
      data: {
        stats,
        recentUsers,
        recentEnrollments
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with admin filters
// @access  Private/Admin
router.get('/users', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    if (role) whereClause.role = role;
    if (status === 'active') whereClause.isActive = true;
    if (status === 'inactive') whereClause.isActive = false;
    if (status === 'verified') whereClause.isVerified = true;
    if (status === 'unverified') whereClause.isVerified = false;
    if (search) {
      whereClause[Op.or] = [
        { fullName: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
        { phone: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const users = await User.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder]]
    });

    res.json({
      success: true,
      data: {
        users: users.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(users.count / limit),
          totalItems: users.count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// @route   GET /api/admin/enrollments
// @desc    Get all enrollments with admin filters
// @access  Private/Admin
router.get('/enrollments', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
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
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, sortOrder]]
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
    console.error('Get admin enrollments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enrollments',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/enrollments/:id/approve
// @desc    Approve enrollment
// @access  Private/Admin
router.put('/enrollments/:id/approve', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    const updatedEnrollment = await enrollment.update({
      status: 'approved',
      adminNotes
    });

    res.json({
      success: true,
      message: 'Enrollment approved successfully',
      data: { enrollment: updatedEnrollment }
    });
  } catch (error) {
    console.error('Approve enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Enrollment approval failed',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/enrollments/:id/reject
// @desc    Reject enrollment
// @access  Private/Admin
router.put('/enrollments/:id/reject', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    const updatedEnrollment = await enrollment.update({
      status: 'rejected',
      adminNotes
    });

    res.json({
      success: true,
      message: 'Enrollment rejected successfully',
      data: { enrollment: updatedEnrollment }
    });
  } catch (error) {
    console.error('Reject enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Enrollment rejection failed',
      error: error.message
    });
  }
});

// @route   GET /api/admin/categories
// @desc    Get all categories for admin management
// @access  Private/Admin
router.get('/categories', adminAuth, async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get admin categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

// @route   POST /api/admin/categories
// @desc    Create new category
// @access  Private/Admin
router.post('/categories', adminAuth, async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      parentId,
      icon,
      color,
      sortOrder
    } = req.body;

    const category = await Category.create({
      name,
      description,
      type,
      parentId,
      icon,
      color,
      sortOrder
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Category creation failed',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/categories/:id
// @desc    Update category
// @access  Private/Admin
router.put('/categories/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const updatedCategory = await category.update(req.body);

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category: updatedCategory }
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Category update failed',
      error: error.message
    });
  }
});

// @route   DELETE /api/admin/categories/:id
// @desc    Delete category
// @access  Private/Admin
router.delete('/categories/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    await category.destroy();

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Category deletion failed',
      error: error.message
    });
  }
});

module.exports = router;

