import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import logo from '../assets/stockLogo.png';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/landing'); // go to dashboard after login
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="logo-container">
        {isLoggedIn ? (
          <img
            src={logo}
            alt="Logo"
            className="logo-small"
            onClick={() => navigate('/login')}
          />
        ) : (
          <Link to="/login">
            <img src={logo} alt="Logo" className="logo-small" />
          </Link>
        )}
      </div>

      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="field">
            <label>Username</label>
            <input
              className="input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary" type="submit">Login</button>
        </form>
        <p>
          Don’t have an account?{' '}
          <span className="toggle-link" onClick={() => navigate('/register')}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
