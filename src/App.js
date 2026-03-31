import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import components we'll create
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import DatasetDetail from './components/DatasetDetail';
import SurveyDesigner from './components/SurveyDesigner';
import Navigation from './components/Navigation';
import MyPurchases from './components/MyPurchases';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [companyName, setCompanyName] = useState('');

  const handleLogin = (name) => {
    setIsAuthenticated(true);
    setCompanyName(name);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCompanyName('');
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <Navigation companyName={companyName} onLogout={handleLogout} />}
        
        <Routes>
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isAuthenticated ? 
              <Dashboard companyName={companyName} /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/marketplace" 
            element={
              isAuthenticated ? 
              <Marketplace /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/dataset/:id" 
            element={
              isAuthenticated ? 
              <DatasetDetail /> : 
              <Navigate to="/login" />
            } 
          />
          <Route 
            path="/survey-designer" 
            element={
              isAuthenticated ? 
              <SurveyDesigner /> : 
              <Navigate to="/login" />
            } 
          />
<Route 
  path="/my-purchases" 
  element={
    isAuthenticated ? 
    <MyPurchases /> : 
    <Navigate to="/login" />
  } 
/>
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;