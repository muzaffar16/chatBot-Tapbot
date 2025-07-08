import { useEffect } from 'react';
import "../styles/footer.css";
import footerImg from '../assets/footerimg.png'
const Footer = ({ web_data ,isInternet}) => {

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
        <div className="img"><img src={footerImg} alt="" /></div>
        {/* <span>{web_data.discription}</span> */}
        {!isInternet &&(
          <span >No Internet Connection</span>
        )}
        {isInternet &&(
          <span>Welcome to the <span className="title">{web_data.websiteName}</span> Customer Service!!</span>
        )}
      </div>
    </>
  );
};

export default Footer;
