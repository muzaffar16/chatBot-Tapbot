//upload promt and info file used in route access

const multer = require('multer');

// Store files in memory (buffer)
const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = upload;
