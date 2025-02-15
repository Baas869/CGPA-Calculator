import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="bg-[#00994D] text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="/">Baas Tech</Link>
        </div>
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => isActive ? "text-white font-bold" : "hover:text-gray-200 text-black"}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => isActive ? "text-white font-bold" : "hover:text-gray-200 text-black"}
              >
                Features
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => isActive ? "text-white font-bold" : "hover:text-gray-200 text-black"}
              >
                About
              </NavLink>
            </li>
          </ul>
        </nav>
        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="focus:outline-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-[#00994D]">
          <ul className="px-4 pb-4 space-y-2">
            <li>
              <NavLink 
                to="/" 
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => isActive ? "block text-white font-bold" : "block hover:text-gray-200 text-black"}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/features" 
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => isActive ? "block text-white font-bold" : "block hover:text-gray-200 text-black"}
              >
                Features
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/about" 
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => isActive ? "block text-white font-bold" : "block hover:text-gray-200 text-black"}
              >
                About
              </NavLink>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
