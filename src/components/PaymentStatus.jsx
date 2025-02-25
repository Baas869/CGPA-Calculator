import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentStatus = () => {
  const { user, setUser, setIsPaid } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Rehydrate user from localStorage if missing
  useEffect(() => {
    if (!user) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [user, setUser]);

  // Extract payment reference from URL using "paymentReference"
  const queryParams = new URLSearchParams(location.search);
  const transactionReference = queryParams.get("paymentReference");

  useEffect(() => {
    if (!transactionReference) {
      toast.dismiss();
      toast.error("❌ Missing payment reference! Redirecting to payment page...");
      setTimeout(() => navigate("/payment"), 2000);
      return;
    }

    const verifyPaymentStatus = async () => {
      try {
        toast.dismiss();
        toast.info("⏳ Waiting 5 seconds for payment processing...");
        // Wait 5 seconds before the check
        await new Promise((resolve) => setTimeout(resolve, 5000));

        console.log("🛠️ Checking Payment Reference:", transactionReference);

        // Construct API request URL using the new endpoint format
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
  }, [transactionReference, navigate, setIsPaid]);

  return (
    <div className="container mx-auto p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Verifying Payment...</h2>
      {loading ? (
        <p>Please wait while we verify your payment.</p>
      ) : (
        <p className="text-lg font-semibold">Redirecting...</p>
      )}
      {user && (
        <p className="text-lg font-semibold">Checking payment for {user.name}...</p>
      )}
    </div>
  );
};

export default PaymentStatus;
