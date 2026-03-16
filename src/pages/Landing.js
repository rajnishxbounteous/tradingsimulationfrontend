import React, { useEffect, useState } from 'react';
import API, { fetchStockPrices } from '../services/api';
import './Landing.css';

const Landing = () => {
  const [marketStatus, setMarketStatus] = useState('Closed');
  const [timeRemaining, setTimeRemaining] = useState('');
  const [stocks, setStocks] = useState([]);

  // Market schedule: opens at 9:30 AM IST, closes at 3:30 PM IST
  const marketOpenHour = 9;
  const marketOpenMinute = 30;
  const marketCloseHour = 15;
  const marketCloseMinute = 30;

  useEffect(() => {
    // Fetch market status from backend
    const fetchStatus = async () => {
      try {
        const res = await API.get('/market/status'); // backend endpoint
        setMarketStatus(res.data.status); // "Open" or "Closed"
      } catch (err) {
        console.error('Error fetching market status:', err);
      }
    };
    fetchStatus();

    // Countdown timer
    const interval = setInterval(() => {
      const now = new Date();

      const openTime = new Date();
      openTime.setHours(marketOpenHour, marketOpenMinute, 0, 0);

      const closeTime = new Date();
      closeTime.setHours(marketCloseHour, marketCloseMinute, 0, 0);

      if (marketStatus === 'Open') {
        if (now > closeTime) {
          setTimeRemaining('Market Closed');
        } else {
          const diffMs = closeTime - now;
          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        }
      } else {
        // Market closed → show time until next open
        if (now < openTime) {
          const diffMs = openTime - now;
          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
          setTimeRemaining(`Opens in ${hours}h ${minutes}m ${seconds}s`);
        } else {
          // If already past today's open time, calculate for tomorrow
          const tomorrowOpen = new Date(openTime.getTime() + 24 * 60 * 60 * 1000);
          const diffMs = tomorrowOpen - now;
          const hours = Math.floor(diffMs / (1000 * 60 * 60));
          const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
          setTimeRemaining(`Opens in ${hours}h ${minutes}m ${seconds}s`);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [marketStatus]);

  useEffect(() => {
    // Fetch stock prices continuously
    const loadStocks = async () => {
      try {
        const res = await fetchStockPrices();
        setStocks(res.data); // assume backend returns array of {symbol, currentPrice, change, percentChange}
      } catch (err) {
        console.error('Error fetching stocks:', err);
      }
    };

    loadStocks();
    const interval = setInterval(loadStocks, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main-content">
      <div className={`card market-card ${marketStatus === 'Open' ? 'open' : 'closed'}`}>
        <h2>
          Market Status 
          <span className={`status-dot ${marketStatus === 'Open' ? 'dot-open' : 'dot-closed'}`}></span>
        </h2>
        <p><strong>{marketStatus}</strong></p>
        <h3>{marketStatus === 'Open' ? 'Time Remaining to Close' : 'Time Remaining to Open'}</h3>
        <p><strong>{timeRemaining}</strong></p>
        <p className="schedule-info">
          Market opens at {marketOpenHour}:{marketOpenMinute.toString().padStart(2, '0')} AM IST
          &nbsp;|&nbsp; closes at {marketCloseHour}:{marketCloseMinute.toString().padStart(2, '0')} PM IST
        </p>
      </div>

      <div className="card">
        <h2>Live Stock Prices</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Price</th>
              <th>Change</th>
              <th>% Change</th>
            </tr>
          </thead>
          <tbody>
            {stocks.slice(0, 5).map((stock) => (
              <tr key={stock.symbol}>
                <td>{stock.symbol}</td>
                <td>{stock.currentPrice}</td>
                <td style={{ color: stock.change >= 0 ? 'green' : 'red' }}>
                  {stock.change}
                </td>
                <td style={{ color: stock.percentChange >= 0 ? 'green' : 'red' }}>
                  {stock.percentChange}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Landing;
