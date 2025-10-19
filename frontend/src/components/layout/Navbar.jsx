import React, { useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Context.jsx'; // SAHI
import api from '../../api/api';
import toast from 'react-hot-toast';
import { gsap } from 'gsap';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    // Navbar animation
    gsap.from(navRef.current, { 
      duration: 0.8, 
      y: -100, 
      ease: 'power3.out' 
    });
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const NavLinkItem = ({ to, children }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `px-3 py-2 rounded-md font-medium ${
          isActive 
            ? 'bg-cyan-500 text-gray-900' 
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`
      }
    >
      {children}
    </NavLink>
  );

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow-lg">
      <div className="container px-4 py-3 mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="text-2xl font-bold text-cyan-400">
            HealthMate
          </NavLink>

          {/* Nav Links */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-300">Hi, {user?.fullName.split(' ')[0]}</span>
                <NavLinkItem to="/">Dashboard</NavLinkItem>
                <NavLinkItem to="/upload">Upload</NavLinkItem>
                <NavLinkItem to="/add-vitals">Add Vitals</NavLinkItem>
                <NavLinkItem to="/family">Family</NavLinkItem>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 font-medium text-gray-300 bg-red-600 rounded-md hover:bg-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLinkItem to="/login">Login</NavLinkItem>
                <NavLinkItem to="/register">Register</NavLinkItem>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;