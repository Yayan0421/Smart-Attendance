import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  login_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  logout_time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fine_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
}, {
  timestamps: true,
  tableName: 'events',
});

export default Event;
