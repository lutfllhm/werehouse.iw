import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { FaSync, FaSearch, FaCheck } from 'react-icons/fa';

const Transaksi = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  useEffect(() => {
    fetchTransactions();
  }, [pagination.page, statusFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/transactions', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search,
          status: statusFilter
        }
      });
      setTransactions(response.data.data);
      setPagination(prev => ({ ...prev, ...response.data.pagination }));
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      await axios.post('/transactions/sync');
      alert('Sinkronisasi berhasil!');
      fetchTransactions();
    } catch (error) {
      console.error('Error syncing transactions:', error);
      alert('Sinkronisasi gagal!');
    } finally {
      setSyncing(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`/transactions/${id}/status`, {
        status: newStatus
      });
      fetchTransactions();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Gagal mengupdate status!');
    }
  };

  const handleVerify = async (id) => {
    try {
      await axios.put(`/transactions/${id}/verify`);
      alert('Transaksi berhasil diverifikasi!');
      fetchTransactions();
    } catch (error) {
      console.error('Error verifying transaction:', error);
      alert('Gagal verifikasi transaksi!');
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'menunggu_proses': 'Menunggu Proses',
      'sebagian_terproses': 'Sebagian Terproses',
      'terproses': 'Terproses'
    };
    return labels[status] || status;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Transaksi</h1>
        <button 
          onClick={handleSync} 
          disabled={syncing}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50"
        >
          <FaSync className={syncing ? 'animate-spin' : ''} />
          <span>{syncing ? 'Syncing...' : 'Sync dari Accurate'}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchTransactions()}
              placeholder="Cari transaksi..."
              className="input-field pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="">Semua Status</option>
            <option value="menunggu_proses">Menunggu Proses</option>
            <option value="sebagian_terproses">Sebagian Terproses</option>
            <option value="terproses">Terproses</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nomor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pelanggan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.transaction_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(transaction.transaction_date).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.customer_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {transaction.description || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Rp {parseFloat(transaction.total_amount || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={transaction.status}
                          onChange={(e) => handleStatusChange(transaction.id, e.target.value)}
                          className={`status-badge status-${transaction.status.split('_')[0]} cursor-pointer`}
                        >
                          <option value="menunggu_proses">Menunggu Proses</option>
                          <option value="sebagian_terproses">Sebagian Terproses</option>
                          <option value="terproses">Terproses</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {!transaction.verified && (
                          <button
                            onClick={() => handleVerify(transaction.id)}
                            className="text-green-600 hover:text-green-800 flex items-center space-x-1"
                          >
                            <FaCheck />
                            <span>Verifikasi</span>
                          </button>
                        )}
                        {transaction.verified && (
                          <span className="text-green-600 font-medium">✓ Terverifikasi</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Menampilkan {transactions.length} dari {pagination.total} transaksi
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="btn-secondary disabled:opacity-50"
                >
                  Sebelumnya
                </button>
                <span className="px-4 py-2 text-sm">
                  Halaman {pagination.page} dari {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="btn-secondary disabled:opacity-50"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Transaksi;
