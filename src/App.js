import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Portfolio from './pages/Portfolio';
import Market from './pages/Market';
import Trading from './pages/Trading';
// import Analytics from './pages/Analytics';
// import Orders from './pages/Orders'; // create later
import Landing from './pages/Landing';
import TopNav from './components/TopNav';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      {/* Show TopNav only if logged in */}
      {token && <TopNav />}

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
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/market"
          element={
            <ProtectedRoute>
              <Market />
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
        {/* <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} /> */}
        {/* <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} /> */}

        {/* Default redirect: if logged in → Landing, else → Login */}
        <Route
          path="/"
          element={token ? <Navigate to="/landing" /> : <Navigate to="/login" />}
        />
      </Routes>

      <ToastContainer />
    </Router>
  );
}

export default App;
