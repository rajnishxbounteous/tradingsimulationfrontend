import React, { useState } from 'react';
import Portfolio from '../components/Portfolio';

const PortfolioPage = () => {
  const [userId, setUserId] = useState(1);

  return (
    <div className="page">
      <h1>Portfolio</h1>
      <p>View your holdings, performance, and key portfolio metrics.</p>
      <div className="field" style={{ alignItems: 'center', marginTop: '16px', maxWidth: '300px' }}>
        <label>User ID</label>
        <input
          className="input"
          type="number"
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
          min={1}
        />
      </div>
      <Portfolio userId={userId} />
    </div>
  );
};

export default PortfolioPage;
