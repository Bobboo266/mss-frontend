import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
  const [email, setEmail] = useState('test@mss-hub.com');
  const [password, setPassword] = useState('SecurePass123!');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 Starting login...');
    
    try {
      // FastAPI OAuth2 يتوقع form data مش JSON
      const formData = new URLSearchParams();
      formData.append('username', email);  // مهم: username مش email
      formData.append('password', password);

      const res = await axios.post(
        'http://127.0.0.1:8001/api/v1/auth/login',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      console.log('✅ Response:', res.data);
      
      const token = res.data.access_token;
      if (token) {
        localStorage.setItem('token', token);
        console.log('✅ Token saved! Navigating...');
        if (onLogin) onLogin(token);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('❌ Full error:', err);
      console.error('❌ Error response:', err.response?.data);
      
      // تحويل الـ error object لنص عشان ما يظهرش خطأ React
      let errorMsg = 'Login failed';
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'string') {
          errorMsg = data;
        } else if (data.detail) {
          if (typeof data.detail === 'string') {
            errorMsg = data.detail;
          } else if (Array.isArray(data.detail)) {
            errorMsg = data.detail.map(d => d.msg || JSON.stringify(d)).join(', ');
          } else {
            errorMsg = JSON.stringify(data.detail);
          }
        } else {
          errorMsg = JSON.stringify(data);
        }
      }
      console.error('❌ Error message:', errorMsg);
      setError(errorMsg);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
      <div style={{ width: '100%', maxWidth: '450px', padding: '40px', background: '#111', borderRadius: '8px' }}>
        <h2 style={{ textAlign: 'center', color: '#D4AF37', marginBottom: '40px' }}>Sign In</h2>
        
        {error && (
          <div style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid red', color: '#ff6666', padding: '12px', marginBottom: '20px', borderRadius: '4px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#888', marginBottom: '8px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '4px', color: '#fff' }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', color: '#888', marginBottom: '8px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '4px', color: '#fff' }}
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '14px', background: '#D4AF37', color: '#000', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;