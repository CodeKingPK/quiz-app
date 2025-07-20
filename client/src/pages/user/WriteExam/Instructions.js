import React from "react";
import { useNavigate } from "react-router-dom";

function Instructions({ examData, setView, startTimer }) {
  const navigate = useNavigate();
  return (
    <div className="premium-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="premium-card-header text-center">
        <h2 style={{ margin: 0, fontSize: '2rem' }}>📋 Quiz Instructions</h2>
        <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9, fontSize: '1.1rem' }}>
          {examData.name}
        </p>
      </div>

      <div className="premium-card-body">
        {/* Quiz Info Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div className="premium-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--primary)' }}>
              {examData.totalMarks}
            </div>
            <div style={{ color: 'var(--gray-600)' }}>Total Questions</div>
          </div>

          <div className="premium-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏱️</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--secondary)' }}>
              {Math.floor(examData.duration / 60)} min
            </div>
            <div style={{ color: 'var(--gray-600)' }}>Duration</div>
          </div>

          <div className="premium-card" style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success)' }}>
              {examData.passingMarks}
            </div>
            <div style={{ color: 'var(--gray-600)' }}>Passing Score</div>
          </div>
        </div>

        {/* Instructions List */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ 
            color: 'var(--gray-900)', 
            marginBottom: '1rem',
            fontSize: '1.25rem',
            fontWeight: '600'
          }}>
            📝 Important Guidelines:
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { icon: '⏰', text: `Complete the quiz within ${Math.floor(examData.duration / 60)} minutes` },
              { icon: '🔄', text: 'Quiz will auto-submit when time expires' },
              { icon: '🚫', text: 'Once submitted, answers cannot be changed' },
              { icon: '💻', text: 'Do not refresh or close the browser' },
              { icon: '🔍', text: 'Use Previous/Next buttons to navigate questions' },
              { icon: '📊', text: `Score ${examData.passingMarks} or more to pass` },
              { icon: '✅', text: 'Click on any option to select your answer' },
              { icon: '📝', text: 'Review all answers before submitting' }
            ].map((instruction, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem 1rem',
                background: 'var(--gray-50)',
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--gray-200)'
              }}>
                <span style={{ fontSize: '1.25rem' }}>{instruction.icon}</span>
                <span style={{ color: 'var(--gray-700)' }}>{instruction.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          borderTop: '1px solid var(--gray-200)',
          paddingTop: '2rem'
        }}>
          <button 
            className="premium-btn premium-btn-outline"
            onClick={() => navigate('/')}
          >
            🏠 Back to Home
          </button>
          <button
            className="premium-btn premium-btn-primary"
            onClick={() => {
              startTimer();
              setView("questions");
            }}
            style={{ fontSize: '1.1rem', padding: '0.875rem 2rem' }}
          >
            🚀 Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default Instructions;
