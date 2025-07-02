const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // updated to use memoryStorage
const { handleAddWebsite,handleUpdateData, handleIsWebsiteExisit } = require('../controller/botAccessController');


router.post(
  '/add',
  upload.fields([
    { name: 'info', maxCount: 1 },
    { name: 'prompt', maxCount: 1 }
  ]),
  handleAddWebsite
);

router.post('/update/:website',
  upload.fields([
    { name: 'info', maxCount: 1 },
    { name: 'prompt', maxCount: 1 }
  ]),handleUpdateData)

router.get('/check/:website',handleIsWebsiteExisit)

module.exports = router;
