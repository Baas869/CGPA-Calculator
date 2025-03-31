import React, { useState, useContext } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollY } = useScroll();

  // Track scroll position
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 73) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  });

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  // Animation variants
  const stickyVariants = {
    normal: {
      y: -100,
      opacity: 0,
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0)",
    },
    sticky: {
      y: 0,
      opacity: 1,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      }
    }
  };

  return (
    <>
      {/* Original Header (non-sticky) */}
      <header className="bg-navy-blue text-white">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl font-bold flex items-center">
            <Link to="/">
              <h2 className="text-4xl text-link-primary-color">Logo</h2>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 text-lg font-semibold">
            {[
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
              { name: "Features", path: "/dashboard" },
              { name: "Team", path: "/team" },
              { name: "Contact", path: "/contact" },
            ].map(({ name, path }) => (
              <div key={path}>
                <NavLink 
                  to={path}
                  className={({ isActive }) =>
                    (isActive || (name === "Home" && location.pathname === "/"))
                      ? "text-link-primary-color font-bold border-b-4 border-link-primary-color pb-1"
                      : "hover:text-btn-hover-color text-white"
                  }
                >
                  {name}
                </NavLink>
              </div>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 bg-btn-primary-color px-4 py-2 rounded-lg hover:bg-btn-hover-color transition"
              >
                <FaSignOutAlt /> Logout
              </button>
            ) : (
              <Link 
                to="/login"
                className="flex items-center gap-2 text-white font-bold bg-btn-primary-color px-4 py-2 rounded-lg hover:bg-btn-hover-color transition"
              >
                <FaSignInAlt /> Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden focus:outline-none"
          >
            {menuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <nav className="md:hidden bg-navy-blue">
            <ul className="px-6 pb-6 space-y-4 text-lg">
              {[
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
                { name: "Features", path: "/dashboard" },
                { name: "Team", path: "/team" },
                { name: "Contact", path: "/contact" },
              ].map(({ name, path }) => (
                <li key={path}>
                  <NavLink 
                    to={path} 
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      (isActive || (name === "Home" && location.pathname === "/"))
                        ? "block text-white font-bold border-b-4 border-white pb-1"
                        : "block hover:text-gray-300"
                    }
                  >
                    {name}
                  </NavLink>
                </li>
              ))}
              <li>
                {user ? (
                  <button 
                    onClick={() => { setMenuOpen(false); handleLogout(); }} 
                    className="block w-full text-left text-white font-bold bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    <FaSignOutAlt className="inline mr-2" /> Logout
                  </button>
                ) : (
                  <NavLink 
                    to="/login" 
                    onClick={() => setMenuOpen(false)}
                    className="block text-white font-bold bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    <FaSignInAlt className="inline mr-2" /> Login
                  </NavLink>
                )}
              </li>
            </ul>
          </nav>
        )}
      </header>

      {/* Sticky Header (animated) */}
      <motion.header
        className="bg-navy-blue text-white fixed top-0 left-0 right-0 z-50"
        initial="normal"
        animate={isSticky ? "sticky" : "normal"}
        variants={stickyVariants}
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            className="text-2xl font-bold flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link to="/">
              <h2 className="text-4xl text-link-primary-color">Logo</h2>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 text-lg font-semibold">
            {[
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
              { name: "Features", path: "/features" },
              { name: "Team", path: "/team" },
              { name: "Contact", path: "/contact" },
            ].map(({ name, path }) => (
              <motion.div
                key={path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <NavLink 
                  to={path}
                  className={({ isActive }) =>
                    (isActive || (name === "Home" && location.pathname === "/"))
                      ? "text-link-primary-color font-bold border-b-4 border-link-primary-color pb-1"
                      : "hover:text-btn-hover-color text-white"
                  }
                >
                  {name}
                </NavLink>
              </motion.div>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <motion.button 
                onClick={handleLogout} 
                className="flex items-center gap-2 bg-btn-primary-color px-4 py-2 rounded-lg hover:bg-btn-hover-color transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaSignOutAlt /> Logout
              </motion.button>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/login"
                  className="flex items-center gap-2 text-white font-bold bg-btn-primary-color px-4 py-2 rounded-lg hover:bg-btn-hover-color transition"
                >
                  <FaSignInAlt /> Login
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button 
            onClick={toggleMenu} 
            className="md:hidden focus:outline-none"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {menuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
          </motion.button>
        </div>

        {/* Mobile Navigation Menu */}
        {menuOpen && (
          <motion.nav 
            className="md:hidden bg-navy-blue"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="px-6 pb-6 space-y-4 text-lg">
              {[
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
                { name: "Features", path: "/features" },
                { name: "Team", path: "/team" },
                { name: "Contact", path: "/contact" },
              ].map(({ name, path }) => (
                <motion.li 
                  key={path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <NavLink 
                    to={path} 
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      (isActive || (name === "Home" && location.pathname === "/"))
                        ? "block text-white font-bold border-b-4 border-white pb-1"
                        : "block hover:text-gray-300"
                    }
                  >
                    {name}
                  </NavLink>
                </motion.li>
              ))}
              <motion.li
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {user ? (
                  <button 
                    onClick={() => { setMenuOpen(false); handleLogout(); }} 
                    className="block w-full text-left text-white font-bold bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    <FaSignOutAlt className="inline mr-2" /> Logout
                  </button>
                ) : (
                  <NavLink 
                    to="/login" 
                    onClick={() => setMenuOpen(false)}
                    className="block text-white font-bold bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    <FaSignInAlt className="inline mr-2" /> Login
                  </NavLink>
                )}
              </motion.li>
            </ul>
          </motion.nav>
        )}
      </motion.header>
    </>
  );
};

export default Header;