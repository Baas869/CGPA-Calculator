import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Payment = () => {
  const { user, isPaid, setIsPaid } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Extract payment reference from URL query parameters (after Monnify redirects)
  const queryParams = new URLSearchParams(location.search);
  const paymentReference = queryParams.get('reference');

  // ✅ Memoized function to verify payment
  const verifyPayment = useCallback(async (reference) => {
    try {
      setLoading(true);
      toast.info("Verifying your payment...");

      console.log('Verifying Payment with reference:', reference);

      const response = await axios.post(
        'https://cgpacalculator-0ani.onrender.com/payment/payment/verify/',
        { reference },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Payment Verification Response:', response.data);

      if (response.data && response.data.status === 'success') {
        setIsPaid(true);
        toast.success("Payment successful! Redirecting to dashboard...");
        navigate('/dashboard');
      } else {
        toast.error("Payment failed! Please try again.");
        navigate('/payment');
      }
    } catch (error) {
      console.error('Payment verification error:', error.response ? error.response.data : error.message);
      toast.error("An error occurred while verifying payment.");
    } finally {
      setLoading(false);
    }
  }, [navigate, setIsPaid]);

  // ✅ Run `verifyPayment` if the reference is in the URL
  useEffect(() => {
    if (isPaid) {
      navigate('/dashboard');
    }

    if (paymentReference) {
      verifyPayment(paymentReference);
    }
  }, [isPaid, navigate, paymentReference, verifyPayment]);

  // ✅ Function to initiate payment
  const handlePayment = async () => {
    try {
      if (!user || !user.id) {
        console.error('Student ID is missing. Cannot initiate payment.');
        toast.error("User ID missing! Please try logging in again.");
        return;
      }

      setLoading(true);
      toast.info("Generating your payment link...");

      // Convert user ID to string
      const studentIdString = String(user.id);

      console.log('Sending Payment Request:', { student_id: studentIdString });

      const response = await axios.post(
        'https://cgpacalculator-0ani.onrender.com/payment/payment/initiate',
        { student_id: studentIdString },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('Payment API Response:', response.data);

      if (response.data && response.data.payment_link) {
        toast.success("Redirecting to payment gateway...");
        window.location.href = response.data.payment_link;
      } else {
        toast.error("Failed to generate payment link! Please try again.");
      }
    } catch (error) {
      console.error('Payment error:', error.response ? error.response.data : error.message);
      toast.error("An error occurred while initiating payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>
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
