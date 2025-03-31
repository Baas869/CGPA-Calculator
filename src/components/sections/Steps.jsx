import React from "react";
import { FaGlobe, FaMoneyBillWave, FaCalculator, FaChartLine } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";
import { TbHandClick } from "react-icons/tb";

const steps = [
  { id: 1, icon: <FaGlobe className="text-5xl text-blue-600 mx-auto" />, title: "Visit the Website", description: "Open the CGPA calculator website to get started." },
  { id: 2, icon: <TbHandClick className="text-5xl text-green-600 mx-auto" />, title: "Click 'Get Started'", description: "Click the 'Get Started' button to begin using the calculator." },
  { id: 3, icon: <MdAccountCircle className="text-5xl text-purple-600 mx-auto" />, title: "Create Account / Login", description: "Sign up for a new account or log in if you already have one." },
  { id: 4, icon: <FaMoneyBillWave className="text-5xl text-yellow-500 mx-auto" />, title: "Make Payment", description: "Choose a plan and complete the payment process." },
  { id: 5, icon: <FaCalculator className="text-5xl text-red-500 mx-auto" />, title: "Calculate Your GPA", description: "Enter your grades and credits to calculate your GPA." },
  { id: 6, icon: <FaChartLine className="text-5xl text-indigo-500 mx-auto" />, title: "Predict Your CGPA", description: "Use the prediction tool to forecast your academic performance." }
];

const Steps = () => {
  return (
    <section id="steps" className="container mx-auto my-10 px-6">
      <h2 className="text-4xl font-bold text-center mb-10 text-primary-color">How It <span className="text-link-primary-color">Works</span></h2>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16">
        {steps.map((step, index) => (
          <div key={step.id} className="group relative text-center p-6 border border-gray-200 rounded-lg shadow-md bg-white 
            transition-transform transform hover:-translate-y-2 hover:shadow-xl cursor-pointer">

            {step.icon}
            <h3 className="text-xl font-semibold mt-4">{step.title}</h3>
            <p className="text-secondary-text mt-2">{step.description}</p>

            <div className="hidden sm:block">
              {index < steps.length - 1 && index % 3 !== 2 && (
                <svg 
                  className="absolute left-full top-1/2 transform -translate-y-1/2 w-16 h-4 text-gray-400 group-hover:text-link-primary-color transition-colors duration-300 hidden md:block"
                  viewBox="0 0 64 16" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M0 8H60" stroke="currentColor" strokeWidth="2" />
                  <path d="M56 4L64 8L56 12" fill="currentColor" />
                </svg>
              )}
              
              {index % 2 === 0 && index < steps.length - 1 && index !== 1 && index !== 3 && index !== 5 && (
                <svg 
                    className="absolute left-full top-1/2 transform -translate-y-1/2 w-16 h-4 text-gray-400 group-hover:text-blue-600 transition-colors duration-300 sm:block md:hidden"
                    viewBox="0 0 64 16" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M0 8H60" stroke="currentColor" strokeWidth="2" />
                    <path d="M56 4L64 8L56 12" fill="currentColor" />
                </svg>
                )}
            </div>

            <div className="block sm:hidden">
              {index < steps.length - 1 && (
                <svg 
                  className="absolute left-1/2 bottom-[-30px] transform -translate-x-1/2 w-4 h-10 text-gray-400 group-hover:text-blue-600 transition-colors duration-300"
                  viewBox="0 0 16 40" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8 0V32" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 28L8 36L12 28" fill="currentColor" />
                </svg>
              )}
            </div>

          </div>
        ))}
      </div>
    </section>
  );
};

export default Steps;