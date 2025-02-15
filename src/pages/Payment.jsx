import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const Payment = () => {
  const { setIsPaid } = useContext(AuthContext);
  const navigate = useNavigate();

  const handlePayment = () => {
    // Simulate payment confirmation
    setIsPaid(true);
    // After payment, direct the user to the Dashboard
    navigate("/dashboard");
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>
      {/* Display payment details and instructions */}
      <p>Please complete your payment to access the dashboard.</p>
      <button 
        onClick={handlePayment}
        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Confirm Payment
      </button>
    </div>
  );
};

export default Payment;
