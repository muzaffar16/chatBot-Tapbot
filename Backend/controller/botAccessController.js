const { botModel } = require('../model/botModel');
const crypto = require('crypto');
const fetch = require('node-fetch');

const RedisService = require('../helper/redisClass')
const Redis = new RedisService();

// require('dotenv').config();

// const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

// async function handleAddWebsite(req, res) {
//   const { websiteName } = req.body;

//   if (!websiteName) {
//     return res.status(400).json({ error: 'websiteName is required' });
//   }

//   const infoFile = req.files?.info?.[0];
//   const promptFile = req.files?.prompt?.[0];

//   if (!infoFile || !promptFile) {
//     return res.status(400).json({ error: 'Both info and prompt files are required' });
//   }

//   // Convert buffer to string
//   const infoContent = infoFile.buffer.toString('utf8');
//   const promptContent = promptFile.buffer.toString('utf8');

//   // Store into database
//   await botModel.create({
//     websiteName,
//     info: infoContent,
//     prompt: promptContent,
//     expire_date: new Date(),
//   });

//   res.status(200).json({ msg: 'Website added successfully', websiteName });
// }



async function handleAddWebsite(req, res) {
  const { websiteName, logo_url, discription, bg_color_code, expire_date, body_color_code, accent_color } = req.body;

  if (!websiteName || !logo_url || !discription ||!expire_date|| !bg_color_code || !body_color_code || !accent_color) {
    return res.status(400).json({ error: 'all fields are required' });
  }

  const result = await botModel.findOne({ where: { websiteName: websiteName } })
  if (result) {
    return res.status(400).json({ error: 'website is already added' });
  }

  const infoFile = req.files.info[0];
  const promptFile = req.files.prompt[0];
  //  console.log(infoFile)
  if (!infoFile || !promptFile) {
    return res.status(400).json({ error: 'Both info and prompt files are required' });
  }



//  const now = new Date();
//  const expire_date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // const date = expire_date.toString('utf8')
  var hash = crypto.createHash('md5').update(websiteName).digest('hex');
  // console.log(hash)

  // return
  // Store into database
  await botModel.create({
    websiteName,
    logo_url,
    discription,
    expire_date: expire_date,
    license_key: hash,
    status : 1,
    bg_color_code,
    body_color_code,
    accent_color

  });

  const infoContent = infoFile.buffer.toString('utf8');
  const promptContent = promptFile.buffer.toString('utf8');

  // Use Redis key like: site:<websiteName>:info
  Redis.set(`site:${websiteName}:info`, infoContent);
  Redis.set(`site:${websiteName}:prompt`, promptContent);


  res.status(200).json({ msg: 'Saved to Redis successfully', websiteName });
}



async function handleUpdateData(req, res) {
  const website = req.params.website;

  const result = await botModel.findOne({ where: { websiteName: website } })
  if (!result) {
    return res.status(400).json({ error: 'website not found!' });
  }

  // console.log(req.files)


  if (req.files.info && !req.files.prompt) {
    const infoFile = req.files.info[0];
    const infoContent = infoFile.buffer.toString('utf8');
    Redis.set(`site:${result.websiteName}:info`, infoContent);
    return res.status(200).json({ msg: 'info file update successfully!' });
  }
  if (req.files.prompt && !req.files.info) {
    const promptFile = req.files.prompt[0];
    const promptContent = promptFile.buffer.toString('utf8');
    Redis.set(`site:${result.websiteName}:prompt`, promptContent);
    return res.status(200).json({ msg: 'prompt file update successfully!' });
  }
  if (req.files.info && req.files.prompt) {
    const infoFile = req.files.info[0];
    const promptFile = req.files.prompt[0];
    const infoContent = infoFile.buffer.toString('utf8');
    const promptContent = promptFile.buffer.toString('utf8');

    Redis.set(`site:${result.websiteName}:info`, infoContent);
    Redis.set(`site:${result.websiteName}:prompt`, promptContent);
    return res.status(200).json({ msg: 'info and prompt files update successfully!' });
  }
  return res.status(400).json({ error: 'upload info or prompt file for update' });

}


async function handleIsWebsiteExist(req, res) {
  const { licenseKey } = req.params;
  // console.log(req.params)
  try {
    // Step 1: Check if website exists in DB
    const result = await botModel.findOne({ where: { license_key: licenseKey } });

    if (!result) {
      return res.status(404).json({
        valid: false,
        // isGemini: false,
        message: "Website not found in database"
      });
    }

    // console.log(result.dataValues.expire_date)
const status = result.dataValues.status;
const website_exp_date = result.dataValues.expire_date;
const now = new Date();
const today_date = new Date(now.getFullYear(), now.getMonth(), now.getDate());

// Convert website_exp_date to start of the day (optional but safe)
const site_exp_date = new Date(website_exp_date);
site_exp_date.setHours(0, 0, 0, 0);

if ((site_exp_date <= today_date)  || (status == 0)) {
  return res.status(200).json({
    valid: false,
    // isGemini: false,
    result,
    message: "Your license is expired!  or Status = 0"
  });
}
 return res.status(200).json({
    valid: true,
    // isGemini: false,
    result,
    message: "license is activate"
  });

    // Step 2: Check Gemini API (fast check using HEAD)

    // try {

    //   const response = await fetch(GEMINI_API_URL, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       contents: [{ parts: [{ text: 'are you alive' }] }],
    //     }),
    //   });

    //   const { candidates = [] } = await response.json();
    //   // console.log(candidates)
    //   if (candidates && candidates.length>0) {
    //     return res.status(200).json({
    //       valid: true,
    //       // isGemini: true,
    //       result,
    //       message: "website exists and Gemini API is working"
    //     })
    //   }
      
    // } catch (err) {

    //   return res.status(503).json({
    //     valid: true,
    //     // isGemini: false,
    //     result,
    //     message: "Website exists but Gemini API check failed"
    //   });
    // }

  } catch (err) {
    console.error('Error checking website:', err);
    return res.status(500).json({ valid: false, message: "Internal server error" });
  }
}



module.exports = {
  handleAddWebsite,
  handleUpdateData,
  handleIsWebsiteExist
};
