import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear errors when the user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validate = () => {
    if (!formData.fullName.trim()) {
      alert("Full Name is required");
      return false;
    }

    if (!formData.email.trim()) {
      alert("Email is required");
      return false;
    }

    if (!formData.password) {
      alert("Password is required");
      return false;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        await axios.post("http://localhost:8080/api/auth/register", {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        });
        
        alert("Registration successful!");
        setIsSuccess(true);
        // Reset form after a small delay
        setTimeout(() => {
          setFormData({
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
          });
          setIsSuccess(false);
        }, 3000);
      } catch (error) {
        const errorMsg = error.response?.data || "Registration failed. Please try again.";
        alert(errorMsg);
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-card" id="patient-registration-card">
        <div className="register-header">
          <h2>Patient Registration</h2>
          <p>Create an account to manage your appointments and queues</p>
        </div>

        {isSuccess && (
          <div className="success-alert" id="register-success-alert">
            Registration successful! Welcome to the system.
          </div>
        )}

        <form className="register-form" onSubmit={handleSubmit} id="registration-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                className="form-input"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            {errors.fullName && (
              <span className="form-error-msg" id="fullName-error">
                {errors.fullName}
              </span>
            )}
          </div>

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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            {errors.confirmPassword && (
              <span className="form-error-msg" id="confirmPassword-error">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <button type="submit" className="submit-btn" id="register-submit-btn">
            Register
          </button>
        </form>

        <div className="form-footer">
          Already have an account? <a href="#login">Log In</a>
        </div>
      </div>
    </div>
  );
}

export default Register;
