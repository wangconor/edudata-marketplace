import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');

const handleSubmit = (e) => {
  e.preventDefault();
  if (companyName && email) {
    localStorage.setItem('companyEmail', email);
    localStorage.setItem('companyName', companyName);
    onLogin(companyName);
  }
};

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>📊 EduData Marketplace</h1>
          <p>Company Portal</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter your company name"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="company@example.com"
              required
            />
          </div>
          
          <button type="submit" className="login-button">
            Access Dashboard
          </button>
        </form>
        
        <div className="login-footer">
          <p>Demo credentials: Any company name + valid email format</p>
        </div>
      </div>
    </div>
  );
}

export default Login;