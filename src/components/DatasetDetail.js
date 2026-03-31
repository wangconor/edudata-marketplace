import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './DatasetDetail.css';

const API_BASE_URL = 'http://localhost:8000';
const COLORS = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981'];

function DatasetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    fetchSurveyAndResults();
    checkPurchaseStatus();
  }, [id]);

  const checkPurchaseStatus = async () => {
    try {
      const companyEmail = localStorage.getItem('companyEmail') || 'demo@company.com';
      const response = await fetch(`${API_BASE_URL}/purchases/${encodeURIComponent(companyEmail)}`);
      const purchases = await response.json();
      
      if (Array.isArray(purchases)) {
        const purchased = purchases.some(p => p.survey_id === parseInt(id));
        setHasPurchased(purchased);
      }
    } catch (error) {
      console.error('Error checking purchase status:', error);
    }
  };

  const fetchSurveyAndResults = async () => {
    try {
      const surveysResponse = await fetch(`${API_BASE_URL}/surveys`);
      const surveys = await surveysResponse.json();
      const selectedSurvey = surveys.find(s => s.id.toString() === id);
      setSurvey(selectedSurvey);

      if (selectedSurvey) {
        const resultsResponse = await fetch(
          `${API_BASE_URL}/results/${encodeURIComponent(selectedSurvey.title)}/1`
        );
        const resultsData = await resultsResponse.json();
        setResults(resultsData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handlePurchase = () => {
    setShowPayment(true);
  };

  const handlePaymentComplete = async (e) => {
    e.preventDefault();
    
    const companyEmail = localStorage.getItem('companyEmail') || 'demo@company.com';
    const companyName = localStorage.getItem('companyName') || 'Demo Company';
    
    try {
      const response = await fetch(`${API_BASE_URL}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_email: companyEmail,
          company_name: companyName,
          survey_id: parseInt(id),
          survey_title: survey.title
        })
      });
      
      if (response.ok) {
        setPurchaseComplete(true);
        setShowPayment(false);
        
        setTimeout(() => {
          navigate('/my-purchases');
        }, 2500);
      } else {
        const errorData = await response.json();
        alert('Error recording purchase: ' + (errorData.detail || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error recording purchase:', error);
      alert('Error recording purchase: ' + error.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading dataset...</div>;
  }

  if (!survey) {
    return <div className="loading">Dataset not found</div>;
  }

  if (purchaseComplete) {
    return (
      <div className="purchase-success-screen">
        <div className="success-animation">
          <div className="success-checkmark">✓</div>
        </div>
        <h1>Purchase Successful!</h1>
        <p>Dataset "{survey.title}" has been added to your account.</p>
        <p className="redirect-note">Redirecting to My Purchases...</p>
      </div>
    );
  }

  return (
    <div className="dataset-detail-container">
      {!showPayment ? (
        <>
          <div className="detail-header">
            <div>
              <h1>{survey.title}</h1>
              <span className="category-badge">{survey.category}</span>
            </div>
            <div className="price-section">
              <span className="price-label">Dataset Price</span>
              <span className="price-large">$299</span>
            </div>
          </div>

          <div className="detail-overview">
            <h2>Dataset Overview</h2>
            <div className="overview-grid">
              <div className="overview-item">
                <strong>Total Responses:</strong> {results?.total_responses || 0}
              </div>
              <div className="overview-item">
                <strong>Questions:</strong> {survey.questions.length}
              </div>
              <div className="overview-item">
                <strong>Schools:</strong> Multiple participating
              </div>
              <div className="overview-item">
                <strong>Updated:</strong> Real-time
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h2>Data Visualization</h2>
            {hasPurchased ? (
              <p className="section-subtitle">Full access to all {survey.questions.length} questions</p>
            ) : (
              <p className="section-subtitle">Preview of Question 1 - Purchase to unlock all {survey.questions.length} questions</p>
            )}

            {/* Show first question (always visible) */}
            {results?.question_results.slice(0, 1).map((questionResult, index) => {
              const chartData = Object.entries(questionResult.answer_counts).map(([name, value]) => ({
                name,
                value
              }));

              return (
                <div key={index} className="chart-card">
                  <div className="preview-badge">{hasPurchased ? 'PURCHASED' : 'FREE PREVIEW'}</div>
                  <h3>{questionResult.question_text}</h3>
                  <p className="response-count">Based on {results.total_responses} responses</p>
                  
                  <div className="charts-row">
                    <div className="chart-container">
                      <h4>Distribution</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#4F46E5" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="chart-container">
                      <h4>Breakdown</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {chartData.map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Show remaining questions if purchased */}
            {hasPurchased && results?.question_results.slice(1).map((questionResult, index) => {
              const chartData = Object.entries(questionResult.answer_counts).map(([name, value]) => ({
                name,
                value
              }));

              return (
                <div key={index + 1} className="chart-card">
                  <div className="preview-badge purchased">PURCHASED</div>
                  <h3>{questionResult.question_text}</h3>
                  <p className="response-count">Based on {results.total_responses} responses</p>
                  
                  <div className="charts-row">
                    <div className="chart-container">
                      <h4>Distribution</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#4F46E5" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="chart-container">
                      <h4>Breakdown</h4>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {chartData.map((entry, idx) => (
                              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Show locked section if not purchased */}
            {survey.questions.length > 1 && !hasPurchased && (
              <div className="locked-section">
                <div className="locked-overlay">
                  <div className="lock-icon">🔒</div>
                  <h3>Unlock {survey.questions.length - 1} More Question{survey.questions.length - 1 > 1 ? 's' : ''}</h3>
                  <p>Purchase this dataset to access complete insights from all questions</p>
                  <ul className="locked-features">
                    {survey.questions.slice(1).map((q, idx) => (
                      <li key={idx}>
                        <span className="locked-check">✓</span>
                        {q.question_text}
                      </li>
                    ))}
                  </ul>
                  <button onClick={handlePurchase} className="unlock-button">
                    Unlock Full Dataset - $299
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="detail-features">
            <h2>What's Included</h2>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <div>
                  <strong>Complete Data Access</strong>
                  <p>All {survey.questions.length} questions with full response data</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <div>
                  <strong>School Breakdowns</strong>
                  <p>Demographic analysis by participating schools</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <div>
                  <strong>Export Options</strong>
                  <p>Download in CSV, JSON, or Excel formats</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <div>
                  <strong>Real-time Updates</strong>
                  <p>Access to new responses as they come in</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <div>
                  <strong>Advanced Analytics</strong>
                  <p>Interactive dashboards and trend analysis</p>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <div>
                  <strong>API Access</strong>
                  <p>Programmatic access for integration</p>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-actions">
            {!hasPurchased ? (
              <button onClick={handlePurchase} className="purchase-button">
                Purchase Full Dataset - $299
              </button>
            ) : (
              <div className="purchased-notice">
                ✓ You own this dataset
              </div>
            )}
            <button onClick={() => navigate('/marketplace')} className="back-button">
              ← Back to Marketplace
            </button>
          </div>
        </>
      ) : (
        <div className="payment-modal">
          <div className="payment-card">
            <h2>Complete Your Purchase</h2>
            <div className="payment-summary">
              <h3>{survey.title}</h3>
              <div className="summary-details">
                <div className="summary-row">
                  <span>Dataset Access</span>
                  <span>$299.00</span>
                </div>
                <div className="summary-row">
                  <span>Processing Fee</span>
                  <span>$0.00</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>$299.00</span>
                </div>
              </div>
            </div>

            <form className="payment-form" onSubmit={handlePaymentComplete}>
              <div className="form-group">
                <label>Card Number</label>
                <input 
                  type="text" 
                  placeholder="1234 5678 9012 3456" 
                  maxLength="19"
                  required 
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    maxLength="5"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input 
                    type="text" 
                    placeholder="123" 
                    maxLength="4"
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Name on Card</label>
                <input type="text" placeholder="John Doe" required />
              </div>

              <div className="payment-note">
                <p>🔒 This is a demo payment system for the Congressional App Challenge. No actual charges will be made.</p>
              </div>

              <div className="payment-actions">
                <button type="submit" className="confirm-button">
                  Complete Purchase - $299
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowPayment(false)} 
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DatasetDetail;