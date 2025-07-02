import React from 'react'
import "../styles/header.css"
import tapShopIcon from '../assets/tapShopIcon.png';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect } from 'react';

const Header = ({ web_data }) => {
  useEffect(() => {
    if (web_data) {
      document.documentElement.style.setProperty('--bot-bg', web_data.bg_color_code || '#3a8d3a');
      document.documentElement.style.setProperty('--bot-body', web_data.body_color_code || '#2e7d32');
      document.documentElement.style.setProperty('--bot-accent', web_data.accent_color || '#ffffff');
    }
  }, [web_data]);

  return (
    <div className="chat-header">
      <div className="logo">
        <i className="bi bi-robot"></i>
      </div>
      <div className="TapShop-logo">
        {/* <img src={tapShopIcon} alt="TapShop Logo" /> */}
        <img src={web_data.logo_url} style={{ width: '100px', height: 'auto', marginBottom: '10px' }} alt="TapShop Logo" />
      </div>
    </div>
  )
}

export default Header