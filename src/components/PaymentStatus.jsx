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

  // ✅ Extract transactionReference from URL (Monnify sends `paymentReference`)
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
        toast.info("Verifying payment...");

        console.log("Verifying Payment with reference:", transactionReference);

        const response = await axios.post(
          "https://your-backend-domain.com/payment/webhook/",
          { reference: transactionReference }, // ✅ Send the correct reference
          { headers: { "Content-Type": "application/json" } }
        );

        console.log("Payment Verification Response:", response.data);

        if (response.data && response.data.status === "success") {
          setIsPaid(true);
          toast.success("Payment successful! Redirecting...");
          navigate("/dashboard");
        } else {
          toast.error("Payment failed! Please try again.");
          navigate("/payment");
        }
      } catch (error) {
        console.error("Payment verification error:", error.response ? error.response.data : error.message);
        toast.error("Error verifying payment.");
        navigate("/payment");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [transactionReference, navigate, setIsPaid]);

  return (
    <div className="container mx-auto p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Verifying Payment...</h2>
      {loading ? <p>Please wait while we verify your payment.</p> : <p>Redirecting...</p>}
    </div>
  );
};

export default PaymentStatus;
