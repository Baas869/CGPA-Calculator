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
    const verifyPayment = async () => {
      if (!transactionReference) {
        toast.error("Missing payment reference! Redirecting to payment page.");
        navigate("/payment");
        return;
      }

      try {
        toast.info("Verifying your payment, please wait...");
        console.log("Verifying Payment with reference:", transactionReference);

        // Build the payload as expected by your backend:
        const payload = {
          eventType: "SUCCESSFUL_TRANSACTION",
          eventData: {
            transactionReference: transactionReference,
            amountPaid: "500"
          }
        };

        const response = await axios.post(
          "https://cgpacalculator-0ani.onrender.com/payment/payment/verify/",
          payload,
          { headers: { "Content-Type": "application/json" } }
        );

        console.log("Payment Verification Response:", response.data);

        // Check if the response indicates a successful update
        if (response.data && response.data.message === "Payment status updated") {
          setIsPaid(true);
          toast.success("Payment successful! Redirecting to dashboard...");
          setTimeout(() => navigate("/dashboard"), 2000);
        } else {
          toast.error("Payment verification failed! Please try again.");
          setTimeout(() => navigate("/payment"), 2000);
        }
      } catch (error) {
        console.error(
          "Payment verification error:",
          error.response ? error.response.data : error.message
        );
        toast.error("An error occurred while verifying payment.");
        setTimeout(() => navigate("/payment"), 2000);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
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
