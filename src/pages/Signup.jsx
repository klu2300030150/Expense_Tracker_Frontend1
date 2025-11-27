import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import API_BASE_URL from '../config';
import './Auth.css';

const Signup = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    currency: 'USD'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('❌ Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('❌ Password must be at least 6 characters!');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        currency: formData.currency
      });
      
      // Don't auto-login - redirect to login page instead
      toast.success(`🎉 Account created successfully! Please login to continue.`, {
        position: "top-right",
        autoClose: 2000,
      });
      
      // Redirect to login page after signup
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Signup error:', err);
      
      if (err.response?.data) {
        const msg = typeof err.response.data === 'string'
          ? err.response.data
          : (err.response.data.error || err.response.data.message || 'Signup failed. Please try again.');
        toast.error(msg);
      } else if (err.request) {
        toast.error('⚠️ No response from server. Please check if backend is running.');
      } else {
        toast.error('Signup failed: ' + err.message);
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
          <i className="bi bi-person-plus text-success" style={{ fontSize: '3rem' }}></i>
          <h1 className="mt-3">Create Account</h1>
          <p className="text-muted">Join Expense Tracker Today!</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">
              <i className="bi bi-person me-2"></i>Full Name
            </label>
            <input
              type="text"
              name="fullName"
              className="form-control"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <i className="bi bi-envelope me-2"></i>Email Address
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <i className="bi bi-phone me-2"></i>Phone Number <span className="text-muted">(Optional)</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              className="form-control"
              placeholder="Enter phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <i className="bi bi-currency-exchange me-2"></i>Preferred Currency
            </label>
            <select 
              name="currency" 
              className="form-select" 
              value={formData.currency} 
              onChange={handleChange}
            >
              <option value="USD">🇺🇸 USD ($)</option>
              <option value="EUR">🇪🇺 EUR (€)</option>
              <option value="GBP">🇬🇧 GBP (£)</option>
              <option value="INR">🇮🇳 INR (₹)</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">
              <i className="bi bi-lock me-2"></i>Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Create a password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">
              <i className="bi bi-shield-lock me-2"></i>Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-success btn-lg w-100 mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Creating Account...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
                Sign Up
              </>
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-muted mb-0">
            Already have an account? <Link to="/login" className="text-primary fw-bold">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
