// import React, { useState, useEffect } from 'react';
// import api from '../services/api';
// import StockChart from '../components/StockChart';

// const StockAnalytics = () => {
//   const [stocks, setStocks] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [page, setPage] = useState(1);
//   const pageSize = 10;

//   useEffect(() => {
//     const fetchStocks = async () => {
//       try {
//         const res = await api.get('/stocks');
//         setStocks(res.data);
//       } catch (err) {
//         console.error('Error fetching stocks for analytics:', err);
//       }
//     };
//     fetchStocks();
//   }, []);

//   const pages = Math.max(1, Math.ceil(stocks.length / pageSize));
//   const paged = stocks.slice((page - 1) * pageSize, page * pageSize);

//   return (
//     <div className="page">
//       <h1>Stock Analytics</h1>
//       <p>Select a stock to explore historical price movement and fluctuations.</p>

//       <div className="analytics-grid">
//         <div className="analytics-list">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>Symbol</th>
//                 <th>Name</th>
//                 <th>Price</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paged.map((stock) => (
//                 <tr
//                   key={stock.symbol}
//                   onClick={() => setSelected(stock.symbol)}
//                   style={{ cursor: 'pointer' }}
//                   className={selected === stock.symbol ? 'active-row' : ''}
//                 >
//                   <td>{stock.symbol}</td>
//                   <td>{stock.displaySymbol}</td>
//                   <td>${stock.price.toFixed(2)}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div className="pagination">
//             <button className="page" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
//               ←
//             </button>
//             {Array.from({ length: pages }, (_, i) => i + 1).map((pageNumber) => (
//               <button
//                 key={pageNumber}
//                 className={`page${pageNumber === page ? ' active' : ''}`}
//                 onClick={() => setPage(pageNumber)}
//               >
//                 {pageNumber}
//               </button>
//             ))}
//             <button className="page" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}>
//               →
//             </button>
//           </div>
//         </div>

//         <div className="analytics-chart">
//           {selected ? (
//             <StockChart symbol={selected} />
//           ) : (
//             <div className="card" style={{ padding: '26px' }}>
//               <p>Select a stock on the left to view its historical chart.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StockAnalytics;
