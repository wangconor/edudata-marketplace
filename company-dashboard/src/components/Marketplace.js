import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Marketplace.css';

const API_BASE_URL = 'http://localhost:8000';

function Marketplace() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurveysWithStats();
  }, []);

  const fetchSurveysWithStats = async () => {
    try {
      // Fetch all surveys
      const surveysResponse = await fetch(`${API_BASE_URL}/surveys`);
      const surveysData = await surveysResponse.json();
      
      // Fetch schools count
      const schoolsResponse = await fetch(`${API_BASE_URL}/schools`);
      const schoolsData = await schoolsResponse.json();
      
      // For each survey, fetch response count
      const surveysWithStats = await Promise.all(
        surveysData.map(async (survey) => {
          try {
            // Get leaderboard to count total responses
            const leaderboardResponse = await fetch(
              `${API_BASE_URL}/leaderboard/${encodeURIComponent(survey.title)}`
            );
            const leaderboardData = await leaderboardResponse.json();
            
            // Sum up all responses
            const totalResponses = leaderboardData.reduce(
              (sum, school) => sum + school.response_count, 
              0
            );
            
            return {
              ...survey,
              totalResponses,
              schoolCount: leaderboardData.length
            };
          } catch (error) {
            return {
              ...survey,
              totalResponses: 0,
              schoolCount: 0
            };
          }
        })
      );
      
      setSurveys(surveysWithStats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading marketplace...</div>;
  }

  const totalResponses = surveys.reduce((sum, s) => sum + (s.totalResponses || 0), 0);
  
  // Get unique schools count across all surveys
  const allSchools = new Set();
  surveys.forEach(s => {
    if (s.schoolCount > 0) {
      // This is simplified - in a real app you'd track actual school IDs
      allSchools.add(s.schoolCount);
    }
  });
  const participatingSchools = surveys.some(s => s.schoolCount > 0) 
    ? Math.max(...surveys.map(s => s.schoolCount || 0)) 
    : 0;

  return (
    <div className="marketplace-container">
      <div className="marketplace-header">
        <h1>Dataset Marketplace</h1>
        <p>Browse and purchase student survey datasets</p>
      </div>
      <div className="impact-banner">
  <div className="impact-icon">🎓</div>
  <div className="impact-text">
    <h3>Student-Powered Insights</h3>
    <p>Access authentic data from high school students while supporting educational programs. All responses are anonymous and voluntary.</p>
  </div>
</div>

      <div className="marketplace-stats">
        <div className="stat-card">
          <h3>{surveys.length}</h3>
          <p>Available Datasets</p>
        </div>
        <div className="stat-card">
          <h3>{participatingSchools > 0 ? `${participatingSchools}+` : '4+'}</h3>
          <p>Schools</p>
        </div>
        <div className="stat-card">
          <h3>{totalResponses > 0 ? totalResponses : '100+'}</h3>
          <p>Total Responses</p>
        </div>
      </div>

      <div className="datasets-grid">
        {surveys.map((survey) => (
          <div key={survey.id} className="dataset-card">
            <div className="dataset-header">
              <h3>{survey.title}</h3>
              <span className="category-badge">{survey.category}</span>
            </div>
            
            <div className="dataset-info">
              <p className="dataset-description">
                Consumer insights from high school students
              </p>
              <p className="dataset-details">
                • {survey.questions.length} questions<br/>
                • {survey.schoolCount || 'Multiple'} schools participating<br/>
                • {survey.totalResponses || 0} total responses<br/>
                • Updated daily
              </p>
            </div>

            <div className="dataset-preview">
              <p className="preview-label">Sample Data Preview:</p>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={[
                  { name: 'Option 1', value: 45 },
                  { name: 'Option 2', value: 30 },
                  { name: 'Option 3', value: 25 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#4F46E5" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="dataset-footer">
              <div className="price">
                <span className="price-label">Dataset Price:</span>
                <span className="price-amount">$299</span>
              </div>
              <Link to={`/dataset/${survey.id}`} className="view-button">
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marketplace;