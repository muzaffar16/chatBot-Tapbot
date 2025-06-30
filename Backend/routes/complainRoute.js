const express = require('express');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');
const { HandleComplainData } = require('../controller/complainController');
const mobileLimiter = require('../middleware/rateLimitMobile');
const router = express.Router();


//  Required for mobileLimiter to access req.body.mobile_number
router.use(express.json());
router.use(express.urlencoded({ extended: true }));


// ---- 2. multer config ----
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const fileFilter = (_req, file, cb) => {
  if (/\.(pdf|png|jpe?g)$/i.test(file.originalname)) cb(null, true);
  else cb(new Error('Only .pdf, .png, .jpg, .jpeg allowed'));
  
};
const upload = multer({ storage, fileFilter });

// ---- 3. validation chain ----
const validate = [
  body('order_id')
    .trim()
    .notEmpty().withMessage('Order ID required')
    .isLength({ max: 30 }).withMessage('Max 30 chars'),
  body('mobile_number')
    .trim()
    .notEmpty().withMessage('Mobile number required')
    .isLength({ max: 15 }).withMessage('Max 15 digits')
    .isNumeric().withMessage('Digits only'),
  body('email')
    .optional()
    .isEmail().withMessage('Invalid email'),
  body('message')
    .trim()
    .notEmpty().withMessage('Message required')
    .isLength({ max: 200 }).withMessage('Max 200 chars')
];



// ---- 4. endpoint ----
router.post(
  '/',
  upload.single('attachment'),   
  mobileLimiter,                 
  validate,
  HandleComplainData
);

module.exports = router;
