import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Offers from '../components/share/Offers';

const Dashboard = () => {
  const { user, isPaid } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Define exempt user criteria: "Test Student" with level "300"
  const exemptUser =
    user &&
    user.name &&
    user.level &&
    user.name.trim().toLowerCase() === "test student" &&
    user.level.trim() === "300";

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const paymentReference = queryParams.get('paymentReference');

  useEffect(() => {
    if (!user) {
      // Redirect to login with preserved query parameters if user is not available.
      navigate(`/login${location.search}`);
    } else {
      setLoading(false);
    }
  }, [user, navigate, location.search]);

  return (
    <div className="pageContainer p-4">
      {loading ? (
        <p className="text-lg font-semibold">Loading dashboard...</p>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">
            Welcome, {user?.name || 'Guest'}!
          </h2>

          {paymentReference && (
            <p className="text-green-600 font-semibold">
              ✅ Payment verified! Reference: {paymentReference}
            </p>
          )}

          {/* Only show payment warning if the user is not exempt */}
          {(!isPaid && !exemptUser) && (
            <p className="text-red-500 font-semibold">
              ⚠ Payment is required to access premium features.
            </p>
          )}

          <Offers />

          {/* Only show the payment button if payment is required */}
          {(!isPaid && !exemptUser) && (
            <button
              onClick={() => navigate(`/payment${location.search}`)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Proceed to Payment
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
