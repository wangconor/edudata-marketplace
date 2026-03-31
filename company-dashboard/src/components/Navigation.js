import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation({ companyName, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h2>📊 EduData Marketplace</h2>
        </div>
        
       <div className="nav-links">
  <Link to="/dashboard">Dashboard</Link>
  <Link to="/marketplace">Marketplace</Link>
  <Link to="/my-purchases">My Purchases</Link>
  <Link to="/survey-designer">Design Survey</Link>
</div>
        
        <div className="nav-user">
          <span className="company-name">{companyName}</span>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;