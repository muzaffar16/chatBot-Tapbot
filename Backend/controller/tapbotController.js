/**
 * @description
 */
const BaseController 	  = require("./BaseController");
const { botModel }        = require('../Model/botModel');
const { complainModel }        = require('../Model/complainModel');
const crypto              = require('crypto');
const  GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
let chatCache={}
const path = require('path');
//------------------extent base controller class----------------

class TapBotController extends BaseController {
    
    // var chatCache;
    constructor() {
        super();
    //    chatCache={}   
    }
    // const  GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    //-----------------------------get Tashops Banners--------------------------------
    handleAddWebsite = async (req, res) => {
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

	  const hash = crypto.createHash('md5').update(websiteName).digest('hex');
	 
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
	  await this.RedisDb.setCache(`site:${websiteName}:info`, infoContent);
	  await this.RedisDb.setCache(`site:${websiteName}:prompt`, promptContent);

	  res.status(200).json({ msg: 'Saved to Redis successfully', websiteName });
	}

    handleUpdateData=async(req,res) =>{
        const website = req.params.website;
        
          const result = await botModel.findOne({ where: { websiteName: website } })
          if (!result) {
            return res.status(400).json({ error: 'website not found!' });
          }
        
          // console.log(req.files)
        
        
          if (req.files.info && !req.files.prompt) {
            const infoFile = req.files.info[0];
            const infoContent = infoFile.buffer.toString('utf8');
            await this.RedisDb.setCache(`site:${result.websiteName}:info`, infoContent);
            return res.status(200).json({ msg: 'info file update successfully!' });
          }
          if (req.files.prompt && !req.files.info) {
            const promptFile = req.files.prompt[0];
            const promptContent = promptFile.buffer.toString('utf8');
            await this.RedisDb.setCache(`site:${result.websiteName}:prompt`, promptContent);
            return res.status(200).json({ msg: 'prompt file update successfully!' });
          }
          if (req.files.info && req.files.prompt) {
            const infoFile = req.files.info[0];
            const promptFile = req.files.prompt[0];
            const infoContent = infoFile.buffer.toString('utf8');
            const promptContent = promptFile.buffer.toString('utf8');
        
            await this.RedisDb.setCache(`site:${result.websiteName}:info`, infoContent);
            await this.RedisDb.setCache(`site:${result.websiteName}:prompt`, promptContent);
            return res.status(200).json({ msg: 'info and prompt files update successfully!' });
          }
          return res.status(400).json({ error: 'upload info or prompt file for update' });
        
    }

    handleIsWebsiteExist =async (req,res)=>{
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


    /* -------------------------- chat with gemini ---------------------- */

    getData =async (website) =>{
          const result = await botModel.findOne({ where: { websiteName: website } })
          //  console.log(result)
          return result
    }
    //  let chatCache
    HandleGeminiResponce =async (req,res) =>{
         
         const { message, sessionId = 'anon' } = req.body;
          const website = req.params.website;
        
          const result =this.getData(website)
          if (!result) {
           
            // console.log("result")
            return res.status(404).json({ reply: 'Bot is currently not available for this website.' });
          }
        
          //get prompt and info form redix
        
          let KB_TEXT = await this.RedisDb.getCache(`site:${website}:info`);
        //   console.log(KB_TEXT)
          let promptText = await this.RedisDb.getCache(`site:${website}:prompt`);
        
          // const result = getData(website)
        
        
          // write expire logic here
        
          //   console.log("info file  ",KB_TEXT)
          // console.log("prompt file  ",promptText)
          // console.log("website", req.params.website)
        
          if (!message) return res.status(400).json({ error: 'Message is required' });
          if (!website) return res.status(400).json({ error: 'you have no access for this chatbot' });
          const history = chatCache[sessionId] || [];
        
          const historyText = history.map(h => `User: ${h.q}\nAssistant: ${h.a}`).join('\n');
          const prompt = await this.buildPrompt({ KB_TEXT, historyText, message, promptText });
          // console.log("prompt: ",prompt)
          try {
            const response = await fetch(GEMINI_API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
              }),
            });
        
            const { candidates = [] } = await response.json();
            // console.log(candidates)
            const reply = candidates[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn’t understand.';
        
        
            // Keep last 4 messages + current exchange
            let updatedHistory = [];
            updatedHistory = history.slice(-4);
            updatedHistory.push({ q: message, a: reply });
        
            // Update the cache and respond
            chatCache[sessionId] = updatedHistory;
            console.log(chatCache[sessionId])
          console.log(updatedHistory.length)
            res.json({ reply });
        
          } catch (err) {
            console.error('Gemini error:', err);
            res.status(500).json({ error: 'Internal server error' });
          }
    }

    HandleComplainData = async (req,res) =>{
        const { order_id = '', mobile_number = '', email = '', message = '' } = req.body;

  // wrong file type already blocked by multer, but double-check
  const attachmentPath = req.file ? `/uploads/${req.file.filename}` : null;

  // ------------- save to DB -------------
    await complainModel.create({
      order_id,
      mobile_number,
      email: email || null,
      message,
      attachment: attachmentPath,
      ip: req.ip,
      status: 1,
      created_by: req.ip,
      created_at: new Date()
    });
    res.status(200).json({ message: 'Inquiry submitted successfully' });
    }

    
    
    buildPrompt = async ({ KB_TEXT, historyText, message,promptText }) =>{
      try {
        // console.log("info file  ",KB_TEXT)
        // console.log("prompt file  ",promptText)
        // Replace placeholders
        promptText = promptText
          .replace('{{KB_TEXT}}', KB_TEXT)
          .replace('{{historyText}}', historyText)
          .replace('{{message}}', message);
        
        //  console.log(promptText)
    
        return promptText;
      } catch (err) {
        console.error('Error loading prompt template:', err);
        return 'Prompt generation failed.';
      }
    }
    


}

module.exports =new TapBotController;