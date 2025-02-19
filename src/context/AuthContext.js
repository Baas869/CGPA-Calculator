import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User details in state
  const [isPaid, setIsPaid] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Function to update payment status manually
  const updatePaymentStatus = (status) => {
    setIsPaid(status);
  };

  // Function to verify payment status for the logged-in user
  // Note: This endpoint expects a payment reference, so it shouldn't be called using a student id.
  const checkPaymentStatus = async (paymentRef) => {
    try {
      if (!paymentRef) return;
      console.log(`🔍 Checking payment status for payment ref: ${paymentRef}`);
      const response = await axios.get(
        `https://cgpacalculator-0ani.onrender.com/payment/payment/status/?payment_ref=${paymentRef}`
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

  // useCallback to wrap fetchUserProfile so it has a stable reference
  const fetchUserProfile = useCallback(async () => {
    try {
      if (!token) return;
      const response = await axios.get(
        "https://cgpacalculator-0ani.onrender.com/students/auth/profile/",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        setUser(response.data.student);
        // We no longer call checkPaymentStatus here because the Payment Status API requires a payment reference.
      }
    } catch (error) {
      console.error("❌ Failed to fetch user profile:", error);
      logoutUser();
    }
  }, [token]);

  // Load user session by verifying token on mount and when token changes
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token, fetchUserProfile]);

  // Register user and automatically log them in
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
      localStorage.setItem("token", token);
      return response.data;
    } catch (error) {
      console.error("❌ Registration error:", error);
      throw error;
    }
  };

  // Login user and store session token
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
      localStorage.setItem("token", session_token);
      // We no longer call checkPaymentStatus here because the API expects a payment reference.
      return response.data;
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  };

  // Logout function clears the user, token, and resets payment status
  const logoutUser = () => {
    setUser(null);
    setIsPaid(false);
    setToken("");
    localStorage.removeItem("token");
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
