import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isPaid, setIsPaid] = useState(false);

  // Register user and automatically log them in.
  // After registration, the user is logged in and should be directed to the dashboard.
  // Payment status (isPaid) remains false until the user completes payment.
  const registerUser = async (userData) => {
    try {
      // Post user data as JSON to the registration endpoint.
      const response = await axios.post(
        'https://cgpacalculator-0ani.onrender.com/students/auth/register',
        userData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      // Assuming your API returns:
      // { message: "Registration successful", student: { ... }, token: "some-auth-token" }
      const { student: registeredUser, token } = response.data;
      
      // Automatically log the user in.
      setUser(registeredUser);
      localStorage.setItem('token', token);
      
      // Payment status remains false by default.
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Login function that posts credentials to the login endpoint.
  // On success, the user is logged in and a token is stored.
  // For the special user ("Baas" with level "100"), payment is automatically marked as complete.
  const loginUser = async (credentials) => {
    try {
      // Post credentials as JSON to the login endpoint.
      const response = await axios.post(
        'https://cgpacalculator-0ani.onrender.com/students/auth/login',
        credentials,
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      // Log the API response to inspect its structure.
      console.log('Login API response:', response.data);
      
      // Ensure the response contains a student and session_token (instead of user and token).
      if (!response.data || !response.data.student || !response.data.session_token) {
        throw new Error('Invalid login response: Missing student data or session token');
      }
      
      const { student: loggedInUser, session_token: token } = response.data;
      
      // Automatically log the user in.
      setUser(loggedInUser);
      localStorage.setItem('token', token);
      
      // Automatically mark payment as complete for the special "Baas" user.
      if (loggedInUser.name === "Baas" && loggedInUser.level === "100") {
        setIsPaid(true);
      } else {
        setIsPaid(false);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  

  // Logout function clears the user, token, and resets payment status.
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('token');
    setIsPaid(false);
  };

  // Payment function to be called when the user completes payment.
  // Once successful, the payment status is set to true.
  const processPayment = async () => {
    try {
      // Integrate with your payment gateway API here.
      // For demonstration, we simulate a successful payment.
      setIsPaid(true);
      return true;
    } catch (error) {
      console.error('Payment error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, isPaid, registerUser, loginUser, logoutUser, processPayment }}
    >
      {children}
    </AuthContext.Provider>
  );
};
