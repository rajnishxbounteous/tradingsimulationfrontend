import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/stockLogo.png';
import './TopNav.css';

const TopNav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`topnav-container ${scrolled ? 'scrolled' : ''}`}>
      <div className="topnav">
        {/* Logo on left, moves inside bar when scrolled */}
        <div className="nav-logo">
          <Link to="/landing">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>

        {/* Nav items center */}
        <div className="nav-items">
          <Link to="/landing">Home</Link>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/trades">Trades</Link>
          <Link to="/reports">Reports</Link>
        </div>

        {/* Icons on right */}
        <div className="nav-icons">
          <button className="icon-btn">
            <span className="material-icons">notifications</span>
          </button>
          <button className="icon-btn">
            <span className="material-icons">account_circle</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
