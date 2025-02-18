import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentStatus = () => {
  const { setIsPaid } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Extract paymentReference from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const transactionReference = queryParams.get("paymentReference");

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      if (!transactionReference) {
        toast.error("Missing payment reference! Redirecting to payment page.");
        navigate("/payment");
        return;
      }

      try {
        toast.info("Verifying your payment, please wait...");
        
        // Log extracted reference
        console.log("🛠️ Extracted Payment Reference:", transactionReference);
        
        // Encode reference to handle special characters
        const encodedReference = encodeURIComponent(transactionReference);
        const requestUrl = `https://cgpacalculator-0ani.onrender.com/payment/payment/status/?payment_ref=${encodedReference}`;

        console.log("🔍 Payment Verification Request:", requestUrl);

        // Send GET request with query params
        const response = await axios.get(requestUrl);

        console.log("✅ Payment API Response:", response.data);

        // Handle response
        if (response.data && response.data.status === "paid") {
          setIsPaid(true);
          toast.success("Payment successful! Redirecting to dashboard...");
          setTimeout(() => navigate("/dashboard"), 2000);
        } else {
          toast.error(`Payment status: ${response.data.status}. Please try again.`);
          setTimeout(() => navigate("/payment"), 2000);
        }
      } catch (error) {
        console.error("❌ Payment Status Error:", error);
        
        if (error.response) {
          console.error("🚨 Error Response Data:", error.response.data);
          console.error("📌 Error Status:", error.response.status);
          console.error("📩 Error Headers:", error.response.headers);
        } else {
          console.error("⚠️ Error Message:", error.message);
        }

        toast.error("An error occurred while verifying payment. Please try again.");
        setTimeout(() => navigate("/payment"), 2000);
      } finally {
        setLoading(false);
      }
    };

    verifyPaymentStatus();
  }, [transactionReference, navigate, setIsPaid]);

  return (
    <div className="container mx-auto p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Verifying Payment...</h2>
      {loading ? (
        <p>Please wait while we verify your payment.</p>
      ) : (
        <p>Redirecting...</p>
      )}
    </div>
  );
};

export default PaymentStatus;
