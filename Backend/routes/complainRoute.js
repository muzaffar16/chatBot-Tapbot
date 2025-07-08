const express = require('express');
const { HandleComplainData } = require('../controller/complainController');
const mobileLimiter = require('../middleware/rateLimitMobile');
const complainSchema = require('../schema/complainSchema');
const validate = require('../middleware/validate');
const upload = require('../middleware/complainUpload');

const router = express.Router();


router.use(express.json());
router.use(express.urlencoded({ extended: true }));



router.post(
  '/',
  upload.single('attachment'),   
  mobileLimiter,                 
  validate(complainSchema),
  HandleComplainData
);

module.exports = router;
