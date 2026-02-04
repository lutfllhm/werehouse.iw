import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaWarehouse, FaChartLine, FaUsers, FaShieldAlt, FaCheckCircle, FaClock, FaSync, FaRocket } from 'react-icons/fa';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const HomePage = () => {
  const [companyInfo, setCompanyInfo] = useState(null);

  // Lazy load animations for different sections
  const heroContent = useIntersectionObserver({ threshold: 0.2 });
  const featuresSection = useIntersectionObserver({ threshold: 0.1 });
  const aboutSection = useIntersectionObserver({ threshold: 0.1 });
  const statsSection = useIntersectionObserver({ threshold: 0.1 });
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
    <div className="bg-white">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <picture>
            <source srcSet="/img/optimized/bg1.webp" type="image/webp" />
            <source srcSet="/img/bg1.jpeg" type="image/jpeg" />
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-slow-zoom"
              style={{
                backgroundImage: 'url(/img/bg1.jpeg)',
              }}
            />
          </picture>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/85 via-purple-900/75 to-indigo-900/85" />
          
          {/* Animated Gradient Orbs */}
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float-delayed" />
        </div>

        {/* Content */}
        <div ref={heroContent.ref} className="container mx-auto px-6 lg:px-12 relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo and Title */}
            <div className={`flex flex-col items-center mb-8 ${heroContent.isVisible ? 'animate-zoom-in' : 'opacity-0'}`}>
              <div className="relative mb-5">
                <div className="absolute inset-0 bg-white/15 rounded-full blur-xl"></div>
                <img 
                  src="/img/lg.png" 
                  alt="iware Logo" 
                  className="h-20 md:h-24 w-auto relative z-10 drop-shadow-2xl"
                  loading="lazy"
                />
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight"
                  style={{ 
                    textShadow: '0 4px 30px rgba(0, 0, 0, 0.6)',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                IWARE
              </h1>
            </div>
            
            {/* Subtitle */}
            <div className={`mb-6 ${heroContent.isVisible ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
              <h2 className="text-xl md:text-2xl text-white font-medium mb-3"
                  style={{ textShadow: '0 2px 15px rgba(0, 0, 0, 0.7)' }}>
                Sistem Penjadwalan SO Gudang
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mx-auto rounded-full" />
            </div>
            
            {/* Description */}
            <p className={`text-base md:text-lg text-white/90 font-light max-w-2xl mx-auto mb-10 leading-relaxed ${heroContent.isVisible ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}
               style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)' }}>
              Kelola stok barang, transaksi, dan jadwal pengiriman dengan mudah. 
              Terintegrasi dengan Accurate Online untuk efisiensi maksimal.
            </p>
            
            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row justify-center gap-4 mb-14 relative z-20 ${heroContent.isVisible ? 'animate-bounce-in delay-500' : 'opacity-0'}`}>
              <a 
                href="#about" 
                className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
                style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)' }}
              >
                <span className="relative z-10 flex items-center gap-2 text-white">
                  <FaRocket className="text-lg" />
                  Pelajari Lebih Lanjut
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              <a 
                href="/login" 
                className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-bold text-white bg-white/20 backdrop-blur-md rounded-full border-2 border-white overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-white shadow-xl hover:shadow-2xl"
                style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)' }}
              >
                <span className="relative z-10 flex items-center gap-2 group-hover:text-gray-900 transition-colors duration-300">
                  <FaCheckCircle className="text-lg" />
                  Login Sekarang
                </span>
              </a>
            </div>

            {/* Scroll Indicator */}
            <div className={`animate-bounce ${heroContent.isVisible ? 'animate-fade-in-up delay-700' : 'opacity-0'}`}>
              <a href="#features" className="inline-flex flex-col items-center text-white/70 hover:text-white transition-colors">
                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className="text-xs font-medium">Scroll</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Simple & Professional */}
      <section id="features" className="py-16 bg-white relative overflow-hidden">
        <div ref={featuresSection.ref} className="container mx-auto px-6 lg:px-12 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className={`inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold mb-3 ${featuresSection.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              FITUR UNGGULAN
            </span>
            <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-3 ${featuresSection.isVisible ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}>
              Keunggulan Sistem
            </h2>
            <p className={`text-base text-gray-600 max-w-2xl mx-auto ${featuresSection.isVisible ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
              Solusi terintegrasi untuk manajemen gudang yang efisien
            </p>
          </div>
          
          {/* Features Grid - Simple Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className={`bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 ${featuresSection.isVisible ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FaWarehouse className="text-blue-600 text-xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Manajemen Gudang</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Kelola SO masuk dan keluar dengan sistem yang efisien dan terorganisir
              </p>
            </div>

            {/* Feature 2 */}
            <div className={`bg-white rounded-xl p-6 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 ${featuresSection.isVisible ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <FaClock className="text-green-600 text-xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Tepat Waktu</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Penjadwalan akurat untuk setiap SO masuk maupun keluar dari gudang
              </p>
            </div>

            {/* Feature 3 */}
            <div className={`bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 ${featuresSection.isVisible ? 'animate-fade-in-up delay-500' : 'opacity-0'}`}>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <FaSync className="text-purple-600 text-xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Accurate Online</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Terintegrasi sempurna dengan Accurate Online tanpa mengubah data
              </p>
            </div>

            {/* Feature 4 */}
            <div className={`bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 ${featuresSection.isVisible ? 'animate-fade-in-up delay-600' : 'opacity-0'}`}>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <FaChartLine className="text-orange-600 text-xl" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Efisien & Fleksibel</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Sistem yang dapat disesuaikan untuk efisiensi maksimal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float-delayed" />
        </div>
        
        <div ref={statsSection.ref} className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-white">
            <div className={`${statsSection.isVisible ? 'animate-zoom-in delay-200' : 'opacity-0'}`}>
              <div className="text-5xl md:text-6xl font-bold mb-3">100%</div>
              <div className="text-xl font-medium text-white/90">Terintegrasi</div>
              <p className="text-white/70 mt-2">Dengan Accurate Online</p>
            </div>
            <div className={`${statsSection.isVisible ? 'animate-zoom-in delay-300' : 'opacity-0'}`}>
              <div className="text-5xl md:text-6xl font-bold mb-3">24/7</div>
              <div className="text-xl font-medium text-white/90">Akses Real-time</div>
              <p className="text-white/70 mt-2">Monitoring kapan saja</p>
            </div>
            <div className={`${statsSection.isVisible ? 'animate-zoom-in delay-400' : 'opacity-0'}`}>
              <div className="text-5xl md:text-6xl font-bold mb-3">∞</div>
              <div className="text-xl font-medium text-white/90">Skalabilitas</div>
              <p className="text-white/70 mt-2">Berkembang bersama bisnis</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Simple & Professional */}
      <section id="about" className="py-16 bg-gray-50 relative overflow-hidden">
        <div ref={aboutSection.ref} className="container mx-auto px-6 lg:px-12 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className={`inline-block px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold mb-3 ${aboutSection.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              TENTANG KAMI
            </span>
            <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-3 ${aboutSection.isVisible ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}>
              Mengenal IWARE
            </h2>
            <p className={`text-base text-gray-600 max-w-2xl mx-auto ${aboutSection.isVisible ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
              Komitmen kami untuk memberikan solusi terbaik
            </p>
          </div>
          
          {companyInfo && (
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Main Description */}
              <div className={`bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 shadow-lg ${aboutSection.isVisible ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FaWarehouse className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Deskripsi Perusahaan</h3>
                    <p className="text-base text-white/95 leading-relaxed">
                      {companyInfo.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Field, Vision & Mission Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Business Field */}
                <div className={`bg-white rounded-xl p-6 border border-gray-200 shadow-sm ${aboutSection.isVisible ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}>
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                    <FaChartLine className="text-emerald-600 text-lg" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Bidang Usaha</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    {companyInfo.business_field}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-xs font-medium">
                      Warehouse
                    </span>
                    <span className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded text-xs font-medium">
                      Logistics
                    </span>
                  </div>
                </div>

                {/* Vision */}
                <div className={`bg-white rounded-xl p-6 border border-gray-200 shadow-sm ${aboutSection.isVisible ? 'animate-fade-in-up delay-500' : 'opacity-0'}`}>
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <FaRocket className="text-purple-600 text-lg" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Visi Kami</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {companyInfo.vision}
                  </p>
                </div>

                {/* Mission */}
                <div className={`bg-white rounded-xl p-6 border border-gray-200 shadow-sm ${aboutSection.isVisible ? 'animate-fade-in-up delay-600' : 'opacity-0'}`}>
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                    <FaShieldAlt className="text-pink-600 text-lg" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Misi Kami</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {companyInfo.mission}
                  </p>
                </div>
              </div>

              {/* CTA Banner */}
              <div className={`bg-gray-900 rounded-xl p-8 text-center shadow-lg ${aboutSection.isVisible ? 'animate-fade-in-up delay-700' : 'opacity-0'}`}>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Siap Meningkatkan Efisiensi Gudang?
                </h3>
                <p className="text-sm text-gray-300 mb-6">
                  Bergabunglah dengan perusahaan yang telah mempercayai IWARE
                </p>
                <a 
                  href="/login" 
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-gray-900 rounded-full font-bold text-sm hover:scale-105 transition-transform duration-300 shadow-lg"
                >
                  <FaRocket />
                  Mulai Sekarang
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
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
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-purple-900/85 to-indigo-900/90" />
        </div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20 z-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-float-delayed" />
        </div>
        
        <div ref={ctaSection.ref} className="container mx-auto px-6 lg:px-12 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 ${ctaSection.isVisible ? 'animate-zoom-in' : 'opacity-0'}`}
                style={{ textShadow: '0 4px 20px rgba(0, 0, 0, 0.7)' }}>
              Efisiensi Terhadap SO Gudang IWARE
            </h2>
            
            <p className={`text-2xl md:text-3xl text-white/95 font-semibold mb-12 ${ctaSection.isVisible ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}
               style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)' }}>
              #everywhereadaiware
            </p>
            
            <div className={`flex flex-col sm:flex-row justify-center gap-5 mb-12 relative z-20 ${ctaSection.isVisible ? 'animate-bounce-in delay-400' : 'opacity-0'}`}>
              <a 
                href="/login" 
                className="group relative inline-flex items-center justify-center px-12 py-5 text-lg font-bold text-gray-900 bg-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
                style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)' }}
              >
                <span className="relative z-10 flex items-center gap-2 text-gray-900 group-hover:text-white transition-colors duration-300">
                  <FaRocket className="text-xl" />
                  Mulai Sekarang
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              
              <a 
                href="#features" 
                className="group relative inline-flex items-center justify-center px-12 py-5 text-lg font-bold text-white bg-white/20 backdrop-blur-md rounded-full border-2 border-white overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-white shadow-xl hover:shadow-2xl"
                style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)' }}
              >
                <span className="relative z-10 flex items-center gap-2 group-hover:text-gray-900 transition-colors duration-300">
                  <FaCheckCircle className="text-xl" />
                  Lihat Fitur
                </span>
              </a>
            </div>
            
            {/* Decorative Elements */}
            {ctaSection.isVisible && (
              <div className="flex justify-center space-x-3 animate-fade-in-up delay-600">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ boxShadow: '0 0 15px rgba(96, 165, 250, 0.8)' }} />
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce delay-100" style={{ boxShadow: '0 0 15px rgba(192, 132, 252, 0.8)' }} />
                <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-200" style={{ boxShadow: '0 0 15px rgba(244, 114, 182, 0.8)' }} />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
