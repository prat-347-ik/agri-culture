const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Farm = sequelize.define('Farm', {
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
  type: {
    type: DataTypes.ENUM('crops', 'equipment', 'weather', 'all'),
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
    validate: {
      min: -90,
      max: 90
    }
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
    validate: {
      min: -180,
      max: 180
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'maintenance'),
    defaultValue: 'active'
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '🌾'
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  operatingHours: {
    type: DataTypes.STRING,
    allowNull: true
  },
  facilities: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  crops: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  equipment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  services: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'farms'
});

module.exports = Farm;

