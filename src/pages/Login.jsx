import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import API_BASE_URL from '../config';
import './Auth.css';

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData);
      
      const userData = {
        token: response.data.token,
        userId: response.data.userId,
        fullName: response.data.fullName,
        email: response.data.email,
        currency: response.data.currency
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      toast.success(`🎉 Welcome back, ${userData.fullName}!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error('❌ User not found. Please sign up first!');
      } else if (err.response?.status === 401) {
        toast.error('❌ Invalid password!');
      } else {
        toast.error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer />
      <div className="auth-card shadow-lg">
        <div className="text-center mb-4">
          <i className="bi bi-wallet2 text-primary" style={{ fontSize: '3rem' }}></i>
          <h1 className="mt-3">Welcome Back!</h1>
          <p className="text-muted">Login to Expense Tracker</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              <i className="bi bi-envelope me-2"></i>Email Address
            </label>
            <input
              type="email"
              name="email"
              className="form-control form-control-lg"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">
              <i className="bi bi-lock me-2"></i>Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control form-control-lg"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-lg w-100 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Logging in...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Login
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-muted mb-0">
            Don't have an account? <Link to="/signup" className="text-primary fw-bold">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
