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
  const [paymentStatus, setPaymentStatus] = useState(null);

  // Extract payment reference from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const transactionReference = queryParams.get("paymentReference");

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      if (!transactionReference) {
        toast.error("❌ Missing payment reference! Redirecting to payment page...");
        setTimeout(() => navigate("/payment"), 2000);
        return;
      }

      try {
        toast.info("🔍 Verifying your payment, please wait...");

        console.log("🛠️ Extracted Payment Reference:", transactionReference);
        
        // Encode reference to handle special characters
        const encodedReference = encodeURIComponent(transactionReference);
        const requestUrl = `https://cgpacalculator-0ani.onrender.com/payment/payment/status/?payment_ref=${encodedReference}`;

        console.log("🔍 Sending Payment Verification Request:", requestUrl);

        // Send GET request to verify payment status
        const response = await axios.get(requestUrl);

        console.log("✅ Payment API Response:", response.data);

        if (response.data && response.data.status) {
          setPaymentStatus(response.data.status);

          if (response.data.status === "paid") {
            setIsPaid(true);
            toast.success("✅ Payment successful! Redirecting to dashboard...");
            setTimeout(() => navigate("/dashboard"), 2000);
          } else if (response.data.status === "pending") {
            toast.warning("⚠️ Payment is still pending. Please wait or try again.");
            setTimeout(() => navigate("/payment"), 3000);
          } else if (response.data.status === "refunded") {
            toast.info("💰 Payment has been refunded. Contact support if needed.");
            setTimeout(() => navigate("/payment"), 4000);
          } else {
            toast.error(`❌ Payment status: ${response.data.status}. Please try again.`);
            setTimeout(() => navigate("/payment"), 3000);
          }
        } else {
          throw new Error("Invalid response from server.");
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

        toast.error("❌ An error occurred while verifying payment. Please try again.");
        setTimeout(() => navigate("/payment"), 3000);
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
        <p className="text-lg font-semibold">
          {paymentStatus ? `Payment Status: ${paymentStatus}` : "Redirecting..."}
        </p>
      )}
    </div>
  );
};

export default PaymentStatus;
