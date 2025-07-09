const multer = require('multer');
const path = require('path');

// Configure storage
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

// Filter only images and PDF
const fileFilter = (_req, file, cb) => {
  if (/\.(pdf|png|jpe?g)$/i.test(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf, .png, .jpg, .jpeg files are allowed'));
  }
};

// Multer config with file size limit 
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 8 * 1024 * 1024 // 8MB in bytes
  }
});

module.exports = upload;
