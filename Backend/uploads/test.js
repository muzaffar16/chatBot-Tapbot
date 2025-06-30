import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import fetch from 'node-fetch';


const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAk51oBuCpPgBEGVpuS274dZL6oyyB47ng'
// Load intents.json once at startup
let intentsText = '';
(async () => {
  try {
   intentsText = await fs.readFile('./intents.txt', 'utf8');
    console.log('✅ intents.json loaded');
  } catch (err) {
    console.error('❌ Failed to load intents.json:', err);
  }
})();

// POST /chat endpoint
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required.' });

    // Build the prompt Gemini will see
    const prompt = `
You are a helpful and friendly digital assistant.

Below is a list of intents with questions and suggested answers.

Intents File:
${intentsText}

User Question:
"${message}"

Your job is to respond in a natural, human-like way. 
Only use the relevant information from the intents file to answer the user's question — but feel free to rephrase the response to sound helpful and conversational, like a real assistant would speak.

If the user asks something like "what do you sell?", explain it clearly and warmly — avoid robotic or copy-paste responses. You can format your answer with dashes, emojis, or sections if it improves clarity.

Avoid using greeting responses unless the user's message is only a greeting.
`.trim();




    const payload = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };

    const geminiResponse = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const geminiData = await geminiResponse.json();
    const reply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not understand.';

    return res.json({ reply });
  } catch (err) {
    console.error('❌ Gemini API error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
