import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/stockLogo.png';
import './TopNav.css';

const TopNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <div className={`topnav-container ${scrolled ? 'scrolled' : ''}`}>
      <div className="topnav">
        {/* Logo on left */}
        <div className="nav-logo">
          <Link to="/landing">
            <img src={logo} alt="Logo" className="logo" />
          </Link>
        </div>

        {/* Nav items center */}
        <div className="nav-items">
          <Link to="/market">Market</Link>
          <Link to="/trades">Trades</Link>
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/analytics">Analytics</Link>
          {/* <Link to="/notifications">Notifications</Link> */}
        </div>

        {/* Profile icon on right */}
        <div className="nav-icons">
  <button className="icon-btn" onClick={toggleDropdown}>
    <img src="/images/profileIcon.png" alt="Profile" />
  </button>
  {dropdownOpen && (
    <div className="dropdown-menu">
      <button onClick={handleLogout}>Logout</button>
    </div>
  )}
</div>

      </div>
    </div>
  );
};

export default TopNav;
