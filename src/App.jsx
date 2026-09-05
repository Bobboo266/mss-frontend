import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Agents from './pages/Agents';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Invoices from './pages/Invoices';
import Payments from './pages/Payments';

function App() {
  const { i18n } = useTranslation();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing toggleLanguage={toggleLanguage} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} toggleLanguage={toggleLanguage} />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard onLogout={handleLogout} toggleLanguage={toggleLanguage} /> : <Navigate to="/login" replace />} />
        <Route path="/customers" element={isLoggedIn ? <Customers /> : <Navigate to="/login" replace />} />
        <Route path="/products" element={isLoggedIn ? <Products /> : <Navigate to="/login" replace />} />
        <Route path="/orders" element={isLoggedIn ? <Orders /> : <Navigate to="/login" replace />} />
        <Route path="/invoices" element={isLoggedIn ? <Invoices /> : <Navigate to="/login" replace />} />
        <Route path="/payments" element={isLoggedIn ? <Payments /> : <Navigate to="/login" replace />} />
        <Route path="/agents" element={isLoggedIn ? <Agents /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;