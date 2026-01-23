import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaWarehouse, FaChartLine, FaBoxes, FaExchangeAlt, 
  FaCalendarAlt, FaFileAlt, FaSignOutAlt, FaBars, FaTimes, FaUser 
} from 'react-icons/fa';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: FaChartLine, label: 'Dashboard' },
    { path: '/admin/stok-barang', icon: FaBoxes, label: 'Stok Barang' },
    { path: '/admin/transaksi', icon: FaExchangeAlt, label: 'Transaksi' },
    { path: '/admin/schedule', icon: FaCalendarAlt, label: 'Schedule' },
    { path: '/admin/rekap', icon: FaFileAlt, label: 'Rekap' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-gray-900 shadow-lg w-64`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <Link to="/admin/dashboard" className="flex items-center space-x-2">
              <img src="/img/lg.png" alt="iware Logo" className="h-10 w-auto" />
              <span className="text-xl font-bold text-white">iware</span>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-800 bg-gray-800/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
                <FaUser />
              </div>
              <div>
                <p className="font-semibold text-white">{user?.full_name}</p>
                <p className="text-sm text-gray-400">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-gray-600 text-white' 
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white w-full transition-colors"
            >
              <FaSignOutAlt size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Top Bar */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <FaBars size={24} />
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
