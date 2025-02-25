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
  const [retryCount, setRetryCount] = useState(0);

  // Extract payment reference from URL using "reference"
  const queryParams = new URLSearchParams(location.search);
  const transactionReference = queryParams.get("reference");

  useEffect(() => {
    if (!transactionReference) {
      toast.dismiss();
      toast.error("❌ Missing payment reference! Redirecting to payment page...");
      setTimeout(() => navigate("/payment"), 2000);
      return;
    }

    const verifyPaymentStatus = async () => {
      try {
        // On the first attempt, wait 10 seconds
        if (retryCount === 0) {
          toast.dismiss();
          toast.info("⏳ Waiting for payment processing...");
          await new Promise((resolve) => setTimeout(resolve, 10000));
        }

        console.log("🛠️ Verifying Payment Reference:", transactionReference);

        // Construct API request using the new endpoint with payment_reference in the URL
        const requestUrl = `https://cgpacalculator-0ani.onrender.com/payment/payment/verify/${encodeURIComponent(transactionReference)}`;
        console.log("🔍 Sending GET Request:", requestUrl);

        // Send GET request to verify payment status
        const response = await axios.get(requestUrl);
        console.log("✅ Payment API Response:", response.data);

        if (response.data && response.data.message) {
          const msg = response.data.message;
          if (msg === "Payment successful, you can now access services.") {
            toast.dismiss();
            setIsPaid(true);
            toast.success("✅ Payment successful! Redirecting to dashboard...");
            setTimeout(() => navigate("/dashboard"), 2000);
          } else if (msg === "Payment not successful, please try again.") {
            toast.dismiss();
            toast.error("❌ Payment not successful. Redirecting to payment page...");
            setTimeout(() => navigate("/payment"), 3000);
          } else if (retryCount < 10) {
            // If the message isn't one of the two expected ones (perhaps still processing), retry after 5 seconds
            setRetryCount((prev) => prev + 1);
            setTimeout(verifyPaymentStatus, 5000);
          } else {
            toast.dismiss();
            toast.warning("⚠️ Payment status unclear. Redirecting to payment...");
            setTimeout(() => navigate("/payment"), 3000);
          }
        } else {
          throw new Error("Invalid response from server.");
        }
      } catch (error) {
        console.error("❌ Payment Status Error:", error);
        toast.dismiss();
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
        <p className="text-lg font-semibold">Redirecting...</p>
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
