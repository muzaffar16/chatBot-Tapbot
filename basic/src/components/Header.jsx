import React from 'react'
import "../styles/header.css";
import '../styles/popup.css';
import tapShopIcon from '../assets/tapShopIcon.png';
import 'bootstrap-icons/font/bootstrap-icons.css';
import boticon from '../assets/boticon.png'
import { useEffect } from 'react';

const Header = ({ web_data , closeBtnShow, onClose}) => {
  useEffect(() => {
    if (web_data) {
      document.documentElement.style.setProperty('--bot-bg', web_data.bg_color_code || '#3a8d3a');
      document.documentElement.style.setProperty('--bot-body', web_data.body_color_code || '#2e7d32');
      document.documentElement.style.setProperty('--bot-accent', web_data.accent_color || '#ffffff');
    }
  }, [web_data]);

  return (
    <div className="chat-header">
      {closeBtnShow &&(
         <div className="closeBtn">
              <button className="popup-close" onClick={onClose}><i className="bi bi-arrow-left-short"></i></button>
      </div>
      )}
      <div className="logo">
        {/* <i className="bi bi-robot"></i> */}
        <img src={boticon} alt="" />
      </div>
      <div className="TapShop-logo">
        {/* <img src={tapShopIcon} alt="TapShop Logo" /> */}
        <img src={web_data.logo_url} style={{ width: '100px', height: 'auto'}} alt="TapShop Logo" />
      </div>
    </div>
  )
}

export default Header