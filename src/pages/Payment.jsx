import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const { user, isPaid, setIsPaid } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If payment is already processed, redirect immediately.
    if (isPaid) {
      navigate('/dashboard');
    }
  }, [isPaid, navigate]);

  const handlePayment = async () => {
    try {
      if (!user || !user.id) {
        console.error('Student ID is missing. Cannot initiate payment.');
        return;
      }

      // Convert user ID to a string and format the request payload
      const studentIdString = String(user.id);
      const payload = { student_id: studentIdString };

      console.log('Sending Payment Request:', payload);

      // Send the request with the correct payload
      const response = await axios.post(
        'https://cgpacalculator-0ani.onrender.com/payment/payment/initiate',
        payload, // Send student_id as a string
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Payment API Response:', response.data);

      if (response.data && response.data.payment_link) {
        // Redirect user to the Monnify payment gateway
        window.location.href = response.data.payment_link;
      } else {
        console.error('Payment link not generated:', response.data);
      }
    } catch (error) {
      console.error('Payment error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>
      <p>
        Hello, <strong>{user?.name}</strong>! Please complete your payment of <strong>500 Naira</strong> to access the features.
      </p>
      <p>
        Click "Proceed to Payment" to be redirected to the Monnify payment gateway.
      </p>
      <button
        onClick={handlePayment}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default Payment;
