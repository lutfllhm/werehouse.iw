import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { FaBoxes, FaExchangeAlt, FaExclamationTriangle, FaSync, FaChartLine, FaTrophy } from 'react-icons/fa';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactionView, setTransactionView] = useState('daily'); // 'daily' or 'weekly'

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get('/dashboard/stats');
      console.log('Dashboard data:', response.data);
      console.log('Charts data:', response.data?.charts);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#ef4444', '#eab308', '#22c55e'];
  const PRODUCT_COLORS = ['#4b5563', '#6b7280', '#9ca3af', '#d1d5db', '#e5e7eb'];

  const getStatusLabel = (status) => {
    const labels = {
      'menunggu_proses': 'Menunggu Proses',
      'sebagian_terproses': 'Sebagian Terproses',
      'terproses': 'Terproses'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard Analytics
          </h1>
          <p className="text-gray-500 mt-1">Selamat datang kembali! Berikut ringkasan data Anda</p>
        </div>
        <button 
          onClick={fetchDashboardStats} 
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <FaSync className="animate-spin-slow" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Stats Cards - Modern Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Produk Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <FaBoxes className="text-3xl" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium opacity-90">Total Produk</p>
                <p className="text-4xl font-bold mt-1">{stats?.stats?.totalProducts || 0}</p>
              </div>
            </div>
            <div className="flex items-center text-sm opacity-90">
              <FaChartLine className="mr-2" />
              <span>Produk aktif dalam sistem</span>
            </div>
          </div>
        </div>

        {/* Total Transaksi Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <FaExchangeAlt className="text-3xl" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium opacity-90">Total Transaksi</p>
                <p className="text-4xl font-bold mt-1">{stats?.stats?.totalTransactions || 0}</p>
              </div>
            </div>
            <div className="flex items-center text-sm opacity-90">
              <FaChartLine className="mr-2" />
              <span>Transaksi berhasil</span>
            </div>
          </div>
        </div>

        {/* Stok Rendah Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <FaExclamationTriangle className="text-3xl" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium opacity-90">Stok Rendah</p>
                <p className="text-4xl font-bold mt-1">{stats?.stats?.lowStockProducts || 0}</p>
              </div>
            </div>
            <div className="flex items-center text-sm opacity-90">
              <FaExclamationTriangle className="mr-2" />
              <span>Perlu restock segera</span>
            </div>
          </div>
        </div>

        {/* Status Breakdown Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <FaTrophy className="text-3xl" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium opacity-90">Status Aktif</p>
                <p className="text-4xl font-bold mt-1">{stats?.stats?.statusBreakdown?.length || 0}</p>
              </div>
            </div>
            <div className="flex items-center text-sm opacity-90">
              <FaChartLine className="mr-2" />
              <span>Kategori status</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 - Modern Glass Effect */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily/Weekly Transactions Chart */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              📊 Transaksi {transactionView === 'daily' ? 'Harian' : 'Mingguan'}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setTransactionView('daily')}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  transactionView === 'daily'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                7 Hari
              </button>
              <button
                onClick={() => setTransactionView('weekly')}
                className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                  transactionView === 'weekly'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                8 Minggu
              </button>
            </div>
          </div>
          {transactionView === 'daily' ? (
            stats?.charts?.dailyTransactions && stats.charts.dailyTransactions.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={stats.charts.dailyTransactions}>
                  <defs>
                    <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="label" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    name="Jumlah Transaksi"
                    dot={{ fill: '#3b82f6', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[320px] text-gray-400">
                <div className="text-center">
                  <p className="text-lg font-medium">Tidak ada data transaksi harian</p>
                  <p className="text-sm mt-2">Data akan muncul setelah ada transaksi</p>
                </div>
              </div>
            )
          ) : (
            stats?.charts?.weeklyTransactions && stats.charts.weeklyTransactions.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={stats.charts.weeklyTransactions}>
                  <defs>
                    <linearGradient id="colorWeekly" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="week" 
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        const data = payload[0].payload;
                        return `${label} (${data.start_date} - ${data.end_date})`;
                      }
                      return label;
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    name="Jumlah Transaksi"
                    dot={{ fill: '#3b82f6', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[320px] text-gray-400">
                <div className="text-center">
                  <p className="text-lg font-medium">Tidak ada data transaksi mingguan</p>
                  <p className="text-sm mt-2">Data akan muncul setelah ada transaksi</p>
                </div>
              </div>
            )
          )}
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">💰 Pendapatan Bulanan</h3>
          {stats?.charts?.monthlyRevenue && stats.charts.monthlyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={stats.charts.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => `Rp ${parseFloat(value).toLocaleString('id-ID')}`}
                />
                <Legend />
                <Bar 
                  dataKey="revenue" 
                  fill="url(#colorRevenue)" 
                  name="Pendapatan (Rp)" 
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[320px] text-gray-400">
              <div className="text-center">
                <p className="text-lg font-medium">Tidak ada data pendapatan</p>
                <p className="text-sm mt-2">Data akan muncul setelah ada transaksi</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 - Modern Glass Effect */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Chart */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">📈 Distribusi Status Transaksi</h3>
          {stats?.stats?.statusBreakdown && stats.stats.statusBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={stats.stats.statusBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${getStatusLabel(entry.status)}: ${entry.count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.stats.statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[320px] text-gray-400">
              <div className="text-center">
                <p className="text-lg font-medium">Tidak ada data status</p>
                <p className="text-sm mt-2">Data akan muncul setelah ada transaksi</p>
              </div>
            </div>
          )}
        </div>

        {/* Top Products Chart */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">🏆 Produk Terlaris (3 Bulan)</h3>
          {stats?.charts?.topProducts && stats.charts.topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={stats.charts.topProducts} layout="vertical">
                <defs>
                  <linearGradient id="colorProduct" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="product_name" type="category" width={120} stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => {
                    if (name === 'Total Terjual') return `${value} unit`;
                    return `Rp ${parseFloat(value).toLocaleString('id-ID')}`;
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="total_sold" 
                  fill="url(#colorProduct)" 
                  name="Total Terjual" 
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[320px] text-gray-400">
              <div className="text-center">
                <p className="text-lg font-medium">Tidak ada data produk terlaris</p>
                <p className="text-sm mt-2">Data akan muncul setelah ada transaksi</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions - Modern Table */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">🕒 Transaksi Terbaru</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">No. Transaksi</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Pelanggan</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats?.recentTransactions?.map((transaction, index) => (
                <tr key={transaction.id} className="hover:bg-blue-50/50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-blue-600">{transaction.transaction_number}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(transaction.transaction_date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    Rp {parseFloat(transaction.total_amount || 0).toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      transaction.status === 'terproses' 
                        ? 'bg-green-100 text-green-800' 
                        : transaction.status === 'sebagian_terproses'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {getStatusLabel(transaction.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!stats?.recentTransactions || stats.recentTransactions.length === 0) && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-lg font-medium">Belum ada transaksi terbaru</p>
              <p className="text-sm mt-2">Transaksi akan muncul di sini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
