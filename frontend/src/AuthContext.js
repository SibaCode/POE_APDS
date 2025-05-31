import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });


  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (credentials, userType = 'customer') => {
    const endpoint = userType === 'employee'
      ? 'https://sibapayment-cubwerbvhzfpbmg8.southafricanorth-01.azurewebsites.net/api/Employee/login'
      : 'https://sibapayment-cubwerbvhzfpbmg8.southafricanorth-01.azurewebsites.net/api/Customers/login';
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login failed:', errorData);  // Log the error message
        throw new Error(errorData?.message || 'Unknown error');
      }
  
      const data = await response.json();
      return data;  // Return the successful login response data
  
    } catch (error) {
      console.error('Error during login:', error);  // Log the error
      throw error;  // Re-throw the error
    }
  };
  

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
