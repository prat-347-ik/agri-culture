const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Bid = sequelize.define('Bid', {
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
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'outbid', 'winning', 'won', 'lost', 'cancelled'),
    defaultValue: 'active'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isAutoBid: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  maxBidAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  }
}, {
  tableName: 'bids'
});

module.exports = Bid;

