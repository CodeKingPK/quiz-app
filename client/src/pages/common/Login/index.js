import { Form, message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser } from "../../../apicalls/users";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function Login() {
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await loginUser(values);
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-primary">
      <div className="premium-card" style={{ width: '480px', margin: '2rem' }}>
        <div className="premium-card-header text-center">
          <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: '700' }}>
            🎓 Quiz Portal
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>
            Sign in to access your quizzes
          </p>
        </div>
        
        <div className="premium-card-body">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item 
              name="email" 
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <input 
                type="email" 
                className="premium-input"
                placeholder="Enter your email"
                style={{ width: '100%' }}
              />
            </Form.Item>
            
            <Form.Item 
              name="password" 
              label="Password"
              rules={[{ required: true, message: 'Please enter your password!' }]}
            >
              <input 
                type="password" 
                className="premium-input"
                placeholder="Enter your password"
                style={{ width: '100%' }}
              />
            </Form.Item>

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                type="submit"
                className="premium-btn premium-btn-primary"
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                🚀 Sign In
              </button>
              
              <div style={{ margin: '1.5rem 0' }}>
                <div style={{ 
                  padding: '1rem', 
                  background: 'var(--gray-100)', 
                  borderRadius: 'var(--border-radius)',
                  fontSize: '0.875rem',
                  color: 'var(--gray-600)'
                }}>
                  <strong>Demo Admin Account:</strong><br/>
                  📧 admin@quiz.com<br/>
                  🔑 admin123
                </div>
              </div>
              
              <Link 
                to="/register" 
                style={{ 
                  color: 'var(--primary)',
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                🆕 Don't have an account? Register here
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
