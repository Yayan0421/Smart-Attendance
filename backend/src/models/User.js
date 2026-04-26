import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  middlename: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  student_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  year_level: {
    type: DataTypes.ENUM('1st Year', '2nd Year', '3rd Year', '4th Year'),
    allowNull: true,
  },
  rfid_uid: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('admin', 'staff'),
    defaultValue: 'staff',
  },
  profile_photo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  tableName: 'users',
});

export default User;
