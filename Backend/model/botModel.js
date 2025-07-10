const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

const botModel = sequelize.define('botAccess', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  websiteName: {
    type: DataTypes.STRING(255),
    allowNull: true  
  },
  logo_url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  discription: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expire_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  license_key: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bg_color_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  body_color_code: {
    type: DataTypes.STRING,
    allowNull: false
  },
  accent_color: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true,
  timestamps: false,
  logging: false
});

module.exports = { botModel };
