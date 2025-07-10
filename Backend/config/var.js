module.exports = {
    env: process.env.APP_ENV,
    mysqldb: {
      host:     process.env.APP_ENV === 'production' ? process.env.DB_HOST     : process.env.DB_HOST_STAG,
      user:     process.env.APP_ENV === 'production' ? process.env.DB_USER     : process.env.DB_USER_STAG,
      password: process.env.APP_ENV === 'production' ? process.env.DB_PASSWORD : process.env.DB_PASSWORD_STAG,
      port:     process.env.APP_ENV === 'production' ? process.env.DB_PORT     : process.env.DB_PORT_STAG,
      database: process.env.APP_ENV === 'production' ? process.env.DB_DATABASE : process.env.DB_DATABASE_STAG,      
    },  
    redisdb: {
      host:     process.env.APP_ENV === 'production' ? process.env.REDIS_HOST     : process.env.REDIS_HOST,
      port:     process.env.APP_ENV === 'production' ? process.env.REDIS_PORT     : process.env.REDIS_PORT,
    },  
    
  };