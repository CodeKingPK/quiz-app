import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.users);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (!user) return null;

  return (
    <nav style={{
      background: 'white',
      borderBottom: '1px solid var(--gray-200)',
      padding: '1rem 2rem',
      boxShadow: 'var(--shadow-sm)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h2 style={{ 
            margin: 0, 
            color: 'var(--primary)',
            fontWeight: '700',
            cursor: 'pointer'
          }} onClick={() => navigate('/')}>
            🎓 Quiz Portal
          </h2>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              className={`premium-btn ${location.pathname === '/' ? 'premium-btn-primary' : 'premium-btn-outline'}`}
              onClick={() => navigate('/')}
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              🏠 Home
            </button>
            
            <button
              className={`premium-btn ${location.pathname.includes('/user/reports') ? 'premium-btn-primary' : 'premium-btn-outline'}`}
              onClick={() => navigate('/user/reports')}
              style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              📊 My Reports
            </button>
            
            {user.isAdmin && (
              <>
                <button
                  className={`premium-btn ${location.pathname.includes('/admin/exams') ? 'premium-btn-primary' : 'premium-btn-outline'}`}
                  onClick={() => navigate('/admin/exams')}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  🛠️ Manage Quizzes
                </button>
                
                <button
                  className={`premium-btn ${location.pathname.includes('/admin/reports') ? 'premium-btn-primary' : 'premium-btn-outline'}`}
                  onClick={() => navigate('/admin/reports')}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  📈 All Reports
                </button>
              </>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            background: 'var(--gray-100)',
            borderRadius: 'var(--border-radius)',
            fontSize: '0.875rem'
          }}>
            <span>👤</span>
            <span style={{ fontWeight: '600', color: 'var(--gray-700)' }}>
              {user.name}
            </span>
            {user.isAdmin && (
              <span className="status-badge status-success" style={{ marginLeft: '0.5rem' }}>
                ADMIN
              </span>
            )}
          </div>
          
          <button
            className="premium-btn"
            onClick={handleLogout}
            style={{ 
              padding: '0.5rem 1rem',
              fontSize: '0.875rem',
              background: 'var(--danger)',
              color: 'white',
              border: 'none'
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
