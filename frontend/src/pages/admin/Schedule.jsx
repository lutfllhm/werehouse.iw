import { useState, useEffect, useRef } from 'react';
import axios from '../../utils/axios';
import { FaWarehouse, FaClock, FaCheckCircle, FaExclamationCircle, FaSpinner, FaTruck, FaBoxes, FaClipboardList, FaExpand, FaCompress } from 'react-icons/fa';

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

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

    // Listen for fullscreen changes
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      clearInterval(timer);
      clearInterval(refreshInterval);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Compact Warehouse Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl shadow-2xl p-4 mb-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
          }}></div>
        </div>
        
        <div className="relative z-10 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Logo IWARE */}
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-xl">
              <FaWarehouse className="text-4xl text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  IWARE WAREHOUSE
                </h1>
                <div className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold animate-pulse">
                  LIVE
                </div>
              </div>
              <p className="text-blue-100 text-sm font-medium">
                Sistem Monitoring Sales Order Real-Time
              </p>
            </div>
          </div>
          
          {/* Stats Summary Inline */}
          <div className="flex items-center space-x-3">
            <div className="bg-red-500/90 backdrop-blur-sm rounded-xl px-4 py-2 text-white">
              <div className="flex items-center space-x-2">
                <FaClock className="text-xl" />
                <div>
                  <p className="text-xs opacity-90">MENUNGGU</p>
                  <p className="text-2xl font-bold">{schedules.filter(s => s.status === 'menunggu_proses').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-500/90 backdrop-blur-sm rounded-xl px-4 py-2 text-white">
              <div className="flex items-center space-x-2">
                <FaSpinner className="text-xl animate-spin" />
                <div>
                  <p className="text-xs opacity-90">PROSES</p>
                  <p className="text-2xl font-bold">{schedules.filter(s => s.status === 'sebagian_terproses').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-500/90 backdrop-blur-sm rounded-xl px-4 py-2 text-white">
              <div className="flex items-center space-x-2">
                <FaCheckCircle className="text-xl" />
                <div>
                  <p className="text-xs opacity-90">SELESAI</p>
                  <p className="text-2xl font-bold">{schedules.filter(s => s.status === 'terproses').length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-110 border border-white/20 group"
              title={isFullscreen ? "Exit Fullscreen (ESC)" : "Enter Fullscreen (F11)"}
            >
              {isFullscreen ? (
                <FaCompress className="text-2xl group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <FaExpand className="text-2xl group-hover:rotate-90 transition-transform duration-300" />
              )}
            </button>
            {/* Clock */}
            <div className="text-right bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
              <div className="text-4xl font-bold text-white font-mono tabular-nums">
                {currentTime.toLocaleTimeString('id-ID', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </div>
              <div className="text-xs text-blue-100 font-medium">
                {currentTime.toLocaleDateString('id-ID', { 
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Filter Bar */}
      <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-3 mb-4 shadow-xl border border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-white font-bold text-sm flex items-center space-x-2">
              <FaClipboardList className="text-blue-400" />
              <span>FILTER:</span>
            </span>
            <button
              onClick={() => setStatusFilter('')}
              className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-all duration-300 ${
                statusFilter === '' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              SEMUA
            </button>
            <button
              onClick={() => setStatusFilter('menunggu_proses')}
              className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-all duration-300 ${
                statusFilter === 'menunggu_proses' 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg scale-105' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              MENUNGGU
            </button>
            <button
              onClick={() => setStatusFilter('sebagian_terproses')}
              className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-all duration-300 ${
                statusFilter === 'sebagian_terproses' 
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg scale-105' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              PROSES
            </button>
            <button
              onClick={() => setStatusFilter('terproses')}
              className={`px-4 py-1.5 rounded-lg font-bold text-sm transition-all duration-300 ${
                statusFilter === 'terproses' 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-105' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              SELESAI
            </button>
          </div>
          <div className="flex items-center space-x-4 text-slate-400 text-xs">
            <span className="animate-pulse">● Auto-refresh: 30s</span>
            <span>Total: {schedules.length} SO</span>
          </div>
        </div>
      </div>

      {/* Compact Schedule Display Board */}
      <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        {/* Compact Table Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 border-b-2 border-blue-500">
          <div className="grid grid-cols-12 gap-3 px-4 py-3 text-blue-300 font-bold text-sm uppercase tracking-wider">
            <div className="col-span-2 flex items-center space-x-1">
              <FaClipboardList className="text-xs" />
              <span>NO. SO</span>
            </div>
            <div className="col-span-3 flex items-center space-x-1">
              <FaTruck className="text-xs" />
              <span>PELANGGAN</span>
            </div>
            <div className="col-span-2">TGL TRANSAKSI</div>
            <div className="col-span-2">TGL SCHEDULE</div>
            <div className="col-span-1 text-center">WAKTU</div>
            <div className="col-span-2 text-center">STATUS</div>
          </div>
        </div>

        {/* Compact Table Body with Scrolling */}
        <div className="divide-y divide-slate-700/50 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <FaWarehouse className="text-5xl text-blue-500 mx-auto mb-3 animate-pulse" />
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mx-auto mb-3"></div>
                <p className="text-white text-lg font-semibold">Memuat data schedule...</p>
              </div>
            </div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-16">
              <FaBoxes className="text-5xl text-slate-600 mx-auto mb-3" />
              <p className="text-white text-xl font-semibold">Tidak ada schedule yang ditemukan</p>
              <p className="text-slate-400 mt-2 text-sm">Silakan ubah filter atau tambah schedule baru</p>
            </div>
          ) : (
            schedules.map((schedule, index) => (
              <div 
                key={schedule.id}
                className={`grid grid-cols-12 gap-3 px-4 py-3 items-center hover:bg-slate-700/50 transition-all duration-200 ${
                  index % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-800/50'
                }`}
                style={{
                  animation: `fadeIn 0.3s ease-in-out ${index * 0.05}s both`
                }}
              >
                {/* NO. SO - Compact */}
                <div className="col-span-2">
                  <div className="bg-blue-500/20 border-l-2 border-blue-500 rounded px-2 py-1.5">
                    <div className="text-blue-300 text-[10px] font-semibold">SO</div>
                    <div className="text-white font-bold text-sm font-mono">
                      {schedule.transaction_number}
                    </div>
                  </div>
                </div>

                {/* PELANGGAN - Compact */}
                <div className="col-span-3">
                  <div className="text-white text-sm font-bold truncate">
                    {schedule.customer_name}
                  </div>
                  {schedule.notes && (
                    <div className="text-slate-400 text-[10px] truncate">
                      📝 {schedule.notes}
                    </div>
                  )}
                </div>

                {/* TGL TRANSAKSI - Compact */}
                <div className="col-span-2">
                  <div className="text-cyan-300 text-sm font-semibold">
                    {formatDate(schedule.transaction_date)}
                  </div>
                </div>

                {/* TGL SCHEDULE - Compact */}
                <div className="col-span-2">
                  <div className="text-green-300 text-sm font-semibold">
                    {formatDate(schedule.schedule_date)}
                  </div>
                </div>

                {/* WAKTU - Compact */}
                <div className="col-span-1 text-center">
                  <div className="text-orange-300 text-sm font-bold font-mono">
                    {formatTime(schedule.schedule_date)}
                  </div>
                </div>

                {/* STATUS - Compact */}
                <div className="col-span-2">
                  <div className={`bg-gradient-to-r ${getStatusColor(schedule.status)} rounded-lg px-3 py-2 flex items-center justify-center space-x-2 shadow-md`}>
                    {getStatusIcon(schedule.status)}
                    <span className="text-white font-bold text-xs uppercase tracking-wide">
                      {getStatusLabel(schedule.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Compact Footer Info */}
      <div className="mt-4 bg-slate-800/80 backdrop-blur-md rounded-xl p-3 shadow-xl border border-slate-700">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
              <span className="text-white font-semibold text-xs">MENUNGGU PROSES</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50"></div>
              <span className="text-white font-semibold text-xs">SEDANG DIPROSES</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
              <span className="text-white font-semibold text-xs">SELESAI</span>
            </div>
          </div>
          <div className="text-right text-slate-400 text-xs">
            <p>
              {isFullscreen ? (
                <span className="text-yellow-400 animate-pulse">📺 Mode Fullscreen - Tekan ESC</span>
              ) : (
                <span>💡 Klik fullscreen untuk tampilan TV</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
