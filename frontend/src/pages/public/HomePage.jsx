import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaWarehouse, FaChartLine, FaUsers, FaShieldAlt } from 'react-icons/fa';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const HomePage = () => {
  const [companyInfo, setCompanyInfo] = useState(null);

  // Lazy load animations for different sections
  const heroContent = useIntersectionObserver({ threshold: 0.2 });
  const featuresSection = useIntersectionObserver({ threshold: 0.1 });
  const aboutSection = useIntersectionObserver({ threshold: 0.1 });
  const ctaSection = useIntersectionObserver({ threshold: 0.2 });

  useEffect(() => {
    fetchCompanyInfo();
  }, []);

  const fetchCompanyInfo = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.get(`${apiUrl}/company`);
      setCompanyInfo(response.data.data);
    } catch (error) {
      console.error('Error fetching company info:', error);
      // Set default company info if API fails
      setCompanyInfo({
        description: 'IWARE adalah sistem manajemen gudang modern yang membantu mengelola stok barang dan transaksi dengan efisien.',
        business_field: 'Manajemen Gudang dan Logistik',
        vision: 'Menjadi solusi terdepan dalam manajemen gudang yang terintegrasi.',
        mission: 'Memberikan kemudahan dalam pengelolaan gudang dengan teknologi modern.'
      });
    }
  };

  return (
    <div>
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay - WebP with fallback */}
        <div className="absolute inset-0 z-0">
          <picture>
            <source srcSet="/img/optimized/bg1.webp" type="image/webp" />
            <source srcSet="/img/bg1.jpeg" type="image/jpeg" />
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-slow-zoom bg-optimized"
              style={{
                backgroundImage: 'url(/img/bg1.jpeg)',
              }}
            />
          </picture>
          {/* Gradient Overlay for better visual */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/40 to-black/50" />
          
          {/* Animated Shapes with Glow */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float animate-glow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed animate-glow" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Content */}
        <div ref={heroContent.ref} className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Animated Title with Logo - Enhanced with backdrop and shadow */}
            <div className={`flex justify-center items-center space-x-6 mb-8 ${heroContent.isVisible ? 'animate-zoom-in' : 'opacity-0'}`}>
              <div className={`relative ${heroContent.isVisible ? 'animate-rotate-in delay-200' : 'opacity-0'}`}>
                <div className="absolute inset-0 bg-white/10 rounded-full blur-xl"></div>
                <img 
                  src="/img/lg.png" 
                  alt="iware Logo" 
                  className="h-24 md:h-28 lg:h-32 w-auto relative z-10 drop-shadow-2xl"
                  loading="lazy"
                  style={{ filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))' }}
                />
              </div>
              <h1 className={`text-6xl md:text-7xl lg:text-8xl font-bold text-white ${heroContent.isVisible ? 'animate-slide-in-right-custom delay-300' : 'opacity-0'}`}
                  style={{ 
                    textShadow: '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 255, 255, 0.2)',
                    letterSpacing: '0.02em'
                  }}>
                iware
              </h1>
            </div>
            
            {/* Animated Subtitle with Enhanced Background */}
            <div className={`relative inline-block mb-10 ${heroContent.isVisible ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}>
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-2xl -m-4"></div>
              <p className="text-2xl md:text-3xl text-white font-bold relative z-10 px-8 py-4"
                 style={{ 
                   textShadow: '0 2px 10px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 255, 255, 0.1)',
                   letterSpacing: '0.03em'
                 }}>
                Sistem Penjadwalan SO Gudang IWARE
              </p>
              {heroContent.isVisible && <div className="absolute inset-0 shimmer-effect pointer-events-none rounded-2xl" />}
            </div>
            
            {/* Animated Description with Better Contrast */}
            <div className={`relative inline-block mb-12 ${heroContent.isVisible ? 'animate-slide-in-bottom delay-500' : 'opacity-0'}`}>
              <div className="absolute inset-0 bg-black/20 backdrop-blur-md rounded-xl -m-3"></div>
              <p className="text-lg md:text-xl text-white font-medium max-w-2xl mx-auto relative z-10 px-6 py-3"
                 style={{ 
                   textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
                   lineHeight: '1.8'
                 }}>
                Kelola stok barang, transaksi, dan jadwal pengiriman dengan mudah. 
                Terintegrasi dengan Accurate Online untuk efisiensi maksimal.
              </p>
            </div>
            
            {/* Animated Buttons with Hover Effects */}
            <div className={`flex flex-col sm:flex-row justify-center gap-4 mb-10 relative z-20 ${heroContent.isVisible ? 'animate-bounce-in delay-600' : 'opacity-0'}`}>
              <a 
                href="#about" 
                className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-110 hover:shadow-2xl relative overflow-hidden group"
                style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)', zIndex: 50 }}
              >
                <span className="relative z-10">Pelajari Lebih Lanjut</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              <a 
                href="/login" 
                className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-110 hover:shadow-2xl border-2 border-white hover:bg-white hover:text-gray-900 relative overflow-hidden group"
                style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)', zIndex: 50 }}
              >
                <span className="relative z-10">Login Sekarang</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
        
        <div ref={featuresSection.ref} className="container mx-auto px-4 relative z-10">
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-4 ${featuresSection.isVisible ? 'animate-slide-in-bottom' : 'opacity-0'}`}>
            Keunggulan Aplikasi ini
          </h2>
          <div className={`w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-12 ${featuresSection.isVisible ? 'animate-zoom-in delay-200' : 'opacity-0'}`} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className={`text-center p-6 bg-white rounded-xl shadow-lg hover-lift group ${featuresSection.isVisible ? 'animate-slide-in-bottom delay-200' : 'opacity-0'}`}>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:rotate-12 transition-transform duration-300">
                <FaWarehouse className="text-white text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Manajemen Gudang</h3>
              <p className="text-gray-600">mengelola SO masuk dan keluar dengan effisien</p>
            </div>

            <div className={`text-center p-6 bg-white rounded-xl shadow-lg hover-lift group ${featuresSection.isVisible ? 'animate-slide-in-bottom delay-300' : 'opacity-0'}`}>
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:rotate-12 transition-transform duration-300">
                <FaChartLine className="text-white text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Tepat waktu</h3>
              <p className="text-gray-600">tepat waktu ketika SO masuk ataupun keluar</p>
            </div>

            <div className={`text-center p-6 bg-white rounded-xl shadow-lg hover-lift group ${featuresSection.isVisible ? 'animate-slide-in-bottom delay-400' : 'opacity-0'}`}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:rotate-12 transition-transform duration-300">
                <FaUsers className="text-white text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Accurate Online</h3>
              <p className="text-gray-600">Terintegrasi dengan Accurate Online tanpa mengubah data</p>
            </div>

            <div className={`text-center p-6 bg-white rounded-xl shadow-lg hover-lift group ${featuresSection.isVisible ? 'animate-slide-in-bottom delay-500' : 'opacity-0'}`}>
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
        
        <div ref={aboutSection.ref} className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl md:text-4xl font-bold text-center mb-4 ${aboutSection.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              Tentang IWARE
            </h2>
            <div className={`w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-12 ${aboutSection.isVisible ? 'animate-zoom-in delay-200' : 'opacity-0'}`} />
            
            {companyInfo && (
              <div className="space-y-8">
                <div className={`card hover-lift border-l-4 border-blue-500 ${aboutSection.isVisible ? 'animate-slide-in-left-custom delay-200' : 'opacity-0'}`}>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse" />
                    Deskripsi Perusahaan
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{companyInfo.description}</p>
                </div>

                <div className={`card hover-lift border-l-4 border-green-500 ${aboutSection.isVisible ? 'animate-slide-in-right-custom delay-300' : 'opacity-0'}`}>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse" />
                    Bidang Usaha
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{companyInfo.business_field}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className={`card hover-lift border-l-4 border-purple-500 ${aboutSection.isVisible ? 'animate-zoom-in delay-400' : 'opacity-0'}`}>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 animate-pulse" />
                      Visi
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{companyInfo.vision}</p>
                  </div>

                  <div className={`card hover-lift border-l-4 border-pink-500 ${aboutSection.isVisible ? 'animate-zoom-in delay-500' : 'opacity-0'}`}>
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
      <section className="py-16 text-white relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <picture>
            <source srcSet="/img/optimized/bg2.webp" type="image/webp" />
            <source srcSet="/img/bg2.jpeg" type="image/jpeg" />
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url(/img/bg2.jpeg)',
              }}
            />
          </picture>
          {/* Gradient Overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60" />
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20 z-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div ref={ctaSection.ref} className="container mx-auto px-4 text-center relative z-10">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-3xl -m-8 z-0"></div>
            <div className="relative z-10 px-12 py-10">
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${ctaSection.isVisible ? 'animate-zoom-in' : 'opacity-0'}`}
                  style={{ 
                    textShadow: '0 4px 20px rgba(0, 0, 0, 0.7), 0 0 40px rgba(255, 255, 255, 0.2)',
                    letterSpacing: '0.02em'
                  }}>
                Effesiensi Terhadap SO Gudang IWARE
              </h2>
              <p className={`text-2xl md:text-3xl mb-10 text-white font-bold ${ctaSection.isVisible ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}
                 style={{ 
                   textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
                   letterSpacing: '0.05em'
                 }}>
                #everywhereadaiware
              </p>
              <a 
                href="/login" 
                className={`bg-white text-gray-900 px-12 py-5 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-110 hover:shadow-2xl inline-block relative overflow-hidden group ${ctaSection.isVisible ? 'animate-bounce-in delay-400' : 'opacity-0'}`}
                style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)', zIndex: 50 }}
              >
                <span className="relative z-10">Mulai Sekarang</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            </div>
          </div>
          
          {/* Decorative Elements */}
          {ctaSection.isVisible && (
            <div className="mt-12 flex justify-center space-x-4 animate-fade-in-up delay-600">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ boxShadow: '0 0 10px rgba(96, 165, 250, 0.8)' }} />
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-100" style={{ boxShadow: '0 0 10px rgba(192, 132, 252, 0.8)' }} />
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-200" style={{ boxShadow: '0 0 10px rgba(244, 114, 182, 0.8)' }} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
