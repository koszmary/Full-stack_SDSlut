import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaTrophy,
  FaCalendarAlt,
  FaChartLine,
  FaSignOutAlt
} from 'react-icons/fa';
import axios from 'axios';
import './AccountPage.css';

const AccountPage = ({ onLogout }) => {
  const [stats, setStats] = useState({
    streak: 0,
    totalPractice: 0,
    achievements: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/user/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="account-page">
      <h1>My Account</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <FaCalendarAlt className="stat-icon" />
          <h3>Current Streak</h3>
          <p>{stats.streak} days</p>
        </div>
        
        <div className="stat-card">
          <FaChartLine className="stat-icon" />
          <h3>Total Practice</h3>
          <p>{stats.totalPractice} minutes</p>
        </div>
        
        <div className="stat-card">
          <FaTrophy className="stat-icon" />
          <h3>Achievements</h3>
          <p>{stats.achievements.length} unlocked</p>
        </div>
      </div>
      
      <div className="account-links">
        <Link to="/profile/stats" className="account-link">
          <FaChartLine /> View Detailed Stats
        </Link>
        <Link to="/profile/achievements" className="account-link">
          <FaTrophy /> View Achievements
        </Link>
        <button onClick={onLogout} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default AccountPage;