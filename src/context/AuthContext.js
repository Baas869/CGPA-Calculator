import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isPaid, setIsPaid] = useState(false);

  // ✅ Load user session from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Function to update payment status manually
  const updatePaymentStatus = (status) => {
    setIsPaid(status);
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
      console.error('🚨 Registration error:', error);
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

      console.log('✅ Login API response:', response.data);

      if (!response.data || !response.data.student || !response.data.session_token) {
        throw new Error('❌ Invalid login response: Missing student data or session token');
      }

      const { student: loggedInUser, session_token: token } = response.data;
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      localStorage.setItem('token', token);

      // ✅ Automatically check and update payment status
      await checkPaymentStatus(loggedInUser.id);

      return response.data;
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  // ✅ Logout function clears the user, token, and resets payment status
  const logoutUser = () => {
    setUser(null);
    setIsPaid(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // ✅ Function to verify payment status for the logged-in user
  const checkPaymentStatus = async (studentId) => {
    try {
      if (!studentId) return;

      console.log(`🔍 Checking payment status for student ID: ${studentId}`);
      const response = await axios.get(
        `https://cgpacalculator-0ani.onrender.com/payment/payment/status/?student_id=${studentId}`
      );

      if (response.data && response.data.status === "paid") {
        console.log("✅ Payment verified as PAID");
        setIsPaid(true);
      } else {
        console.log("⚠️ Payment status:", response.data.status);
        setIsPaid(false);
      }
    } catch (error) {
      console.error("❌ Error checking payment status:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isPaid,
        setIsPaid: updatePaymentStatus,
        registerUser,
        loginUser,
        logoutUser,
        checkPaymentStatus, // ✅ Expose function to be used in PaymentStatus.jsx
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
