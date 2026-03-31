import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SurveyDesigner.css';

const API_BASE_URL = 'http://localhost:8000';

function SurveyDesigner() {
  const [surveyTitle, setSurveyTitle] = useState('');
  const [category, setCategory] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''] }
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [submittedSurvey, setSubmittedSurvey] = useState(null);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''] }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const updateQuestion = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;
    setQuestions(newQuestions);
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const addOption = (questionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push('');
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options = newQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const surveyData = {
      title: surveyTitle,
      category: category,
      questions: questions.map(q => ({
        question: q.question,
        options: q.options.filter(opt => opt.trim() !== '')
      }))
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}/create-survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData)
      });
      
      if (response.ok) {
        setSubmittedSurvey(surveyData);
        setSubmitted(true);
      } else {
        alert('Error creating survey. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create survey. Make sure the backend is running.');
    }
  };

  const handleCreateAnother = () => {
    setSubmitted(false);
    setSubmittedSurvey(null);
    setSurveyTitle('');
    setCategory('');
    setQuestions([{ question: '', options: ['', '', '', ''] }]);
  };

if (submitted) {
  return (
    <div className="designer-container">
      <div className="review-screen">
        <div className="review-header">
          <div className="review-icon">✅</div>
          <h1>Survey Submitted Successfully!</h1>
          <p className="review-subtitle">
            Your survey "{submittedSurvey.title}" is now live and available to students.
          </p>
        </div>

        <div className="review-content">
          <div className="review-info">
            <h2>What Happens Next?</h2>
            <div className="review-steps">
              <div className="review-step">
                <span className="step-number">1</span>
                <div>
                  <h3>Students Take Survey</h3>
                  <p>Your survey is immediately available to students across participating schools</p>
                </div>
              </div>
              <div className="review-step">
                <span className="step-number">2</span>
                <div>
                  <h3>Data Collection</h3>
                  <p>Responses are collected anonymously and aggregated by school demographics</p>
                </div>
              </div>
              <div className="review-step">
                <span className="step-number">3</span>
                <div>
                  <h3>Purchase Results</h3>
                  <p>Once sufficient responses are collected, purchase the dataset from the marketplace</p>
                </div>
              </div>
            </div>
          </div>

          <div className="review-pricing">
            <h2>Pricing Information</h2>
            <div className="pricing-card">
              <div className="pricing-detail">
                <span className="pricing-label">Survey Creation</span>
                <span className="pricing-value free">FREE ✨</span>
              </div>
              <div className="pricing-detail">
                <span className="pricing-label">Dataset Purchase</span>
                <span className="pricing-value">$299</span>
              </div>
              <div className="pricing-note">
                💡 Creating surveys is free! You only pay when you purchase the results dataset.
              </div>
            </div>
          </div>
        </div>

        <div className="review-actions">
          <button onClick={handleCreateAnother} className="create-another-btn">
            Create Another Survey
          </button>
          <Link to="/marketplace" className="view-marketplace-btn">
            View in Marketplace →
          </Link>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="designer-container">
      <div className="designer-header">
        <h1>Survey Designer</h1>
        <p>Create custom surveys to gather specific student insights - completely free!</p>
      </div>

      <form onSubmit={handleSubmit} className="designer-form">
        <div className="form-section">
          <h2>Survey Details</h2>
          
          <div className="form-group">
            <label>Survey Title *</label>
            <input
              type="text"
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
              placeholder="e.g., Student Technology Preferences"
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              <option value="technology">Technology</option>
              <option value="fashion">Fashion</option>
              <option value="food">Food & Beverage</option>
              <option value="entertainment">Entertainment</option>
              <option value="sports">Sports</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h2>Questions</h2>
            <button type="button" onClick={addQuestion} className="add-question-btn">
              + Add Question
            </button>
          </div>

          {questions.map((q, qIndex) => (
            <div key={qIndex} className="question-card">
              <div className="question-header">
                <h3>Question {qIndex + 1}</h3>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-group">
                <label>Question Text *</label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => updateQuestion(qIndex, e.target.value)}
                  placeholder="Enter your question"
                  required
                />
              </div>

              <div className="form-group">
                <label>Answer Options</label>
                {q.options.map((option, oIndex) => (
                  <div key={oIndex} className="option-row">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      placeholder={`Option ${oIndex + 1}`}
                      required
                    />
                    {q.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(qIndex, oIndex)}
                        className="remove-option-btn"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(qIndex)}
                  className="add-option-btn"
                >
                  + Add Option
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="form-section">
          <h2>Pricing & Delivery</h2>
          <div className="pricing-info">
            <div className="pricing-item free-item">
              <strong>Survey Creation:</strong> FREE ✨
            </div>
            <div className="pricing-item">
              <strong>Dataset Purchase:</strong> $299 (pay only when you want the results)
            </div>
            <div className="pricing-item">
              <strong>Estimated Responses:</strong> 50-100 students per school
            </div>
            <div className="pricing-item">
              <strong>Data Delivery:</strong> Instant access upon purchase
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Submit Survey (Free!)
          </button>
        </div>
      </form>
    </div>
  );
}

export default SurveyDesigner;