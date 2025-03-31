import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spiner from "../components/share/Spiner";

const Payment = () => {
  const { user, setIsPaid } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    // Exemption check: if user is "Test Student" with level "300"
    if (
      user &&
      user.name &&
      user.level &&
      user.name.trim().toLowerCase() === "test student" &&
      user.level.trim() === "300"
    ) {
      toast.dismiss();
      toast.success("You are exempt from payment! Redirecting to dashboard...");
      setIsPaid(true);
      setTimeout(() => navigate("/dashboard"), 2000);
      return;
    }

    try {
      if (!user || !user.id) {
        toast.dismiss();
        toast.error("User ID missing! Please log in again.");
        navigate("/login");
        return;
      }

      setLoading(true);
      toast.dismiss();
      toast.info("Generating your payment link...");

      // Convert user ID to a number
      const studentId = Number(user.id);

      const response = await axios.post(
        "https://cgpacalculator-0ani.onrender.com/payment/payment/initiate",
        { student_id: studentId },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data && response.data.payment_link) {
        toast.dismiss();
        toast.success("Redirecting to Monnify...");
        window.location.href = response.data.payment_link;
      } else {
        toast.dismiss();
        toast.error("Failed to generate payment link! Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error.response ? error.response.data : error.message);
      toast.dismiss();
      toast.error("An error occurred while initiating payment. Please refresh and log in again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 text-center">
      <h2 className="text-3xl font-bold mb-4 text-primary-color">
        Welcome to <span className='text-link-primary-color'>AI CGPA Calculator</span>
      </h2>
      <p className="text-xl mb-2">
        Hello, <strong>{user?.name}</strong>!
      </p>
      <p className="text-lg text-gray-700 mb-4">
        Our AI-powered CGPA Calculator and Prediction tool is designed to help you track your academic performance and plan for your future. To unlock full features—including accurate CGPA predictions and personalized improvement suggestions—a fee of <strong>500 Naira</strong> is required.
      </p>
      <p className="text-base text-gray-600 mb-6 border-b border-gray-300 border-opacity-50 pb-2">
        Investing in your education is the first step toward success. Complete your payment to access your personalized dashboard, receive tailored advice, and stay motivated on your journey to excellence!
      </p>
      <div className="flex flex-col items-center">
        <button
          onClick={handlePayment}
          className="bg-btn-primary-color hover:bg-btn-hover-color text-primary-color font-bold py-3 px-6 rounded w-full max-w-sm"
          disabled={loading}
        >
          {loading ? "Processing Payment..." : "Proceed to Payment"}
        </button>
        {loading && (
          <div className="mt-2">
            <Spiner />
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;