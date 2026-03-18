import React, { useEffect, useState } from "react";
import TopNav from "../components/TopNav";
import {
  fetchMarketStatus,
  fetchUserBalance,
  fetchUserMargin,
  fetchUserPortfolio,
  fetchUserLedger
} from "../services/api";
import "./Portfolio.css";

const Portfolio = () => {
  const userId = parseInt(localStorage.getItem("userId"), 10) || 1;
  const [status, setStatus] = useState(null);
  const [balance, setBalance] = useState(0);
  const [margin, setMargin] = useState("");
  const [holdings, setHoldings] = useState([]);
  const [ledger, setLedger] = useState([]);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const statusRes = await fetchMarketStatus();
        setStatus(statusRes.data);

        const balanceRes = await fetchUserBalance(userId);
        setBalance(balanceRes.data);

        const marginRes = await fetchUserMargin(userId);
        setMargin(marginRes.data);

        const holdingsRes = await fetchUserPortfolio(userId);
        setHoldings(holdingsRes.data);

        const ledgerRes = await fetchUserLedger(userId);
        setLedger(ledgerRes.data);
      } catch (err) {
        console.error("Error loading portfolio:", err);
      }
    };

    loadPortfolio();
  }, [userId]);

  const marginLines =
    typeof margin === "string" ? margin.split(",").map((line) => line.trim()) : [];

  return (
    <div className="portfolio-page">
      <TopNav />

      <div className="portfolio-content">
        {/* Top Section */}
        <div className="top-cards">
          {/* Market Status Card */}
          {status && (
            <div
              className={`market-card ${status.open ? "open" : "closed"}`}
            >
              <h2>Market Status</h2>
              <p>{status.open ? "OPEN" : "CLOSED"}</p>
              {status.message && <small>{status.message}</small>}
            </div>
          )}

          {/* Portfolio Overview Card */}
          <div className="overview-card">
            <h2>Portfolio Overview</h2>
            <p>Balance: ₹{balance.toFixed(2)}</p>
            {marginLines.map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
        </div>

        {/* Holdings Section */}
        <div className="portfolio-section">
          <h3>Current Holdings</h3>
          {holdings.length === 0 ? (
            <p>No holdings available.</p>
          ) : (
            <div className="card-list">
              {holdings.map((h) => {
                const pl = (h.currentPrice - h.avgPrice) * h.quantity;
                return (
                  <div key={h.symbol} className="data-card horizontal-card">
                    <div className="card-header">
                      <span className="symbol">{h.symbol}</span>
                      <span className="name">{h.description}</span>
                    </div>
                    <div className="card-body horizontal-body">
                      <p>Qty: {h.quantity}</p>
                      <p>Avg: ₹{h.avgPrice}</p>
                      <p>Current: ₹{h.currentPrice}</p>
                      <p className={pl >= 0 ? "gain" : "loss"}>
                        {pl >= 0 ? "▲" : "▼"} ₹{isNaN(pl) ? 0 : pl.toFixed(2)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Trade History Section */}
        <div className="portfolio-section">
          <h3>Trade History</h3>
          {ledger.length === 0 ? (
            <p>No trades yet.</p>
          ) : (
            <div className="card-list">
              {ledger.map((entry) => (
                <div key={entry.id} className="data-card horizontal-card">
                  <div className="card-header">
                    <span className="symbol">{entry.stockSymbol}</span>
                    <span className="name">{entry.description}</span>
                  </div>
                  <div className="card-body horizontal-body">
                    <p>Type: {entry.type}</p>
                    <p>Qty: {entry.quantity}</p>
                    <p>Price: ₹{entry.price}</p>
                    <p>Date: {new Date(entry.timestamp).toLocaleString()}</p>
                    <p>User: {entry.userId}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
