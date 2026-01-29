import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { FaWarehouse, FaClock, FaCheckCircle, FaExclamationCircle, FaSpinner, FaTruck, FaBoxes, FaClipboardList } from 'react-icons/fa';

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
      'menunggu_proses': <FaClock className="text-xl" />,
      'sebagian_terproses': <FaSpinner className="text-xl animate-spin" />,
      'terproses': <FaCheckCircle className="text-xl" />
    };
    return icons[status] || <FaExclamationCircle className="text-xl" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      'menunggu_proses': 'from-red-500 to-red-600',
      'sebagian_terproses': 'from-yellow-500 to-yellow-600',
      'terproses': 'from-green-500 to-green-600'
    };
    return colors[status] || 'from-gray-500 to-gray-600';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* Warehouse Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl shadow-2xl p-8 mb-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
          }}></div>
        </div>
        
        <div className="relative z-10 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            {/* Logo IWARE */}
            <div className="bg-white/20 backdrop-blur-sm p-5 rounded-2xl shadow-xl">
              <FaWarehouse className="text-6xl text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-5xl font-bold text-white tracking-tight">
                  IWARE WAREHOUSE
                </h1>
                <div className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold animate-pulse">
                  LIVE
                </div>
              </div>
              <p className="text-blue-100 text-xl font-medium">
                Sistem Monitoring Sales Order Real-Time
              </p>
              <div className="flex items-center space-x-4 mt-2 text-blue-200 text-sm">
                <div className="flex items-center space-x-2">
                  <FaBoxes />
                  <span>Stock Management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaTruck />
                  <span>Delivery Tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaClipboardList />
                  <span>Order Processing</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-6xl font-bold text-white font-mono tabular-nums">
              {currentTime.toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
            <div className="text-lg text-blue-100 mt-2 font-medium">
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

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-4 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 font-medium">MENUNGGU</p>
              <p className="text-3xl font-bold mt-1">
                {schedules.filter(s => s.status === 'menunggu_proses').length}
              </p>
            </div>
            <FaClock className="text-4xl opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-4 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 font-medium">PROSES</p>
              <p className="text-3xl font-bold mt-1">
                {schedules.filter(s => s.status === 'sebagian_terproses').length}
              </p>
            </div>
            <FaSpinner className="text-4xl opacity-80 animate-spin" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 font-medium">SELESAI</p>
              <p className="text-3xl font-bold mt-1">
                {schedules.filter(s => s.status === 'terproses').length}
              </p>
            </div>
            <FaCheckCircle className="text-4xl opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 font-medium">TOTAL SO</p>
              <p className="text-3xl font-bold mt-1">{schedules.length}</p>
            </div>
            <FaClipboardList className="text-4xl opacity-80" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 mb-6 shadow-xl border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-white font-bold text-lg flex items-center space-x-2">
              <FaClipboardList className="text-blue-400" />
              <span>FILTER STATUS:</span>
            </span>
            <button
              onClick={() => setStatusFilter('')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                statusFilter === '' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              SEMUA
            </button>
            <button
              onClick={() => setStatusFilter('menunggu_proses')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                statusFilter === 'menunggu_proses' 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg scale-105' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              MENUNGGU
            </button>
            <button
              onClick={() => setStatusFilter('sebagian_terproses')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                statusFilter === 'sebagian_terproses' 
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg scale-105' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              PROSES
            </button>
            <button
              onClick={() => setStatusFilter('terproses')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                statusFilter === 'terproses' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              SELESAI
            </button>
          </div>
          <div className="text-slate-400 text-sm">
            <span className="animate-pulse">● </span>
            Auto-refresh: 30s
          </div>
        </div>
      </div>

      {/* Schedule Display Board */}
      <div className="bg-slate-800/60 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-slate-700">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 border-b-4 border-blue-500">
          <div className="grid grid-cols-12 gap-4 p-6 text-blue-300 font-bold text-base uppercase tracking-wider">
            <div className="col-span-2 flex items-center space-x-2">
              <FaClipboardList />
              <span>NO. SO</span>
            </div>
            <div className="col-span-3 flex items-center space-x-2">
              <FaTruck />
              <span>PELANGGAN</span>
            </div>
            <div className="col-span-2">TGL TRANSAKSI</div>
            <div className="col-span-2">TGL SCHEDULE</div>
            <div className="col-span-1 text-center">WAKTU</div>
            <div className="col-span-2 text-center">STATUS</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-700/50">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <FaWarehouse className="text-6xl text-blue-500 mx-auto mb-4 animate-pulse" />
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
                <p className="text-white text-xl font-semibold">Memuat data schedule...</p>
              </div>
            </div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-20">
              <FaBoxes className="text-6xl text-slate-600 mx-auto mb-4" />
              <p className="text-white text-2xl font-semibold">Tidak ada schedule yang ditemukan</p>
              <p className="text-slate-400 mt-2">Silakan ubah filter atau tambah schedule baru</p>
            </div>
          ) : (
            schedules.map((schedule, index) => (
              <div 
                key={schedule.id}
                className={`grid grid-cols-12 gap-4 p-5 items-center hover:bg-slate-700/50 transition-all duration-300 ${
                  index % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-800/50'
                }`}
                style={{
                  animation: `fadeIn 0.5s ease-in-out ${index * 0.1}s both`
                }}
              >
                {/* NO. SO */}
                <div className="col-span-2">
                  <div className="bg-blue-500/20 border-l-4 border-blue-500 rounded-lg p-3">
                    <div className="text-blue-300 text-xs font-semibold mb-1">SO NUMBER</div>
                    <div className="text-white font-bold text-xl font-mono">
                      {schedule.transaction_number}
                    </div>
                  </div>
                </div>

                {/* PELANGGAN */}
                <div className="col-span-3">
                  <div className="text-white text-lg font-bold mb-1">
                    {schedule.customer_name}
                  </div>
                  {schedule.notes && (
                    <div className="text-slate-400 text-sm line-clamp-1 bg-slate-700/50 rounded px-2 py-1">
                      📝 {schedule.notes}
                    </div>
                  )}
                </div>

                {/* TGL TRANSAKSI */}
                <div className="col-span-2">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="text-slate-400 text-xs font-semibold mb-1">TRANSAKSI</div>
                    <div className="text-cyan-300 text-base font-bold">
                      {formatDate(schedule.transaction_date)}
                    </div>
                  </div>
                </div>

                {/* TGL SCHEDULE */}
                <div className="col-span-2">
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="text-slate-400 text-xs font-semibold mb-1">SCHEDULE</div>
                    <div className="text-green-300 text-base font-bold">
                      {formatDate(schedule.schedule_date)}
                    </div>
                  </div>
                </div>

                {/* WAKTU */}
                <div className="col-span-1 text-center">
                  <div className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-3">
                    <FaClock className="text-orange-400 mx-auto mb-1" />
                    <div className="text-orange-300 text-lg font-bold font-mono">
                      {formatTime(schedule.schedule_date)}
                    </div>
                  </div>
                </div>

                {/* STATUS */}
                <div className="col-span-2">
                  <div className={`bg-gradient-to-r ${getStatusColor(schedule.status)} rounded-xl p-4 flex items-center justify-center space-x-3 shadow-lg transform hover:scale-105 transition-transform`}>
                    {getStatusIcon(schedule.status)}
                    <span className="text-white font-bold text-lg uppercase tracking-wide">
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
      <div className="mt-6 bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-slate-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
              <span className="text-white font-semibold">MENUNGGU PROSES</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50"></div>
              <span className="text-white font-semibold">SEDANG DIPROSES</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
              <span className="text-white font-semibold">SELESAI</span>
            </div>
          </div>
          <div className="text-right text-slate-400">
            <p className="text-sm font-medium">🔄 Auto-refresh setiap 30 detik</p>
            <p className="text-xs mt-1">Powered by IWARE System</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
