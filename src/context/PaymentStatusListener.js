import React, { useEffect } from "react";
import Pusher from "pusher-js";
import { useNavigate } from "react-router-dom";

const PaymentStatusListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Enable Pusher logging in development mode
    Pusher.logToConsole = true;

    // Initialize Pusher
    const pusher = new Pusher("4e1dd966da8686ac50e2", {
      cluster: "mt1",
    });

    // Subscribe to the channel
    const channel = pusher.subscribe("my-channel");

    // Listen for the event
    channel.bind("my-event", (data) => {
      console.log("Received payment update:", data);
      alert(`Payment Update: ${JSON.stringify(data)}`);

      if (data.status === "paid") {
        navigate("/dashboard");
      } else if (data.status === "failed") {
        navigate("/payment");
      }
    });

    // Cleanup on unmount
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [navigate]);

  return null; // This component doesn't render anything
};

export default PaymentStatusListener;
