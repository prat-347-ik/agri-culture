const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
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
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'piece'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  minOrderQuantity: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  qualityGrade: {
    type: DataTypes.ENUM('premium', 'standard', 'economy'),
    allowNull: false,
    defaultValue: 'standard'
  },
  organicCertified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  additionalCertifications: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deliveryAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  deliveryCharges: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'sold_out', 'pending'),
    defaultValue: 'active'
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isBidding: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  biddingEndTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  startingBid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  currentBid: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  tableName: 'products'
});

module.exports = Product;

