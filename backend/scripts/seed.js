const { sequelize, Category, User, Product, Rental, Farm } = require('../models');
const bcrypt = require('bcryptjs');
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

const seedSampleUsers = async () => {
  const sampleUsers = [
    {
      email: 'farmer1@example.com',
      password: 'farmer123',
      fullName: 'Rajesh Patel',
      phone: '9876543210',
      role: 'farmer',
      isVerified: true,
      isActive: true,
      district: 'Pune',
      taluka: 'Mulshi',
      village: 'Tamhini'
    },
    {
      email: 'farmer2@example.com',
      password: 'farmer123',
      fullName: 'Sunita Sharma',
      phone: '9876543211',
      role: 'farmer',
      isVerified: true,
      isActive: true,
      district: 'Nashik',
      taluka: 'Dindori',
      village: 'Ghoti'
    },
    {
      email: 'farmer3@example.com',
      password: 'farmer123',
      fullName: 'Mahesh Kumar',
      phone: '9876543212',
      role: 'farmer',
      isVerified: true,
      isActive: true,
      district: 'Aurangabad',
      taluka: 'Kannad',
      village: 'Bidkin'
    },
    {
      email: 'supplier1@example.com',
      password: 'supplier123',
      fullName: 'Agro Supplies Co',
      phone: '9876543213',
      role: 'farmer',
      isVerified: true,
      isActive: true,
      district: 'Mumbai',
      taluka: 'Kurla',
      village: 'Kurla'
    },
    {
      email: 'equipment@example.com',
      password: 'equipment123',
      fullName: 'Farm Equipment Rentals',
      phone: '9876543214',
      role: 'farmer',
      isVerified: true,
      isActive: true,
      district: 'Pune',
      taluka: 'Haveli',
      village: 'Kharadi'
    }
  ];

  for (const userData of sampleUsers) {
    await User.findOrCreate({
      where: { email: userData.email },
      defaults: userData
    });
  }

  console.log('✅ Sample users seeded successfully');
};

