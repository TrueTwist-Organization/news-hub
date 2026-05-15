import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, Cpu, Network } from 'lucide-react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkboxShake, setCheckboxShake] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!rememberMe) {
      setError('Please agree to the terms/Remember me to proceed.');
      setCheckboxShake(true);
      setTimeout(() => setCheckboxShake(false), 500);
      return;
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    
    try {
      const response = await api.post('/auth/register', { email, password });
      
      setIsSuccess(true);
      setTimeout(() => {
        const user = response.data.user;
        const token = response.data.token;
        
        // Use sessionStorage for ephemeral sessions
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(user));
        
        const isPro = user?.subscription?.plan === 'pro';
        
        if (isPro) {
          // Direct entry for Pro users
          sessionStorage.setItem('hasAccessedApp', 'true');
          navigate('/welcome', { replace: true });
        } else {
          // Free users must login to verify session
          sessionStorage.removeItem('token'); // Clear token to force fresh login
          sessionStorage.removeItem('user');
          navigate('/', { 
            replace: true, 
            state: { message: '✅ Registration Successful! Please login with your credentials.' } 
          });
        }
      }, 2500);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col md:flex-row bg-white relative overflow-hidden"
    >
      {/* Neural Success Animation Overlay - LIGHT THEME */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-50 flex flex-col items-center justify-center p-4 md:p-8"
          >
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
              <div className="grid grid-cols-6 md:grid-cols-12 gap-4 h-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border-l border-slate-900 h-full w-full" />
                ))}
              </div>
            </div>

            <div className="max-w-xl w-full relative z-10">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-8 md:p-12 rounded-2xl shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border border-slate-100"
              >
                <div className="flex items-center justify-center gap-3 mb-10">
                  <div className="h-[1px] flex-grow bg-slate-100" />
                  <Network className="text-red-600 animate-spin-slow" size={28} />
                  <div className="h-[1px] flex-grow bg-slate-100" />
                </div>

                <div className="space-y-6 text-center">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="overflow-hidden whitespace-nowrap text-[9px] md:text-[10px] text-slate-400 font-mono tracking-wider mx-auto"
                  >
                    NEURAL_INITIALIZATION // VERIFYING_IDENTITY...
                  </motion.div>

                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-playfair text-3xl md:text-5xl font-black text-slate-900 tracking-tight"
                  >
                    THE <span className="text-red-600">NEURAL</span> TIMES
                  </motion.h2>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex justify-center"
                  >
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 rounded-full">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-white font-bold">
                        ID VERIFIED
                      </span>
                    </div>
                  </motion.div>

                  <div className="pt-10 space-y-2">
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>SYNCING_NEURAL_LINK</span>
                      <span>100%</span>
                    </div>
                    <motion.div 
                      className="h-1 bg-slate-50 rounded-full overflow-hidden"
                    >
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.8, ease: "easeInOut" }}
                        className="h-full bg-red-600 relative"
                      >
                        <motion.div 
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        />
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center mt-8 text-[10px] text-slate-400 font-mono uppercase tracking-[0.3em]"
              >
                Welcome to the Network...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Panel - Image (Hidden on mobile) */}
      <div className="hidden md:flex md:w-1/2 bg-[#121212] relative overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.8 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/auth-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        
        <div className="relative z-10 p-12 flex flex-col justify-end h-full text-white">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h2 className="font-playfair text-4xl lg:text-6xl font-black mb-4 leading-tight text-white drop-shadow-2xl">
              Join the <br />Neural Network.
            </h2>
            <p className="font-lora text-lg lg:text-xl text-gray-200 italic max-w-md drop-shadow-md">
              "The premier destination for AI-curated journalism and deep-tech insights."
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-grow flex items-center justify-center p-6 md:p-12 lg:p-24 bg-white">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-10">
            <h1 className="font-playfair text-3xl md:text-4xl font-black tracking-tighter mb-2">
              THE <span className="text-[#E1261C]">NEURAL</span> TIMES
            </h1>
            <p className="font-montserrat font-bold text-[10px] md:text-[11px] uppercase tracking-[0.3em] text-gray-400 mb-8">
              Daily Intelligence Hub
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">Create account</h3>
            <p className="text-gray-500 text-sm">Join the elite circle of readers</p>
          </motion.div>

          {/* Form */}
          <motion.form 
            variants={itemVariants}
            animate={error && !error.includes('agree') ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit} 
            className="space-y-4"
          >
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-sm flex items-center gap-2 mb-4"
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-md focus:ring-1 focus:ring-black focus:border-black transition-all outline-none text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-md focus:ring-1 focus:ring-black focus:border-black transition-all outline-none text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-md focus:ring-1 focus:ring-black focus:border-black transition-all outline-none text-sm"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <motion.div 
              animate={checkboxShake ? { x: [-5, 5, -5, 5, 0] } : {}}
              className="py-1"
            >
              <label className={`flex items-center gap-2 cursor-pointer group p-1 rounded transition-colors ${checkboxShake ? 'bg-red-50' : ''}`}>
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 focus:ring-black accent-black" 
                />
                <span className={`text-[11px] ${checkboxShake ? 'text-red-600 font-bold' : 'text-gray-500'} group-hover:text-gray-700 transition-colors`}>
                  Agree to Neural Terms / Remember me
                </span>
              </label>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading || isSuccess}
              className="w-full bg-[#E1261C] hover:bg-[#c41e15] text-white py-4 rounded-md font-bold text-sm transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2 overflow-hidden relative mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" 
                  />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <>Sign up</>
              )}
            </motion.button>
          </motion.form>

          {/* Footer */}
          <motion.div variants={itemVariants} className="mt-12 text-center text-sm">
            <span className="text-gray-500">Already a member? </span>
            <Link to="/login" className="font-bold text-[#E1261C] hover:underline">
              Login
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SignUp;
