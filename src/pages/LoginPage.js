import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/tradeMarcoLogo.jpg'; // place your logo in src/assets
import './LoginPage.css';

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call backend login/register API
    localStorage.setItem('token', 'dummyToken');
    navigate('/landing');
  };

  return (
    <div className="login-page">
      {/* Logo top-left */}
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo-small" />
      </div>

      {/* Center card */}
      <div className="login-card">
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
        </form>
        <p>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span className="toggle-link" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Login here' : 'Register'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
