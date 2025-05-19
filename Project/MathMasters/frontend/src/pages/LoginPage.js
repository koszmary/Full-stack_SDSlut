import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
      onLogin(response.data.token);
      navigate('/account');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <AuthForm isLogin={true} onSubmit={handleSubmit} />
      <p className="register-link">
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

export default LoginPage;