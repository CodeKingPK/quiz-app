import { Form, message } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../../../apicalls/users";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      const response = await registerUser(values);
      if (response.success) {
        message.success(response.message);
        navigate("/login");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div className="premium-container" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh' 
    }}>
      <div className="premium-card" style={{ width: '400px' }}>
        <div className="premium-card-header">
          <h1 style={{ margin: 0, textAlign: 'center' }}>QUIZ APP - REGISTER</h1>
        </div>
        <div className="premium-card-body">
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input your name!' }]}>
              <input type="text" className="premium-input" />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please input your email!' }]}>
              <input type="email" className="premium-input" />
            </Form.Item>
            <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please input your password!' }]}>
              <input type="password" className="premium-input" />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <Link to="/login" style={{ color: 'var(--primary)' }}>
                Already have an account? Login
              </Link>
              <button type="submit" className="premium-btn premium-btn-primary">
                Register
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Register;
