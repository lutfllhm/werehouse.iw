import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { FaBoxes, FaExchangeAlt, FaExclamationTriangle, FaSync } from 'react-icons/fa';
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button onClick={fetchDashboardStats} className="btn-primary flex items-center space-x-2">
          <FaSync />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-gray-600 to-gray-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-100 text-sm">Total Produk</p>
              <p className="text-3xl font-bold mt-2">{stats?.stats?.totalProducts || 0}</p>
            </div>
            <FaBoxes className="text-5xl text-gray-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-600 to-green-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Transaksi</p>
              <p className="text-3xl font-bold mt-2">{stats?.stats?.totalTransactions || 0}</p>
            </div>
            <FaExchangeAlt className="text-5xl text-green-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-red-600 to-red-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Stok Rendah</p>
              <p className="text-3xl font-bold mt-2">{stats?.stats?.lowStockProducts || 0}</p>
            </div>
            <FaExclamationTriangle className="text-5xl text-red-200" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-600 to-purple-700 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Status Breakdown</p>
              <p className="text-xl font-bold mt-2">
                {stats?.stats?.statusBreakdown?.length || 0} Status
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily/Weekly Transactions Chart */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              Transaksi {transactionView === 'daily' ? 'Harian (7 Hari)' : 'Mingguan (8 Minggu)'}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setTransactionView('daily')}
                className={`px-3 py-1 text-sm rounded ${
                  transactionView === 'daily'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Harian
              </button>
              <button
                onClick={() => setTransactionView('weekly')}
                className={`px-3 py-1 text-sm rounded ${
                  transactionView === 'weekly'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Mingguan
              </button>
            </div>
          </div>
          {transactionView === 'daily' ? (
            stats?.charts?.dailyTransactions && stats.charts.dailyTransactions.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.charts.dailyTransactions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#4b5563" strokeWidth={2} name="Jumlah Transaksi" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                Tidak ada data transaksi harian
              </div>
            )
          ) : (
            stats?.charts?.weeklyTransactions && stats.charts.weeklyTransactions.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.charts.weeklyTransactions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="week" 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        const data = payload[0].payload;
                        return `${label} (${data.start_date} - ${data.end_date})`;
                      }
                      return label;
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#4b5563" strokeWidth={2} name="Jumlah Transaksi" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                Tidak ada data transaksi mingguan
              </div>
            )
          )}
        </div>

        {/* Monthly Revenue Chart */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Pendapatan Bulanan</h3>
          {stats?.charts?.monthlyRevenue && stats.charts.monthlyRevenue.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.charts.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => `Rp ${parseFloat(value).toLocaleString('id-ID')}`}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#22c55e" name="Pendapatan (Rp)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              Tidak ada data pendapatan
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Chart */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Distribusi Status Transaksi</h3>
          {stats?.stats?.statusBreakdown && stats.stats.statusBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.stats.statusBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${getStatusLabel(entry.status)}: ${entry.count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.stats.statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              Tidak ada data status
            </div>
          )}
        </div>

        {/* Top Products Chart */}
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Produk Terlaris (3 Bulan Terakhir)</h3>
          {stats?.charts?.topProducts && stats.charts.topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.charts.topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="product_name" type="category" width={120} />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'Total Terjual') return `${value} unit`;
                    return `Rp ${parseFloat(value).toLocaleString('id-ID')}`;
                  }}
                />
                <Legend />
                <Bar dataKey="total_sold" fill="#4b5563" name="Total Terjual" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              Tidak ada data produk terlaris
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Transaksi Terbaru</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Transaksi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pelanggan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats?.recentTransactions?.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.transaction_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(transaction.transaction_date).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.customer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rp {parseFloat(transaction.total_amount || 0).toLocaleString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`status-badge status-${transaction.status.split('_')[0]}`}>
                      {getStatusLabel(transaction.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
