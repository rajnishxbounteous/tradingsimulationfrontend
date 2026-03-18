// src/services/api.js
import axios from 'axios';
import { toast } from 'react-toastify';

const API = axios.create({ baseURL: 'http://localhost:8080/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const res = await axios.post('http://localhost:8080/api/auth/refresh', { refreshToken });
          localStorage.setItem('accessToken', res.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return API(originalRequest);
        } catch (refreshErr) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          toast.error('Session expired. Please log in again.');
          window.location.href = '/login';
        }
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        toast.error('Session expired. Please log in again.');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// -------------------- STOCKS --------------------
export const fetchAllStocks = () => API.get('/stocks');

// -------------------- TRADES --------------------
export const executeTrade = (tradeData) => API.post('/trades', tradeData);

// -------------------- MARKET ENDPOINTS --------------------
export const fetchMarketStatus = () => API.get('/market/status'); // returns { open: boolean, message: string }
export const fetchTopGainers = () => API.get('/market/top-gainers'); // returns List<StockDTO>
export const fetchTopLosers = () => API.get('/market/top-losers');   // returns List<StockDTO>
export const fetchMarketSummary = () => API.get('/market/summary');  // returns MarketSummaryDTO
export const fetchMarketNews = () => API.get('/market/news');        // returns List<NewsDTO>

// -------------------- PORTFOLIO ENDPOINTS --------------------
export const fetchUserBalance = (userId) => API.get(`/portfolio/${userId}/balance`); // returns double
export const fetchUserMargin = (userId) => API.get(`/portfolio/${userId}/margin`);   // returns string
export const fetchUserPortfolio = (userId) => API.get(`/portfolio/${userId}`);       // returns List<PortfolioDTO>
export const fetchUserLedger = (userId) => API.get(`/ledger/${userId}`);             // returns List<LedgerEntry>

export default API;
