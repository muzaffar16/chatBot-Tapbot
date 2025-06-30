const fs = require('fs/promises');
const path = require('path');

async function buildPrompt({ KB_TEXT, historyText, message }) {
  try {
    const templatePath = path.join( __dirname,'prompt.txt');
    let promptText = await fs.readFile(templatePath, 'utf8');
    console.log(templatePath)
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

module.exports = { buildPrompt };
