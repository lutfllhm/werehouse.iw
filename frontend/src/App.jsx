import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Public Pages
import PublicLayout from './layouts/PublicLayout';
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import StokBarang from './pages/admin/StokBarang';
import Transaksi from './pages/admin/Transaksi';
import Schedule from './pages/admin/Schedule';
import Rekap from './pages/admin/Rekap';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="stok-barang" element={<StokBarang />} />
            <Route path="transaksi" element={<Transaksi />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="rekap" element={<Rekap />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
