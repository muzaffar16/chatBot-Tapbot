const {Sequelize}  = require('sequelize');
const {mysqldb} = require('../config/var.js');



//-------------db connection with squilize orm --------------------------------
const sequelize = new Sequelize(mysqldb.database, mysqldb.user, mysqldb.password, {
    host: mysqldb.host,
    port: mysqldb.port,
    dialect: 'mysql',  
     logging: false, 
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    define: {
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        charset: 'utf8',
        collate: 'utf8_general_ci',
        logging: false
    }
    
});

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
module.exports = {sequelize,Sequelize}; // Export the Sequelize instance