// rateLimitMobile.js  (create this helper file)
const blockUntil   = new Map();  // key -> timestamp (ms)
const requestCount = new Map();  // key -> { cnt, windowStart }

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQ   = 5;      // 5 requests per window

module.exports = function mobileLimiter(req, res, next) {
  const mobile = req.body?.mobile_number;
//   console.log(mobile)
  if (!mobile) return res.status(400).json({ error: 'mobile_number required' });

  const key = `${req.ip}|${mobile}`;
  const now = Date.now();

  /* Check if currently blocked */
  if (blockUntil.has(key) && blockUntil.get(key) > now) {
    return res
      .status(429)
      .json({ message: 'Too many requests from this number. Try again in 1 minute.' });
  }
  // unblock if time passed
  if (blockUntil.has(key) && blockUntil.get(key) <= now) blockUntil.delete(key);

  /* 2️  Count requests in current window */
  if (!requestCount.has(key) || now - requestCount.get(key).windowStart > WINDOW_MS) {
    requestCount.set(key, { cnt: 1, windowStart: now });
  } else {
    const rec = requestCount.get(key);
    rec.cnt += 1;

    if (rec.cnt > MAX_REQ) {
      // hit the limit – move to block list and clear counter
      blockUntil.set(key, now + WINDOW_MS); // block for next minute
      requestCount.delete(key);
      return res
        .status(429)
        .json({ message: 'Too many requests from this number. Try again in 1 minute.' });
    }
  }

  next();
};
