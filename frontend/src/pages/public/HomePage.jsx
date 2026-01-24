import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { FaWarehouse, FaChartLine, FaUsers, FaShieldAlt } from 'react-icons/fa';

const HomePage = () => {
  const [companyInfo, setCompanyInfo] = useState(null);

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const response = await axios.get('/company');
      setCompanyInfo(response.data.data);
    } catch (error) {
      console.error('Error fetching company info:', error);
    }
  };

  return (
    <div>
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-slow-zoom"
            style={{
              backgroundImage: 'url(/img/bg.jpg)',
            }}
          />
          {/* Gradient Overlay for better visual */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/50" />
          
          {/* Animated Shapes with Glow */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float animate-glow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed animate-glow" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Animated Title with Logo */}
            <div className="flex justify-center items-center space-x-4 mb-6 animate-zoom-in">
              <img 
                src="/img/lg.png" 
                alt="iware Logo" 
                className="h-20 md:h-24 lg:h-28 w-auto animate-rotate-in delay-200" 
              />
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white animate-slide-in-right-custom delay-300">
                iware
              </h1>
            </div>
            
            {/* Animated Subtitle with Shimmer */}
            <div className="relative inline-block mb-8 animate-fade-in-up delay-400">
              <p className="text-xl md:text-2xl text-white/90 font-semibold">
                Sistem Penjadwalan SO Gudang IWARE
              </p>
              <div className="absolute inset-0 shimmer-effect pointer-events-none" />
            </div>
            
            {/* Animated Description */}
            <p className="text-lg mb-10 text-white/80 max-w-2xl mx-auto animate-slide-in-bottom delay-500">
              Kelola stok barang, transaksi, dan jadwal pengiriman dengan mudah. 
              Terintegrasi dengan Accurate Online untuk efisiensi maksimal.
            </p>
            
            {/* Animated Buttons with Hover Effects */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-bounce-in delay-600">
              <a 
                href="#about" 
                className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover-glow relative overflow-hidden group"
              >
                <span className="relative z-10">Pelajari Lebih Lanjut</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </a>
              <a 
                href="/login" 
                className="bg-transparent text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-110 hover:shadow-2xl border-2 border-white hover:bg-white hover:text-gray-900 relative overflow-hidden group"
              >
                <span className="relative z-10">Login Sekarang</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ zIndex: 0 }} />
              </a>
            </div>

            {/* Scroll Indicator with Wave Animation */}
            <div className="mt-16 animate-bounce">
              <a href="#features" className="inline-block text-white/70 hover:text-white transition-colors animate-wave">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className="text-sm mt-2 block">Scroll untuk lebih lanjut</span>
              </a>
            </div>
          </div>
        </div>

        {/* Enhanced Animated Particles */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/40 rounded-full animate-twinkle" />
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-blue-300/40 rounded-full animate-twinkle delay-200" />
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-purple-300/40 rounded-full animate-twinkle delay-400" />
          <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-pink-300/40 rounded-full animate-twinkle delay-600" />
          <div className="absolute top-1/2 left-1/5 w-2 h-2 bg-white/30 rounded-full animate-twinkle delay-300" />
          <div className="absolute top-2/3 right-1/5 w-3 h-3 bg-blue-200/30 rounded-full animate-twinkle delay-500" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 animate-slide-in-bottom">
            Keunggulan Aplikasi ini
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-12 animate-zoom-in delay-200" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover-lift animate-slide-in-bottom delay-200 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:rotate-12 transition-transform duration-300">
                <FaWarehouse className="text-white text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Manajemen Gudang</h3>
              <p className="text-gray-600">mengelola SO masuk dan keluar dengan effisien</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover-lift animate-slide-in-bottom delay-300 group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:rotate-12 transition-transform duration-300">
                <FaChartLine className="text-white text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Tepat waktu</h3>
              <p className="text-gray-600">tepat waktu ketika SO masuk ataupun keluar</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover-lift animate-slide-in-bottom delay-400 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:rotate-12 transition-transform duration-300">
                <FaUsers className="text-white text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Accurate Online</h3>
              <p className="text-gray-600">Terintegrasi dengan Accurate Online tanpa mengubah data</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover-lift animate-slide-in-bottom delay-500 group">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:rotate-12 transition-transform duration-300">
                <FaShieldAlt className="text-white text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Effisien dan flexsibel</h3>
              <p className="text-gray-600">Schedule Transaksi Teratur dan Rapi</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-purple-100/20 rounded-full blur-3xl animate-float-delayed" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 animate-fade-in-up">
              Tentang IWARE
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-12 animate-zoom-in delay-200" />
            
            {companyInfo && (
              <div className="space-y-8">
                <div className="card hover-lift animate-slide-in-left-custom delay-200 border-l-4 border-blue-500">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse" />
                    Deskripsi Perusahaan
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{companyInfo.description}</p>
                </div>

                <div className="card hover-lift animate-slide-in-right-custom delay-300 border-l-4 border-green-500">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse" />
                    Bidang Usaha
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{companyInfo.business_field}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card hover-lift animate-zoom-in delay-400 border-l-4 border-purple-500">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse" />
                      Visi
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{companyInfo.vision}</p>
                  </div>

                  <div className="card hover-lift animate-zoom-in delay-500 border-l-4 border-pink-500">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
                      <span className="w-2 h-2 bg-pink-500 rounded-full mr-3 animate-pulse" />
                      Misi
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{companyInfo.mission}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        </div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-zoom-in">
            Effesiensi Terhadap SO Gudang IWARE
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 animate-fade-in-up delay-200 font-semibold">
            #everywhereadaiware
          </p>
          <a 
            href="/login" 
            className="bg-white text-gray-900 px-10 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-110 hover:shadow-2xl inline-block animate-bounce-in delay-400 relative overflow-hidden group"
          >
            <span className="relative z-10">Mulai Sekarang</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
          
          {/* Decorative Elements */}
          <div className="mt-12 flex justify-center space-x-4 animate-fade-in-up delay-600">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" />
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-100" />
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-200" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
