import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import axios from 'axios';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (credentials) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
      
      // Debugowanie - sprawdź odpowiedź backendu
      console.log('Login response:', response.data);
      
      if (!response.data.token) {
        throw new Error('No token received from server');
      }
      
      onLogin(response.data.token);
      
      // Debugowanie - sprawdź localStorage
      console.log('Token saved in localStorage:', localStorage.getItem('token'));
      
      // Pewne przekierowanie z opóźnieniem (opcjonalne)
      setTimeout(() => {
        navigate('/account', { replace: true });
      }, 100);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Login failed. Check your credentials.';
      setError(errorMessage);
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Log in to MathMasters</h2>
        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>
            {error}
          </div>
        )}
        
        <AuthForm 
          isLogin={true} 
          onSubmit={handleSubmit} 
          isLoading={isLoading}
          submitText={isLoading ? 'Logging in...' : 'Log in'}
        />
        
        <div className="login-links" style={{ marginTop: '1.5rem' }}>
          <p style={{ marginBottom: '0.5rem' }}>
            Don't have an account?{' '}
            <Link to="/register" className="link" style={{ color: '#3498db' }}>
              Register here
            </Link>
          </p>
          <p>
            <Link to="/" className="link" style={{ color: '#3498db' }}>
              Back to homepage
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;