import React, { createContext, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from './components/Footer';


// Create a Context for auth and payment status
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);    // Stores the logged-in user
  const [isPaid, setIsPaid] = useState(false); // Stores the payment status

  return (
    <AuthContext.Provider value={{ user, setUser, isPaid, setIsPaid }}>
      {children}
    </AuthContext.Provider>
  );
};

// PrivateRoute checks if user is logged in and has completed payment
const PrivateRoute = ({ children }) => {
  const { user, isPaid } = useContext(AuthContext);

  // Redirect to login if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect to payment if user hasn't paid
  if (!isPaid) {
    return <Navigate to="/payment" />;
  }

  // If both conditions are met, render the child component
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                {/* Default route redirects to Dashboard */}
                {/* <Route path="/dashboard" element={<Navigate to="/dashboard" />} /> */}
                <Route path='/' element={<Home />} />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/payment" element={<Payment />} />

                {/* Dashboard is protected by PrivateRoute */}
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />

                {/* 404 Route */}
                <Route path="*" element={<div>404 - Page Not Found</div>} />
              </Routes>
            </main>
            <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;























// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Dashboard from "./components/Dashboard";
// import Register from './pages/Register'
// import Home from "./pages/Home";
// import Header from "./components/Header";
// import Footer from './components/Footer';
// // import Navbar from "./components/share/Navbar";

// function App() {
//   return (
//     <>
//       <Router>
//         <div className="flex flex-col min-h-screen">
//           <Header />
//           <main className="flex-grow">
//             <Routes>
//               <Route path='/' element={<Home />} />
//               <Route path='/dashboard' element={<Dashboard />} />
//               <Route path='/register' element={<Register />} />
//             </Routes>
//           </main>
//           <Footer />
//         </div>
//       </Router>
//     </>
//   );
// }

// export default App;
