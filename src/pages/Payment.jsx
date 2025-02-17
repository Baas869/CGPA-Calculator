import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const { user, isPaid, setIsPaid } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Extract reference from URL query parameters after redirection from Monnify
  const queryParams = new URLSearchParams(location.search);
  const paymentReference = queryParams.get('reference');

  useEffect(() => {
    // If payment is already processed, redirect immediately.
    if (isPaid) {
      navigate('/dashboard');
    }

    // If there's a payment reference, verify payment
    if (paymentReference) {
      verifyPayment(paymentReference);
    }
  }, [isPaid, navigate, paymentReference]);

  const handlePayment = async () => {
    try {
      if (!user || !user.id) {
        console.error('Student ID is missing. Cannot initiate payment.');
        return;
      }

      setLoading(true);
      setErrorMessage('');

      // Convert user ID to string
      const studentIdString = String(user.id);

      console.log('Sending Payment Request:', { student_id: studentIdString });

      // Send request to initiate payment
      const response = await axios.post(
        'https://cgpacalculator-0ani.onrender.com/payment/payment/initiate',
        { student_id: studentIdString },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Payment API Response:', response.data);

      if (response.data && response.data.payment_link) {
        // Redirect user to the payment gateway
        window.location.href = response.data.payment_link;
      } else {
        setErrorMessage('Payment link could not be generated. Try again.');
        console.error('Payment link not generated:', response.data);
      }
    } catch (error) {
      console.error('Payment error:', error.response ? error.response.data : error.message);
      setErrorMessage('An error occurred while initiating payment. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (reference) => {
    try {
      setLoading(true);
      setErrorMessage('');

      console.log('Verifying Payment with reference:', reference);

      const response = await axios.post(
        'https://cgpacalculator-0ani.onrender.com/payment/payment/verify/',
        { reference },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Payment Verification Response:', response.data);

      if (response.data && response.data.status === 'success') {
        setIsPaid(true);
        navigate('/dashboard');
      } else {
        setErrorMessage('Payment was not successful. Please try again.');
        navigate('/payment');
      }
    } catch (error) {
      console.error('Payment verification error:', error.response ? error.response.data : error.message);
      setErrorMessage('An error occurred while verifying payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <p>
        Hello, <strong>{user?.name}</strong>! Please complete your payment of <strong>500 Naira</strong> to access the features.
      </p>
      <p>Click "Proceed to Payment" to be redirected to the Monnify payment gateway.</p>
      <button
        onClick={handlePayment}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Proceed to Payment'}
      </button>
    </div>
  );
};

export default Payment;
