import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Complain from './complain';
import Bot from './Bot';
import '../styles/mainpg.css';
import '../styles/popup.css';
import { useParams } from 'react-router-dom';
import boticon from '../assets/boticon.png'

const API = import.meta.env.VITE_API_URL;

const Mainpg = ({ isPopup = true, onClose }) => {
  const { website } = useParams();
  const [showComplain, setShowComplain] = useState(false);
  const [showBot, setShowBot] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [validSite, setValidSite] = useState(null); // null = loading

  const [web_data, setweb_data] = useState({
    websiteName: '',
    bg_color_code: '',
    color_code: '',
    font_color: '',
    logo_url: '',
    discription: ''
  });

  useEffect(() => {
    fetch(`${API}/bot/check/${website}`)
      .then(res => res.json())
      .then(data => {
        setValidSite(data.valid);
        setweb_data(data.result);

        // Set theme from fetched result
        const result = data.result || {};
        document.documentElement.style.setProperty('--bot-bg', result.bg_color_code);
        document.documentElement.style.setProperty('--bot-body', result.color_code);
        document.documentElement.style.setProperty('--bot-accent', result.font_color);
      })
      .catch(() => setValidSite(false));
  }, [website]);

  const widget = (
    <div className="widget">
      <Header web_data={web_data} />
      <Footer web_data={web_data} />
      <div className="chat-body">
        <div className="complain-btn">
          <button onClick={() => setShowComplain(true)}>
            <span>Add Complain</span>
          </button>
        </div>
        <div className="question-btn">
          <button className='white' onClick={() => setShowBot(true)}>
            <span>Ask Questions</span>
          </button>
        </div>
      </div>
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

  // If full widget is being used (not embedded), handle popup logic
  if (!isPopup) {
    return (
      <>
        {validSite && !showChat && !showComplain && !showBot && (
          <button
            className="chat-launcher"
            onClick={() => setShowChat(true)}>

            {/* <i className="bi bi-robot"></i> */}
            <img src={boticon} alt="" />

          </button>
        )}
        {validSite && showChat && !showComplain && !showBot && (
          <div >
            <div className="popup-box">
              {/* <div className="popup-header" style={{ backgroundColor: web_data.color_code, color: web_data.font_color }}>
                <span>Customer Service</span>
                <button className="popup-close" onClick={() => setShowChat(false)}>&times;</button>
              </div> */}
              {widget}
            </div>
            <button
              className="chat-launcher"
              onClick={() => setShowChat(false)}>
              {/* <i className="bi bi-robot"></i> */}
              <img src={boticon} alt="" />

            </button>
          </div>
        )}


        {/* Chat window appears when icon is clicked */}

        {/* Optional full-page content */}
        {validSite && showComplain && (
          <Complain isPopup onClose={() => setShowComplain(false)} web_data={web_data} />
        )}
        {validSite && showBot && (
          <Bot isPopup onClose={() => setShowBot(false)} website={website} web_data={web_data} />
        )}

      </>
    );
  }

  // If being used inside a popup container (like iframe embed mode)
  return (
    <div className="popup-box">
      <div className="popup-header" style={{ backgroundColor: web_data.color_code, color: web_data.font_color }}>
        <span>Customer Service</span>
        <button className="popup-close" onClick={onClose}>&times;</button>
      </div>
      {validSite === null ? loading : validSite ? widget : botUnavailable}
    </div>
  );
};

export default Mainpg;
