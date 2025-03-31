import React from 'react';

import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Steps from '../components/sections/Steps';
import Team from '../components/sections/Team';
import Contact from '../components/sections/Contact';


const Home = () => {

  return (
    <div className="flex flex-col min-h-screen">
      <main className="">
      <Hero />
      <About />
      <Steps />
      <Team />
      <Contact />
      </main>
    </div>
  );
};

export default Home;
