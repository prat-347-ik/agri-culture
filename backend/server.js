const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const { connectDB } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const marketplaceRoutes = require('./routes/marketplace');
const enrollmentRoutes = require('./routes/enrollment');
const mapRoutes = require('./routes/map');
const adminRoutes = require('./routes/admin');

// Mock data for when database is not available
const mockData = {
  categories: [
    { id: '1', name: 'Seeds & Plants', description: 'Grains, vegetables, fruits, flowers', type: 'product', icon: '🌱', color: '#4CAF50' },
    { id: '2', name: 'Farming Tools', description: 'Hand tools, machinery, equipment', type: 'product', icon: '🔧', color: '#FF9800' },
    { id: '3', name: 'Fertilizers & Pesticides', description: 'Organic, chemical, bio-fertilizers', type: 'product', icon: '🧪', color: '#9C27B0' },
    { id: '4', name: 'Livestock & Poultry', description: 'Cattle, poultry, fish, bees', type: 'product', icon: '🐄', color: '#795548' },
    { id: '5', name: 'Fresh Produce', description: 'Vegetables, fruits, grains', type: 'product', icon: '🥬', color: '#8BC34A' },
    { id: '6', name: 'Other Products', description: 'Custom farming products', type: 'product', icon: '📦', color: '#607D8B' }
  ],
  products: [
    { id: '1', name: 'Premium Wheat Seeds', description: 'High-quality wheat seeds for better yield', price: 150, unit: 'kg', quantity: 100, category: 'Seeds & Plants', location: 'Pune, Maharashtra' },
    { id: '2', name: 'Organic Fertilizer', description: '100% organic fertilizer for healthy crops', price: 300, unit: 'bag', quantity: 50, category: 'Fertilizers & Pesticides', location: 'Nashik, Maharashtra' },
    { id: '3', name: 'Farm Tractor', description: 'Heavy-duty tractor for farming operations', price: 500000, unit: 'piece', quantity: 5, category: 'Farming Tools', location: 'Aurangabad, Maharashtra' }
  ],
  farms: [
    { id: '1', name: 'Green Valley Farm', type: 'crops', latitude: 19.0350, longitude: 73.0310, description: 'Wheat and Rice cultivation', status: 'active', icon: '🌾' },
    { id: '2', name: 'Organic Paradise', type: 'crops', latitude: 19.0310, longitude: 73.0280, description: 'Organic vegetables and fruits', status: 'active', icon: '🥬' },
    { id: '3', name: 'Equipment Hub', type: 'equipment', latitude: 19.0370, longitude: 73.0320, description: 'Tractors and farming equipment available', status: 'available', icon: '🚜' }
  ]
};

let dbConnected = false;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    database: dbConnected ? 'Connected' : 'Mock Mode'
  });
});

// Mock endpoints for when database is not available
app.get('/api/marketplace/categories', (req, res) => {
  res.json({
    success: true,
    data: { categories: mockData.categories }
  });
});

app.get('/api/marketplace/products', (req, res) => {
  const { page = 1, limit = 12, search, category } = req.query;
  let products = [...mockData.products];
  
  // Apply search filter
  if (search) {
    products = products.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  // Apply category filter
  if (category) {
    products = products.filter(p => p.category === category);
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedProducts = products.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: {
      products: paginatedProducts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(products.length / limit),
        totalItems: products.length,
        itemsPerPage: parseInt(limit)
      }
    }
  });
});

app.get('/api/marketplace/products/:id', (req, res) => {
  const { id } = req.params;
  const product = mockData.products.find(p => p.id === id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }
  
  res.json({
    success: true,
    data: { product }
  });
});

app.get('/api/map/farms', (req, res) => {
  res.json({
    success: true,
    data: { farms: mockData.farms }
  });
});

app.get('/api/map/farms/:id', (req, res) => {
  const { id } = req.params;
  const farm = mockData.farms.find(f => f.id === id);
  
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
});

