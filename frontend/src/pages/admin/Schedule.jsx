import { useState, useEffect, useRef } from 'react';
import axios from '../../utils/axios';
import { FaWarehouse, FaClock, FaCheckCircle, FaExclamationCircle, FaSpinner, FaTruck, FaBoxes, FaClipboardList, FaExpand, FaCompress, FaCalendarAlt, FaUser } from 'react-icons/fa';

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
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
      'menunggu_proses': <FaClock className="text-lg" />,
      'sebagian_terproses': <FaSpinner className="text-lg animate-spin" />,
      'terproses': <FaCheckCircle className="text-lg" />
    };
    return icons[status] || <FaExclamationCircle className="text-lg" />;
  };

  const getStatusColor = (status) => {
    const colors = {
      'menunggu_proses': 'from-red-500 to-red-600',
      'sebagian_terproses': 'from-yellow-500 to-yellow-600',
      'terproses': 'from-green-500 to-green-600'
    };
    return colors[status] || 'from-gray-500 to-gray-600';
  };

  const getStatusBg = (status) => {
    const colors = {
      'menunggu_proses': 'bg-red-500/10 border-red-500/30',
      'sebagian_terproses': 'bg-yellow-500/10 border-yellow-500/30',
      'terproses': 'bg-green-500/10 border-green-500/30'
    };
    return colors[status] || 'bg-gray-500/10 border-gray-500/30';
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
    <div ref={containerRef} className={`min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 transition-all duration-300 ${isFullscreen ? 'p-2' : 'p-4'}`}>
      {/* Modern Header with Glass Effect */}
      <div className={`relative overflow-hidden rounded-3xl mb-4 transition-all duration-300 ${isFullscreen ? 'p-3' : 'p-5'}`}>
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-indigo-600/90 to-purple-600/90 backdrop-blur-xl"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 animate-pulse" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
          }}></div>
        </div>
        
        <div className="relative z-10 flex justify-between items-center">
          {/* Left: Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className={`bg-white/20 backdrop-blur-sm rounded-2xl shadow-2xl transition-all duration-300 ${isFullscreen ? 'p-2' : 'p-3'}`}>
              <FaWarehouse className={`text-white transition-all duration-300 ${isFullscreen ? 'text-2xl' : 'text-3xl'}`} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className={`font-black text-white tracking-tight transition-all duration-300 ${isFullscreen ? 'text-xl' : 'text-2xl'}`}>
                  IWARE SCHEDULE BOARD
                </h1>
                <div className="bg-red-500 text-white px-2 py-0.5 rounded-lg text-[10px] font-bold animate-pulse shadow-lg">
                  LIVE
                </div>
              </div>
              <p className={`text-blue-100 font-medium transition-all duration-300 ${isFullscreen ? 'text-[10px]' : 'text-xs'}`}>
                Real-Time Sales Order Monitoring System
              </p>
            </div>
          </div>

          {/* Center: Stats */}
          <div className={`flex items-center gap-2 transition-all duration-300`}>
            <div className="bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 border border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className={`text-white font-bold transition-all duration-300 ${isFullscreen ? 'text-sm' : 'text-base'}`}>
                  {schedules.filter(s => s.status === 'menunggu_proses').length}
                </span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 border border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className={`text-white font-bold transition-all duration-300 ${isFullscreen ? 'text-sm' : 'text-base'}`}>
                  {schedules.filter(s => s.status === 'sebagian_terproses').length}
                </span>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl px-3 py-2 border border-white/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className={`text-white font-bold transition-all duration-300 ${isFullscreen ? 'text-sm' : 'text-base'}`}>
                  {schedules.filter(s => s.status === 'terproses').length}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Clock & Fullscreen */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className={`bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl transition-all duration-300 transform hover:scale-110 border border-white/20 group ${isFullscreen ? 'p-2' : 'p-2.5'}`}
              title={isFullscreen ? "Exit Fullscreen (ESC)" : "Enter Fullscreen"}
            >
              {isFullscreen ? (
                <FaCompress className="text-lg group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <FaExpand className="text-lg group-hover:rotate-90 transition-transform duration-300" />
              )}
            </button>
            <div className={`bg-white/10 backdrop-blur-md rounded-xl border border-white/20 transition-all duration-300 ${isFullscreen ? 'px-3 py-1.5' : 'px-4 py-2'}`}>
              <div className={`font-bold text-white font-mono tabular-nums transition-all duration-300 ${isFullscreen ? 'text-2xl' : 'text-3xl'}`}>
                {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-blue-100 text-[10px] text-center">
                {currentTime.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={`flex items-center justify-between mb-4 transition-all duration-300 ${isFullscreen ? 'gap-2' : 'gap-3'}`}>
        <div className="flex items-center gap-2">
          {[
            { value: '', label: 'SEMUA', color: 'blue' },
            { value: 'menunggu_proses', label: 'MENUNGGU', color: 'red' },
            { value: 'sebagian_terproses', label: 'PROSES', color: 'yellow' },
            { value: 'terproses', label: 'SELESAI', color: 'green' }
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                statusFilter === filter.value
                  ? `bg-${filter.color}-500 text-white shadow-lg shadow-${filter.color}-500/50`
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
              } ${isFullscreen ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className={`text-slate-400 font-medium transition-all duration-300 ${isFullscreen ? 'text-[10px]' : 'text-xs'}`}>
          <span className="animate-pulse">● </span>
          Total: {schedules.length} SO
        </div>
      </div>

      {/* Modern Card Grid Layout */}
      <div className={`overflow-y-auto custom-scrollbar transition-all duration-300 ${
        isFullscreen ? 'max-h-[calc(100vh-140px)]' : 'max-h-[calc(100vh-240px)]'
      }`}>
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
            <p className="text-white text-2xl font-semibold">Tidak ada schedule</p>
            <p className="text-slate-400 mt-2">Silakan ubah filter atau tambah schedule baru</p>
          </div>
        ) : (
          <div className={`grid gap-3 transition-all duration-300 ${
            isFullscreen 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {schedules.map((schedule, index) => (
              <div
                key={schedule.id}
                onMouseEnter={() => setHoveredCard(schedule.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative group ${getStatusBg(schedule.status)} backdrop-blur-md rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl cursor-pointer ${
                  isFullscreen ? 'p-3' : 'p-4'
                }`}
                style={{
                  animation: `fadeIn 0.3s ease-in-out ${index * 0.03}s both`
                }}
              >
                {/* Status Badge */}
                <div className="absolute -top-2 -right-2 z-10">
                  <div className={`bg-gradient-to-r ${getStatusColor(schedule.status)} rounded-xl px-3 py-1.5 shadow-lg flex items-center gap-2`}>
                    {getStatusIcon(schedule.status)}
                    <span className={`text-white font-bold uppercase transition-all duration-300 ${isFullscreen ? 'text-[10px]' : 'text-xs'}`}>
                      {getStatusLabel(schedule.status)}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="space-y-3">
                  {/* SO Number */}
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                      <FaClipboardList className="text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-slate-400 transition-all duration-300 ${isFullscreen ? 'text-[9px]' : 'text-[10px]'}`}>SO NUMBER</p>
                      <p className={`text-white font-bold font-mono transition-all duration-300 ${isFullscreen ? 'text-sm' : 'text-base'}`}>
                        {schedule.transaction_number}
                      </p>
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-500/20 p-2 rounded-lg">
                      <FaUser className="text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-slate-400 transition-all duration-300 ${isFullscreen ? 'text-[9px]' : 'text-[10px]'}`}>PELANGGAN</p>
                      <p className={`text-white font-semibold truncate transition-all duration-300 ${isFullscreen ? 'text-xs' : 'text-sm'}`}>
                        {schedule.customer_name}
                      </p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <FaCalendarAlt className="text-cyan-400 text-xs" />
                        <p className={`text-slate-400 transition-all duration-300 ${isFullscreen ? 'text-[8px]' : 'text-[9px]'}`}>TRANSAKSI</p>
                      </div>
                      <p className={`text-cyan-300 font-semibold transition-all duration-300 ${isFullscreen ? 'text-[10px]' : 'text-xs'}`}>
                        {formatDate(schedule.transaction_date)}
                      </p>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <FaClock className="text-orange-400 text-xs" />
                        <p className={`text-slate-400 transition-all duration-300 ${isFullscreen ? 'text-[8px]' : 'text-[9px]'}`}>SCHEDULE</p>
                      </div>
                      <p className={`text-orange-300 font-semibold transition-all duration-300 ${isFullscreen ? 'text-[10px]' : 'text-xs'}`}>
                        {formatDate(schedule.schedule_date)}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-center justify-between bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-lg p-2">
                    <span className={`text-slate-400 font-medium transition-all duration-300 ${isFullscreen ? 'text-[9px]' : 'text-[10px]'}`}>WAKTU</span>
                    <span className={`text-green-300 font-bold font-mono transition-all duration-300 ${isFullscreen ? 'text-sm' : 'text-base'}`}>
                      {formatTime(schedule.schedule_date)}
                    </span>
                  </div>

                  {/* Notes */}
                  {schedule.notes && (
                    <div className="bg-slate-800/30 rounded-lg p-2 border border-slate-700/50">
                      <p className={`text-slate-300 transition-all duration-300 ${isFullscreen ? 'text-[9px]' : 'text-[10px]'} line-clamp-2`}>
                        📝 {schedule.notes}
                      </p>
                    </div>
                  )}
                </div>

                {/* Hover Effect Overlay */}
                {hoveredCard === schedule.id && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl pointer-events-none"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {!isFullscreen && (
        <div className="mt-4 bg-slate-800/50 backdrop-blur-md rounded-xl p-3 border border-slate-700/50">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-slate-300">Menunggu</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-slate-300">Proses</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-slate-300">Selesai</span>
              </div>
            </div>
            <span className="text-slate-400">💡 Klik fullscreen untuk tampilan TV</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
