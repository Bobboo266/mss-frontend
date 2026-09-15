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
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const res = await axios.post(
        '/api/v1/auth/token',
        formData,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      
      const token = res.data.access_token;
      if (token) {
        localStorage.setItem('token', token);
        if (onLogin) onLogin(token);
        navigate('/dashboard');
      }
    } catch (err) {
      let errorMsg = 'فشل تسجيل الدخول';
      if (err.response?.data?.detail) {
        errorMsg = typeof err.response.data.detail === 'string' 
          ? err.response.data.detail 
          : JSON.stringify(err.response.data.detail);
      }
      setError(errorMsg);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
      <div style={{ width: '100%', maxWidth: '450px', padding: '40px', background: '#111', borderRadius: '8px' }}>
        <h2 style={{ textAlign: 'center', color: '#D4AF37', marginBottom: '40px' }}>تسجيل الدخول</h2>
        
        {error && (
          <div style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid red', color: '#ff6666', padding: '12px', marginBottom: '20px', borderRadius: '4px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#888', marginBottom: '8px' }}>البريد الإلكتروني</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', color: '#888', marginBottom: '8px' }}>كلمة المرور</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', background: '#0a0a0a', border: '1px solid #333', borderRadius: '4px', color: '#fff', boxSizing: 'border-box' }} />
          </div>

          <button type="submit" style={{ width: '100%', padding: '14px', background: '#D4AF37', color: '#000', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px' }}>
            تسجيل الدخول
          </button>
        </form>

        <div style={{ textAlign: 'center', color: '#555', margin: '30px 0 20px 0', fontSize: '14px', borderTop: '1px solid #333', paddingTop: '20px' }}>
          أو سجل الدخول عبر
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
          <button style={{ width: '100%', maxWidth: '300px', padding: '12px', background: '#4285F4', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
            تسجيل الدخول عبر Google
          </button>
          <button style={{ width: '100%', maxWidth: '300px', padding: '12px', background: '#1877F2', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
            تسجيل الدخول عبر Facebook
          </button>
          <button style={{ width: '100%', maxWidth: '300px', padding: '12px', background: '#0A66C2', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
            تسجيل الدخول عبر LinkedIn
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;