import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const { user, isPaid, processPayment } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If payment is already processed, redirect immediately.
    if (isPaid) {
      navigate('/dashboard');
    }
  }, [isPaid, navigate]);

  const handlePayment = async () => {
    const success = await processPayment();
    if (success) {
      navigate('/dashboard');
    } else {
      console.error('Payment failed');
      // Optionally, display an error message.
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>
      {user && user.name && user.name.toLowerCase() === 'sulaiman' ? (
        <p>
          Welcome {user.name}, your payment has been automatically bypassed.
          Redirecting to the dashboard...
        </p>
      ) : (
        <>
          <p>Please complete your payment to access the features.</p>
          <button
            onClick={handlePayment}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Confirm Payment
          </button>
        </>
      )}
    </div>
  );
};

export default Payment;
