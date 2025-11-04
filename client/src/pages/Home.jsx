import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import '../styles/Home.scss';

const Home = () => {
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isOver18, setIsOver18] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);

  const handleStartChat = () => {
    setIsPopupOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isOver18 && acceptTerms && captchaValue) {
      navigate('/chat');
    }
  };

  return (
    <div className="home">
      <div className={`hero_area ${isPopupOpen ? 'blur' : ''}`}>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <div className="row">
              <div className="col-md-7">
                <div className="hero-content">
                  <h1>Welcome To <span className="cs">Chat & Mingle</span></h1>
                  <p>Chat & Mingle connects people worldwide, offering a fun platform to make friends and chat with strangers. Whether for casual conversations or meaningful connections, meet individuals from diverse backgrounds and cultures and start exploring new friendships today!</p>
                  <button onClick={handleStartChat} className="start-chat-btn">
                    Start Chatting
                  </button>
                </div>
              </div>
              <div className="col-md-5">
                <div className="hero-image">
                  <img src="/img/1sst.svg" alt="Chat Illustration" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          {/* Add your features content here */}
        </section>
      </div>

      {/* Popup Form */}
      {isPopupOpen && (
        <div className="popup">
          <form onSubmit={handleSubmit}>
            <div className="wrap">
              <input
                type="checkbox"
                id="check1"
                checked={isOver18}
                onChange={(e) => setIsOver18(e.target.checked)}
              />
              <label htmlFor="check1">You are 18 or above</label>
            </div>
            <div className="wrap">
              <input
                type="checkbox"
                id="check2"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <label htmlFor="check2">Accept terms and conditions</label>
            </div>
            <div className="tc">
              {/* Terms and conditions content */}
            </div>
            <ReCAPTCHA
              sitekey="6Lcy2eopAAAAALMqcOmeJ6oC5IKWebxDf3hG_gaG"
              onChange={(value) => setCaptchaValue(value)}
            />
            <div className="submit-btn">
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;
