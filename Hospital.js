const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Hospital = sequelize.define('Hospital', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  address: DataTypes.STRING,
  city: DataTypes.STRING,
  state: DataTypes.STRING,

  phone: DataTypes.STRING,
  emergencyAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },

  latitude: DataTypes.FLOAT,
  longitude: DataTypes.FLOAT
}, { timestamps: true });

module.exports = Hospital;