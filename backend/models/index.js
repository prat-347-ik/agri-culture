const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// Import all models
const User = require('./User');
const Product = require('./Product');
const Bid = require('./Bid');
const Rental = require('./Rental');
const Enrollment = require('./Enrollment');
const Image = require('./Image');
const Farm = require('./Farm');
const Category = require('./Category');

// Define associations
const defineAssociations = () => {
  // User associations
  User.hasMany(Product, { foreignKey: 'user_id', as: 'products' });
  User.hasMany(Bid, { foreignKey: 'user_id', as: 'bids' });
  User.hasMany(Rental, { foreignKey: 'user_id', as: 'rentals' });
  User.hasMany(Enrollment, { foreignKey: 'user_id', as: 'enrollments' });
  User.hasMany(Farm, { foreignKey: 'user_id', as: 'farms' });

  // Product associations
  Product.belongsTo(User, { foreignKey: 'user_id', as: 'owner' });
  Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
  Product.hasMany(Bid, { foreignKey: 'product_id', as: 'bids' });
  Product.hasMany(Image, { foreignKey: 'product_id', as: 'images' });

  // Bid associations
  Bid.belongsTo(User, { foreignKey: 'user_id', as: 'bidder' });
  Bid.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

  // Rental associations
  Rental.belongsTo(User, { foreignKey: 'user_id', as: 'owner' });
  Rental.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
  Rental.hasMany(Image, { foreignKey: 'rental_id', as: 'images' });

  // Enrollment associations
  Enrollment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
  Enrollment.hasMany(Image, { foreignKey: 'enrollment_id', as: 'images' });

  // Farm associations
  Farm.belongsTo(User, { foreignKey: 'user_id', as: 'owner' });
  Farm.hasMany(Image, { foreignKey: 'farm_id', as: 'images' });

  // Image associations
  Image.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
  Image.belongsTo(Rental, { foreignKey: 'rental_id', as: 'rental' });
  Image.belongsTo(Enrollment, { foreignKey: 'enrollment_id', as: 'enrollment' });
  Image.belongsTo(Farm, { foreignKey: 'farm_id', as: 'farm' });

  // Category associations
  Category.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
  Category.hasMany(Rental, { foreignKey: 'category_id', as: 'rentals' });
};

// Initialize associations
defineAssociations();

module.exports = {
  sequelize,
  Op,
  User,
  Product,
  Bid,
  Rental,
  Enrollment,
  Image,
  Farm,
  Category
};
