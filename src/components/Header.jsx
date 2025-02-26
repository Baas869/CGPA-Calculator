import React, { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ReactComponent as Logo } from '../logo.svg';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <header className="bg-[#00994D] text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="/"><Logo className="w-16 h-16" /></Link>
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
              {user ? (
                <button onClick={handleLogout} className="focus:outline-none" title="Logout">
                  <FaSignOutAlt className="w-6 h-6" />
                </button>
              ) : (
                <Link to="/login" title="Login">
                  <FaSignInAlt className="w-6 h-6" />
                </Link>
              )}
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
                to="/dashboard" 
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => isActive ? "block text-white font-bold" : "block hover:text-gray-200 text-black"}
              >
                Features
              </NavLink>
            </li>
            <li>
              {user ? (
                <button 
                  onClick={() => { setMenuOpen(false); handleLogout(); }} 
                  className="block w-full text-left text-white font-bold"
                  title="Logout"
                >
                  <FaSignOutAlt className="w-6 h-6 inline mr-2" /> Logout
                </button>
              ) : (
                <NavLink 
                  to="/login" 
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => isActive ? "block text-white font-bold" : "block hover:text-gray-200 text-black"}
                  title="Login"
                >
                  <FaSignInAlt className="w-6 h-6 inline mr-2" /> Login
                </NavLink>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
