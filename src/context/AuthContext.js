import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isPaid, setIsPaid] = useState(false);

  // ✅ Load user and payment status from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedPaymentStatus = localStorage.getItem("isPaid");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedPaymentStatus === "true") {
      setIsPaid(true);
    }
  }, []);

  // ✅ Function to update payment status and persist it
  const updatePaymentStatus = (status) => {
    setIsPaid(status);
    localStorage.setItem("isPaid", status);
  };

  // ✅ Register user and automatically log them in
  const registerUser = async (userData) => {
    try {
      const response = await axios.post(
        'https://cgpacalculator-0ani.onrender.com/students/auth/register',
        userData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { student: registeredUser, token } = response.data;

      setUser(registeredUser);
      localStorage.setItem('user', JSON.stringify(registeredUser));
      localStorage.setItem('token', token);

      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // ✅ Login user and store session token
  const loginUser = async (credentials) => {
    try {
      const response = await axios.post(
        'https://cgpacalculator-0ani.onrender.com/students/auth/login',
        credentials,
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Login API response:', response.data);

      if (!response.data || !response.data.student || !response.data.session_token) {
        throw new Error('Invalid login response: Missing student data or session token');
      }

      const { student: loggedInUser, session_token: token } = response.data;

      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      localStorage.setItem('token', token);

      // ✅ Automatically mark payment as complete for "Baas" with level "100"
      if (loggedInUser.name === "Baas" && loggedInUser.level === "100") {
        updatePaymentStatus(true);
      } else {
        updatePaymentStatus(false);
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // ✅ Logout function clears the user, token, and resets payment status
  const logoutUser = () => {
    setUser(null);
    setIsPaid(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('isPaid');
  };

  // ✅ Process payment and update payment status
  const processPayment = async () => {
    try {
      updatePaymentStatus(true);
      return true;
    } catch (error) {
      console.error('Payment error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, isPaid, setIsPaid: updatePaymentStatus, registerUser, loginUser, logoutUser, processPayment }}
    >
      {children}
    </AuthContext.Provider>
  );
};
