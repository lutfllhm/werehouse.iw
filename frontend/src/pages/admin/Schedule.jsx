import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { FaCalendarAlt, FaPlus } from 'react-icons/fa';

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchSchedules();
  }, [statusFilter]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/schedules', {
        params: { status: statusFilter }
      });
      setSchedules(response.data.data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
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

  const getStatusColor = (status) => {
    const colors = {
      'menunggu_proses': 'bg-red-500',
      'sebagian_terproses': 'bg-yellow-500',
      'terproses': 'bg-green-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
      </div>

      {/* Filter */}
      <div className="card">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field max-w-xs"
        >
          <option value="">Semua Status</option>
          <option value="menunggu_proses">Menunggu Proses</option>
          <option value="sebagian_terproses">Sebagian Terproses</option>
          <option value="terproses">Terproses</option>
        </select>
      </div>

      {/* Schedule List */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(schedule.status)}`}></div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {schedule.transaction_number}
                      </h3>
                      <span className={`status-badge status-${schedule.status.split('_')[0]}`}>
                        {getStatusLabel(schedule.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                      <div>
                        <p className="text-sm text-gray-500">Pelanggan</p>
                        <p className="font-medium text-gray-900">{schedule.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tanggal Transaksi</p>
                        <p className="font-medium text-gray-900">
                          {new Date(schedule.transaction_date).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Tanggal Schedule</p>
                        <p className="font-medium text-gray-900 flex items-center">
                          <FaCalendarAlt className="mr-2 text-gray-600" />
                          {new Date(schedule.schedule_date).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>

                    {schedule.notes && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-500">Catatan</p>
                        <p className="text-gray-700">{schedule.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {schedules.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Tidak ada schedule yang ditemukan
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
