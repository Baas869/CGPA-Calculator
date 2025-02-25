import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User details in state
  const [isPaid, setIsPaid] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Function to update payment status and persist it if needed
  const updatePaymentStatus = (status) => {
    setIsPaid(status);
    localStorage.setItem("isPaid", status);
  };

  // Function to fetch the user profile using the stored token.
  // This will update the user state and save the studentId to localStorage.
  const fetchUserProfile = useCallback(async () => {
    try {
      if (!token) return;
      const response = await axios.get(
        "https://cgpacalculator-0ani.onrender.com/students/auth/profile/",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        const student = response.data.student;
        setUser({ id: student.id, name: student.name });
        localStorage.setItem("studentId", student.id.toString());
        // Optionally, you can check payment status here if desired.
      }
    } catch (error) {
      console.error("❌ Failed to fetch user profile:", error.response ? error.response.data : error.message);
      logoutUser();
    }
  }, [token]);

  // On mount, if a token exists in localStorage, fetch the user profile.
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
      setUser({ id: registeredUser.id, name: registeredUser.name });
      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("studentId", registeredUser.id.toString());
      return response.data;
    } catch (error) {
      console.error("❌ Registration error:", error);
      throw error;
    }
  };

  // Login user and store session token and studentId in localStorage
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
      // Optionally, check payment status here if needed.
      return response.data;
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  };

  // Logout function clears the user, token, and resets payment status, and removes them from localStorage.
  const logoutUser = () => {
    setUser(null);
    setIsPaid(false);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("studentId");
    localStorage.removeItem("isPaid");
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
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
