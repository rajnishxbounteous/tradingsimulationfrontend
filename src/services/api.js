// services/api.js
import axios from 'axios';
import { toast } from 'react-toastify';

const API = axios.create({ baseURL: 'http://localhost:8080/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      toast.error('Session expired. Please log in again.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// New helper for stock prices
export const fetchStockPrices = () => API.get('/market/stocks'); 
// backend should expose this endpoint returning latest prices

export default API;
