import { useEffect } from 'react';
import "../styles/footer.css";

const Footer = ({ web_data }) => {

  useEffect(() => {
    if (web_data) {
      document.documentElement.style.setProperty('--bot-bg', web_data.bg_color_code || '#3a8d3a');
      document.documentElement.style.setProperty('--bot-body', web_data.body_color_code || '#2e7d32');
      document.documentElement.style.setProperty('--bot-accent', web_data.accent_color || '#ffffff');
    }
  }, [web_data]);

  return (
    <>
      <div className="display-message">
        <span>{web_data.discription}</span>
        {/* <span>Welcome to <span className="title">TAPSHOP</span> Customer Service!!</span> */}
      </div>
    </>
  );
};

export default Footer;
