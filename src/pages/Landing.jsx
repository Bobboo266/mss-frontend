import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Landing({ onLogin }) {
  const [email, setEmail] = useState('test@mss-hub.com');
  const [password, setPassword] = useState('SecurePass123!');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('🚀 Starting login...');
    
    try {
      // مهم جداً: نبعث email مش username
      const res = await axios.post(
        '/api/v1/auth/login',
        {
          email: email,  // ✅ email مش username
          password: password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Response:', res.data);
      
      const token = res.data.access_token;
      if (token) {
        localStorage.setItem('token', token);
        console.log('✅ Token saved!');
        if (onLogin) onLogin(token);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('❌ Error:', err);
      console.error('❌ Response:', err.response?.data);
      
      let errorMsg = 'فشل تسجيل الدخول';
      if (err.response?.data?.detail) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          errorMsg = detail.map(d => d.msg || String(d)).join(', ');
        } else if (typeof detail === 'string') {
          errorMsg = detail;
        } else {
          errorMsg = String(detail);
        }
      }
      console.error('❌ Error message:', errorMsg);
      setError(errorMsg);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', direction: 'rtl' }}>
      <header style={{ 
        background: '#111111', 
        padding: '20px 40px', 
        borderBottom: '1px solid #1a1a1a',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <img src="/mss_logo.png" alt="MSS" style={{ height: '60px' }} />
      </header>

      <section style={{ padding: '100px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', color: '#D4AF37', marginBottom: '20px' }}>MSS HUB</h1>
        <p style={{ fontSize: '20px', color: '#888' }}>منصة برمجيات متكاملة</p>
      </section>

      <section id="login-section" style={{ padding: '80px 40px', background: '#111111' }}>
        <div style={{ maxWidth: '450px', margin: '0 auto' }}>
          <div style={{ background: '#0a0a0a', padding: '40px', borderRadius: '8px', border: '1px solid #1a1a1a' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '24px', color: '#D4AF37' }}>
              تسجيل الدخول
            </h2>

            {error && (
              <div style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid #ff0000', color: '#ff6666', padding: '12px', borderRadius: '4px', marginBottom: '20px' }}>
                {String(error)}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#888', marginBottom: '8px' }}>البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '4px', color: '#fff', textAlign: 'right' }}
                />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', color: '#888', marginBottom: '8px' }}>كلمة المرور</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '4px', color: '#fff', textAlign: 'right' }}
                />
              </div>

              <button type="submit" style={{ width: '100%', padding: '14px', fontSize: '16px', fontWeight: 'bold', background: '#D4AF37', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                تسجيل الدخول
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;