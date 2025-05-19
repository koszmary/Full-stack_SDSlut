import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to <span className="logo-highlight">Math Masters</span></h1>
          <p className="hero-subtitle">Master mathematics through engaging challenges</p>
          
          <div className="operation-grid">
            <Link to="/practice/add" className="op-card add">
              <div className="op-icon">+</div>
              <h3>Addition</h3>
              <p>Build your foundational skills</p>
            </Link>
            
            <Link to="/practice/subtract" className="op-card subtract">
              <div className="op-icon">-</div>
              <h3>Subtraction</h3>
              <p>Sharpen your precision</p>
            </Link>
            
            <Link to="/practice/multiply" className="op-card multiply">
              <div className="op-icon">×</div>
              <h3>Multiplication</h3>
              <p>Accelerate your calculations</p>
            </Link>
            
            <Link to="/practice/divide" className="op-card divide">
              <div className="op-icon">÷</div>
              <h3>Division</h3>
              <p>Develop advanced techniques</p>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="auth-section">
        <div className="auth-container">
          <h3>Start Your Journey</h3>
          <Link to="/login" className="auth-btn login">Login</Link>
          <Link to="/register" className="auth-btn register">Register</Link>
          <div className="divider">
            <span>or</span>
          </div>
          <Link to="/practice" className="guest-btn">Continue as Guest</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;