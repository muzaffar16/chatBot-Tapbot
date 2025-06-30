import React from 'react'
import "../styles/header.css"
import tapShopIcon from '../assets/tapShopIcon.png';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Header = () => {
  return (
    <div className="chat-header">
                <div className="logo">
                  <i className="bi bi-robot"></i>
                </div>
                <div className="TapShop-logo">
                  <img src={tapShopIcon} alt="TapShop Logo" />
                </div>
    </div>
  )
}

export default Header