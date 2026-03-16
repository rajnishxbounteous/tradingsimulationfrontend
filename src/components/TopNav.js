import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/tradeMarcoLogo.jpg'; // import your logo

const TopNav = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);

  const menuItems = [
    { path: '/market', label: 'Market' },
    { path: '/trading', label: 'Trades' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/orders', label: 'Orders' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (onLogout) onLogout();
    navigate('/login');
  };

  return (
    <header className="topnav">
      <div className="topnav-left">
        <div className="brand" onClick={() => handleNavigation('/landing')}>
          <img src={logo} alt="Trading Simulator Logo" className="brand-logo" />
        </div>
      </div>

      <nav className="topnav-menu">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className={`topnav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => handleNavigation(item.path)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="topnav-right">
        <button className="notification">🔔</button>
        <button className="profile" onClick={() => setOpenMenu((open) => !open)}>
          <span className="profile-icon">👤</span>
          <span className="profile-name">Profile</span>
        </button>
        {openMenu && (
          <div className="profile-menu">
            <button className="profile-menu-item" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopNav;
