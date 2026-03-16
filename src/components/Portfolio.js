import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Portfolio = ({ userId }) => {
  const [portfolio, setPortfolio] = useState([]);
  const [balance, setBalance] = useState(0);
  const [margin, setMargin] = useState('');
  const [ledger, setLedger] = useState([]);

  const [metrics, setMetrics] = useState({
    totalValue: 0,
    totalInvested: 0,
    unrealizedPnL: 0,
    realizedPnL: 0,
    dailyPnL: null,
    cash: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portRes, balRes, margRes, ledgerRes] = await Promise.all([
          api.get(`/portfolio/${userId}`),
          api.get(`/portfolio/${userId}/balance`),
          api.get(`/portfolio/${userId}/margin`),
          api.get(`/portfolio/${userId}/ledger`),
        ]);
        setPortfolio(portRes.data);
        setBalance(balRes.data);
        setMargin(margRes.data);
        setLedger(ledgerRes.data);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      }
    };
    if (userId) fetchData();
  }, [userId]);

  useEffect(() => {
    const totalValue = portfolio.reduce((sum, item) => sum + (item.value || 0), 0);

    const buys = ledger.filter((entry) => entry.type === 'BUY');
    const sells = ledger.filter((entry) => entry.type === 'SELL');

    const totalBought = buys.reduce((sum, entry) => sum + entry.price * entry.quantity, 0);
    const totalSold = sells.reduce((sum, entry) => sum + entry.price * entry.quantity, 0);

    const totalInvested = totalBought;
    const realizedPnL = totalSold - totalBought;
    const unrealizedPnL = totalValue - (totalBought - totalSold);

    setMetrics({
      totalValue,
      totalInvested,
      unrealizedPnL,
      realizedPnL,
      dailyPnL: null,
      cash: null,
    });
  }, [portfolio, ledger]);

  return (
    <div className="card">
      <h2>Portfolio</h2>
      <div className="portfolio-summary" style={{ marginBottom: '18px' }}>
        <div className="summary-row">
          <strong>Total Portfolio Value (Net Worth):</strong> <span>${metrics.totalValue.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <strong>Total Invested Amount:</strong> <span>${metrics.totalInvested.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <strong>Unrealized P&L:</strong> <span>${metrics.unrealizedPnL.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <strong>Realized P&L:</strong> <span>${metrics.realizedPnL.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <strong>Daily P&L:</strong>{' '}
          <span>{metrics.dailyPnL === null ? 'N/A' : `$${metrics.dailyPnL.toFixed(2)}`}</span>
        </div>
        <div className="summary-row">
          <strong>Cash & Cash Equivalents:</strong>{' '}
          <span>{metrics.cash === null ? 'N/A' : `$${metrics.cash.toFixed(2)}`}</span>
        </div>
      </div>
      <p>
        Balance: <strong>${balance.toFixed(2)}</strong> · Margin: <strong>{margin}</strong>
      </p>
      <table className="table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((item, index) => (
            <tr key={index}>
              <td>{item.symbol}</td>
              <td>{item.displaySymbol}</td>
              <td>{item.quantity}</td>
              <td>${Number(item.price || 0).toFixed(2)}</td>
              <td>${Number(item.price || 0).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Portfolio;