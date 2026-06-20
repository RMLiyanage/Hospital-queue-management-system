import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      alert('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      alert('Please enter a valid email address');
      return false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      alert('Password is required');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post('http://localhost:8080/api/auth/login', {
          email: formData.email,
          password: formData.password,
        });

        if (response.data && response.data.email) {
          alert('Login successful!');
          setIsSuccess(true);
          
          localStorage.setItem('user', JSON.stringify(response.data));

          setTimeout(() => {
            setIsSuccess(false);
            window.location.hash = '#dashboard';
          }, 1500);
        } else {
          throw new Error('Unexpected response from server');
        }

      } catch (error) {
        const errorMsg = error.response?.data || 'Login failed. Please check your credentials.';
        alert(errorMsg);
        setErrors({
          auth: errorMsg,
        });
      }
    }
  };

  return (
    <div className="login-container" id="login-container">
      <div className="login-card" id="patient-login-card">
        <div className="login-header">
          <h2>Welcome Back</h2>
          <p>Login to manage your appointments and check queue status</p>
        </div>

        {isSuccess && (
          <div className="success-alert" id="login-success-alert">
            Login successful! Redirecting...
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} id="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="johndoe@example.com"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && (
              <span className="form-error-msg" id="email-error">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {errors.password && (
              <span className="form-error-msg" id="password-error">
                {errors.password}
              </span>
            )}
          </div>

          {errors.auth && (
            <span className="form-error-msg auth-error" id="auth-error">
              {errors.auth}
            </span>
          )}

          <button type="submit" className="submit-btn" id="login-submit-btn">
            Log In
          </button>
        </form>

        <div className="form-footer">
          Don't have an account? <a href="#register">Register</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
