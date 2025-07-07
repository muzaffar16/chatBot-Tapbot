const express = require('express');
const multer = require('multer');
const path = require('path');
const { HandleComplainData } = require('../controller/complainController');
const mobileLimiter = require('../middleware/rateLimitMobile');
const complainSchema = require('../schema/complainSchema');
const validate = require('../middleware/validate');

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



// ---- 4. endpoint ----
router.post(
  '/',
  upload.single('attachment'),   
  mobileLimiter,                 
  validate(complainSchema),
  HandleComplainData
);

module.exports = router;
