import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TopNav = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(false);

  const menuItems = [
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/market', label: 'Market' },
    { path: '/analytics', label: 'Stock Analytics' },
    { path: '/trading', label: 'Trading' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    if (onLogout) onLogout();
  };

  return (
    <header className="topnav">
      <div className="topnav-left">
        <div className="brand" onClick={() => handleNavigation('/portfolio')}>
          <span className="brand-icon">📈</span>
          <span className="brand-name">Trading Simulator</span>
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
      </div>

      <div className="topnav-right">
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
