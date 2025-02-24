import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Pusher from "pusher-js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentStatus = () => {
  const { user, setIsPaid } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Extract payment reference from URL using "reference" (as sent by backend)
  const queryParams = new URLSearchParams(location.search);
  const transactionReference = queryParams.get("reference");

  useEffect(() => {
    if (!transactionReference) {
      toast.error("❌ Missing payment reference! Redirecting to payment page...");
      setTimeout(() => navigate("/payment"), 2000);
      return;
    }

    // Initialize Pusher
    Pusher.logToConsole = true; // For development only; remove in production
    const pusher = new Pusher("4e1dd966da8686ac50e2", {
      cluster: "mt1",
    });
    const channel = pusher.subscribe("my-channel");

    // Bind event for payment status updates
    channel.bind("my-event", (data) => {
      console.log("Received Pusher event data:", data);
      // Check if the event corresponds to our payment reference
      if (data.reference === transactionReference) {
        if (data.status === "paid") {
          setIsPaid(true);
          toast.success("✅ Payment successful! Redirecting to dashboard...");
          navigate("/dashboard");
        } else if (data.status === "failed") {
          toast.error("❌ Payment failed! Redirecting to payment page...");
          navigate("/payment");
        }
      }
    });

    // Once the subscription is set up, stop showing loading state
    setLoading(false);

    // Cleanup Pusher subscription on unmount
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [transactionReference, navigate, setIsPaid]);

  return (
    <div className="container mx-auto p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Verifying Payment...</h2>
      {loading ? (
        <p>Please wait while we verify your payment.</p>
      ) : (
        <p className="text-lg font-semibold">
          Waiting for payment status update...
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
