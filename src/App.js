import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Trading from './pages/Trading';
import Landing from './pages/Landing';
import MarketPage from './pages/MarketPage';
import Trades from './pages/Trades';
import Portfolio from './pages/Portfolio';
import AnalyticsPage from './pages/Analytics';   // ✅ import your real Analytics page
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder for notifications until implemented
const NotificationsPage = () => <h2>Notifications Page</h2>;

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/landing"
          element={
            <ProtectedRoute>
              <Landing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trading"
          element={
            <ProtectedRoute>
              <Trading />
            </ProtectedRoute>
          }
        />

        {/* TopNav routes */}
        <Route
          path="/market"
          element={
            <ProtectedRoute>
              <MarketPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trades"
          element={
            <ProtectedRoute>
              <Trades />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />   {/* ✅ real Analytics page */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={token ? <Navigate to="/market" /> : <Navigate to="/login" />}
        />
      </Routes>

      <ToastContainer />
    </Router>
  );
}

export default App;
