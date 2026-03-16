import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', { username, password });
      localStorage.setItem('token', response.data.token);
      alert('Registration successful! You are now logged in.');
      navigate('/');
    } catch (error) {
      alert('Registration failed: ' + (error.response?.data || error.message));
    }
  };

  return (
    <div className="card" style={{ margin: 'auto' }}>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
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
        <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
          Register
        </button>
      </form>
      <p>Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
};

export default Register;