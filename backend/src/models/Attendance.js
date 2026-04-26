import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Event from './Event.js';

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  time_in: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('Present', 'Late', 'Absent'),
    defaultValue: 'Present',
  },
  fine: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
}, {
  timestamps: true,
  tableName: 'attendance',
});

Attendance.belongsTo(User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Attendance.belongsTo(Event, { foreignKey: 'event_id', onDelete: 'CASCADE' });

User.hasMany(Attendance, { foreignKey: 'user_id' });
Event.hasMany(Attendance, { foreignKey: 'event_id' });

export default Attendance;
