import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaPlus, 
  FaMinus, 
  FaTimes, 
  FaDivide,
  FaUser,
  FaTrophy,
  FaCalendarAlt,
  FaChartLine,
  FaSignOutAlt
} from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ isAuthenticated, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/">Math Masters</Link>
      </div>
      
      <div className="nav-operations">
        <Link to="/practice/add"><FaPlus /> Addition</Link>
        <Link to="/practice/subtract"><FaMinus /> Subtraction</Link>
        <Link to="/practice/multiply"><FaTimes /> Multiplication</Link>
        <Link to="/practice/divide"><FaDivide /> Division</Link>
      </div>

      <div className="nav-auth">
        {isAuthenticated ? (
          <div className="profile-dropdown">
            <Link to="/account" className="profile-link">
              <FaUser /> Account
            </Link>
            <div className="dropdown-content">
              <Link to="/account">
                <FaChartLine /> Progress Stats
              </Link>
              <Link to="/account">
                <FaTrophy /> Achievements
              </Link>
              <Link to="/account">
                <FaCalendarAlt /> Streaks
              </Link>
              <div className="dropdown-divider"></div>
              <button onClick={onLogout} className="dropdown-logout">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login"><FaUser /> Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;