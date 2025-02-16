import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isPaid, setIsPaid] = useState(false);

  // Register user and automatically log them in
  const registerUser = async (userData) => {
    try {
      // Replace with your actual registration API endpoint
      const response = await axios.post('http://localhost:5000/users', userData);
      
      // Assuming your API returns the registered user data and an auth token
      const { user: registeredUser, token } = response.data;
      
      // Set the user in context to automatically log them in
      setUser(registeredUser);
      
      // Optionally, store the token in local storage
      localStorage.setItem('token', token);
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Login function (if needed)
  const loginUser = async (credentials) => {
    try {
      // Replace with your actual login API endpoint
      const response = await axios.post('http://localhost:5000/login', credentials);
      const { user: loggedInUser, token } = response.data;
      setUser(loggedInUser);
      localStorage.setItem('token', token);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('token');
    setIsPaid(false);
  };

  // Payment function that bypasses payment for "sulaiman"
  const processPayment = async () => {
    // Bypass payment if user's name is "sulaiman" (case-insensitive)
    if (user && user.name && user.name.toLowerCase() === 'sulaiman') {
      setIsPaid(true);
      return true;
    }
    // Otherwise, simulate normal payment processing.
    try {
      // Here you could integrate with a payment gateway API.
      // For this demo, we simulate payment success:
      setIsPaid(true);
      return true;
    } catch (error) {
      console.error('Payment error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isPaid, registerUser, loginUser, logoutUser, processPayment }}>
      {children}
    </AuthContext.Provider>
  );
};
