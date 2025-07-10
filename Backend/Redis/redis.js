const redis = require("redis");
const { redisdb } = require("../config/var");

module.exports = class Redis {
  static async createRedisConnection() {
    const client = redis.createClient({
      url: "redis://" + redisdb.host + ":" + redisdb.port,
    });

    client.on("error", (err) => console.log("Redis Client Error", err));
    await client.connect();
    return client;
  }

  static async setCache(key, data) {
    const client = await Redis.createRedisConnection();
    try {
      await client.set(key, data);
    } catch (error) {
      console.error('Error setting cache:', error);
    } finally {
      // Close the connection safely after the operation is done.
      await client.disconnect();
    }
  }

  static async setCacheWithExpiry(key, data) {
    const client = await Redis.createRedisConnection();
    try {
      await client.set(key, data);
      await client.expire(key, 60); // Set expiry time
    } catch (error) {
      console.error('Error setting cache with expiry:', error);
    } finally {
      await client.disconnect();
    }
  }

  static async increaseIPHitCount(key) {
    const client = await Redis.createRedisConnection();
    try {
     return await client.incr(key);
    } catch (error) {
      console.error('Error setting cache with expiry:', error);
    } finally {
      await client.disconnect();
    }
  }


  static async getCache(key) {
    const client = await Redis.createRedisConnection();
    try {
      const value = await client.get(key);
      return value;
    } catch (error) {
      console.error('Error getting cache:', error);
    } finally {
      await client.disconnect();
    }
  }
};