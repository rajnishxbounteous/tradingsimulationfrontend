import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Trading from './pages/Trading';
import PortfolioPage from './pages/Portfolio';
import Market from './pages/Market';
import StockAnalytics from './pages/StockAnalytics';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                      <Route path="/" element={<PortfolioPage />} />
                      <Route path="/portfolio" element={<PortfolioPage />} />
                      <Route path="/market" element={<Market />} />
                      <Route path="/analytics" element={<StockAnalytics />} />
                      <Route path="/trading" element={<Trading />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
