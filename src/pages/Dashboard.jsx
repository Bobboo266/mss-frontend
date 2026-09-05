import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { dashboardAPI } from '../services/api';

function Dashboard({ onLogout, toggleLanguage }) {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsResponse, activityResponse] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getRecentActivity(5)
      ]);
      
      setStats(statsResponse.data);
      setRecentActivity(activityResponse.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="bg-dark" style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        direction: isRTL ? 'rtl' : 'ltr'
      }}>
        <div className="gold-gradient" style={{ fontSize: '24px' }}>{t('dashboard.loading')}</div>
      </div>
    );
  }

  return (
    <div className="bg-dark" style={{ minHeight: '100vh', direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Header */}
      <header style={{ 
        background: '#111111', 
        padding: '20px 40px', 
        borderBottom: '1px solid #1a1a1a',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <img src="/mss_logo.png" alt="MSS" style={{ height: '50px' }} />
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button 
            onClick={() => navigate('/agents')}
            className="btn-outline"
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            {isRTL ? '🤖 الـ AI Agents' : '🤖 AI Agents'}
          </button>
          <button 
            onClick={toggleLanguage}
            className="btn-outline"
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            {i18n.language === 'en' ? 'العربية' : 'English'}
          </button>
          <span style={{ color: '#888', fontSize: '14px' }}>{t('dashboard.welcome')}, {t('dashboard.admin')}</span>
          <button onClick={handleLogout} className="btn-outline" style={{ padding: '8px 20px' }}>
            {t('dashboard.logout')}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        <h1 className="gold-gradient" style={{ fontSize: '32px', marginBottom: '40px' }}>
          {t('dashboard.title')}
        </h1>

        {/* Stats Cards */}
        {stats && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div className="bg-card" style={{ padding: '30px', borderRadius: '8px', border: '1px solid #1a1a1a' }}>
              <h3 style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>{t('dashboard.totalProducts')}</h3>
              <p className="gold-gradient" style={{ fontSize: '42px', fontWeight: 'bold', margin: 0 }}>
                {stats.total_products}
              </p>
            </div>

            <div className="bg-card" style={{ padding: '30px', borderRadius: '8px', border: '1px solid #1a1a1a' }}>
              <h3 style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>{t('dashboard.totalCustomers')}</h3>
              <p className="gold-gradient" style={{ fontSize: '42px', fontWeight: 'bold', margin: 0 }}>
                {stats.total_customers}
              </p>
            </div>

            <div className="bg-card" style={{ padding: '30px', borderRadius: '8px', border: '1px solid #1a1a1a' }}>
              <h3 style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>{t('dashboard.totalOrders')}</h3>
              <p className="gold-gradient" style={{ fontSize: '42px', fontWeight: 'bold', margin: 0 }}>
                {stats.total_orders}
              </p>
            </div>

            <div className="bg-card" style={{ padding: '30px', borderRadius: '8px', border: '1px solid #1a1a1a' }}>
              <h3 style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>{t('dashboard.totalRevenue')}</h3>
              <p className="gold-gradient" style={{ fontSize: '42px', fontWeight: 'bold', margin: 0 }}>
                ${stats.total_revenue?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-card" style={{ padding: '30px', borderRadius: '8px', border: '1px solid #1a1a1a' }}>
          <h2 style={{ color: '#D4AF37', marginBottom: '20px', fontSize: '20px' }}>
            {t('dashboard.recentActivity')}
          </h2>
          
          {recentActivity.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>
              {t('dashboard.noActivity')}
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1a1a1a' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#888', fontSize: '12px' }}>{t('dashboard.type')}</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#888', fontSize: '12px' }}>{t('dashboard.code')}</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#888', fontSize: '12px' }}>{t('dashboard.description')}</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#888', fontSize: '12px' }}>{t('dashboard.amount')}</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#888', fontSize: '12px' }}>{t('dashboard.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((activity) => (
                    <tr key={`${activity.type}-${activity.id}`} style={{ borderBottom: '1px solid #1a1a1a' }}>
                      <td style={{ padding: '12px', color: '#fff', textTransform: 'capitalize' }}>{activity.type}</td>
                      <td style={{ padding: '12px', color: '#D4AF37' }}>{activity.code}</td>
                      <td style={{ padding: '12px', color: '#888' }}>{activity.description}</td>
                      <td style={{ padding: '12px', color: '#fff' }}>
                        {activity.amount ? `$${activity.amount.toLocaleString()}` : '-'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: '4px', 
                          fontSize: '12px',
                          background: activity.status === 'completed' || activity.status === 'active' ? 'rgba(0,255,0,0.1)' : 'rgba(255,165,0,0.1)',
                          color: activity.status === 'completed' || activity.status === 'active' ? '#00ff00' : '#ffa500'
                        }}>
                          {activity.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;