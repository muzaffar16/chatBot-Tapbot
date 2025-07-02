const Redis = require('ioredis');

// adjust host/port/auth if needed
const redis = new Redis(); // defaults to localhost:6379

module.exports = redis;
