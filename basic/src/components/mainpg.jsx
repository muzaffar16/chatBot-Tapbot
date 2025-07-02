import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Complain from './complain';
import Bot from './Bot';
import '../styles/mainpg.css';
import '../styles/popup.css';
import { useParams } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL;

const Mainpg = ({ isPopup = true, onClose }) => {
  const { website } = useParams();
  const [showComplain, setShowComplain] = useState(false);
  const [showBot, setShowBot] = useState(false);
  const [validSite, setValidSite] = useState(null); // null = loading
  const [web_data, setweb_data] = useState({
    websiteName: '',
    bg_color_code: '#ffffff',
    color_code: '#000000',
    font_color: '#000000',
    logo_url: '',
    discription: ''
  });

  useEffect(() => {
    fetch(`${API}/bot/check/${website}`)
      .then(res => res.json())
      .then(data => {
        setValidSite(data.valid);
        setweb_data(data.result);
        // Dynamically apply theme variables
        document.documentElement.style.setProperty('--bot-bg', web_data.bg_color_code || '#3a8d3a');
        document.documentElement.style.setProperty('--bot-body', web_data.body_color_code || '#2e7d32');
        document.documentElement.style.setProperty('--bot-accent', web_data.accent_color || '#ffffff');
      })
      .catch(() => setValidSite(false));
  }, [website]);

  const widget = (
    <div
      className="widget"
    >
      <Header web_data={web_data} />
      <div className="chat-body" >
        <div className="btn">
          <button onClick={() => setShowComplain(true)}>
            <span>Add Complain</span>
          </button>
          <button onClick={() => setShowBot(true)}>
            <span>Ask Questions</span>
          </button>
        </div>
      </div>
      <Footer web_data={web_data} />
    </div>
  );

  const botUnavailable = (
    <div className="bot-not-available">
      <h2>Bot is currently not available for this website.</h2>
    </div>
  );

  const loading = (
    <div className="bot-loading">
      <p>🔄 Checking bot availability...</p>
    </div>
  );

  const content = validSite === null ? loading : validSite ? widget : botUnavailable;

  return (
    <>
      {isPopup ? (
        <div className="popup-box">
          <div className="popup-header" style={{ backgroundColor: web_data.color_code, color: web_data.font_color }}>
            <span>Customer Service</span>
            <button className="popup-close" onClick={onClose}>&times;</button>
          </div>
          {content}
        </div>
      ) : (
        <>
          {content}
          {validSite && showComplain && (
            <Complain isPopup onClose={() => setShowComplain(false)} web_data={web_data} />
          )}
          {validSite && showBot && (
            <Bot isPopup onClose={() => setShowBot(false)} website={website} web_data={web_data} />
          )}
        </>
      )}
    </>
  );
};

export default Mainpg;
