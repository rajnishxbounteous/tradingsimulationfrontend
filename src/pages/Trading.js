import React, { useState } from 'react';
import api from '../services/api';

const Trading = () => {
  const [userId, setUserId] = useState(1); // Default to 1, user can change
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState(1);

  const buyStock = async () => {
    try {
      await api.post(`/portfolio/${userId}/buy`, { symbol, quantity: Number(quantity) });
      alert('Stock purchased successfully!');
    } catch (error) {
      alert('Buy failed: ' + (error.response?.data || error.message));
    }
  };

  const sellStock = async () => {
    try {
      await api.post(`/portfolio/${userId}/sell`, { symbol, quantity: Number(quantity) });
      alert('Stock sold successfully!');
    } catch (error) {
      alert('Sell failed: ' + (error.response?.data || error.message));
    }
  };

  return (
    <div className="card" style={{ maxWidth: '520px', margin: 'auto' }}>
      <h1>Trading</h1>

      <div className="field">
        <label>User ID</label>
        <input
          className="input"
          type="number"
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
          min={1}
        />
      </div>

      <div className="field">
        <label>Symbol</label>
        <input
          className="input"
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="e.g., AAPL"
        />
      </div>

      <div className="field">
        <label>Quantity</label>
        <input
          className="input"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
        <button className="btn btn-primary" onClick={buyStock} style={{ flex: 1 }}>
          Buy
        </button>
        <button className="btn btn-secondary" onClick={sellStock} style={{ flex: 1 }}>
          Sell
        </button>
      </div>
    </div>
  );
};

export default Trading;