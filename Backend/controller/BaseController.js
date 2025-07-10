// const TapshopHelpers = require("../Helpers/TapshopHelper");
// const GetSkuProductDetails = require("../Helpers/GetSkuProductDetails.js");
const Redis = require("../Redis/redis.js");
// const TapRes = require("../Helpers/ResponseCode");
// const MissingParameterHelper = require("../Helpers/missingParameter");
const sequelize = require("../config/db.js");
// const { generateKeyPair } = require("crypto");
// const MerchantCredentialsModel = require("../Model/Merchants.js");
// const handleEconnaborted = require("../Utilities/handleEconnaborted.js");
// const { logger } = require("../Utilities/logger.js");
// const extractRequestIp = require("../Helpers/FetchUserIp.js");

/**
 * @class BaseController
 */
class BaseController {
  
  constructor() {
    // this.TapshopHelpers = TapshopHelpers;
    this.RedisDb = Redis;
    // this.TapRes = TapRes;
    // this.MissingParameterHelper = MissingParameterHelper;
    this.sequelize = sequelize;
    // this.generateKeyPair = generateKeyPair;
    // this.MerchantCredentialsModel = MerchantCredentialsModel;
    // this.GetSkuProductDetails = GetSkuProductDetails;
    // this.handleEconnaborted = handleEconnaborted;
    // this.logger = logger;
    // this.extractRequestIp = extractRequestIp;
  }
}
module.exports = BaseController;