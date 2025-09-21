const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('bidding', 'selling', 'renting'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  budgetRange: {
    type: DataTypes.STRING,
    allowNull: true
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true
  },
  specialRequirements: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Product-specific fields
  productName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pricePerUnit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  unitType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  availableQuantity: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  minOrderQuantity: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  qualityGrade: {
    type: DataTypes.STRING,
    allowNull: true
  },
  organicCertified: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  additionalCertifications: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  deliveryAvailable: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  deliveryCharges: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Rental-specific fields
  itemName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rentalRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  ratePeriod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  minRentalPeriod: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  maxRentalPeriod: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  securityDeposit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  availabilityStatus: {
    type: DataTypes.STRING,
    allowNull: true
  },
  condition: {
    type: DataTypes.STRING,
    allowNull: true
  },
  termsConditions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  pickupAvailable: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  additionalCharges: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'active', 'completed'),
    defaultValue: 'pending'
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'enrollments'
});

module.exports = Enrollment;

