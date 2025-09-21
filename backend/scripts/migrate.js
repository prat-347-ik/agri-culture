const { sequelize } = require('../models');
require('dotenv').config();

const migrate = async () => {
  try {
    console.log('🔄 Starting database migration...');
    
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    // Sync all models (create tables)
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Database tables synchronized');

    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

if (require.main === module) {
  migrate();
}

module.exports = { migrate };

