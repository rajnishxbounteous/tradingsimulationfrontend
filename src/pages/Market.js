import React from 'react';
import Prices from '../components/Prices';

const Market = () => {
  return (
    <div className="page">
      <h1>Market</h1>
      <p>Browse market prices and select a stock to view its historical performance.</p>
      <Prices />
    </div>
  );
};

export default Market;
