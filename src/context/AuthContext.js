import React, { createContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isPaid, setIsPaid] = useState(false);

  // Register user and automatically log them in.
  // After registration, the calling component should direct the user to the dashboard.
  // The payment status (isPaid) remains false until the user completes payment.
  const registerUser = async (userData) => {
    try {
      // Replace with your actual registration API endpoint.
      const response = await axios.post('http://localhost:5000/users', userData);
      
      // Assuming your API returns the registered user data and an auth token.
      const { user: registeredUser, token } = response.data;
      
      // Set the user in context to automatically log them in.
      setUser(registeredUser);
      
      // Store the token in local storage.
      localStorage.setItem('token', token);
      
      // Payment status remains false by default.
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Login function that fetches all users from the API and verifies if the credentials match.
  // If successful, a dummy token is generated and the user is logged in.
  // If the user is "Baas" with number "100", automatically mark as paid.
  const loginUser = async (credentials) => {
    try {
      // Fetch the list of registered users.
      const response = await axios.get('http://localhost:5000/users');
      const users = response.data;
      
      // Check if a user with the provided name and number exists.
      const matchedUser = users.find(
        (u) => u.name === credentials.name && u.number === credentials.number
      );

      if (matchedUser) {
        // Simulate token generation.
        const token = 'dummy-token';
        setUser(matchedUser);
        localStorage.setItem('token', token);

        // If the user is "Baas" with number "100", automatically mark payment as complete.
        if (matchedUser.name === "Baas" && matchedUser.number === "100") {
          setIsPaid(true);
        } else {
          setIsPaid(false);
        }

        return { user: matchedUser, token };
      } else {
        throw new Error('Invalid credentials');
      }
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

  // Payment function that should be called when the user completes payment.
  // Once successful, the payment status is set to true.
  // Until isPaid is true, your dashboard components can be disabled.
  const processPayment = async () => {
    try {
      // Integrate with your payment gateway API here.
      // For this demo, we simulate a successful payment.
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
