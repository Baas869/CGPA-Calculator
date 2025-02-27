import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Offers from '../components/share/Offers';

const Dashboard = () => {
  const { user, isPaid } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Exempt check: if user is "Test student" (case-insensitive) and level "300"
  const isExemptUser =
    user &&
    user.name &&
    user.level &&
    user.name.trim().toLowerCase() === "test student" &&
    user.level.trim() === "300";

  // Extract query parameters (for payment reference, if any)
  const queryParams = new URLSearchParams(location.search);
  const paymentReference = queryParams.get('paymentReference');

  useEffect(() => {
    if (!user) {
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

          {/* Show payment warning and button only for non-exempt users */}
          {!isExemptUser && !isPaid && (
            <>
              <p className="text-red-500 font-semibold">
                ⚠ Payment is required to access premium features.
              </p>
              <button
                onClick={() => navigate(`/payment${location.search}`)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Proceed to Payment
              </button>
            </>
          )}

          <Offers />
        </>
      )}
    </div>
  );
};

export default Dashboard;







// import React, { useContext, useEffect, useState } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { useLocation, useNavigate } from 'react-router-dom';
// import Offers from '../components/share/Offers';


// const Dashboard = () => {
//   const { user, isPaid } = useContext(AuthContext);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);

//   // ✅ Extract query parameters
//   const queryParams = new URLSearchParams(location.search);
//   const paymentReference = queryParams.get('paymentReference');

//   useEffect(() => {
//     if (!user) {
//       navigate(`/login${location.search}`); // ✅ Redirect to login if user is not found
//     } else {
//       setLoading(false);
//     }
//   }, [user, navigate, location.search]);

//   return (
//     <div className="pageContainer">
//       {loading ? (
//         <p className="text-lg font-semibold">Loading dashboard...</p>
//       ) : (
//         <>
//           <h2 className="text-2xl font-bold mb-4">
//             Welcome, {user?.name || 'Guest'}!
//           </h2>

//           {paymentReference && (
//             <p className="text-green-600 font-semibold">
//               ✅ Payment verified! Reference: {paymentReference}
//             </p>
//           )}

//           {!isPaid && (
//             <p className="text-red-500 font-semibold">
//               ⚠ Payment is required to access premium features.
//             </p>
//           )}

//           <Offers />

//           {/* ✅ Button to manually retry payment verification */}
//           {!isPaid && (
//             <button
//               onClick={() => navigate(`/payment${location.search}`)}
//               className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
//             >
//               Proceed to Payment
//             </button>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
