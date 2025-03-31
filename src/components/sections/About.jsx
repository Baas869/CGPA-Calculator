import React from 'react';
import bg from "../../assets/bg1.jpg";

const About = () => {
  return (
    <section id='about' className="relative my-9 overflow-hidden h-screen flex items-center w-full">
      <div 
        className="absolute inset-0 -z-20 w-full h-full bg-cover bg-center bg-fixed" 
        style={{ backgroundImage: `url(${bg})` }} 
      ></div>

      <div className="absolute inset-0 -z-10 w-full h-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full absolute top-0 left-0">
          <polygon points="0,0 100,0 50,50" className="fill-white" />
          
          <polygon points="0,0 100,100 0,100" className="fill-[#001F3F]/90" />
          <polygon points="100,0 0,100 100,100" className="fill-[#001F3F]/90" />
        </svg>
      </div>
      
      <div className="container mx-auto px-6 relative text-center w-full">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary-color ">
          About <span className='text-link-primary-color'>CGPA</span>
        </h1>
        <p className="text-[1rem] sm:text-lg text-gray-200 leading-relaxed max-w-3xl mx-auto mt-40 pt-20 sm:mt-40">
          CGPA (Cumulative Grade Point Average) is a measure of a student's academic performance 
          across multiple semesters. It is calculated by averaging the grade points obtained in 
          all courses taken during the study period. CGPA is crucial in assessing student progress, 
          determining eligibility for scholarships, and influencing future career or educational 
          opportunities. A higher CGPA often indicates consistent academic excellence, while a 
          lower CGPA may highlight areas for improvement.
        </p>
      </div>
    </section>
  );
};

export default About;