const seedProducts = async () => {
  // Get categories for products
  const seedsCategory = await Category.findOne({ where: { name: 'Seeds & Plants' } });
  const toolsCategory = await Category.findOne({ where: { name: 'Farming Tools' } });
  const fertilizerCategory = await Category.findOne({ where: { name: 'Fertilizers & Pesticides' } });
  const produceCategory = await Category.findOne({ where: { name: 'Fresh Produce' } });
  const livestockCategory = await Category.findOne({ where: { name: 'Livestock & Poultry' } });
  
  // Get sample users
  const users = await User.findAll({ where: { role: 'farmer' }, limit: 5 });
  
  const products = [
    {
      user_id: users[0]?.id,
      category_id: seedsCategory?.id,
      name: 'Premium Wheat Seeds',
      description: 'High-quality drought-resistant wheat seeds with 95% germination rate. Perfect for Rabi season cultivation.',
      price: 45.50,
      unit: 'kg',
      quantity: 500,
      minOrderQuantity: 10,
      qualityGrade: 'premium',
      organicCertified: true,
      location: 'Pune, Maharashtra',
      deliveryAvailable: true,
      deliveryCharges: 50.00,
      status: 'active'
    },
    {
      user_id: users[1]?.id,
      category_id: seedsCategory?.id,
      name: 'Organic Tomato Seeds',
      description: 'Certified organic hybrid tomato seeds. High yield variety suitable for greenhouse and open field cultivation.',
      price: 120.00,
      unit: 'packet',
      quantity: 200,
      minOrderQuantity: 5,
      qualityGrade: 'premium',
      organicCertified: true,
      location: 'Nashik, Maharashtra',
      deliveryAvailable: true,
      deliveryCharges: 30.00,
      status: 'active'
    },
    {
      user_id: users[2]?.id,
      category_id: fertilizerCategory?.id,
      name: 'Vermicompost Organic Fertilizer',
      description: 'Pure vermicompost made from organic waste. Rich in nutrients and beneficial microorganisms.',
      price: 15.00,
      unit: 'kg',
      quantity: 1000,
      minOrderQuantity: 50,
      qualityGrade: 'standard',
      organicCertified: true,
      location: 'Aurangabad, Maharashtra',
      deliveryAvailable: true,
      deliveryCharges: 100.00,
      status: 'active'
    },
    {
      user_id: users[3]?.id,
      category_id: toolsCategory?.id,
      name: 'Solar Water Pump',
      description: '5HP solar-powered water pump with controller. Energy efficient and low maintenance.',
      price: 45000.00,
      unit: 'piece',
      quantity: 10,
      minOrderQuantity: 1,
      qualityGrade: 'premium',
      organicCertified: false,
      location: 'Mumbai, Maharashtra',
      deliveryAvailable: true,
      deliveryCharges: 500.00,
      status: 'active'
    },
    {
      user_id: users[0]?.id,
      category_id: produceCategory?.id,
      name: 'Fresh Onions',
      description: 'Premium quality red onions, freshly harvested. Good storage quality and uniform size.',
      price: 25.00,
      unit: 'kg',
      quantity: 2000,
      minOrderQuantity: 100,
      qualityGrade: 'premium',
      organicCertified: false,
      location: 'Pune, Maharashtra',
      deliveryAvailable: true,
      deliveryCharges: 200.00,
      status: 'active'
    },
    {
      user_id: users[1]?.id,
      category_id: seedsCategory?.id,
      name: 'Hybrid Corn Seeds',
      description: 'High-yield hybrid corn seeds with excellent disease resistance. Suitable for all seasons.',
      price: 280.00,
      unit: 'kg',
      quantity: 150,
      minOrderQuantity: 5,
      qualityGrade: 'premium',
      organicCertified: false,
      location: 'Nashik, Maharashtra',
      deliveryAvailable: true,
      deliveryCharges: 40.00,
      status: 'active',
      isBidding: true,
      biddingEndTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      startingBid: 250.00,
      currentBid: 250.00
    },
    {
      user_id: users[2]?.id,
      category_id: toolsCategory?.id,
      name: 'Rotary Tiller Attachment',
      description: '6-feet rotary tiller for tractor. Heavy-duty construction with replaceable blades.',
      price: 25000.00,
      unit: 'piece',
      quantity: 5,
      minOrderQuantity: 1,
      qualityGrade: 'standard',
      organicCertified: false,
      location: 'Aurangabad, Maharashtra',
      deliveryAvailable: true,
      deliveryCharges: 800.00,
      status: 'active',
      isBidding: true,
      biddingEndTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      startingBid: 20000.00,
      currentBid: 22000.00
    },
    {
      user_id: users[3]?.id,
      category_id: fertilizerCategory?.id,
      name: 'NPK Complex Fertilizer',
      description: 'Balanced NPK fertilizer (19:19:19) for all crops. Enhanced with micronutrients.',
      price: 32.00,
      unit: 'kg',
      quantity: 800,
      minOrderQuantity: 25,
      qualityGrade: 'standard',
      organicCertified: false,
      location: 'Mumbai, Maharashtra',
      deliveryAvailable: true,
      deliveryCharges: 150.00,
      status: 'active'
    },
    {
      user_id: users[4]?.id,
      category_id: produceCategory?.id,
      name: 'Organic Basmati Rice',
      description: 'Premium organic basmati rice, aged for 2 years. Export quality with certification.',
      price: 95.00,
      unit: 'kg',
      quantity: 1500,
      minOrderQuantity: 50,
      qualityGrade: 'premium',
      organicCertified: true,
      additionalCertifications: 'USDA Organic, India Organic',
      location: 'Pune, Maharashtra',
      deliveryAvailable: true,
      deliveryCharges: 100.00,
      status: 'active'
    },
    {
      user_id: users[0]?.id,
      category_id: livestockCategory?.id,
      name: 'Dairy Cattle - Holstein Friesian',
      description: 'High-yielding dairy cattle, 3-4 years old. Healthy and vaccinated. Average milk yield 20-25 liters/day.',
      price: 65000.00,
      unit: 'head',
      quantity: 8,
      minOrderQuantity: 1,
      qualityGrade: 'premium',
      organicCertified: false,
      location: 'Pune, Maharashtra',
      deliveryAvailable: false,
      status: 'active',
      isBidding: true,
      biddingEndTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      startingBid: 60000.00,
      currentBid: 62000.00
    }
  ];

  for (const productData of products) {
    if (productData.user_id && productData.category_id) {
      await Product.create(productData);
    }
  }

  console.log('✅ Products seeded successfully');
};

