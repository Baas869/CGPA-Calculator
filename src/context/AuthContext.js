import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const AuthContext = createContext();

const isExemptUser = (userObj) => {
  return (
    userObj &&
    userObj.name &&
    userObj.level &&
    userObj.name.trim().toLowerCase() === "test student" &&
    userObj.level.trim() === "300"
  );
};

export const AuthProvider = ({ children }) => {
  // User details stored in state (will not be rehydrated on refresh)
  const [user, setUser] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  // Token is persisted in localStorage
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Function to update payment status and persist it if needed
  const updatePaymentStatus = (status) => {
    setIsPaid(status);
    localStorage.setItem("isPaid", status);
  };

  // Function to fetch the user profile using the token
  const fetchUserProfile = useCallback(async () => {
    try {
      if (!token) return;
      // If the current user is exempt, skip profile fetch.
      if (user && isExemptUser(user)) return;
      const response = await axios.get(
        "https://cgpacalculator-0ani.onrender.com/students/auth/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data) {
        const student = response.data.student;
        const updatedUser = { id: student.id, name: student.name, level: student.level };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error(
        "❌ Failed to fetch user profile:",
        error.response ? error.response.data : error.message
      );
      // Optionally, you can logout the user if profile fetch fails.
      // logoutUser();
    }
  }, [token, user]);

  // Check payment status using student ID by calling the dashboard endpoint.
  const checkPaymentStatus = useCallback(async (studentId) => {
    // For exempt users, skip payment check.
    if (user && isExemptUser(user)) {
      console.log("✅ Exempt user detected. Skipping payment check.");
      updatePaymentStatus(true);
      return;
    }
    try {
      if (!studentId) return;
      console.log(`🔍 Checking payment status for student ID: ${studentId}`);
      const response = await axios.get(
        `https://cgpacalculator-0ani.onrender.com/students/dashboard/?student_id=${studentId}`
      );
      if (response.data && response.data.status === "paid") {
        console.log("✅ Payment verified as PAID");
        updatePaymentStatus(true);
        await fetchUserProfile();
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
  }, [fetchUserProfile, user]);

  // On mount, if a token exists, restore session from localStorage and rehydrate user details.
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // If the stored user is exempt, mark as paid immediately.
      if (isExemptUser(parsedUser)) {
        updatePaymentStatus(true);
      } else {
        checkPaymentStatus(parsedUser.id);
      }
    }
  }, [checkPaymentStatus]);

  // Register user and automatically log them in.
  const registerUser = async (userData) => {
    try {
      const response = await axios.post(
        "https://cgpacalculator-0ani.onrender.com/students/auth/register",
        userData,
        { headers: { "Content-Type": "application/json" } }
      );
      const { student: registeredUser, token } = response.data;
      const newUser = { id: registeredUser.id, name: registeredUser.name, level: registeredUser.level };
      setUser(newUser);
      setToken(token);
      localStorage.setItem("token", token);
      localStorage.setItem("studentId", registeredUser.id.toString());
      localStorage.setItem("user", JSON.stringify(newUser));
      // Exempt user: if name is "Test Student" and level is "300", mark as paid immediately.
      if (isExemptUser(registeredUser)) {
        updatePaymentStatus(true);
      } else {
        await checkPaymentStatus(registeredUser.id);
      }
      return response.data;
    } catch (error) {
      console.error("❌ Registration error:", error);
      throw error;
    }
  };

  // Login user and store token and user details in localStorage.
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
      const newUser = { id: loggedInUser.id, name: loggedInUser.name, level: loggedInUser.level };
      setUser(newUser);
      setToken(session_token);
      localStorage.setItem("token", session_token);
      localStorage.setItem("studentId", loggedInUser.id.toString());
      localStorage.setItem("user", JSON.stringify(newUser));
      // Exempt user: mark as paid immediately.
      if (isExemptUser(loggedInUser)) {
        updatePaymentStatus(true);
      } else {
        await checkPaymentStatus(loggedInUser.id);
      }
      // Optionally, re-fetch updated profile (skip for exempt users)
      if (!isExemptUser(loggedInUser)) {
        await fetchUserProfile();
      }
      return response.data;
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  };

  // Logout function clears the user, token, and resets payment status,
  // and removes user info, studentId, and payment status from localStorage.
  const logoutUser = () => {
    setUser(null);
    setIsPaid(false);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("studentId");
    localStorage.removeItem("user");
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

export default AuthProvider;










// import React, { createContext, useState, useEffect, useCallback } from "react";
// import axios from "axios";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   // User details stored in state
//   const [user, setUser] = useState(null);
//   const [isPaid, setIsPaid] = useState(false);
//   // Token persisted in localStorage
//   const [token, setToken] = useState(localStorage.getItem("token") || "");

//   // Function to update payment status and persist it if needed
//   const updatePaymentStatus = (status) => {
//     setIsPaid(status);
//     localStorage.setItem("isPaid", status);
//   };

//   // Function to fetch the user profile using the token
//   const fetchUserProfile = useCallback(async () => {
//     try {
//       if (!token) return;
//       const response = await axios.get(
//         "https://cgpacalculator-0ani.onrender.com/students/auth/profile",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (response.data) {
//         const student = response.data.student;
//         const updatedUser = { id: student.id, name: student.name };
//         setUser(updatedUser);
//         localStorage.setItem("user", JSON.stringify(updatedUser));
//       }
//     } catch (error) {
//       console.error(
//         "❌ Failed to fetch user profile:",
//         error.response ? error.response.data : error.message
//       );
//       // Optionally, you can logout the user if profile fetch fails:
//       // logoutUser();
//     }
//   }, [token]);

//   // Check payment status using student ID by calling the dashboard endpoint.
//   const checkPaymentStatus = useCallback(async (studentId) => {
//     try {
//       if (!studentId) return;
//       console.log(`🔍 Checking payment status for student ID: ${studentId}`);
//       const response = await axios.get(
//         `https://cgpacalculator-0ani.onrender.com/students/dashboard/?student_id=${studentId}`
//       );
//       if (response.data && response.data.status === "paid") {
//         console.log("✅ Payment verified as PAID");
//         updatePaymentStatus(true);
//         // Re-fetch updated user profile after successful payment
//         await fetchUserProfile();
//       } else {
//         console.log("⚠️ Payment status:", response.data.status);
//         updatePaymentStatus(false);
//       }
//     } catch (error) {
//       console.error(
//         "❌ Error checking payment status:",
//         error.response ? error.response.data : error.message
//       );
//       updatePaymentStatus(false);
//     }
//   }, [fetchUserProfile]);

//   // On mount, if a token exists, restore session from localStorage and rehydrate user details.
//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");
//     if (storedToken && storedUser) {
//       setToken(storedToken);
//       setUser(JSON.parse(storedUser));
//       const storedStudentId = JSON.parse(storedUser).id;
//       checkPaymentStatus(storedStudentId);
//     }
//   }, [checkPaymentStatus]);

//   // Register user and automatically log them in.
//   const registerUser = async (userData) => {
//     try {
//       const response = await axios.post(
//         "https://cgpacalculator-0ani.onrender.com/students/auth/register",
//         userData,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       const { student: registeredUser, token } = response.data;
//       const newUser = { id: registeredUser.id, name: registeredUser.name };
//       setUser(newUser);
//       setToken(token);
//       localStorage.setItem("token", token);
//       localStorage.setItem("studentId", registeredUser.id.toString());
//       localStorage.setItem("user", JSON.stringify(newUser));
//       // If the user is "Test Student" with level "300", mark as paid automatically.
//       if (registeredUser.name === "Test Student" && registeredUser.level === "300") {
//         updatePaymentStatus(true);
//       } else {
//         await checkPaymentStatus(registeredUser.id);
//       }
//       return response.data;
//     } catch (error) {
//       console.error("❌ Registration error:", error);
//       throw error;
//     }
//   };

//   // Login user and store token and user details in localStorage.
//   const loginUser = async (credentials) => {
//     try {
//       const response = await axios.post(
//         "https://cgpacalculator-0ani.onrender.com/students/auth/login",
//         credentials,
//         { headers: { "Content-Type": "application/json" } }
//       );
//       console.log("✅ Login API response:", response.data);
//       if (!response.data || !response.data.student || !response.data.session_token) {
//         throw new Error("❌ Invalid login response: Missing student data or session token");
//       }
//       const { student: loggedInUser, session_token } = response.data;
//       const newUser = { id: loggedInUser.id, name: loggedInUser.name };
//       setUser(newUser);
//       setToken(session_token);
//       localStorage.setItem("token", session_token);
//       localStorage.setItem("studentId", loggedInUser.id.toString());
//       localStorage.setItem("user", JSON.stringify(newUser));
//       // If the user is "Test Student" with level "300", mark as paid automatically.
//       if (loggedInUser.name === "Test Student" && loggedInUser.level === "300") {
//         updatePaymentStatus(true);
//       } else {
//         await checkPaymentStatus(loggedInUser.id);
//       }
//       // Optionally, re-fetch updated profile to ensure current details:
//       await fetchUserProfile();
//       return response.data;
//     } catch (error) {
//       console.error("❌ Login error:", error);
//       throw error;
//     }
//   };

//   // Logout function clears the user, token, and resets payment status,
//   // and removes user info, studentId, and payment status from localStorage.
//   const logoutUser = () => {
//     setUser(null);
//     setIsPaid(false);
//     setToken("");
//     localStorage.removeItem("token");
//     localStorage.removeItem("studentId");
//     localStorage.removeItem("user");
//     localStorage.removeItem("isPaid");
//   };

//   // Process payment and update payment status (for demonstration)
//   const processPayment = async () => {
//     try {
//       updatePaymentStatus(true);
//       return true;
//     } catch (error) {
//       console.error("❌ Payment error:", error);
//       return false;
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         setUser,
//         token,
//         isPaid,
//         setIsPaid: updatePaymentStatus,
//         registerUser,
//         loginUser,
//         logoutUser,
//         processPayment,
//         fetchUserProfile,
//         checkPaymentStatus,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;
