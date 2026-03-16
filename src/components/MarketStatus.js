import React, { useState, useEffect } from 'react';
import api from '../services/api';

const MarketStatus = () => {
  const [status, setStatus] = useState({ open: false, message: '' });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get('/market/status');
        setStatus(res.data);
      } catch (error) {
        console.error('Error fetching market status:', error);
      }
    };
    fetchStatus();
  }, []);

  return (
    <div className="card">
      <h2>Market Status</h2>
      <p>{status.message}</p>
    </div>
  );
};

export default MarketStatus;