import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api.js';
import toast from 'react-hot-toast';
import { gsap } from 'gsap';
import Input from '../components/common/Input.jsx'; // Farz hai ke yeh component hai
import Button from '../components/common/Button.jsx'; // Farz hai ke yeh component hai

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const boxRef = useRef(null);

  useEffect(() => {
    gsap.from(boxRef.current, { duration: 0.7, opacity: 0, y: 50, ease: 'power3.out' });
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // YEH API CALL HAI (LINE 27)
      const { data } = await api.post('/auth/signup', { fullName, email, password });
      
      toast.success(data.message || 'User created! Please login.');
      navigate('/login'); // Login page pe bhej do

    } catch (error) {
      // YEH ERROR HANDLING HAI
      // Backend se aanay wala message toast mein dikhao
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div ref={boxRef} className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-xl">
        <form onSubmit={handleRegister} className="space-y-6">
          <h1 className="text-3xl font-bold text-center text-cyan-400">Register</h1>
          <Input 
            placeholder="Full Name" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)} 
          />
          <Input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <Input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <Button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-cyan-400 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
export default Register;