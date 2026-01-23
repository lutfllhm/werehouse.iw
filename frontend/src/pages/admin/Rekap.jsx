import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { FaFileExcel, FaFilter } from 'react-icons/fa';

const Rekap = () => {
  const [rekapData, setRekapData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchRekapData();
  }, [month, year]);

  const fetchRekapData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/rekap', {
        params: { month, year }
      });
      setRekapData(response.data.data);
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error fetching rekap data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('/rekap/export', {
        params: { month, year },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rekap-transaksi-${year}-${month}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Gagal export data!');
    }
  };

  const months = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' }
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Rekap Transaksi</h1>
        <button 
          onClick={handleExport}
          className="btn-primary flex items-center space-x-2"
        >
          <FaFileExcel />
          <span>Export Excel</span>
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <FaFilter className="text-gray-400" />
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="input-field"
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="input-field"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-gradient-to-br from-gray-600 to-gray-700 text-white">
            <p className="text-gray-100 text-sm">Total Transaksi Terverifikasi</p>
            <p className="text-4xl font-bold mt-2">{summary.totalTransactions}</p>
          </div>
          <div className="card bg-gradient-to-br from-green-600 to-green-700 text-white">
            <p className="text-green-100 text-sm">Total Nilai Transaksi</p>
            <p className="text-4xl font-bold mt-2">
              Rp {summary.totalAmount.toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      )}

      {/* Rekap Table */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Transaksi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pelanggan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keterangan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diverifikasi Oleh</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rekapData.map((transaction) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      Rp {parseFloat(transaction.total_amount || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.verified_by_name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {rekapData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Tidak ada data rekap untuk periode yang dipilih
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rekap;
