import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MyPurchases.css';

const API_BASE_URL = 'http://localhost:8000';

function MyPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const companyEmail = localStorage.getItem('companyEmail') || 'demo@company.com';

  useEffect(() => {
    fetchPurchases();
  }, []);

const fetchPurchases = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/purchases/${encodeURIComponent(companyEmail)}`);
    const data = await response.json();
    
    // Make sure data is an array
    if (Array.isArray(data)) {
      setPurchases(data);
    } else {
      console.error('Purchases data is not an array:', data);
      setPurchases([]);
    }
    setLoading(false);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    setPurchases([]); // Set empty array on error
    setLoading(false);
  }
};

 const handleDownload = async (purchase, format) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/export/${encodeURIComponent(purchase.survey_title)}/${format}`
    );
    const data = await response.json();
    
    if (format === 'csv') {
      const blob = new Blob([data.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${purchase.survey_title.replace(/\s+/g, '_')}_data.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${purchase.survey_title.replace(/\s+/g, '_')}_data.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Error downloading:', error);
    alert('Error downloading data. Please try again.');
  }
};

  if (loading) {
    return <div className="loading">Loading your purchases...</div>;
  }

if (purchases.length === 0) {
  return (
    <div className="purchases-container">
      <div className="purchases-header">
        <h1>My Purchased Datasets</h1>
        <p>Access and download your purchased survey data</p>
      </div>
      
      <div className="empty-purchases">
        <div className="empty-icon">🛒</div>
        <h2>No Purchases Yet</h2>
        <p>Start exploring student insights by purchasing datasets from our marketplace</p>
        <div className="empty-features">
          <div className="empty-feature">
            <span className="feature-icon">📊</span>
            <span>Full survey data access</span>
          </div>
          <div className="empty-feature">
            <span className="feature-icon">📥</span>
            <span>Download in CSV & JSON</span>
          </div>
          <div className="empty-feature">
            <span className="feature-icon">🔄</span>
            <span>Real-time updates</span>
          </div>
        </div>
        <Link to="/marketplace" className="browse-button">
          Browse Marketplace →
        </Link>
      </div>
    </div>
  );
}

  return (
    <div className="purchases-container">
      <div className="purchases-header">
        <h1>My Purchased Datasets</h1>
        <p>Access and download your purchased survey data</p>
      </div>

      <div className="purchases-grid">
        {purchases.map((purchase) => (
          <div key={purchase.id} className="purchase-card">
            <div className="purchase-header">
              <div>
                <h3>{purchase.survey_title}</h3>
                <p className="purchase-date">
                  Purchased: {new Date(purchase.purchase_date).toLocaleDateString()}
                </p>
              </div>
              <div className="purchase-amount">${purchase.amount}</div>
            </div>

            <div className="purchase-actions">
              <Link to={`/dataset/${purchase.survey_id}`} className="action-button view">
                📊 View Dashboard
              </Link>
              <button 
                onClick={() => handleDownload(purchase, 'csv')} 
                className="action-button download"
              >
                📥 Download CSV
              </button>
              <button 
                onClick={() => handleDownload(purchase, 'json')} 
                className="action-button download"
              >
                📥 Download JSON
              </button>
            </div>

            <div className="purchase-features">
              <div className="feature-badge">✓ Full Data Access</div>
              <div className="feature-badge">✓ Real-time Updates</div>
              <div className="feature-badge">✓ Export Options</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyPurchases;