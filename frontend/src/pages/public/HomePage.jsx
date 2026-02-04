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
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/70 to-indigo-900/80" />
          
          {/* Animated Gradient Orbs */}
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float-delayed" />
        </div>

        {/* Content */}
        <div ref={heroContent.ref} className="container mx-auto px-6 lg:px-12 relative z-10 py-20">
          <div className="max-w-5xl mx-auto text-center">
            {/* Logo and Title */}
            <div className={`flex flex-col items-center mb-8 ${heroContent.isVisible ? 'animate-zoom-in' : 'opacity-0'}`}>
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl"></div>
                <img 
                  src="/img/lg.png" 
                  alt="iware Logo" 
                  className="h-28 md:h-36 lg:h-40 w-auto relative z-10 drop-shadow-2xl"
                  loading="lazy"
                />
              </div>
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tight"
                  style={{ 
                    textShadow: '0 4px 30px rgba(0, 0, 0, 0.6)',
                    fontFamily: 'system-ui, -apple-system, sans-serif'
                  }}>
                IWARE
              </h1>
            </div>
            
            {/* Subtitle */}
            <div className={`mb-8 ${heroContent.isVisible ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
              <h2 className="text-2xl md:text-3xl lg:text-4xl text-white font-semibold mb-4"
                  style={{ textShadow: '0 2px 15px rgba(0, 0, 0, 0.7)' }}>
                Sistem Penjadwalan SO Gudang
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mx-auto rounded-full" />
            </div>
            
            {/* Description */}
            <p className={`text-lg md:text-xl text-white/95 font-light max-w-3xl mx-auto mb-12 leading-relaxed ${heroContent.isVisible ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}
               style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)' }}>
              Kelola stok barang, transaksi, dan jadwal pengiriman dengan mudah. 
              Terintegrasi dengan Accurate Online untuk efisiensi maksimal.
            </p>
            
            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row justify-center gap-5 mb-16 relative z-20 ${heroContent.isVisible ? 'animate-bounce-in delay-500' : 'opacity-0'}`}>
              <a 
                href="#about" 
                className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl"
                style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)' }}
              >
                <span className="relative z-10 flex items-center gap-2 text-white">
                  <FaRocket className="text-xl" />
                  Pelajari Lebih Lanjut
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              <a 
                href="/login" 
                className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white bg-white/20 backdrop-blur-md rounded-full border-2 border-white overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-white shadow-xl hover:shadow-2xl"
                style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)' }}
              >
                <span className="relative z-10 flex items-center gap-2 group-hover:text-gray-900 transition-colors duration-300">
                  <FaCheckCircle className="text-xl" />
                  Login Sekarang
                </span>
              </a>
            </div>

            {/* Scroll Indicator */}
            <div className={`animate-bounce ${heroContent.isVisible ? 'animate-fade-in-up delay-700' : 'opacity-0'}`}>
              <a href="#features" className="inline-flex flex-col items-center text-white/80 hover:text-white transition-colors">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className="text-sm font-medium">Scroll untuk lebih lanjut</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Optimized */}
      <section id="features" className="py-20 bg-white relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #6366f1 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        <div ref={featuresSection.ref} className="container mx-auto px-6 lg:px-12 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className={`inline-block ${featuresSection.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold mb-3">
                FITUR UNGGULAN
              </span>
            </div>
            <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-4 ${featuresSection.isVisible ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}>
              Keunggulan Sistem
            </h2>
            <p className={`text-lg text-gray-600 max-w-2xl mx-auto ${featuresSection.isVisible ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
              Solusi terintegrasi untuk manajemen gudang yang efisien dan dapat diandalkan
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className={`group relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 transition-all duration-500 hover:shadow-xl border border-blue-100 ${featuresSection.isVisible ? 'animate-slide-in-left-custom delay-300' : 'opacity-0'}`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200/30 rounded-full blur-2xl group-hover:bg-blue-300/40 transition-all duration-500" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaWarehouse className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Manajemen Gudang Terpadu</h3>
                <p className="text-base text-gray-700 leading-relaxed mb-4">
                  Kelola seluruh operasional gudang dalam satu platform. Dari penerimaan barang hingga pengiriman.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <FaCheckCircle className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Tracking SO real-time</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <FaCheckCircle className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Manajemen stok otomatis</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <FaCheckCircle className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>Dashboard monitoring</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2 */}
            <div className={`group relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 transition-all duration-500 hover:shadow-xl border border-green-100 ${featuresSection.isVisible ? 'animate-slide-in-right-custom delay-400' : 'opacity-0'}`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-200/30 rounded-full blur-2xl group-hover:bg-green-300/40 transition-all duration-500" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaClock className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Penjadwalan Tepat Waktu</h3>
                <p className="text-base text-gray-700 leading-relaxed mb-4">
                  Sistem penjadwalan cerdas yang memastikan setiap transaksi berjalan sesuai timeline.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <FaCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Notifikasi otomatis</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <FaCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Kalender terintegrasi</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <FaCheckCircle className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Reminder system</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3 */}
            <div className={`group relative bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 transition-all duration-500 hover:shadow-xl border border-purple-100 ${featuresSection.isVisible ? 'animate-slide-in-left-custom delay-500' : 'opacity-0'}`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200/30 rounded-full blur-2xl group-hover:bg-purple-300/40 transition-all duration-500" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaSync className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Integrasi Accurate Online</h3>
                <p className="text-base text-gray-700 leading-relaxed mb-4">
                  Sinkronisasi sempurna dengan Accurate Online. Data selalu up-to-date tanpa input manual.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <FaCheckCircle className="text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Sinkronisasi real-time</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <FaCheckCircle className="text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>Data tetap aman</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <FaCheckCircle className="text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>API integration</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 4 */}
            <div className={`group relative bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 transition-all duration-500 hover:shadow-xl border border-orange-100 ${featuresSection.isVisible ? 'animate-slide-in-right-custom delay-600' : 'opacity-0'}`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-200/30 rounded-full blur-2xl group-hover:bg-orange-300/40 transition-all duration-500" />
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FaChartLine className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Efisien & Fleksibel</h3>
                <p className="text-base text-gray-700 leading-relaxed mb-4">
                  Sistem yang dapat disesuaikan dengan kebutuhan bisnis Anda untuk efisiensi maksimal.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <FaCheckCircle className="text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Customizable workflow</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <FaCheckCircle className="text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>Reporting & analytics</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <FaCheckCircle className="text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>User-friendly interface</span>
                  </li>
                </ul>
              </div>
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

      {/* About Section - Optimized */}
      <section id="about" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(30deg, #6366f1 12%, transparent 12.5%, transparent 87%, #6366f1 87.5%, #6366f1), linear-gradient(150deg, #6366f1 12%, transparent 12.5%, transparent 87%, #6366f1 87.5%, #6366f1)',
            backgroundSize: '80px 140px'
          }} />
        </div>
        
        <div ref={aboutSection.ref} className="container mx-auto px-6 lg:px-12 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className={`inline-block ${aboutSection.isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold mb-3">
                TENTANG KAMI
              </span>
            </div>
            <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-4 ${aboutSection.isVisible ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}>
              Mengenal IWARE
            </h2>
            <p className={`text-lg text-gray-600 max-w-2xl mx-auto ${aboutSection.isVisible ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
              Komitmen kami untuk memberikan solusi terbaik dalam manajemen gudang
            </p>
          </div>
          
          {companyInfo && (
            <div className="max-w-6xl mx-auto">
              {/* Main Description - Hero Card */}
              <div className={`relative mb-8 ${aboutSection.isVisible ? 'animate-zoom-in delay-300' : 'opacity-0'}`}>
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 md:p-10 shadow-xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <FaWarehouse className="text-white text-xl" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white">Deskripsi Perusahaan</h3>
                    </div>
                    <p className="text-lg md:text-xl text-white/95 leading-relaxed">
                      {companyInfo.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Field */}
              <div className={`mb-8 ${aboutSection.isVisible ? 'animate-slide-in-left-custom delay-400' : 'opacity-0'}`}>
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                        <FaChartLine className="text-white text-2xl" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Bidang Usaha</h3>
                      <p className="text-base text-gray-700 leading-relaxed mb-4">
                        {companyInfo.business_field}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
                          Warehouse Management
                        </span>
                        <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-semibold">
                          Logistics
                        </span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                          Supply Chain
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vision & Mission */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Vision Card */}
                <div className={`group relative ${aboutSection.isVisible ? 'animate-slide-in-left-custom delay-500' : 'opacity-0'}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                  <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <FaRocket className="text-white text-xl" />
                      </div>
                      <div>
                        <span className="inline-block px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs font-semibold mb-2">
                          VISION
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900">Visi Kami</h3>
                      </div>
                    </div>
                    <p className="text-base text-gray-700 leading-relaxed">
                      {companyInfo.vision}
                    </p>
                  </div>
                </div>

                {/* Mission Card */}
                <div className={`group relative ${aboutSection.isVisible ? 'animate-slide-in-right-custom delay-600' : 'opacity-0'}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-rose-200 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                  <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-rose-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <FaShieldAlt className="text-white text-xl" />
                      </div>
                      <div>
                        <span className="inline-block px-2 py-0.5 bg-pink-50 text-pink-600 rounded-full text-xs font-semibold mb-2">
                          MISSION
                        </span>
                        <h3 className="text-2xl font-bold text-gray-900">Misi Kami</h3>
                      </div>
                    </div>
                    <p className="text-base text-gray-700 leading-relaxed">
                      {companyInfo.mission}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom CTA Banner */}
              <div className={`${aboutSection.isVisible ? 'animate-fade-in-up delay-700' : 'opacity-0'}`}>
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-center shadow-xl">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Siap Meningkatkan Efisiensi Gudang Anda?
                  </h3>
                  <p className="text-base text-gray-300 mb-6 max-w-xl mx-auto">
                    Bergabunglah dengan perusahaan yang telah mempercayai IWARE
                  </p>
                  <a 
                    href="/login" 
                    className="inline-flex items-center gap-2 px-8 py-3 bg-white text-gray-900 rounded-full font-bold hover:scale-105 transition-transform duration-300 shadow-lg"
                  >
                    <FaRocket />
                    Mulai Sekarang
                  </a>
                </div>
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
