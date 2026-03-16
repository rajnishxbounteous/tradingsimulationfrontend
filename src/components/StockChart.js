import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const StockChart = ({ symbol }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [range, setRange] = useState('1M');

  const fetchChartData = useCallback(async () => {
    if (!symbol) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch historical data for the last 30 days
      const to = Math.floor(Date.now() / 1000);

      const rangeConfig = {
        '1D': { duration: 1 * 24 * 60 * 60, resolution: '5' },
        '1W': { duration: 7 * 24 * 60 * 60, resolution: '60' },
        '1M': { duration: 30 * 24 * 60 * 60, resolution: 'D' },
      };

      const { duration, resolution } = rangeConfig[range] || rangeConfig['1M'];
      const from = to - duration;
      const res = await api.get(
        `/finnhub/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`
      );
      console.debug('Finnhub candle response:', res.data);
      const { c, t } = res.data; // c: close prices, t: timestamps
      if (!c || !t || c.length === 0) {
        throw new Error('No historical candle data returned (maybe unsupported symbol or API limit).');
      }
      const chartData = t.map((timestamp, index) => ({
        date: new Date(timestamp * 1000).toLocaleDateString(),
        price: c[index],
      }));
      setData(chartData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load chart');
    } finally {
      setLoading(false);
    }
  }, [symbol, range]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  if (loading) return <div className="chart-loading">Loading chart...</div>;
  if (error) return <div className="chart-error">Error: {error}</div>;

  return (
    <div className="stock-chart">
      <h3>{symbol} Performance (Last 30 Days)</h3>
      <div className="chart-controls">
        <label htmlFor="range-select">View:</label>
        <select
          id="range-select"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          <option value="1D">1 Day</option>
          <option value="1W">1 Week</option>
          <option value="1M">1 Month</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="date" stroke="var(--muted)" />
          <YAxis stroke="var(--muted)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
            }}
          />
          <Line type="monotone" dataKey="price" stroke="var(--purple)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;