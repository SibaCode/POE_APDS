import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import DashboardPage from './components/customer/DashboardPage';
import RegisterPage from './components/customer/RegisterPage';
import LoginPage from './components/customer/LoginPage';
import EmployeeLoginPage from './components/employee/EmployeeLoginPage';
import EmployeeDashboardPage from './components/employee/EmployeeDashboardPage'; 

import { AuthProvider } from './AuthContext.js';

function App() {
  // Use ref to hold WebSocket instance
  const socketRef = useRef(null);

  useEffect(() => {
    // Create WebSocket connection
    const socket = new WebSocket(`${window.location.origin.replace(/^http/, 'ws')}/ws`);
    socketRef.current = socket;

    // WebSocket event listeners
    socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socket.onmessage = (event) => {
      console.log('Message from server:', event.data);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Cleanup on unmount
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/employee" element={<EmployeeLoginPage />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboardPage />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
