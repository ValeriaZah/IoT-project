// Navbar.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../styles/ThemeProvider';
import '../styles/Navbar.css'; // Assuming you have a CSS file for styling

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <Link to="/">WildFireEye</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/monitoring">Monitoring</Link>
        <Link to="/alerts">Alerts</Link>
        <Link to="/settings">Settings</Link>
        {user ? (
          <button className="link-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? '☀️ Light' : '🌙 Dark'}
      </button>
    </nav>
  );
};

export default Navbar;