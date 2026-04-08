const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Medicine = sequelize.define('Medicine', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  category: DataTypes.STRING,
  description: DataTypes.TEXT,
  manufacturer: DataTypes.STRING,
  price: DataTypes.FLOAT,

  inStock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }

}, { timestamps: true });

module.exports = Medicine;