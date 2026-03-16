import React, { useState } from 'react';
import Portfolio from '../components/Portfolio';
import MarketStatus from '../components/MarketStatus';
import Prices from '../components/Prices';

const Dashboard = () => {
  const [userId, setUserId] = useState(1); // Default to 1, user can change

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to your trading dashboard. Monitor markets, view your portfolio, and trade stocks.</p>
        <div className="field" style={{ alignItems: 'center', marginTop: '16px' }}>
          <label>User ID</label>
          <input
            className="input"
            type="number"
            value={userId}
            onChange={(e) => setUserId(Number(e.target.value))}
            min={1}
            style={{ width: '100px', marginLeft: '8px' }}
          />
        </div>
      </div>

      <div className="dashboard-grid">
        <MarketStatus />
        <Prices />
        <Portfolio userId={userId} />
      </div>
    </div>
  );
};

export default Dashboard;