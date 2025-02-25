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

  // Updated checkPaymentStatus that calls the dashboard endpoint
  const checkPaymentStatus = useCallback(async (studentId) => {
    try {
      if (!studentId) return;
      console.log(`🔍 Checking payment status for student ID: ${studentId}`);
      const response = await axios.get(
        `https://cgpacalculator-0ani.onrender.com/students/dashboard/?student_id=${studentId}`
      );
      // Assume the backend returns { status: "paid" } if payment is complete,
      // otherwise some other status or message.
      if (response.data && response.data.status === "paid") {
        console.log("✅ Payment verified as PAID");
        updatePaymentStatus(true);
      } else {
        console.log("⚠️ Payment status:", response.data.status);
        updatePaymentStatus(false);
      }
    } catch (error) {
      console.error("❌ Error checking payment status:", error.response ? error.response.data : error.message);
      // Optionally, set isPaid to false on error
      updatePaymentStatus(false);
    }
  }, []);

  // Function to fetch user profile using token; updates user state and checks payment status.
  const fetchUserProfile = useCallback(async () => {
    try {
      if (!token) return;
      // Use the correct endpoint (adjust trailing slash as needed)
      const response = await axios.get(
        "https://cgpacalculator-0ani.onrender.com/students/auth/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        const student = response.data.student;
        setUser({ id: student.id, name: student.name });
        localStorage.setItem("studentId", student.id.toString());
        await checkPaymentStatus(student.id);
      }
    } catch (error) {
      console.error("❌ Failed to fetch user profile:", error.response ? error.response.data : error.message);
      // If profile fetch fails, we can choose to logout.
      logoutUser();
    }
  }, [token, checkPaymentStatus]);

  // On mount, load token and studentId from localStorage and fetch profile.
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedStudentId = localStorage.getItem("studentId");
    if (storedToken && storedStudentId) {
      setToken(storedToken);
      // Optionally, set a minimal user object:
      setUser({ id: storedStudentId });
      // Check payment status using stored studentId
      checkPaymentStatus(storedStudentId);
    }
    if (storedToken) {
      fetchUserProfile();
    }
  }, [fetchUserProfile, checkPaymentStatus]);

  // Register user and automatically log them in, saving token and studentId in localStorage.
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

  // Logout function clears the user, token, and resets payment status and removes them from localStorage.
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
        checkPaymentStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
