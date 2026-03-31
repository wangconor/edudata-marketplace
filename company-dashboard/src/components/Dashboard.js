import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const API_BASE_URL = 'http://localhost:8000';

function Dashboard({ companyName }) {
  const [stats, setStats] = useState({
    schools: 0,
    responses: 0,
    surveys: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch schools
      const schoolsResponse = await fetch(`${API_BASE_URL}/schools`);
      const schoolsData = await schoolsResponse.json();
      
      // Fetch surveys
      const surveysResponse = await fetch(`${API_BASE_URL}/surveys`);
      const surveysData = await surveysResponse.json();
      
      // Count total responses (simplified - counts from one survey as example)
      let totalResponses = 0;
      for (const survey of surveysData) {
        try {
          const leaderboardResponse = await fetch(
            `${API_BASE_URL}/leaderboard/${encodeURIComponent(survey.title)}`
          );
          const leaderboardData = await leaderboardResponse.json();
          totalResponses += leaderboardData.reduce((sum, school) => sum + school.response_count, 0);
        } catch (error) {
          console.error('Error fetching leaderboard:', error);
        }
      }
      
      setStats({
        schools: schoolsData.length,
        responses: totalResponses,
        surveys: surveysData.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {companyName}!</h1>
        <p>Access student insights and design custom surveys</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-icon">📊</div>
          <h3>Browse Datasets</h3>
          <p>Explore available student survey data from multiple schools</p>
          <Link to="/marketplace" className="card-button">
            Go to Marketplace →
          </Link>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">✏️</div>
          <h3>Design Survey</h3>
          <p>Create custom surveys to gather specific student insights</p>
          <Link to="/survey-designer" className="card-button">
            Create Survey →
          </Link>
        </div>

        <div className="dashboard-card">
          <div className="card-icon">💼</div>
          <h3>My Purchases</h3>
          <p>View and download your purchased datasets</p>
          <Link to="/my-purchases" className="card-button">
          View Purchases →
          </Link>
        </div>
      </div>
<div className="how-it-works">
  <h2>How It Works</h2>
  <div className="steps-container">
    <div className="step">
      <div className="step-icon">📊</div>
      <h3>1. Create Surveys</h3>
      <p>Design custom surveys to understand student preferences at no cost</p>
    </div>
    <div className="step">
      <div className="step-icon">👥</div>
      <h3>2. Students Respond</h3>
      <p>Students voluntarily participate, earning benefits for their schools</p>
    </div>
    <div className="step">
      <div className="step-icon">💰</div>
      <h3>3. Purchase Insights</h3>
      <p>Access aggregated, anonymized data for actionable insights</p>
    </div>
    <div className="step">
      <div className="step-icon">🏫</div>
      <h3>4. Schools Benefit</h3>
      <p>Proceeds support participating schools' programs and initiatives</p>
    </div>
  </div>
  <div className="value-proposition">
    <h3>Why EduData Marketplace?</h3>
    <div className="benefits-grid">
      <div className="benefit">
        <span className="benefit-icon">✓</span>
        <span>Authentic student insights</span>
      </div>
      <div className="benefit">
        <span className="benefit-icon">✓</span>
        <span>Multiple school demographics</span>
      </div>
      <div className="benefit">
        <span className="benefit-icon">✓</span>
        <span>Anonymous, privacy-focused</span>
      </div>
      <div className="benefit">
        <span className="benefit-icon">✓</span>
        <span>Supports education funding</span>
      </div>
    </div>
  </div>
</div>
      <div className="dashboard-stats">
        <h2>Platform Statistics</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <h3>{stats.schools}+</h3>
            <p>Participating Schools</p>
          </div>
          <div className="stat-item">
            <h3>{stats.responses}+</h3>
            <p>Student Responses</p>
          </div>
          <div className="stat-item">
            <h3>{stats.surveys}</h3>
            <p>Available Surveys</p>
          </div>
          <div className="stat-item">
            <h3>Daily</h3>
            <p>Data Updates</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;