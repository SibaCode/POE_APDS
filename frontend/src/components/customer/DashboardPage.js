import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import Notification from './../../Notification';
import { useAuth } from '../../../src/AuthContext';
import './../customer/css/DashboardPage.css';

const apiBaseUrl = 'https://sibapayment-cubwerbvhzfpbmg8.southafricanorth-01.azurewebsites.net/api/TransactionDetails';

const DashboardPage = () => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    amount: '',
    currency: '',
    swiftCode: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = useCallback(async () => {
    if (user?.accountNumber) {
      try {
        const response = await axios.get(`${apiBaseUrl}/account/${user.accountNumber}`);
        setTransactions(response.data);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to fetch transaction history.');
      }
    } else {
      setError('Account number not found.');
    }
  }, [user?.accountNumber]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, user?.accountNumber]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        accountNumber: user.accountNumber,
        status: 'Pending',
        date: new Date().toISOString(),
      };
      await axios.post(apiBaseUrl, payload);
      setSuccess('Transaction created successfully');
      fetchTransactions(); // Re-fetch transactions after creating a new one
      resetForm();
    } catch (err) {
      console.error(err);
      setError('Transaction failed');
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setForm({
      amount: '',
      currency: '',
      swiftCode: '',
    });
  };

  const resetForm = () => {
    setForm({
      amount: '',
      currency: '',
      swiftCode: '',
    });
    setIsModalOpen(false);
  };

  return (
    <>
      <Navbar userType="Customer" />
      <div className="dashboard-container">
        <h2>Customer Dashboard</h2>
        <h3>Welcome, {user?.fullName}</h3>
        {success && <Notification message={success} type="success" />}
        {error && <Notification message={error} type="error" />}
        <h3>Transaction History</h3>
        <button className="verify-btn" onClick={toggleModal}>Add New Transaction</button>

        {transactions.length === 0 && !error ? (
          <p>You have no transactions yet.</p>
        ) : (
          <table border="1" width="100%">
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>SWIFT Code</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.id}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.currency}</td>
                  <td>{tx.swiftCode}</td>
                  <td>
                    <span className={`status-pill ${tx.status.toLowerCase()}`}>
                      {tx.status === 'Verified' ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h3>{'New Transaction'}</h3>
              <form onSubmit={handleSubmit}>
                <div>
                  <label>Amount:</label>
                  <input type="number" name="amount" value={form.amount} onChange={handleChange} required />
                </div>
                <div>
                  <label>Currency:</label>
                  <select name="currency" value={form.currency} onChange={handleChange} required>
                    <option value="">Select currency</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="ZAR">ZAR</option>
                  </select>
                </div>
                <div>
                  <label>SWIFT Code:</label>
                  <input type="text" name="swiftCode" value={form.swiftCode} onChange={handleChange} required />
                </div>
                <button type="submit">Create</button>
                <button type="button" onClick={toggleModal}>Close</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardPage;
