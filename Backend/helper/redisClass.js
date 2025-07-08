// redisClass.js
const redis = require('../redisClient');

class Redis {
    constructor() {
        this.redis = redis;
    }

    async get(key) {
        return await this.redis.get(key);
    }

    async set(key, data) {
        await this.redis.set(key, data);
    }
}

module.exports = Redis;
