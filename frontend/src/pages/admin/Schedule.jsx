import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { FaPlane, FaClock, FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchSchedules();
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Auto refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchSchedules();
    }, 30000);

    return () => {
      clearInterval(timer);
      clearInterval(refreshInterval);
    };
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
      'menunggu_proses': 'MENUNGGU',
      'sebagian_terproses': 'PROSES',
      'terproses': 'SELESAI'
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      'menunggu_proses': <FaClock className="text-2xl" />,
      'sebagian_terproses': <FaSpinner className="text-2xl animate-spin" />,
      'terproses': <FaCheckCircle className="text-2xl" />
    };
    return icons[status] || <FaExclamationCircle className="text-2xl" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      'menunggu_proses': 'bg-red-500',
      'sebagian_terproses': 'bg-yellow-500',
      'terproses': 'bg-green-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', { 
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4">
      {/* Airport-Style Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-2xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
              <FaPlane className="text-5xl text-white transform rotate-45" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white tracking-wide">
                JADWAL SO GUDANG IWARE
              </h1>
              <p className="text-blue-100 text-lg mt-1">
                Sistem Penjadwalan Sales Order - Real Time Display
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-6xl font-bold text-white font-mono">
              {currentTime.toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
            <div className="text-xl text-blue-100 mt-1">
              {currentTime.toLocaleDateString('id-ID', { 
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6 flex items-center space-x-4">
        <span className="text-white font-semibold text-lg">FILTER STATUS:</span>
        <button
          onClick={() => setStatusFilter('')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
            statusFilter === '' 
              ? 'bg-white text-blue-900 shadow-lg' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          SEMUA
        </button>
        <button
          onClick={() => setStatusFilter('menunggu_proses')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
            statusFilter === 'menunggu_proses' 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          MENUNGGU
        </button>
        <button
          onClick={() => setStatusFilter('sebagian_terproses')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
            statusFilter === 'sebagian_terproses' 
              ? 'bg-yellow-500 text-white shadow-lg' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          PROSES
        </button>
        <button
          onClick={() => setStatusFilter('terproses')}
          className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
            statusFilter === 'terproses' 
              ? 'bg-green-500 text-white shadow-lg' 
              : 'bg-white/20 text-white hover:bg-white/30'
          }`}
        >
          SELESAI
        </button>
      </div>

      {/* Airport-Style Schedule Board */}
      <div className="bg-black/40 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b-4 border-yellow-500">
          <div className="grid grid-cols-12 gap-4 p-6 text-yellow-400 font-bold text-lg uppercase tracking-wider">
            <div className="col-span-2">NO. SO</div>
            <div className="col-span-3">PELANGGAN</div>
            <div className="col-span-2">TGL TRANSAKSI</div>
            <div className="col-span-2">TGL SCHEDULE</div>
            <div className="col-span-1 text-center">WAKTU</div>
            <div className="col-span-2 text-center">STATUS</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-700/50">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500 mx-auto mb-4"></div>
                <p className="text-white text-xl font-semibold">Memuat data schedule...</p>
              </div>
            </div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-20">
              <FaExclamationCircle className="text-6xl text-gray-500 mx-auto mb-4" />
              <p className="text-white text-2xl font-semibold">Tidak ada schedule yang ditemukan</p>
              <p className="text-gray-400 mt-2">Silakan ubah filter atau tambah schedule baru</p>
            </div>
          ) : (
            schedules.map((schedule, index) => (
              <div 
                key={schedule.id}
                className={`grid grid-cols-12 gap-4 p-6 items-center hover:bg-white/5 transition-all duration-300 ${
                  index % 2 === 0 ? 'bg-white/5' : ''
                }`}
                style={{
                  animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s both`
                }}
              >
                {/* NO. SO */}
                <div className="col-span-2">
                  <div className="text-white font-bold text-2xl font-mono">
                    {schedule.transaction_number}
                  </div>
                </div>

                {/* PELANGGAN */}
                <div className="col-span-3">
                  <div className="text-white text-xl font-semibold">
                    {schedule.customer_name}
                  </div>
                  {schedule.notes && (
                    <div className="text-gray-400 text-sm mt-1 line-clamp-1">
                      {schedule.notes}
                    </div>
                  )}
                </div>

                {/* TGL TRANSAKSI */}
                <div className="col-span-2">
                  <div className="text-blue-300 text-lg font-semibold">
                    {formatDate(schedule.transaction_date)}
                  </div>
                </div>

                {/* TGL SCHEDULE */}
                <div className="col-span-2">
                  <div className="text-green-300 text-lg font-semibold">
                    {formatDate(schedule.schedule_date)}
                  </div>
                </div>

                {/* WAKTU */}
                <div className="col-span-1 text-center">
                  <div className="text-yellow-300 text-xl font-bold font-mono">
                    {formatTime(schedule.schedule_date)}
                  </div>
                </div>

                {/* STATUS */}
                <div className="col-span-2">
                  <div className={`${getStatusColor(schedule.status)} rounded-xl p-4 flex items-center justify-center space-x-3 shadow-lg`}>
                    {getStatusIcon(schedule.status)}
                    <span className="text-white font-bold text-xl uppercase tracking-wide">
                      {getStatusLabel(schedule.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-4">
        <div className="flex justify-between items-center text-white">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">MENUNGGU PROSES</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">SEDANG DIPROSES</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="font-semibold">SELESAI</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-75">Auto-refresh setiap 30 detik</p>
            <p className="text-xs opacity-50">Total Schedule: {schedules.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
