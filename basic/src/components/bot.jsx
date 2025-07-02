import React, { useState } from 'react';
import Header from './Header';
import '../styles/bot.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/popup.css';
import { useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

//button category
const categories = [
  { label: 'Pricing', msg: 'Suggest all possible questions/categories about Pricing and ask to select question/category like enter 1 for this ,2 for that and so on, and start with greeting' },
  { label: 'Sales & Offers', msg: 'show all possible product which you offer and when user select it than share information regarding this to user, and tell user enter 1 for this ,2 for that and so on, and start with greeting' },
  { label: 'Availability', msg: 'Suggest all possible questions/categories about availability and ask to select question/category like enter 1 for this ,2 for that and so on, and start with greeting' },
  { label: 'Redemption Help', msg: 'Suggest all possible questions/categories about Redemption Help and ask to select question/category like enter 1 for this ,2 for that and so on, and start with greeting' },
  { label: 'Payment Methods', msg: 'Which payment methods are accepted?' },
  { label: 'Complain or Issue', msg: 'Suggest all possible questions/categories about Complain or issue and ask to select question/category like enter 1 for this ,2 for that and so on, and start with greeting' },
  { label: 'Ask Help', msg: 'Print only a welcome msg to user' }
];

//main body
const Bot = ({ isPopup = false, onClose, website  , web_data }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => Date.now().toString());
  const [allowInput, setAllowInput] = useState(false);
  const [showButtons, setShowButtons] = useState(true);

  useEffect(() => {
  if (web_data) {
    document.documentElement.style.setProperty('--bot-bg', web_data.bg_color_code || '#3a8d3a');
    document.documentElement.style.setProperty('--bot-body', web_data.body_color_code || '#2e7d32');
    document.documentElement.style.setProperty('--bot-accent', web_data.accent_color || '#ffffff');
  }
}, [web_data]);

  //clean bot message
  const cleanMessage = (text) =>
    text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\\n/g, '<br />')
      .replace(/\*/g, '-')
      .trim();

      //when user enter 0 - goto main menu
  const handleMainMenuClick = () => {
    setMessages((prev) => [...prev, { sender: 'bot', text: '🔁 Returned to Main Menu' }]);
    setTimeout(() => {
      setMessages([]);
      setQuery('');
      setAllowInput(false);
      setShowButtons(true);
    }, 1500);
  };

  //user click send button send msg to bot
  const handleSend = async (text = query, showUserMsg = true) => {
    const trimmed = text.trim();
    if (!trimmed) return;
     //if msg ==0 goto main pg
    if (trimmed === '0') return handleMainMenuClick();

    //display msg to chat screen
    if (showUserMsg) {
      setMessages((prev) => [...prev, { sender: 'user', text: trimmed }]);
    }

    setQuery(''); // set input field empty
    setLoading(true);
    setShowButtons(false);
     
    //send msg to gemeini 
    try {
      const res = await fetch(`${API_URL}/chat/${website}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, sessionId }),
      });
      
      //get gemini responce and display to screen
      const data = await res.json();
      const botMessage = `${data.reply}<br /><br /><em>Enter <strong>0</strong> for 🔁 Go to Main Menu</em>`;
      setMessages((prev) => [...prev, { sender: 'bot', text: botMessage }]);
    } catch {
      setMessages((prev) => [...prev, { sender: 'bot', text: '⚠️ Error talking to server.' }]);
    } finally {
      setLoading(false);
    }
  };

  //when user click any category btn from main menu
  const handleCategoryClick = (msg) => {
    handleSend(msg, false);
    setAllowInput(true);
    setShowButtons(false);
  };

  //render user and bot msg to chat window
  const renderMessages = () =>
    messages.map((m, i) => (
      <div key={i} className={m.sender === 'user' ? 'user-msg' : 'bot-msg'}>
        <span
          className="message-text"
          dangerouslySetInnerHTML={{
            __html: m.sender === 'user' ? m.text : cleanMessage(m.text),
          }}
        />
      </div>
    ));

    //render category buttons eg. pricing etc
  const renderButtons = () =>
    showButtons && (
      <div className="category-buttons">
        {categories.map(({ label, msg }) => (
          <button key={label} onClick={() => handleCategoryClick(msg)} 
            >
            <span>{label}</span>
          </button>
        ))}
      </div>
    );


    //main content that display to user
  const content = (
    <div className="msg-window">
      <Header  web_data={web_data}/>
      <div className="chat-window">
        {/* call render msg funct */}
        {renderMessages()}  
        {/* call funct to render main menu funct */}
        {renderButtons()}
        {loading && <p className="typing-indicator">tapBot is typing…</p>}
      </div>
         
         {/* input field */}
      {allowInput && (
        <div className="user-input">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Message..."
            className="input-box"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          {query && (
            <button className="send-btn" onClick={() => handleSend()} >
              <i className="bi bi-arrow-up-circle"></i>
            </button>
          )}
        </div>
      )}
    </div>
  );

  //if not popup then show content else show neche wala div
  return !isPopup ? content : (
    <div className="popup-box">
      <div className="popup-header">
        <span>Ask Questions</span>
        <button className="popup-close" onClick={onClose} >
          &times;
        </button>
      </div>
      {content}
    </div>
  );
};

export default Bot;
