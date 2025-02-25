import React, { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User details in state only
  const [isPaid, setIsPaid] = useState(false);
  const [token, setToken] = useState(""); // Token is stored in state only

  // Function to update payment status manually
  const updatePaymentStatus = (status) => {
    setIsPaid(status);
  };

  // Register user and automatically log them in (do not persist user details locally)
  const registerUser = async (userData) => {
    try {
      const response = await axios.post(
        "https://cgpacalculator-0ani.onrender.com/students/auth/register",
        userData,
        { headers: { "Content-Type": "application/json" } }
      );
      const { student: registeredUser, token } = response.data;
      setUser(registeredUser);
      setToken(token);
      return response.data;
    } catch (error) {
      console.error("❌ Registration error:", error);
      throw error;
    }
  };

  // Login user and store session token in state only
  const loginUser = async (credentials) => {
    try {
      const response = await axios.post(
        "https://cgpacalculator-0ani.onrender.com/students/auth/login",
        credentials,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("✅ Login API response:", response.data);
      if (!response.data || !response.data.student || !response.data.session_token) {
        throw new Error("❌ Invalid login response: Missing student data or session token");
      }
      const { student: loggedInUser, session_token } = response.data;
      setUser(loggedInUser);
      setToken(session_token);
      await checkPaymentStatus(loggedInUser.id);
      return response.data;
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  };

  // Logout function clears the user, token, and resets payment status (state only)
  const logoutUser = () => {
    setUser(null);
    setIsPaid(false);
    setToken("");
  };

  // Function to verify payment status for the logged-in user (using student ID)
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

  // Process payment and update payment status
  const processPayment = async () => {
    try {
      updatePaymentStatus(true);
      return true;
    } catch (error) {
      console.error("❌ Payment error:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        isPaid,
        setIsPaid: updatePaymentStatus,
        registerUser,
        loginUser,
        logoutUser,
        processPayment,
        checkPaymentStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
