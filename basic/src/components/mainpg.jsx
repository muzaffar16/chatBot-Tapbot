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
  const { licenseKey } = useParams();
  const [showComplain, setShowComplain] = useState(false);
  const [showBot, setShowBot] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [validSite, setValidSite] = useState(null); // null = loading
  const [isInternet, setisInternet] = useState(true);

  //stop running api call two time
  const [isLoading, setIsLoading] = useState(false);

  const [web_data, setweb_data] = useState({
    websiteName: '',
    bg_color_code: '',
    color_code: '',
    font_color: '',
    logo_url: '',
    discription: ''
  });

useEffect(() => {
  
    if (isLoading) return; // Prevent multiple simultaneous requests    
    setIsLoading(true);
  console.log(licenseKey)
  fetch(`${API}/bot/check/${licenseKey}`)
    .then(res => res.json())
    .then(data => {
      setValidSite(data.valid || false);
      // setisInternet(data.isGemini ?? false);
      setweb_data(data.result);

      // If theme data is available, set CSS variables
      const result = data.result;
      if (result.bg_color_code)
        document.documentElement.style.setProperty('--bot-bg', result.bg_color_code);
      if (result.color_code)
        document.documentElement.style.setProperty('--bot-body', result.color_code);
      if (result.font_color)
        document.documentElement.style.setProperty('--bot-accent', result.font_color);
    })
    .catch(() => {
      setValidSite(false);
      setisInternet(false);
    });
}, [licenseKey]);




  const widget = (
    <div className="widget">
      <Header web_data={web_data} />
      <Footer web_data={web_data} isInternet={isInternet} />

      {isInternet && (
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
      )}
    </div>
  );


  // If full widget is being used (not embedded), handle popup logic
  if (!isPopup) {
    return (
      <>
        {validSite && (
          <button
            className="chat-launcher"
            onClick={() => setShowChat(true)}>

            {/* <i className="bi bi-robot"></i> */}
            <img src={boticon} alt="" />
            {/* <img src="https://d34080pnh6e62j.cloudfront.net/images/VideoOnDemandThumb/1752050613tapBot-logo.png" alt="" /> */}
            
          </button>
        )}
        {validSite && showChat && (
          <div >
            <div className="popup-box animated-popup">
              {widget}
            </div>
            <button
              className="chat-launcher"
              onClick={() => setShowChat(false)}>
              {/* <i className="bi bi-robot"></i> */}
              {/* <img src="https://d34080pnh6e62j.cloudfront.net/images/VideoOnDemandThumb/1752050613tapBot-logo.png" alt="" /> */}
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
          <Bot isPopup onClose={() => setShowBot(false)} web_data={web_data} />
        )}
        {validSite && (showComplain || showBot || showChat) && (
          <div>
            <button
              className="chat-launcher"
              onClick={() => {
                setShowChat(false);
                setShowBot(false);
                setShowComplain(false);
              }}
            >
              {/* <img src="https://d34080pnh6e62j.cloudfront.net/images/VideoOnDemandThumb/1752050613tapBot-logo.png" alt="" /> */}
              <img src={boticon} alt="Close all tabs" />
            </button>
          </div>
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
