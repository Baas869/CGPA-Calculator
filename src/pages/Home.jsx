import React from 'react';
import { Link } from 'react-router-dom';

// Import images and icons
import homeImage from '../assets/home-image.jpg';
import {ReactComponent as IconUser} from '../assets/svg/icon-user.svg';
import {ReactComponent as IconPayment} from '../assets/svg/icon-payments.svg';
import {ReactComponent as IconPrediction} from '../assets/svg/icon-prediction.svg';

const Home = () => {

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="hero bg-gray-100 py-12">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mr-4">
              <h1 className="text-4xl font-bold mb-4">
                Welcome to CGPA Calculator & Prediction
              </h1>
              <p className="mb-6 text-justify">
                Welcome to CGPA Calculator & Prediction, an innovative platform designed to help students track, calculate, and predict their academic performance with ease. <br/>Our mission is to simplify grade management by providing an intuitive tool that enables students to compute their Cumulative Grade Point Average (CGPA) accurately while offering insights into future performance trends.

                <br/>With features like automated GPA calculations, predictive analysis, and historical performance tracking, our platform empowers students to set academic goals and make informed decisions. We also integrate a one-time payment system to ensure seamless access to our premium services.

                Join us in taking control of your academic journey today! 🚀

              </p>
              <div className="flex space-x-4">
              <button                
                className="bg-[#00cc66] hover:bg-[rgba(0,204,102,0.7)] text-white font-bold py-2 px-4 rounded transition duration-200"
              >
                <Link to='/dashboard'>Get Started</Link>
              </button>
                {/* <IconUser className="w-16 h-16 text-[#00cc66]" />
                <IconPayment className="w-16 h-16 text-[#00cc66]" />
                <IconPrediction className="w-16 h-16 text-[#00cc66]" /> */}
              </div>
            </div>
            <div className="md:w-1/2 mt-6 md:mt-0">
              <img src={homeImage} alt="CGPA Calculator Visual" className="rounded shadow-lg" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Our Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="feature-card p-4 border rounded shadow">
                <IconUser className="w-[4.5rem] h-[3.5rem] mx-auto mb-4 text-[#00cc66] "/>
                <h3 className="text-xl font-semibold text-center">User Management</h3>
                <p className="text-center">
                  Easy registration, login, and secure session management.
                </p>
              </div>
              <div className="feature-card p-4 border rounded shadow">
                <IconPayment className="w-[4.5rem] h-[3.5rem] mx-auto mb-4 text-[#00cc66]"/>
                <h3 className="text-xl font-semibold text-center">Payment Integration</h3>
                <p className="text-center">
                  Secure payment processing via Monnify API to unlock services.
                </p>
              </div>
              <div className="feature-card p-4 border rounded shadow">
                <IconPrediction className="w-[4.5rem] h-[3.5rem] mx-auto mb-4 text-[#00cc66]"/>
                <h3 className="text-xl font-semibold text-center">CGPA Prediction</h3>
                <p className="text-center">
                  Accurate future CGPA predictions using linear regression.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;





// import React from 'react';
// import Dashboard from '../components/Dashboard'
// function Home() {
//   return (
//     <div>
//       <Dashboard />
//     </div>
//   )
// }

// export default Home