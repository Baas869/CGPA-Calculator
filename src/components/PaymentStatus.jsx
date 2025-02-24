import React from "react";
import { useLocation } from "react-router-dom";
import PaymentStatusListener from "../context/PaymentStatusListener";

const PaymentStatus = () => {
  const location = useLocation();
  // Assuming the backend redirects with ?reference=...
  const queryParams = new URLSearchParams(location.search);
  const paymentReference = queryParams.get("reference");

  return (
    <div className="container mx-auto p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Verifying Payment...</h2>
      <p>Please wait while we verify your payment status.</p>
      {/* Render the listener so it can capture Pusher events */}
      <PaymentStatusListener paymentReference={paymentReference} />
    </div>
  );
};

export default PaymentStatus;
