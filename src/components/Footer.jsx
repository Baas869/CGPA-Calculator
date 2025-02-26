import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#00994D] text-gray-200">
      <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p>&copy; {new Date().getFullYear()} Baas Tech. All rights reserved.</p>
        </div>
        <div className="flex space-x-4">
          <Link to="/" className="hover:text-white">
            Privacy Policy
          </Link>
          <Link to="/" className="hover:text-white">
            Terms of Service
          </Link>
          <Link to="/" className="hover:text-white">
            Support
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
