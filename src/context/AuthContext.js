import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User details stored in state
  const [isPaid, setIsPaid] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Function to update payment status
  const updatePaymentStatus = (status) => {
    setIsPaid(status);
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

  // Wrap fetchUserProfile in useCallback for stable reference
  const fetchUserProfile = useCallback(async () => {
    try {
      if (!token) return;
      const response = await axios.get(
        "https://cgpacalculator-0ani.onrender.com/students/auth/profile/",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        setUser(response.data.student);
        await checkPaymentStatus(response.data.student.id);
      }
    } catch (error) {
      console.error("❌ Failed to fetch user profile:", error);
      logoutUser();
    }
  }, [token]);

  // Load user session by verifying token on mount and when token changes
  useEffect(() => {
    // Load token and studentId from localStorage
    const storedToken = localStorage.getItem("token");
    const storedStudentId = localStorage.getItem("studentId");
    if (storedToken && storedStudentId) {
      setToken(storedToken);
      // Optionally, you can set a minimal user object if needed:
      setUser({ id: storedStudentId });
    }
    if (storedToken) {
      fetchUserProfile();
    }
  }, [fetchUserProfile]);

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
      localStorage.setItem("studentId", registeredUser.id.toString());
      return response.data;
    } catch (error) {
      console.error("❌ Registration error:", error);
      throw error;
    }
  };

  // Login user and store session token along with student ID in localStorage
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
      localStorage.setItem("studentId", loggedInUser.id.toString());
      await checkPaymentStatus(loggedInUser.id);
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
    localStorage.removeItem("studentId");
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
