import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/Context.jsx'; // Sahi context path
import api from '../api/api.js';
import toast from 'react-hot-toast';
import { gsap } from 'gsap';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const loginBoxRef = useRef(null);

  useEffect(() => {
    gsap.from(loginBoxRef.current, { 
      duration: 0.7, 
      opacity: 0, 
      y: 50, 
      ease: 'power3.out' 
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // YEH API CALL HAI (LINE 29)
      const { data } = await api.post('/auth/login', { email, password });
      
      login(data.token, data.user); // Context mein token save karo
      toast.success(data.message);
      navigate('/'); // Dashboard pe jao

    } catch (error) {
      // YEH ERROR HANDLING HAI
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div ref={loginBoxRef} className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-center text-cyan-400">
          HealthMate Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
          />
          <Input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
          />
          <Button 
            type="submit" 
            disabled={loading} 
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
           <p className="text-center text-sm text-gray-400">
            No account?{' '}
            <Link to="/register" className="font-medium text-cyan-400 hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
export default Login;