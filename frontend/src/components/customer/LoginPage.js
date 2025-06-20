import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import './../customer/css/LoginPage.css';

function LoginPage() {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    accountNumber: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Perform login and clear error if successful
      await login(formData, 'customer'); 
      setError('');
      // Optionally, redirect the user to the dashboard or another page on success
      // e.g., navigate('/dashboard');
    } catch (err) {
      // Display error message if login fails
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Customer Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Account Number</label>
          <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit" className="login-btn">Login</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
      <p className="register-link">Not registered? <Link to="/register">Register here</Link></p>
    </div>
  );
}

export default LoginPage;
