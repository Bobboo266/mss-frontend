import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token ? token.substring(0, 50) + '...' : 'No token');
        
        if (!token) {
          console.error('No token found');
          navigate('/login');
          return;
        }

        console.log('Fetching customers from /api/v1/customers...');
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch('/api/v1/customers', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        console.log('Response status:', response.status);

        if (response.status === 401) {
          console.error('Unauthorized - token invalid');
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log('Customers data received:', data?.length || 0, 'customers');
        setCustomers(data || []);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err.name, err.message);
        if (err.name === 'AbortError') {
          setError('Request timed out. Backend may not be responding.');
        } else {
          setError(err.message);
        }
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-yellow-500 text-xl animate-pulse">Loading customers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-500">Customers</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Company</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={customer.id || index} className="border-t border-gray-700 hover:bg-gray-750">
                  <td className="px-4 py-3">{customer.name}</td>
                  <td className="px-4 py-3">{customer.email}</td>
                  <td className="px-4 py-3">{customer.phone}</td>
                  <td className="px-4 py-3">{customer.company_name || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      customer.status === 'active' ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {customers.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No customers found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}