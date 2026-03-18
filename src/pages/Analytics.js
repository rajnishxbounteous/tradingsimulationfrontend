import React, { useEffect, useState } from "react";
import TopNav from "../components/TopNav";
import {
  fetchMarketStatus,
  fetchUserPortfolio,
  fetchUserLedger,
  fetchUserBalance,
  fetchUserMargin,
} from "../services/api";
import "./Analytics.css";

const AnalyticsPage = () => {
  const userId = parseInt(localStorage.getItem("userId"), 10) || 1;

  const [status, setStatus] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [balance, setBalance] = useState(0);
  const [margin, setMargin] = useState("");

  // Derived analytics
  const [marketCompliance, setMarketCompliance] = useState({
    validOrders: 0,
    rejectedOrders: 0,
  });
  const [tradingActivity, setTradingActivity] = useState({
    marketOrders: 0,
    limitOrders: 0,
    pendingLimit: 0,
  });
  const [portfolioSnapshot, setPortfolioSnapshot] = useState({
    balance: 0,
    marginPower: 0,
    stocksHeld: 0,
  });
  const [performance, setPerformance] = useState({
    totalPnL: 0,
    bestTrade: null,
    worstTrade: null,
  });
  const [tradeInsights, setTradeInsights] = useState({
    winRatio: 0,
    avgBuy: 0,
    avgSell: 0,
  });

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const statusRes = await fetchMarketStatus();
        setStatus(statusRes.data);

        const balanceRes = await fetchUserBalance(userId);
        setBalance(balanceRes.data);

        const marginRes = await fetchUserMargin(userId);
        setMargin(marginRes.data);

        const portfolioRes = await fetchUserPortfolio(userId);
        setPortfolio(portfolioRes.data);

        const ledgerRes = await fetchUserLedger(userId);
        setLedger(ledgerRes.data);

        // After data is loaded, compute analytics
        computeAnalytics(
          statusRes.data,
          balanceRes.data,
          marginRes.data,
          portfolioRes.data,
          ledgerRes.data
        );
      } catch (err) {
        console.error("Error loading analytics:", err);
      }
    };

    loadAnalytics();
  }, [userId]);

  const computeAnalytics = (status, balance, margin, portfolio, ledger) => {
    // Market compliance: count rejected orders
    const rejectedOrders = ledger.filter((t) => t.status === "REJECTED").length;
    const validOrders = ledger.length - rejectedOrders;
    setMarketCompliance({ validOrders, rejectedOrders });

    // Trading activity
    const marketOrders = ledger.filter((t) => t.orderType === "MARKET").length;
    const limitOrders = ledger.filter((t) => t.orderType === "LIMIT").length;
    const pendingLimit = ledger.filter(
      (t) => t.orderType === "LIMIT" && t.status === "PENDING"
    ).length;
    setTradingActivity({ marketOrders, limitOrders, pendingLimit });

    // Portfolio snapshot
    const stocksHeld = portfolio.length;
    const marginPower = typeof margin === "string" ? 0 : margin.allowed || 0;
    setPortfolioSnapshot({ balance, marginPower, stocksHeld });

    // Performance overview
    let totalPnL = 0;
    let bestTrade = null;
    let worstTrade = null;
    ledger.forEach((t) => {
      if (t.pnl !== undefined) {
        totalPnL += t.pnl;
        if (!bestTrade || t.pnl > bestTrade.pnl) bestTrade = t;
        if (!worstTrade || t.pnl < worstTrade.pnl) worstTrade = t;
      }
    });
    setPerformance({ totalPnL, bestTrade, worstTrade });

    // Trade insights
    const wins = ledger.filter((t) => t.pnl > 0).length;
    const losses = ledger.filter((t) => t.pnl < 0).length;
    const winRatio = ledger.length ? wins / ledger.length : 0;

    const buys = ledger.filter((t) => t.type === "BUY");
    const sells = ledger.filter((t) => t.type === "SELL");
    const avgBuy =
      buys.length > 0
        ? buys.reduce((sum, t) => sum + t.price, 0) / buys.length
        : 0;
    const avgSell =
      sells.length > 0
        ? sells.reduce((sum, t) => sum + t.price, 0) / sells.length
        : 0;

    setTradeInsights({ winRatio, avgBuy, avgSell });
  };

  return (
    <div className="analytics-page">
      <TopNav />

      <div className="analytics-content">
        {/* Top Row */}
        <div className="analytics-top">
          <div className="analytics-card small-card">
            <h3>Market Hours Compliance</h3>
            <p>Orders During Market Hours: {marketCompliance.validOrders}</p>
            <p>Orders Rejected (Closed): {marketCompliance.rejectedOrders}</p>
          </div>

          <div className="analytics-card small-card">
            <h3>Trading Activity</h3>
            <p>Market Orders: {tradingActivity.marketOrders}</p>
            <p>Limit Orders: {tradingActivity.limitOrders}</p>
            <p>Pending Limit Orders: {tradingActivity.pendingLimit}</p>
          </div>
        </div>

        {/* Middle Row */}
        <div className="analytics-card wide-card">
          <h3>Portfolio Snapshot</h3>
          <p>Balance: ₹{portfolioSnapshot.balance.toLocaleString()}</p>
          <p>Margin Power: ₹{portfolioSnapshot.marginPower.toLocaleString()}</p>
          <p>Stocks Held: {portfolioSnapshot.stocksHeld}</p>
        </div>

        {/* Bottom Row */}
        <div className="analytics-bottom">
          <div className="analytics-card">
            <h3>Performance Overview</h3>
            <p>Total P&L: ₹{performance.totalPnL}</p>
            {performance.bestTrade && (
              <p>
                Best Trade: {performance.bestTrade.stockSymbol} ₹
                {performance.bestTrade.pnl}
              </p>
            )}
            {performance.worstTrade && (
              <p>
                Worst Trade: {performance.worstTrade.stockSymbol} ₹
                {performance.worstTrade.pnl}
              </p>
            )}
          </div>

          <div className="analytics-card">
            <h3>Trade Insights</h3>
            <p>Win Ratio: {(tradeInsights.winRatio * 100).toFixed(0)}%</p>
            <p>Avg Buy Price: ₹{tradeInsights.avgBuy.toFixed(2)}</p>
            <p>Avg Sell Price: ₹{tradeInsights.avgSell.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
