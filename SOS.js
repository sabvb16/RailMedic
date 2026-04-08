const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SOS = sequelize.define('SOS', {
  userId: DataTypes.INTEGER,
  trainNumber: DataTypes.STRING,
  coachNumber: DataTypes.STRING,
  seatNumber: DataTypes.STRING,
  emergencyType: DataTypes.STRING,
  status: { type: DataTypes.STRING, defaultValue: 'pending' }
}, { timestamps: true });

module.exports = SOS;