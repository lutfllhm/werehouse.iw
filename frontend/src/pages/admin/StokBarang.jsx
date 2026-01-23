import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { FaSync, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

const StokBarang = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/products', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search
        }
      });
      setProducts(response.data.data);
      setPagination(prev => ({ ...prev, ...response.data.pagination }));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      await axios.post('/products/sync');
      alert('Sinkronisasi berhasil!');
      fetchProducts();
    } catch (error) {
      console.error('Error syncing products:', error);
      alert('Sinkronisasi gagal!');
    } finally {
      setSyncing(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Stok Barang</h1>
        <button 
          onClick={handleSync} 
          disabled={syncing}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50"
        >
          <FaSync className={syncing ? 'animate-spin' : ''} />
          <span>{syncing ? 'Syncing...' : 'Sync dari Accurate'}</span>
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk..."
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-primary">
            Cari
          </button>
        </form>
      </div>

      {/* Products Table */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Produk</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stok</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Satuan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.product_code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.product_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {product.stock_quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Rp {parseFloat(product.price || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.stock_quantity <= product.min_stock ? (
                          <span className="flex items-center text-red-600">
                            <FaExclamationTriangle className="mr-1" />
                            Stok Rendah
                          </span>
                        ) : (
                          <span className="text-green-600">Normal</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Menampilkan {products.length} dari {pagination.total} produk
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="btn-secondary disabled:opacity-50"
                >
                  Sebelumnya
                </button>
                <span className="px-4 py-2 text-sm">
                  Halaman {pagination.page} dari {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="btn-secondary disabled:opacity-50"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StokBarang;
