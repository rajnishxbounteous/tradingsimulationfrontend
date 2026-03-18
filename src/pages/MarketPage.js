import React, { useEffect, useState } from "react";
import {
  fetchMarketStatus,
  fetchTopGainers,
  fetchTopLosers,
  fetchMarketSummary,
  fetchMarketNews,
} from "../services/api";
import TopNav from "../components/TopNav";
import "./MarketPage.css";

const MarketPage = () => {
  const [status, setStatus] = useState(null);
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [news, setNews] = useState([]);
  const [timerMessage, setTimerMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statusRes = await fetchMarketStatus();
        setStatus(statusRes.data);

        const gainersRes = await fetchTopGainers();
        setGainers(gainersRes.data);

        const losersRes = await fetchTopLosers();
        setLosers(losersRes.data);

        const summaryRes = await fetchMarketSummary();
        setSummary(summaryRes.data);

        const newsRes = await fetchMarketNews();
        setNews(newsRes.data);
      } catch (err) {
        console.error("Error fetching market data", err);
      }
    };

    fetchData();
  }, []);

  // Timer logic
  useEffect(() => {
    if (!status) return;

    const updateTimer = () => {
      const now = new Date();
      const times = status.message.match(/\d{2}:\d{2}/g);
      if (!times || times.length < 2) return;

      const [openHour, openMinute] = times[0].split(":");
      const [closeHour, closeMinute] = times[1].split(":");

      const openTime = new Date();
      openTime.setHours(openHour, openMinute, 0, 0);

      const closeTime = new Date();
      closeTime.setHours(closeHour, closeMinute, 0, 0);

      if (status.open) {
        const diffMs = closeTime - now;
        const diffMins = Math.max(Math.floor(diffMs / 60000), 0);
        setTimerMessage(`Market Closes in: ${diffMins} minutes`);
      } else {
        let diffMs = openTime - now;
        if (diffMs < 0) {
          openTime.setDate(openTime.getDate() + 1);
          diffMs = openTime - now;
        }
        const diffMins = Math.max(Math.floor(diffMs / 60000), 0);
        setTimerMessage(`Market Opens in: ${diffMins} minutes`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="market-page">
      <TopNav />

      <div className="market-content">
        <div className="market-top">
          {/* Market Status Card */}
          {status && (
            <div
              className={`market-card status-card ${
                status.open ? "open" : "closed"
              }`}
            >
              <h3>Market Status</h3>
              <p>{status.open ? "OPEN" : "CLOSED"}</p>
              <small>{timerMessage}</small>
            </div>
          )}

          {/* Market Summary Card */}
          {summary && (
            <div className="market-card summary-card">
              <h3>Market Summary</h3>
              <p>Stocks Up: {summary.upCount}</p>
              <p>Stocks Down: {summary.downCount}</p>
              <p>
                Average Change: {summary.averagePercentChange.toFixed(2)}%
              </p>
            </div>
          )}
        </div>

        {/* Top Gainers */}
        <div className="section">
          <h3>Top Gainers</h3>
          <div className="card-grid">
            {gainers.map((stock) => (
              <div key={stock.symbol} className="stock-card gain-card">
                <h4>{stock.name} ({stock.symbol})</h4>
                <p>{stock.description}</p>
                <p>Price: {stock.currentPrice}</p>
                <p>Change: {stock.change} ({stock.percentChange}%)</p>
                <p>High: {stock.high} | Low: {stock.low}</p>
                <p>Open: {stock.open} | Prev Close: {stock.previousClose}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Losers */}
        <div className="section">
          <h3>Top Losers</h3>
          <div className="card-grid">
            {losers.map((stock) => (
              <div key={stock.symbol} className="stock-card lose-card">
                <h4>{stock.name} ({stock.symbol})</h4>
                <p>{stock.description}</p>
                <p>Price: {stock.currentPrice}</p>
                <p>Change: {stock.change} ({stock.percentChange}%)</p>
                <p>High: {stock.high} | Low: {stock.low}</p>
                <p>Open: {stock.open} | Prev Close: {stock.previousClose}</p>
              </div>
            ))}
          </div>
        </div>

        {/* News Section */}
        <div className="news-section">
          <h3>Latest News</h3>
          <div className="news-cards">
            {news.map((item, idx) => (
              <div key={idx} className="news-card">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <h4>{item.headline}</h4>
                </a>
                <p>{item.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketPage;
