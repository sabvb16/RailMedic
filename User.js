const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db'); // your db.js

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: DataTypes.STRING,
  password: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.ENUM('passenger', 'tte', 'admin'),
    defaultValue: 'passenger'
  },

  bloodGroup: {
    type: DataTypes.ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-','Unknown'),
    defaultValue: 'Unknown'
  },

  allergies: DataTypes.JSON,
  conditions: DataTypes.JSON,
  medications: DataTypes.JSON,

  trainNumber: DataTypes.STRING,
  coachNumber: DataTypes.STRING,
  seatNumber: DataTypes.STRING,

  emergencyContact: DataTypes.JSON,
  fcmToken: DataTypes.STRING
}, { timestamps: true });

User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 12);
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, 12);
  }
});

User.prototype.matchPassword = async function(pw) {
  return bcrypt.compare(pw, this.password);
};

module.exports = User;