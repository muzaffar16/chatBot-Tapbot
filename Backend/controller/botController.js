// File: controller/botController.js
const fetch = require('node-fetch');
const fs = require('fs/promises');
const path = require('path');
const { buildPrompt } = require('../info/builtPrompt');
require('dotenv').config();

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;


let KB_TEXT = '';
fs.readFile(path.join(__dirname, '../info/productinfo.json'), 'utf8')
  .then(text => {
    KB_TEXT = text;
    console.log('Knowledge base loaded ');
  })
  .catch(err => {
    console.error('Failed to load KB :', err);
  });

const chatCache = {};

async function HandleGeminiResponce(req, res) {
  const { message, sessionId = 'anon' } = req.body;
//   const WELCOME_CATEGORIES = `
// 👋 Welcome! I can help you with:

// 🔹 **Pricing** — Ask for prices of any game or gift card  
// 🔹 **Sales & Offers** — Find out current discounts  
// 🔹 **Availability** — Check if a product is in stock  
// 🔹 **Redemption Help** — Step-by-step usage instructions  
// 🔹 **Payment Methods** — Know how to pay  
// 🔹 **Complain or Issue** — File a complaint

// 💬 Just type a question or tap a category to start!
// `;

  if (!message) return res.status(400).json({ error: 'Message is required' });

  const history = chatCache[sessionId] || [];

  // // 🔥 Return only if message is "__init__"
  // if (message === '__init__') {
  //   chatCache[sessionId] = [{ q: 'Welcome', a: WELCOME_CATEGORIES }];
  //   return res.json({ reply: WELCOME_CATEGORIES });
  // }

  const historyText = history.map(h => `User: ${h.q}\nAssistant: ${h.a}`).join('\n');
  const prompt =await buildPrompt({ KB_TEXT, historyText, message });
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
  console.log(candidates)
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
