const {Sequelize}=require ('sequelize')
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
  }
);


const dbConnection=async()=>{
    try {
        await sequelize.authenticate();
        console.log('DB connected!')
    } catch (error) {
        console.log('unable to connect DB: ',error)
    }
};

module.exports={
    dbConnection,
    sequelize
}