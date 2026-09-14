import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Agents() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const [agentsRes, summaryRes] = await Promise.all([
          fetch('https://mss-backend-production.up.railway.app/api/v1/ai-agents/', {
            headers: { 'Authorization': `Bearer ${token}` },
            signal: controller.signal
          }),
          fetch('https://mss-backend-production.up.railway.app/api/v1/ai-agents/stats/summary', {
            headers: { 'Authorization': `Bearer ${token}` },
            signal: controller.signal
          })
        ]);

        clearTimeout(timeoutId);

        if (agentsRes.status === 401 || summaryRes.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        const agentsData = await agentsRes.json();
        const summaryData = await summaryRes.json();
        
        setAgents(agentsData || []);
        setSummary(summaryData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-yellow-500 text-xl animate-pulse">Loading AI Agents...</div></div>;
  if (error) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-red-500 text-xl">Error: {error}</div></div>;

  const getCategoryColor = (cat) => {
    const colors = {
      'Operations': 'bg-blue-600',
      'Sales': 'bg-green-600',
      'Marketing': 'bg-purple-600',
      'Finance': 'bg-yellow-600',
      'Support': 'bg-pink-600',
      'Analytics': 'bg-cyan-600',
      'Risk': 'bg-red-600',
      'Strategy': 'bg-indigo-600',
      'Quality': 'bg-teal-600',
      'Legal': 'bg-orange-600',
      'Security': 'bg-rose-600'
    };
    return colors[cat] || 'bg-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-yellow-500">AI Agents - {agents.length} Agents</h1>
          <button onClick={() => navigate('/dashboard')} className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded">Back to Dashboard</button>
        </div>

        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">Total Agents</div>
              <div className="text-2xl font-bold text-yellow-500">{summary.total_agents}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">Tasks Today</div>
              <div className="text-2xl font-bold text-green-500">{summary.total_tasks_today.toLocaleString()}</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-gray-400 text-sm">Avg Accuracy</div>
              <div className="text-2xl font-bold text-blue-500">{summary.average_accuracy}%</div>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-t border-gray-700 hover:bg-gray-750">
                  <td className="px-4 py-3 font-mono text-yellow-400">#{agent.id}</td>
                  <td className="px-4 py-3 font-semibold">{agent.name}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 rounded text-xs ${getCategoryColor(agent.category)}`}>{agent.category}</span></td>
                  <td className="px-4 py-3 text-gray-300">{agent.description}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 rounded text-xs bg-green-600">{agent.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}