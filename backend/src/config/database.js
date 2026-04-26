import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// ⚠️  IMPORTANT: Backend uses Supabase REST API for all operations
// Sequelize is kept for compatibility but NOT used for production
// All RFID data goes to Supabase via REST API

let sequelize;

// Dummy SQLite connection (not used in production)
const initDummyDB = () => {
  return new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
};

sequelize = initDummyDB();

export default sequelize;
