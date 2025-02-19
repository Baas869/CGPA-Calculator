import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentStatus = () => {
  const { user, setIsPaid } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // ✅ Extract payment reference from URL
  const queryParams = new URLSearchParams(location.search);
  const transactionReference = queryParams.get("paymentReference");

  useEffect(() => {
    if (!transactionReference) {
      toast.error("❌ Missing payment reference! Redirecting to payment page...");
      setTimeout(() => navigate("/payment"), 2000);
      return;
    }

    const verifyPaymentStatus = async () => {
      try {
        toast.info("⏳ Waiting for webhook update...");

        // ✅ Wait 10 seconds before the first check
        await new Promise((resolve) => setTimeout(resolve, 10000));

        toast.info("🔍 Checking payment status...");

        console.log("🛠️ Extracted Payment Reference:", transactionReference);

        // ✅ Construct API request
        const requestUrl = `https://cgpacalculator-0ani.onrender.com/payment/payment/status/?payment_ref=${encodeURIComponent(transactionReference)}`;
        console.log("🔍 Sending GET Request:", requestUrl);

        // ✅ Send GET request to verify payment status
        const response = await axios.get(requestUrl);
        console.log("✅ Payment API Response:", response.data);

        if (response.data && response.data.status) {
          setPaymentStatus(response.data.status);

          if (response.data.status === "paid") {
            setIsPaid(true);
            toast.success("✅ Payment successful! Redirecting to dashboard...");
            setTimeout(() => navigate("/dashboard"), 2000);
          } else if (response.data.status === "pending" && retryCount < 3) {
            // 🔄 Retry every 5 seconds (max 3 times)
            setRetryCount((prev) => prev + 1);
            setTimeout(verifyPaymentStatus, 5000);
          } else {
            toast.warning(`⚠️ Payment status: ${response.data.status}. Redirecting...`);
            setTimeout(() => navigate("/payment"), 3000);
          }
        } else {
          throw new Error("Invalid response from server.");
        }
      } catch (error) {
        console.error("❌ Payment Status Error:", error);
        toast.error("❌ An error occurred while verifying payment. Please try again.");
        setTimeout(() => navigate("/payment"), 3000);
      } finally {
        setLoading(false);
      }
    };

    verifyPaymentStatus();
  }, [transactionReference, navigate, setIsPaid, retryCount]);

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

      {user && (
        <p className="text-lg font-semibold">
          Checking payment for {user.name}...
        </p>
      )}
    </div>
  );
};

export default PaymentStatus;
