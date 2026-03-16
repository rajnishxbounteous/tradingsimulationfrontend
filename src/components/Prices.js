import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StockChart from './StockChart';

const Prices = () => {
  const [prices, setPrices] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedStock, setSelectedStock] = useState(null);
  const pageSize = 10;

  const pages = Math.max(1, Math.ceil(prices.length / pageSize));
  const pagedPrices = prices.slice((page - 1) * pageSize, page * pageSize);

  const goToPage = (newPage) => {
    setPage(Math.min(pages, Math.max(1, newPage)));
  };

  const handleStockClick = (symbol) => {
    setSelectedStock(symbol === selectedStock ? null : symbol);
  };

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await api.get('/prices');
        setPrices(res.data);
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };
    fetchPrices();
  }, []);

  return (
    <div className="card">
      <h2>Stock Prices</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {pagedPrices.map((stock, index) => (
            <tr
              key={index}
              onClick={() => handleStockClick(stock.symbol)}
              style={{ cursor: 'pointer' }}
            >
              <td>{stock.symbol}</td>
              <td>{stock.displaySymbol}</td>
              <td>${stock.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button className="page" onClick={() => goToPage(page - 1)} disabled={page === 1}>
          ←
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            className={`page${pageNumber === page ? ' active' : ''}`}
            onClick={() => goToPage(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
        <button className="page" onClick={() => goToPage(page + 1)} disabled={page === pages}>
          →
        </button>
      </div>

      {selectedStock && <StockChart symbol={selectedStock} />}
    </div>
  );
};

export default Prices;