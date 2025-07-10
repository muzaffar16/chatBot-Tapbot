const Redis = require("../Redis/redis.js");

const WINDOW_SECONDS = 60; // 1 minute
const MAX_REQUESTS = 5;

const mobileRateLimiter = async (req, res, next) => {
  const mobile = req.body?.mobile_number;
  if (!mobile) {
    return res.status(400).json({ error: 'Mobile number is required.' });
  }

  const key = `rate:${mobile}`;
    const cnt = await Redis.increaseIPHitCount(key);
    //  console.log(cnt)
    if (cnt === 1) {
      // Set expiry when first request is made
      await Redis.setCacheWithExpiry(key, cnt);
    }

    if (cnt > MAX_REQUESTS) {
      return res.status(429).json({
        message: `Too many requests. Try again in ${WINDOW_SECONDS} seconds.`
      });
    }

    next();

};

module.exports = mobileRateLimiter;