const seedRentals = async () => {
  // Get rental categories
  const machineryCategory = await Category.findOne({ where: { name: 'Farm Machinery' } });
  const toolsCategory = await Category.findOne({ where: { name: 'Tools & Equipment' } });
  const vehiclesCategory = await Category.findOne({ where: { name: 'Vehicles' } });
  const landCategory = await Category.findOne({ where: { name: 'Land & Storage' } });
  const laborCategory = await Category.findOne({ where: { name: 'Labor Services' } });
  
  // Get sample users
  const users = await User.findAll({ where: { role: 'farmer' }, limit: 5 });
  
  const rentals = [
    {
      user_id: users[4]?.id, // Equipment rental company
      category_id: machineryCategory?.id,
      name: 'John Deere 5050D Tractor',
      description: '50HP tractor with power steering, suitable for all farming operations. Well-maintained and regularly serviced.',
      rentalRate: 1200.00,
      ratePeriod: 'daily',
      minRentalPeriod: 1,
      maxRentalPeriod: 30,
      securityDeposit: 10000.00,
      availabilityStatus: 'available',
      condition: 'excellent',
      termsConditions: 'Fuel not included. Operator available for additional charge. Damage charges apply.',
      location: 'Pune, Maharashtra',
      pickupAvailable: true,
      status: 'active'
    },
    {
      user_id: users[0]?.id,
      category_id: machineryCategory?.id,
      name: 'Harvester Combine',
      description: 'Self-propelled combine harvester for wheat, paddy, and other crops. 14-feet cutting width.',
      rentalRate: 3500.00,
      ratePeriod: 'daily',
      minRentalPeriod: 2,
      maxRentalPeriod: 15,
      securityDeposit: 25000.00,
      availabilityStatus: 'available',
      condition: 'good',
      termsConditions: 'Experienced operator included. Fuel charges separate. Minimum 2-day rental.',
      location: 'Aurangabad, Maharashtra',
      pickupAvailable: false,
      additionalCharges: 'Transport charges: Rs. 15/km',
      status: 'active'
    },
    {
      user_id: users[1]?.id,
      category_id: toolsCategory?.id,
      name: 'Drip Irrigation System',
      description: 'Complete drip irrigation setup for 1 acre. Includes pipes, drippers, filters, and control valves.',
      rentalRate: 800.00,
      ratePeriod: 'monthly',
      minRentalPeriod: 3,
      maxRentalPeriod: 12,
      securityDeposit: 5000.00,
      availabilityStatus: 'available',
      condition: 'good',
      termsConditions: 'Installation and removal service included. Water pump not included.',
      location: 'Nashik, Maharashtra',
      pickupAvailable: true,
      status: 'active'
    },
    {
      user_id: users[2]?.id,
      category_id: toolsCategory?.id,
      name: 'Soil Testing Equipment',
      description: 'Digital soil pH and EC meter with calibration solutions. Professional grade equipment.',
      rentalRate: 150.00,
      ratePeriod: 'daily',
      minRentalPeriod: 1,
      maxRentalPeriod: 7,
      securityDeposit: 1000.00,
      availabilityStatus: 'available',
      condition: 'excellent',
      termsConditions: 'Calibration solutions included. Training provided if needed.',
      location: 'Pune, Maharashtra',
      pickupAvailable: true,
      status: 'active'
    },
    {
      user_id: users[3]?.id,
      category_id: vehiclesCategory?.id,
      name: 'Farm Transport Vehicle',
      description: 'Tata Ace pickup truck for farm produce transport. 750kg payload capacity.',
      rentalRate: 600.00,
      ratePeriod: 'daily',
      minRentalPeriod: 1,
      maxRentalPeriod: 10,
      securityDeposit: 8000.00,
      availabilityStatus: 'available',
      condition: 'good',
      termsConditions: 'Driver included. Fuel charges extra. Within 100km radius only.',
      location: 'Mumbai, Maharashtra',
      pickupAvailable: false,
      additionalCharges: 'Fuel charges: Actual. Overtime: Rs. 50/hour',
      status: 'active'
    },
    {
      user_id: users[4]?.id,
      category_id: machineryCategory?.id,
      name: 'Rotavator',
      description: '7-feet rotavator with adjustable depth control. Perfect for seedbed preparation.',
      rentalRate: 800.00,
      ratePeriod: 'daily',
      minRentalPeriod: 1,
      maxRentalPeriod: 5,
      securityDeposit: 3000.00,
      availabilityStatus: 'limited',
      condition: 'good',
      termsConditions: 'Tractor not included. Compatible with 35HP+ tractors.',
      location: 'Pune, Maharashtra',
      pickupAvailable: true,
      status: 'active'
    },
    {
      user_id: users[0]?.id,
      category_id: landCategory?.id,
      name: 'Climate-Controlled Storage',
      description: '1000 sq ft climate-controlled warehouse for seed/grain storage. Temperature and humidity controlled.',
      rentalRate: 2500.00,
      ratePeriod: 'monthly',
      minRentalPeriod: 6,
      maxRentalPeriod: 24,
      securityDeposit: 15000.00,
      availabilityStatus: 'available',
      condition: 'excellent',
      termsConditions: 'Electricity charges separate. 24/7 security. Loading/unloading facility available.',
      location: 'Aurangabad, Maharashtra',
      pickupAvailable: false,
      additionalCharges: 'Electricity: Rs. 8/unit. Security: Rs. 2000/month',
      status: 'active'
    },
    {
      user_id: users[1]?.id,
      category_id: laborCategory?.id,
      name: 'Skilled Farm Workers',
      description: 'Team of 5 experienced farm workers for harvest, planting, and general farm operations.',
      rentalRate: 1500.00,
      ratePeriod: 'daily',
      minRentalPeriod: 1,
      maxRentalPeriod: 30,
      securityDeposit: 0.00,
      availabilityStatus: 'available',
      condition: 'excellent',
      termsConditions: '8-hour work day. Overtime charges apply. Food and accommodation by hirer.',
      location: 'Nashik, Maharashtra',
      pickupAvailable: false,
      additionalCharges: 'Overtime: Rs. 200/person/hour. Transport if needed: Rs. 500',
      status: 'active'
    },
    {
      user_id: users[2]?.id,
      category_id: toolsCategory?.id,
      name: 'Water Pump - 5HP',
      description: 'Diesel water pump, 5HP, suitable for irrigation. Low fuel consumption and high efficiency.',
      rentalRate: 400.00,
      ratePeriod: 'daily',
      minRentalPeriod: 1,
      maxRentalPeriod: 15,
      securityDeposit: 2000.00,
      availabilityStatus: 'available',
      condition: 'good',
      termsConditions: 'Fuel not included. Regular maintenance done. Pipes not included.',
      location: 'Aurangabad, Maharashtra',
      pickupAvailable: true,
      status: 'active'
    },
    {
      user_id: users[3]?.id,
      category_id: machineryCategory?.id,
      name: 'Seed Drill Machine',
      description: '9-row seed drill with fertilizer attachment. Suitable for wheat, soybean, and other crops.',
      rentalRate: 1000.00,
      ratePeriod: 'daily',
      minRentalPeriod: 2,
      maxRentalPeriod: 10,
      securityDeposit: 5000.00,
      availabilityStatus: 'available',
      condition: 'excellent',
      termsConditions: 'Tractor not included. Seeds and fertilizer not included. Operator training available.',
      location: 'Mumbai, Maharashtra',
      pickupAvailable: true,
      status: 'active'
    }
  ];

  for (const rentalData of rentals) {
    if (rentalData.user_id && rentalData.category_id) {
      await Rental.create(rentalData);
    }
  }

  console.log('✅ Rentals seeded successfully');
};

