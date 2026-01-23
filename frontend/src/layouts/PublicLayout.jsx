import { Outlet, Link } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/img/lg.png" alt="iware Logo" className="h-10 w-auto" />
              <span className="text-2xl font-bold text-primary-600">iware</span>
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                Beranda
              </Link>
              <Link to="/login" className="btn-primary">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/img/lg.png" alt="iware Logo" className="h-10 w-auto" />
                <span className="text-2xl font-bold">iware</span>
              </div>
              <p className="text-gray-400">
                Sistem Penjadwalan SO Gudang IWARE
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontak</h3>
              <p className="text-gray-400">Email: info@iware.com</p>
              <p className="text-gray-400">Telp: (021) 1234-5678</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Alamat</h3>
              <p className="text-gray-400">
                Iware official store, Jl. Babatan Pantai No.14, RT.003/RW.01, Dukuh Sutorejo, Kec. Mulyorejo, Surabaya, Jawa Timur 60113
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 iware. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
