const { sequelize, Category, User } = require('../models');
require('dotenv').config();

const seedCategories = async () => {
  const categories = [
    // Product Categories
    { name: 'Seeds & Plants', description: 'Grains, vegetables, fruits, flowers', type: 'product', icon: '🌱', color: '#4CAF50' },
    { name: 'Farming Tools', description: 'Hand tools, machinery, equipment', type: 'product', icon: '🔧', color: '#FF9800' },
    { name: 'Fertilizers & Pesticides', description: 'Organic, chemical, bio-fertilizers', type: 'product', icon: '🧪', color: '#9C27B0' },
    { name: 'Livestock & Poultry', description: 'Cattle, poultry, fish, bees', type: 'product', icon: '🐄', color: '#795548' },
    { name: 'Fresh Produce', description: 'Vegetables, fruits, grains', type: 'product', icon: '🥬', color: '#8BC34A' },
    { name: 'Other Products', description: 'Custom farming products', type: 'product', icon: '📦', color: '#607D8B' },
    
    // Rental Categories
    { name: 'Farm Machinery', description: 'Tractors, harvesters, tillers', type: 'rental', icon: '🚜', color: '#FF5722' },
    { name: 'Tools & Equipment', description: 'Hand tools, power tools, irrigation', type: 'rental', icon: '🔨', color: '#FFC107' },
    { name: 'Vehicles', description: 'Transport vehicles, trailers', type: 'rental', icon: '🚛', color: '#2196F3' },
    { name: 'Land & Storage', description: 'Farmland, warehouses, sheds', type: 'rental', icon: '🏭', color: '#795548' },
    { name: 'Labor Services', description: 'Skilled workers, helpers', type: 'rental', icon: '👷', color: '#3F51B5' },
    { name: 'Other Services', description: 'Custom rental services', type: 'rental', icon: '⚙️', color: '#9E9E9E' }
  ];

  for (const category of categories) {
    await Category.findOrCreate({
      where: { name: category.name },
      defaults: category
    });
  }

  console.log('✅ Categories seeded successfully');
};

const seedAdminUser = async () => {
  const adminUser = await User.findOrCreate({
    where: { email: 'admin@agri-culture.com' },
    defaults: {
      email: 'admin@agri-culture.com',
      password: 'admin123',
      fullName: 'Admin User',
      phone: '9999999999',
      role: 'admin',
      isVerified: true,
      isActive: true
    }
  });

  console.log('✅ Admin user seeded successfully');
};

const seed = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await sequelize.authenticate();
    console.log('✅ Database connected');

    await seedCategories();
    await seedAdminUser();

    console.log('🎉 Database seeding completed successfully!');
    console.log('📧 Admin login: admin@agri-culture.com');
    console.log('🔑 Admin password: admin123');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await sequelize.close();
  }
};

if (require.main === module) {
  seed();
}

module.exports = { seed };

