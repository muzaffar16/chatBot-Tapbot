const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');


const complainModel = sequelize.define(
  
  'complains',
  {
    id:            { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_id:      { type: DataTypes.STRING(30), allowNull: false },
    mobile_number: { type: DataTypes.BIGINT(20), allowNull: false },
    email:         { type: DataTypes.STRING(255) },
    message:       { type: DataTypes.TEXT, allowNull: false },
    attachment:    { type: DataTypes.TEXT },
    ip:            { type: DataTypes.STRING(100) },
    status:        { type: DataTypes.TINYINT, defaultValue: 1 },
    created_at:    { type: DataTypes.DATE },
    created_by:    { type: DataTypes.STRING(100) },
  },
  {
    freezeTableName: true,
    timestamps: false,
    logging: false
  }
);

module.exports = { complainModel };
