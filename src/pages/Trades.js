import React, { useEffect, useState } from "react";
import TopNav from "../components/TopNav";
import { fetchAllStocks, executeTrade } from "../services/api";
import "./Trades.css";

const Trades = () => {
  const [stocks, setStocks] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const userId = parseInt(localStorage.getItem("userId"), 10) || 1;

  useEffect(() => {
    const loadStocks = async () => {
      try {
        const res = await fetchAllStocks();
        console.log("Stocks from backend:", res.data);
        setStocks(res.data);
      } catch (err) {
        console.error("Error fetching stocks", err);
      }
    };
    loadStocks();

    const interval = setInterval(loadStocks, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleTrade = async (type) => {
    try {
      const payload = {
        userId,
        symbol: symbol.trim(),
        quantity: parseInt(quantity, 10),
        type,
      };
      console.log("Trade payload:", payload);

      const res = await executeTrade(payload);
      console.log("Trade response:", res.data);

      alert(`${type} order placed for ${payload.quantity} shares of ${payload.symbol}`);
      setSymbol("");
      setQuantity("");
    } catch (err) {
      console.error("Trade error:", err.response ? err.response.data : err);
      alert(err.response?.data?.message || "Error executing trade");
    }
  };

  return (
    <div className="trades-page">
      <TopNav />

      <div className="trades-content">
        {/* Trade Card */}
        <div className="trade-card">
          <h3>Place Trade</h3>
          <p>User ID: {userId}</p>
          <input
            type="text"
            placeholder="Company Symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          />
          <input
            type="number"
            placeholder="Number of Stocks"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <div className="trade-buttons">
            <button
              className="buy-btn"
              disabled={!symbol || !quantity}
              onClick={() => handleTrade("BUY")}
            >
              Buy
            </button>
            <button
              className="sell-btn"
              disabled={!symbol || !quantity}
              onClick={() => handleTrade("SELL")}
            >
              Sell
            </button>
          </div>
        </div>

        {/* Stocks List */}
        <div className="stocks-list">
          <h3>Live Stocks</h3>
          {stocks.length === 0 ? (
            <p>No stocks available.</p>
          ) : (
            <div className="stocks-table">
              {stocks.map((stock) => {
                const isGain = stock.change >= 0;
                return (
                  <div key={stock.symbol} className="stock-card">
                    <div className="stock-header">
                      <span className="stock-symbol">{stock.symbol}</span>
                      <span className="stock-name">{stock.description}</span>
                      <span className="stock-price">₹{stock.currentPrice.toFixed(2)}</span>
                      <span
                        className={`stock-change ${isGain ? "gain" : "loss"}`}
                      >
                        {isGain ? "▲" : "▼"} {stock.percentChange.toFixed(2)}%
                      </span>
                    </div>
                    <div className="stock-details">
                      High: ₹{stock.high} &nbsp; Low: ₹{stock.low} &nbsp; 
                      Open: ₹{stock.open} &nbsp; Prev Close: ₹{stock.previousClose}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trades;
