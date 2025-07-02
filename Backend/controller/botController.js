const redis = require('../redisClient');
const fetch = require('node-fetch');
const fs = require('fs/promises');
const path = require('path');
const { buildPrompt } = require('../info/builtPrompt');
const { botModel } = require('../model/botModel');
require('dotenv').config();

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;


// let KB_TEXT = redis.get(`site:${website}:info`);
// fs.readFile(path.join(__dirname, '../info/productinfo.json'), 'utf8')
//   .then(text => {
//     KB_TEXT = text;
//     console.log('Knowledge base loaded ');
//   })
//   .catch(err => {
//     console.error('Failed to load KB :', err);
//   });

// let promptText=redis.get(`site:${website}:prompt`);
//   fs.readFile(path.join( __dirname,'../info/prompt.txt'), 'utf8')
//    .then(text => {
//    promptText =  text
//   console.log('prompt loaded ');
// })

async function getData(website) {
  const result = await botModel.findOne({ where: { websiteName: website } })
  //  console.log(result)
  return result
}

const chatCache = {};

async function HandleGeminiResponce(req, res) {
  const { message, sessionId = 'anon' } = req.body;
  const website = req.params.website;

  //get prompt and info form redix
  let KB_TEXT = await redis.get(`site:${website}:info`);
  let promptText = await redis.get(`site:${website}:prompt`);

  const result = getData(website)

  if (!result) {
    console.log("result")
   return res.status(404).json({ reply: '⚠️ Bot is currently not available for this website.' });
  }

  // write expire logic here

  //   console.log("info file  ",KB_TEXT)
  // console.log("prompt file  ",promptText)
  // console.log("website", req.params.website)

  if (!message) return res.status(400).json({ error: 'Message is required' });
  if (!website) return res.status(400).json({ error: 'you have no access for this chatbot' });
  const history = chatCache[sessionId] || [];

  const historyText = history.map(h => `User: ${h.q}\nAssistant: ${h.a}`).join('\n');
  const prompt = await buildPrompt({ KB_TEXT, historyText, message, promptText });
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
    const updatedHistory = history.slice(-4);
    updatedHistory.push({ q: message, a: reply });

    // Update the cache and respond
    chatCache[sessionId] = updatedHistory;
    res.json({ reply });

  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}


module.exports = { HandleGeminiResponce };
