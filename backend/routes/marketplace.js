const express = require('express');
const { Product, Bid, Category, User, Image } = require('../models');
const { auth, optionalAuth } = require('../middleware/auth');
const { Op } = require('sequelize');
const router = express.Router();

// @route   GET /api/marketplace/products
// @desc    Get all products with filtering and pagination
// @access  Public
router.get('/products', optionalAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      qualityGrade,
      organicCertified,
      location,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { status: 'active' };

    // Apply filters
    if (category) whereClause.category_id = category;
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = minPrice;
      if (maxPrice) whereClause.price[Op.lte] = maxPrice;
    }
    if (qualityGrade) whereClause.qualityGrade = qualityGrade;
    if (organicCertified !== undefined) whereClause.organicCertified = organicCertified === 'true';
    if (location) whereClause.location = { [Op.iLike]: `%${location}%` };

    const products = await Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'fullName', 'phone', 'location']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'icon', 'color']
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
      order: [[sortBy, sortOrder]]
    });

    res.json({
      success: true,
      data: {
        products: products.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(products.count / limit),
          totalItems: products.count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// @route   GET /api/marketplace/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/products/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'fullName', 'phone', 'location', 'isVerified']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'icon', 'color']
        },
        {
          model: Image,
          as: 'images',
          attributes: ['id', 'url', 'isPrimary'],
          order: [['isPrimary', 'DESC'], ['sortOrder', 'ASC']]
        },
        {
          model: Bid,
          as: 'bids',
          include: [
            {
              model: User,
              as: 'bidder',
              attributes: ['id', 'fullName']
            }
          ],
          order: [['amount', 'DESC']],
          limit: 10
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    await product.increment('views');

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

// @route   POST /api/marketplace/products
// @desc    Create new product
// @access  Private
router.post('/products', auth, async (req, res) => {
  try {
    const {
      category_id,
      name,
      description,
      price,
      unit,
      quantity,
      minOrderQuantity,
      qualityGrade,
      organicCertified,
      additionalCertifications,
      location,
      deliveryAvailable,
      deliveryCharges,
      isBidding,
      biddingEndTime,
      startingBid
    } = req.body;

    const product = await Product.create({
      user_id: req.user.id,
      category_id,
      name,
      description,
      price,
      unit,
      quantity,
      minOrderQuantity,
      qualityGrade,
      organicCertified,
      additionalCertifications,
      location,
      deliveryAvailable,
      deliveryCharges,
      isBidding,
      biddingEndTime,
      startingBid,
      currentBid: startingBid
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Product creation failed',
      error: error.message
    });
  }
});

// @route   PUT /api/marketplace/products/:id
// @desc    Update product
// @access  Private
router.put('/products/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updatedProduct = await product.update(req.body);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product: updatedProduct }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Product update failed',
      error: error.message
    });
  }
});

// @route   DELETE /api/marketplace/products/:id
// @desc    Delete product
// @access  Private
router.delete('/products/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await product.destroy();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Product deletion failed',
      error: error.message
    });
  }
});

// @route   POST /api/marketplace/products/:id/bid
// @desc    Place a bid on a product
// @access  Private
router.post('/products/:id/bid', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, message } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.isBidding) {
      return res.status(400).json({
        success: false,
        message: 'This product is not available for bidding'
      });
    }

    if (product.user_id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot bid on your own product'
      });
    }

    if (product.biddingEndTime && new Date() > new Date(product.biddingEndTime)) {
      return res.status(400).json({
        success: false,
        message: 'Bidding has ended for this product'
      });
    }

    if (amount <= (product.currentBid || product.startingBid || 0)) {
      return res.status(400).json({
        success: false,
        message: 'Bid amount must be higher than current bid'
      });
    }

    // Create bid
    const bid = await Bid.create({
      user_id: req.user.id,
      product_id: id,
      amount,
      message
    });

    // Update product current bid
    await product.update({ currentBid: amount });

    res.status(201).json({
      success: true,
      message: 'Bid placed successfully',
      data: { bid }
    });
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Bid placement failed',
      error: error.message
    });
  }
});

// @route   GET /api/marketplace/categories
// @desc    Get all categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true },
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    });
  }
});

module.exports = router;

