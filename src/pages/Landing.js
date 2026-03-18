import React, { useEffect, useState } from 'react';
import API from '../services/api';
import TopNav from '../components/TopNav';
import './Landing.css';

const Landing = () => {
  const [marketStatus, setMarketStatus] = useState('Closed');
  const [timeRemaining, setTimeRemaining] = useState('');
  const [stocks, setStocks] = useState([]);

  const marketOpenHour = 9;
  const marketOpenMinute = 30;
  const marketCloseHour = 15;
  const marketCloseMinute = 30;

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await API.get('/market/status'); // corrected endpoint
        setMarketStatus(res.data.isOpen ? 'Open' : 'Closed');
      } catch (err) {
        console.error('Error fetching market status:', err);
      }
    };
    fetchStatus();

    const interval = setInterval(() => {
      const now = new Date();
      const openTime = new Date();
      openTime.setHours(marketOpenHour, marketOpenMinute, 0, 0);
      const closeTime = new Date();
      closeTime.setHours(marketCloseHour, marketCloseMinute, 0, 0);

      if (marketStatus === 'Open') {
        if (now > closeTime) {
          setTimeRemaining('Closed');
        } else {
          const diffMs = closeTime - now;
          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        }
      } else {
        if (now < openTime) {
          const diffMs = openTime - now;
          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          const tomorrowOpen = new Date(openTime.getTime() + 24 * 60 * 60 * 1000);
          const diffMs = tomorrowOpen - now;
          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [marketStatus]);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await API.get('/stocks'); // corrected endpoint
        setStocks(res.data.slice(0, 8)); // ensure 8 stocks
      } catch (err) {
        console.error('Error fetching stocks:', err);
      }
    };
    fetchStocks();
  }, []);

  return (
    <div className="landing-page">
      <TopNav />

      {/* Market Status Card centered above */}
      <div className={`stock-card market-card ${marketStatus === 'Open' ? 'open' : 'closed'}`}>
        <h3>Market Status 
          <span className={`status-dot ${marketStatus === 'Open' ? 'dot-open' : 'dot-closed'}`}></span>
        </h3>
        <p className="status-text"><strong>{marketStatus}</strong></p>
        <p className="timer-text">
          {marketStatus === 'Open' ? `Closes in: ${timeRemaining}` : `Opens in: ${timeRemaining}`}
        </p>
        <p className="schedule-info">Market timing: 9:30 AM IST to 15:30 PM IST</p>
      </div>

      {/* Stock Cards Grid */}
      <div className="stocks-grid">
        {stocks.map((stock, idx) => (
          <div key={idx} className="stock-card">
            <h3>{stock.description} ({stock.symbol})</h3>
            <p className="price">₹{stock.currentPrice}</p>
            <p className={`change ${stock.change >= 0 ? 'up' : 'down'}`}>
              {stock.change >= 0 ? '▲' : '▼'} {stock.change} ({stock.percentChange}%)
            </p>
            <p className="extra-info">
              High: ₹{stock.high} | Low: ₹{stock.low} | Open: ₹{stock.open} | Prev Close: ₹{stock.previousClose}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Landing;
