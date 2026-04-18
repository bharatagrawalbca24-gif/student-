import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success("Welcome back!");
      } else {
        await register(formData.name, formData.email, formData.password);
        toast.success("Account created successfully!");
      }
      navigate('/');
    } catch (err) {
      toast.error(err.message || "Failed to authenticate");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 app-bg" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card w-full max-w-md p-loose relative z-10 mx-4 shadow-2xl"
        style={{ background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(30px)' }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-secondary text-sm">
            {isLogin ? "Enter your credentials to access your dashboard" : "Join the most advanced student experience"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex-col gap-5">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input 
                  type="text" 
                  name="name"
                  placeholder="Full Name" 
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full"
                  style={{ paddingLeft: '3rem' }}
                  required={!isLogin}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input 
              type="email" 
              name="email"
              placeholder="Email Address" 
              value={formData.email}
              onChange={handleChange}
              className="w-full"
              style={{ paddingLeft: '3rem' }}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input 
              type="password" 
              name="password"
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange}
              className="w-full"
              style={{ paddingLeft: '3rem' }}
              required
            />
          </div>

          <button type="submit" className="btn btn-gradient w-full py-4 mt-4 flex items-center justify-center gap-2 group shadow-xl">
            {isLogin ? "Sign In" : "Sign Up"}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-secondary">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="ml-2 text-primary hover:text-white font-bold transition-colors"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
