import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch('http://   mss-backend-production.up.railway.app/api/v1/products', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        setProducts(data || []);
        setLoading(false);
      } catch (err) {
        if (err.name === 'AbortError') {
          setError('Request timed out.');
        } else {
          setError(err.message);
        }
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate]);

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-yellow-500 text-xl animate-pulse">Loading products...</div></div>;
  if (error) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-red-500 text-xl">Error: {error}</div></div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-500">Products</h1>
          <button onClick={() => navigate('/dashboard')} className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded">Back to Dashboard</button>
        </div>
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Currency</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id || i} className="border-t border-gray-700 hover:bg-gray-750">
                  <td className="px-4 py-3 font-mono text-yellow-400">{p.product_code}</td>
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">{p.category || '-'}</td>
                  <td className="px-4 py-3">${p.price?.toLocaleString()}</td>
                  <td className="px-4 py-3">{p.currency || 'USD'}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${p.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`}>{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && <div className="text-center py-8 text-gray-400">No products found</div>}
        </div>
      </div>
    </div>
  );
}