import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.scss';

const Header = () => {
  return (
    <header className="header">
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="logo-text-wrapper">
            <img src="/img/logow.png" alt="Chat & Mingle Logo" />
            <span className="head">CHAT & MINGLE</span>
          </Link>
          <div className="online-status"></div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
