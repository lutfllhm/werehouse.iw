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
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Animated Shapes */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float-delayed" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Animated Title */}
            <div className="flex justify-center items-center space-x-4 mb-6 animate-fade-in-up">
              <img src="/img/lg.png" alt="iware Logo" className="h-20 md:h-24 lg:h-28 w-auto" />
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">iware</h1>
            </div>
            
            {/* Animated Subtitle */}
            <p className="text-xl md:text-2xl mb-8 text-white/90 animate-fade-in-up animation-delay-200">
              Sistem Penjadwalan SO Gudang IWARE
            </p>
            
            {/* Animated Description */}
            <p className="text-lg mb-10 text-white/80 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
              Kelola stok barang, transaksi, dan jadwal pengiriman dengan mudah. 
              Terintegrasi dengan Accurate Online untuk efisiensi maksimal.
            </p>
            
            {/* Animated Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up animation-delay-600">
              <a 
                href="#about" 
                className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                Pelajari Lebih Lanjut
              </a>
              <a 
                href="/login" 
                className="bg-transparent text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2 border-white"
              >
                Login Sekarang
              </a>
            </div>

            {/* Scroll Indicator */}
            <div className="mt-16 animate-bounce">
              <a href="#features" className="inline-block text-white/70 hover:text-white transition-colors">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <span className="text-sm mt-2 block">Scroll untuk lebih lanjut</span>
              </a>
            </div>
          </div>
        </div>

        {/* Animated Particles (optional decorative elements) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-twinkle" />
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white/30 rounded-full animate-twinkle animation-delay-200" />
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-white/30 rounded-full animate-twinkle animation-delay-400" />
          <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-white/30 rounded-full animate-twinkle animation-delay-600" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Keunggulan Aplikasi ini</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaWarehouse className="text-gray-700 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Manajemen Gudang</h3>
              <p className="text-gray-600">mengelola SO masuk dan keluar dengan effisien </p>
            </div>

            <div className="text-center p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="text-gray-700 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tepat waktu</h3>
              <p className="text-gray-600">tepat waktu ketika SO masuk ataupun keluar</p>
            </div>

            <div className="text-center p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-gray-700 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Accurate Online</h3>
              <p className="text-gray-600">Terintegrasi dengan Accurate Online tanpa mengubah data </p>
            </div>

            <div className="text-center p-6 transform hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-gray-700 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Effisien dan flexsibel dalam penjadwalan</h3>
              <p className="text-gray-600">Schedule Transaksi Teratur dan Rapi</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Tentang IWARE</h2>
            
            {companyInfo && (
              <div className="space-y-8">
                <div className="card hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">Deskripsi Perusahaan</h3>
                  <p className="text-gray-700 leading-relaxed">{companyInfo.description}</p>
                </div>

                <div className="card hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">Bidang Usaha</h3>
                  <p className="text-gray-700 leading-relaxed">{companyInfo.business_field}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="card hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-800">Visi</h3>
                    <p className="text-gray-700 leading-relaxed">{companyInfo.vision}</p>
                  </div>

                  <div className="card hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-800">Misi</h3>
                    <p className="text-gray-700 leading-relaxed">{companyInfo.mission}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-float-delayed" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-4">Effesiensi Terhadap SO Gudang IWARE</h2>
          <p className="text-xl mb-8 text-gray-300">#everywhereadaiware</p>
          <a href="/login" className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-xl inline-block">
            Mulai Sekarang
          </a>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
