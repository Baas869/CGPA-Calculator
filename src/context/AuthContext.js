import React, { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // User details are stored only in state (not rehydrated on refresh)
  const [user, setUser] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  // Token is persisted in localStorage
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Function to update payment status and persist it if needed
  const updatePaymentStatus = (status) => {
    setIsPaid(status);
    localStorage.setItem("isPaid", status);
  };

  // Check payment status using student ID by calling the dashboard endpoint.
  const checkPaymentStatus = async (studentId) => {
    try {
      if (!studentId) return;
      console.log(`🔍 Checking payment status for student ID: ${studentId}`);
      const response = await axios.get(
        `https://cgpacalculator-0ani.onrender.com/students/dashboard/?student_id=${studentId}`
      );
      if (response.data && response.data.status === "paid") {
        console.log("✅ Payment verified as PAID");
        updatePaymentStatus(true);
      } else {
        console.log("⚠️ Payment status:", response.data.status);
        updatePaymentStatus(false);
      }
    } catch (error) {
      console.error(
        "❌ Error checking payment status:",
        error.response ? error.response.data : error.message
      );
      updatePaymentStatus(false);
    }
  };

  // Note: We no longer auto-rehydrate the user from localStorage on mount.
  // This forces a logout on page refresh, even though the token remains saved.

  // Register user and automatically log them in
  const registerUser = async (userData) => {
    try {
      const response = await axios.post(
        "https://cgpacalculator-0ani.onrender.com/students/auth/register",
        userData,
        { headers: { "Content-Type": "application/json" } }
      );
      const { student: registeredUser, token } = response.data;
      // Set minimal user details in state
      setUser({ id: registeredUser.id, name: registeredUser.name });
      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("studentId", registeredUser.id.toString());
      await checkPaymentStatus(registeredUser.id);
      return response.data;
    } catch (error) {
      console.error("❌ Registration error:", error);
      throw error;
    }
  };

  // Login user and store token and studentId in localStorage.
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
      setUser({ id: loggedInUser.id, name: loggedInUser.name });
      setToken(session_token);
      localStorage.setItem("token", session_token);
      localStorage.setItem("studentId", loggedInUser.id.toString());
      await checkPaymentStatus(loggedInUser.id);
      return response.data;
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  };

  // Logout function clears the user and resets payment status,
  // but leaves the token in localStorage as required.
  const logoutUser = () => {
    setUser(null);
    setIsPaid(false);
    setToken("");
    localStorage.removeItem("studentId");
    localStorage.removeItem("isPaid");
    // Note: We intentionally do not remove the token from localStorage,
    // so that it remains saved after a refresh.
  };

  // Process payment and update payment status (for demonstration)
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
