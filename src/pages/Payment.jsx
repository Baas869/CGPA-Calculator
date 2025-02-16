import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const { isPaid, processPayment } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If payment is already processed, redirect immediately.
    if (isPaid) {
      navigate('/dashboard');
    }
  }, [isPaid, navigate]);

  const handlePayment = async () => {
    try {
      // Call processPayment to get the Monnify payment URL
      const paymentLink = await processPayment();
      if (paymentLink) {
        // Redirect the user to the Monnify payment gateway
        window.location.href = paymentLink;
      } else {
        console.error('Payment link not generated');
      }
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>
      <p>
        Please complete your payment of <strong>500 Naira</strong> to access the features.
      </p>
      <p>
        Click "Continue for Payment" to be redirected to the Monnify payment gateway.
      </p>
      <button
        onClick={handlePayment}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Continue for Payment
      </button>
    </div>
  );
};

export default Payment;
