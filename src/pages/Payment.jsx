import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Payment = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ Make sure this is used in handlePayment
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    try {
      if (!user || !user.id) {
        toast.dismiss(); // Remove previous notifications
        toast.error("User ID missing! Please log in again.");
        navigate("/login"); // ✅ Now navigate is used
        return;
      }

      setLoading(true);
      toast.dismiss(); // Remove previous notifications
      toast.info("Generating your payment link...");

      // Convert user ID to string
      const studentIdString = String(user.id);

      console.log("Sending Payment Request:", { student_id: studentIdString });

      const response = await axios.post(
        "https://cgpacalculator-0ani.onrender.com/payment/payment/initiate",
        { student_id: studentIdString },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Payment API Response:", response.data);

      if (response.data && response.data.payment_link) {
        toast.dismiss(); // Remove previous notifications
        toast.success("Redirecting to Monnify...");
        window.location.href = response.data.payment_link;
      } else {
        toast.dismiss(); // Remove previous notifications
        toast.error("Failed to generate payment link! Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error.response ? error.response.data : error.message);
      toast.dismiss(); // Remove previous notifications
      toast.error("An error occurred while initiating payment. Please refresh and login again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>
      <p>Hello, <strong>{user?.name}</strong>! Please complete your payment of <strong>500 Naira</strong>.</p>
      <p>Click "Proceed to Payment" to be redirected to Monnify.</p>

      <button
        onClick={handlePayment}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4 w-full max-w-sm"
        disabled={loading}
      >
        {loading ? "Processing..." : "Proceed to Payment"}
      </button>
    </div>
  );
};

export default Payment;
