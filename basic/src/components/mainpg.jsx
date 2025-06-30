// mainpg.jsx
import React, { useState } from 'react';
import Header   from './Header';
import Footer   from './Footer';
import Complain from './complain';
import Bot      from './Bot';
import '../styles/mainpg.css';
import '../styles/popup.css';   // popup styles

const Mainpg = ({ isPopup = false, onClose }) => {
  // local pop-up toggles
  const [showComplain, setShowComplain] = useState(false);
  const [showBot,      setShowBot]      = useState(false);

  /* -------------------------------- main widget -------------------------------- */
  const widget = (
    <div className="widget">
      <Header />

      <div className="chat-body">
        <div className="btn">
          <button onClick={() => setShowComplain(true)}>
            <span>Add Complain</span>
          </button>

          <button onClick={() => setShowBot(true)}>
            <span>Ask Questions</span>
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );

  /* ------------------------------ full-page view ------------------------------- */
  if (!isPopup) {
    return (
      <>
        {widget}

        {/* pop-ups rendered on demand */}
        {showComplain && (
          <Complain isPopup onClose={() => setShowComplain(false)} />
        )}
        {showBot && <Bot isPopup onClose={() => setShowBot(false)} />}
      </>
    );
  }

  /* ------------------------------- pop-up view --------------------------------- */
  return (
    <>
      <div className="popup-box">
        <div className="popup-header">
          <span>Customer Service</span>
          <button className="popup-close" onClick={onClose}>&times;</button>
        </div>
        {widget}
      </div>

      {/* nested pop-ups (stack above) */}
      {showComplain && (
        <Complain isPopup onClose={() => setShowComplain(false)} />
      )}
      {showBot && <Bot isPopup onClose={() => setShowBot(false)} />}
    </>
  );
};

export default Mainpg;
