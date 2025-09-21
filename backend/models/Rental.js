const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Rental = sequelize.define('Rental', {
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
  category_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  name: {
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
  rentalRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  ratePeriod: {
    type: DataTypes.ENUM('hourly', 'daily', 'weekly', 'monthly', 'seasonal'),
    allowNull: false
  },
  minRentalPeriod: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  maxRentalPeriod: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  securityDeposit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  availabilityStatus: {
    type: DataTypes.ENUM('available', 'limited', 'booked', 'unavailable'),
    defaultValue: 'available'
  },
  condition: {
    type: DataTypes.ENUM('excellent', 'good', 'fair', 'needs_repair'),
    allowNull: false
  },
  termsConditions: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  pickupAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  additionalCharges: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'rented', 'maintenance'),
    defaultValue: 'active'
  }
}, {
  tableName: 'rentals'
});

module.exports = Rental;

