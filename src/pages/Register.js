import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import logo from '../assets/stockLogo.png';
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', { name, username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/landing'); // go to dashboard after register
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-page">
      <div className="logo-container">
        {isLoggedIn ? (
          <img
            src={logo}
            alt="Logo"
            className="logo-small"
            onClick={() => navigate('/register')}
          />
        ) : (
          <Link to="/register">
            <img src={logo} alt="Logo" className="logo-small" />
          </Link>
        )}
      </div>

      <div className="register-card">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
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
          <button className="btn btn-primary" type="submit">Register</button>
        </form>
        <p>
          Already have an account?{' '}
          <span className="toggle-link" onClick={() => navigate('/login')}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
