import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For routing to the dashboard

const EmployeeLoginPage = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate(); // useNavigate hook instead of useHistory in v6

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://sibapayment-cubwerbvhzfpbmg8.southafricanorth-01.azurewebsites.net/api/employee/login', form); 
      if (res.data.token) {
        localStorage.setItem('employeeToken', res.data.token);
        navigate('/employee-dashboard');  
      }
    } catch (err) {
      setError('Invalid login credentials');
      console.error('Login error:', err);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <h2>Employee Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={form.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default EmployeeLoginPage;