const seedFarms = async () => {
  // Get sample users
  const users = await User.findAll({ where: { role: 'farmer' }, limit: 5 });
  
  const farms = [
    {
      user_id: users[0]?.id,
      name: 'Green Valley Organic Farm',
      description: 'Certified organic farm specializing in wheat, rice, and vegetable cultivation. 50-acre sustainable farming operation.',
      type: 'crops',
      latitude: 18.5204,
      longitude: 73.8567,
      address: 'Village Tamhini, Taluka Mulshi, District Pune, Maharashtra',
      status: 'active',
      icon: '🌾',
      contactPhone: '9876543210',
      contactEmail: 'green.valley@example.com',
      operatingHours: '6:00 AM - 6:00 PM',
      facilities: 'Organic certification, Cold storage, Processing unit',
      crops: 'Wheat, Rice, Tomatoes, Onions, Potatoes',
      services: 'Organic produce supply, Farm visits, Training programs'
    },
    {
      user_id: users[1]?.id,
      name: 'Sunrise Fruit Orchards',
      description: 'Premium fruit orchard with mango, pomegranate, and citrus trees. Export quality fruit production.',
      type: 'crops',
      latitude: 20.0110,
      longitude: 73.7850,
      address: 'Village Ghoti, Taluka Dindori, District Nashik, Maharashtra',
      status: 'active',
      icon: '🥭',
      contactPhone: '9876543211',
      contactEmail: 'sunrise.orchards@example.com',
      operatingHours: '5:30 AM - 7:00 PM',
      facilities: 'Drip irrigation, Pack house, Cold chain',
      crops: 'Mango, Pomegranate, Orange, Lemon',
      services: 'Fresh fruit supply, Processed products, Agritourism'
    },
    {
      user_id: users[2]?.id,
      name: 'Modern Equipment Hub',
      description: 'Agricultural equipment rental and service center with modern machinery for all farming needs.',
      type: 'equipment',
      latitude: 19.8762,
      longitude: 75.3433,
      address: 'Village Bidkin, Taluka Kannad, District Aurangabad, Maharashtra',
      status: 'active',
      icon: '🚜',
      contactPhone: '9876543212',
      contactEmail: 'equipment.hub@example.com',
      website: 'https://modernequipmenthub.com',
      operatingHours: '7:00 AM - 8:00 PM',
      facilities: 'Service center, Spare parts, Training center',
      equipment: 'Tractors, Harvesters, Tillers, Pumps, Sprayers',
      services: 'Equipment rental, Maintenance, Operator training'
    },
    {
      user_id: users[3]?.id,
      name: 'Supply Chain Central',
      description: 'Agricultural input supply and distribution center serving farmers in the region.',
      type: 'crops',
      latitude: 19.0760,
      longitude: 72.8777,
      address: 'Kurla Industrial Area, Mumbai, Maharashtra',
      status: 'active',
      icon: '🏪',
      contactPhone: '9876543213',
      contactEmail: 'supply.central@example.com',
      operatingHours: '8:00 AM - 7:00 PM',
      facilities: 'Warehouse, Quality testing lab, Distribution network',
      crops: 'Seeds, Fertilizers, Pesticides, Tools',
      services: 'Input supply, Soil testing, Crop advisory'
    },
    {
      user_id: users[4]?.id,
      name: 'Smart Farm Technology Center',
      description: 'Demonstration farm showcasing precision agriculture and smart farming technologies.',
      type: 'equipment',
      latitude: 18.5586,
      longitude: 73.9105,
      address: 'Kharadi, Taluka Haveli, District Pune, Maharashtra',
      status: 'active',
      icon: '📱',
      contactPhone: '9876543214',
      contactEmail: 'smartfarm@example.com',
      website: 'https://smartfarmtech.com',
      operatingHours: '9:00 AM - 6:00 PM',
      facilities: 'IoT sensors, Drone services, Weather station, Training hall',
      equipment: 'Drones, Sensors, Weather stations, GPS systems',
      services: 'Technology consulting, Training, Equipment rental'
    },
    {
      user_id: users[0]?.id,
      name: 'Dairy Excellence Farm',
      description: 'Modern dairy farm with Holstein Friesian cattle. Producing high-quality milk with automated systems.',
      type: 'crops',
      latitude: 18.4529,
      longitude: 73.8683,
      address: 'Village Wadgaon, Taluka Mulshi, District Pune, Maharashtra',
      status: 'active',
      icon: '🐄',
      contactPhone: '9876543210',
      contactEmail: 'dairy.excellence@example.com',
      operatingHours: '4:00 AM - 8:00 PM',
      facilities: 'Automated milking, Milk processing, Feed mill, Veterinary care',
      crops: 'Milk production, Dairy products',
      services: 'Fresh milk supply, Dairy products, Breeding services'
    },
    {
      user_id: users[1]?.id,
      name: 'Hydroponic Innovation Center',
      description: 'Soilless cultivation facility producing premium vegetables using hydroponic technology.',
      type: 'crops',
      latitude: 20.0504,
      longitude: 73.7749,
      address: 'Village Pimpalgaon, Taluka Dindori, District Nashik, Maharashtra',
      status: 'active',
      icon: '💧',
      contactPhone: '9876543211',
      contactEmail: 'hydroponic@example.com',
      operatingHours: '6:00 AM - 8:00 PM',
      facilities: 'Climate-controlled greenhouses, Nutrient systems, Monitoring systems',
      crops: 'Lettuce, Tomatoes, Peppers, Herbs',
      services: 'Premium vegetables, Technology transfer, Training'
    },
    {
      user_id: users[2]?.id,
      name: 'Integrated Pest Management Center',
      description: 'Research and demonstration facility for sustainable pest management practices.',
      type: 'crops',
      latitude: 19.9000,
      longitude: 75.3200,
      address: 'Village Gangapur, Taluka Kannad, District Aurangabad, Maharashtra',
      status: 'active',
      icon: '🔬',
      contactPhone: '9876543212',
      contactEmail: 'ipm.center@example.com',
      operatingHours: '8:00 AM - 5:00 PM',
      facilities: 'Research lab, Biocontrol production, Training center',
      crops: 'Biocontrol agents, Beneficial insects',
      services: 'IPM consulting, Biocontrol supply, Training programs'
    },
    {
      user_id: users[3]?.id,
      name: 'Precision Agriculture Demo Farm',
      description: 'Demonstration farm showcasing GPS-guided farming and variable rate technology.',
      type: 'equipment',
      latitude: 19.1000,
      longitude: 72.9000,
      address: 'Bhandup Industrial Area, Mumbai, Maharashtra',
      status: 'active',
      icon: '🛰️',
      contactPhone: '9876543213',
      contactEmail: 'precision.demo@example.com',
      website: 'https://precisionfarm.com',
      operatingHours: '8:00 AM - 6:00 PM',
      facilities: 'GPS systems, Variable rate applicators, Yield monitors',
      equipment: 'GPS tractors, Precision planters, Yield mapping systems',
      services: 'Precision farming consulting, GPS services, Training'
    },
    {
      user_id: users[4]?.id,
      name: 'Sustainable Energy Farm',
      description: 'Solar-powered farm demonstrating renewable energy applications in agriculture.',
      type: 'equipment',
      latitude: 18.5500,
      longitude: 73.9000,
      address: 'Village Wagholi, Taluka Haveli, District Pune, Maharashtra',
      status: 'active',
      icon: '☀️',
      contactPhone: '9876543214',
      contactEmail: 'solar.farm@example.com',
      operatingHours: '7:00 AM - 7:00 PM',
      facilities: 'Solar panels, Solar pumps, Battery storage, Grid connection',
      equipment: 'Solar pumps, Solar dryers, LED lighting systems',
      services: 'Solar installation, Energy consulting, Equipment rental'
    }
  ];

  for (const farmData of farms) {
    if (farmData.user_id) {
      await Farm.create(farmData);
    }
  }

  console.log('✅ Farms seeded successfully');
};

const seed = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await sequelize.authenticate();
    console.log('✅ Database connected');

    await seedCategories();
    await seedAdminUser();
    await seedSampleUsers();
    await seedProducts();
    await seedRentals();
    await seedFarms();

    console.log('🎉 Database seeding completed successfully!');
    console.log('📧 Admin login: admin@agri-culture.com');
    console.log('🔑 Admin password: admin123');
    console.log('\n👥 Sample farmer accounts:');
    console.log('   📧 farmer1@example.com (farmer123)');
    console.log('   📧 farmer2@example.com (farmer123)');
    console.log('   📧 farmer3@example.com (farmer123)');
    console.log('   📧 supplier1@example.com (supplier123)');
    console.log('   📧 equipment@example.com (equipment123)');
    
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

