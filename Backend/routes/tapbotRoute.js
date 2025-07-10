const express = require('express');
const tapbotRouter = express.Router();
const upload = require('../middleware/upload'); // updated to use memoryStorage
const TapBotController = require ('../controller/tapbotController')
const mobileLimiter = require('../middleware/rateLimitMobile');
const complainSchema = require('../schema/complainSchema');
const validate = require('../middleware/validate');
const complainUpload = require('../middleware/complainUpload');


//bot access route
tapbotRouter.post(
  '/website/add',
  upload.fields([
    { name: 'info', maxCount: 1 },
    { name: 'prompt', maxCount: 1 }
  ]),
  TapBotController.handleAddWebsite
);

tapbotRouter.post('/website/update/:website',
  upload.fields([
    { name: 'info', maxCount: 1 },
    { name: 'prompt', maxCount: 1 }
  ]),TapBotController.handleUpdateData)

tapbotRouter.get('/bot/check/:licenseKey',TapBotController.handleIsWebsiteExist)

// bot ROute

tapbotRouter.post('/chat/:website',TapBotController.HandleGeminiResponce)

//complain route

tapbotRouter.post(
  '/complain',
  complainUpload.single('attachment'),   
  mobileLimiter,                 
  validate(complainSchema),
  TapBotController.HandleComplainData
);

module.exports = tapbotRouter;