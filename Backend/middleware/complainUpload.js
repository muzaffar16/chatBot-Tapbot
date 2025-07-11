// const multer = require('multer');
// const path = require('path');

// // Configure storage
// const storage = multer.diskStorage({
//   destination: './uploads',
//   filename: (_req, file, cb) => {
//     const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, unique + path.extname(file.originalname));
//   }
// });

// // Filter only images and PDF
// const fileFilter = (_req, file, cb) => {
//   if (/\.(pdf|png|jpe?g)$/i.test(file.originalname)) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only .pdf, .png, .jpg, .jpeg files are allowed'));
//   }
// };

// // Multer config with file size limit 
// const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 8 * 1024 * 1024 // 8MB in bytes
//   }
// });

// module.exports = upload;



const multer      = require('multer');
const multerS3    = require('multer-s3');
const path        = require('path');
const s3          = require('../AWS/aws');

const bucketName = 'tapbot-website-info';


// (1) File‑type guard — same regex you used
const fileFilter = (_req, file, cb) => {
  if (/\.(pdf|png|jpe?g)$/i.test(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf, .png, .jpg, .jpeg files are allowed'));
  }
};

// (2) S3 storage adapter
const storage = multerS3({
  s3,
  bucket: bucketName,
  contentType: multerS3.AUTO_CONTENT_TYPE,        // sets correct MIME
  acl: 'private',                                 // or 'public-read' if you insist
  key: (_req, file, cb) => {
    /* e.g. uploads/TIMESTAMP-file.png */
    const timePart   = Date.now();
    const name= file.originalname
    // const ext        = path.extname(file.originalname);
    const storageKey = `uploads/${timePart}-${name}`;
    cb(null, storageKey);
  }
});

// (3) Multer middleware
module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 } // 8 MB
});