// Mock enrollment endpoint
app.post('/api/enroll', (req, res) => {
  console.log('📝 Enrollment received (mock mode):', req.body);
  res.status(201).json({
    success: true,
    message: 'Enrollment submitted successfully (mock mode)',
    data: { 
      id: Date.now().toString(),
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
  });
});

// Mock auth endpoints
app.post('/api/auth/register', (req, res) => {
  console.log('👤 User registration (mock mode):', req.body.email);
  res.status(201).json({
    success: true,
    message: 'User registered successfully (mock mode)',
    data: {
      user: {
        id: Date.now().toString(),
        email: req.body.email,
        fullName: req.body.fullName,
        role: 'farmer',
        isVerified: false,
        isActive: true
      },
      token: 'mock-jwt-token-' + Date.now()
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  console.log('🔐 User login (mock mode):', req.body.email);
  res.json({
    success: true,
    message: 'Login successful (mock mode)',
    data: {
      user: {
        id: '1',
        email: req.body.email,
        fullName: 'Mock User',
        role: 'farmer',
        isVerified: true,
        isActive: true
      },
      token: 'mock-jwt-token-' + Date.now()
    }
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: '1',
        email: 'mock@example.com',
        fullName: 'Mock User',
        role: 'farmer',
        isVerified: true,
        isActive: true
      }
    }
  });
});

// Mock admin dashboard
app.get('/api/admin/dashboard', (req, res) => {
  res.json({
    success: true,
    data: {
      stats: {
        users: { total: 10, verified: 8, active: 9 },
        products: { total: 25, active: 20, bidding: 5 },
        bids: { total: 15, active: 10 },
        rentals: { total: 8, available: 6 },
        enrollments: { total: 12, pending: 3, approved: 9 },
        farms: { total: 5, active: 4 }
      },
      recentUsers: [],
      recentEnrollments: []
    }
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/enroll', enrollmentRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/admin', adminRoutes);

// Configuration endpoint for frontend
app.get('/api/config', (req, res) => {
  res.json({
    MAPS_API_KEY: process.env.HERE_MAPS_API_KEY || '',
    ENROLL_API_BASE: `http://${process.env.HOST || 'localhost'}:${PORT}`
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
  
  // Handle joining specific rooms (optional for future features)
  socket.on('joinProduct', (productId) => {
    socket.join(`product_${productId}`);
    console.log(`🔌 User ${socket.id} joined product room: ${productId}`);
  });
  
  socket.on('leaveProduct', (productId) => {
    socket.leave(`product_${productId}`);
    console.log(`🔌 User ${socket.id} left product room: ${productId}`);
  });
});

// Make io available to routes (for bid notifications)
app.set('io', io);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Try to connect to database
    try {
      await connectDB();
      dbConnected = true;
      console.log('✅ Database connected successfully');
    } catch (dbError) {
      console.log('⚠️  Database connection failed, running in MOCK MODE');
      console.log('📝 Database error:', dbError.message);
      console.log('🔧 To fix: Create .env file and setup PostgreSQL database');
      dbConnected = false;
    }
    
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://${process.env.HOST || 'localhost'}:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database: ${dbConnected ? 'Connected' : 'Mock Mode'}`);
      console.log(`🌐 CORS: Enabled for ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
      console.log(`🔌 Socket.io: Enabled for real-time features`);
      
      if (!dbConnected) {
        console.log('\n📋 Available mock endpoints:');
        console.log('   GET  /health - Health check');
        console.log('   GET  /api/config - Frontend configuration');
        console.log('   GET  /api/marketplace/categories - Product categories');
        console.log('   GET  /api/marketplace/products - Product listings');
        console.log('   GET  /api/map/farms - Farm locations');
        console.log('   POST /api/enroll - Submit enrollment forms');
        console.log('   POST /api/auth/register - User registration');
        console.log('   POST /api/auth/login - User login');
        console.log('   GET  /api/admin/dashboard - Admin dashboard');
        console.log('\n💡 All endpoints work with mock data - no database required!');
        console.log('\n🔌 Socket.io features:');
        console.log('   Real-time bid notifications');
        console.log('   Product room subscriptions');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();

module.exports = app;

