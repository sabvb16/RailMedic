const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Emergency = sequelize.define('Emergency', {
  userId: DataTypes.INTEGER,
  trainNumber: DataTypes.STRING,
  coachNumber: DataTypes.STRING,
  seatNumber: DataTypes.STRING,

  type: DataTypes.STRING,        // medical, fire, accident etc
  description: DataTypes.TEXT,

  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'      // pending | accepted | resolved
  },

  assignedTteId: DataTypes.INTEGER

}, { timestamps: true });

module.exports = Emergency;