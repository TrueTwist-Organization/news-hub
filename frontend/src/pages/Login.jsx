import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Cpu, ArrowRight } from 'lucide-react';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkboxShake, setCheckboxShake] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!rememberMe) {
      setError('Please agree to the terms/Remember me to proceed.');
      setCheckboxShake(true);
      setTimeout(() => setCheckboxShake(false), 500);
      return;
    }

    setLoading(true);
    
    try {
      const cleanEmail = email.trim();
      const cleanPassword = password.trim();
      
      const response = await api.post('/auth/login', { email: cleanEmail, password: cleanPassword });
      
      setIsSuccess(true);
      setTimeout(() => {
        const user = response.data.user;
        const token = response.data.token;

        // Session storage
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('hasAccessedApp', 'true');
        
        // Navigate to the Welcome Page (/welcome) after login
        navigate('/welcome', { replace: true });
      }, 2500);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
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
      className="h-screen flex flex-col md:flex-row bg-white relative overflow-hidden"
    >
      {/* Neural Success Animation Overlay - LIGHT THEME */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-4 sm:p-8"
          >
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-4 h-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border-l border-slate-900 h-full w-full" />
                ))}
              </div>
            </div>

            <div className="max-w-xl w-full relative z-10">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white p-6 sm:p-12 rounded-2xl shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border border-slate-100"
              >
                <div className="flex items-center justify-center gap-3 mb-8 sm:mb-10">
                  <div className="h-[1px] flex-grow bg-slate-100" />
                  <Cpu className="text-red-600 animate-spin-slow" size={28} />
                  <div className="h-[1px] flex-grow bg-slate-100" />
                </div>

                <div className="space-y-6 text-center">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="overflow-hidden whitespace-nowrap text-[9px] md:text-[10px] text-slate-400 font-mono tracking-wider mx-auto"
                  >
                    SYSTEM_LINK_ACTIVE // ENCRYPTING_SESSION_KEYS...
                  </motion.div>

                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-playfair text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 tracking-tight"
                  >
                    THE <span className="text-red-600">NEURAL</span> TIMES
                  </motion.h2>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex justify-center"
                  >
                    <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 bg-slate-900 rounded-full">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-[9px] sm:text-[11px] uppercase tracking-[0.2em] text-white font-bold">
                        ACCESS AUTHORIZED
                      </span>
                    </div>
                  </motion.div>

                  <div className="pt-6 sm:pt-10 space-y-2">
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                      <span>SYNCING_DATA_NODES</span>
                      <span>100%</span>
                    </div>
                    <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
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
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center mt-6 sm:mt-8 text-[10px] text-slate-400 font-mono uppercase tracking-[0.3em]"
              >
                Redirecting to Neural Newsroom...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Panel - Image (Hidden on small mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#121212] relative overflow-hidden h-full">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.8 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/auth-bg.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        
        <div className="relative z-10 p-12 lg:p-20 flex flex-col justify-end h-full text-white">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h2 className="font-garamond text-4xl lg:text-7xl font-black mb-6 leading-tight text-white drop-shadow-2xl uppercase tracking-tighter italic">
              The Future of <br />Intelligence.
            </h2>
            <div className="w-16 h-1 bg-red-600 mb-8" />
            <p className="font-merriweather text-xl lg:text-2xl text-gray-200 italic max-w-md drop-shadow-md leading-relaxed">
              "Experience the news as it happens, curated by artificial intelligence for the modern mind."
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-grow flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-white relative h-full overflow-y-auto no-scrollbar">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/30 rounded-full blur-[100px] pointer-events-none" />

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 mb-6"
            >
              <Cpu className="text-[#E1261C] w-6 h-6" />
            </motion.div>
            <h1 className="font-garamond text-3xl sm:text-4xl font-black tracking-tighter mb-2 uppercase italic">
              THE <span className="text-[#E1261C]">NEURAL</span> TIMES
            </h1>
            <p className="font-montserrat font-bold text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-gray-400 mb-8">
              Daily Intelligence Hub
            </p>
            <h3 className="text-2xl font-black text-gray-900 mb-1 tracking-tight font-garamond">Welcome back</h3>
            <p className="text-gray-500 text-sm font-medium font-merriweather">Login to continue reading</p>
          </motion.div>

          {/* Form */}
          <motion.form 
            variants={itemVariants}
            animate={error && !error.includes('agree') ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            onSubmit={handleSubmit} 
            className="space-y-5"
          >
            <AnimatePresence>
              {successMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-3 mb-4 shadow-sm"
                >
                  <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                  <span>{successMessage}</span>
                </motion.div>
              )}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-xl flex items-center gap-3 mb-4 shadow-sm"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#E1261C] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-11 pr-4 py-4 bg-slate-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/10 focus:border-[#E1261C] transition-all outline-none text-sm font-medium"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#E1261C] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-11 pr-12 py-4 bg-slate-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-600/10 focus:border-[#E1261C] transition-all outline-none text-sm font-medium"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#121212] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.div 
              animate={checkboxShake ? { x: [-5, 5, -5, 5, 0] } : {}}
              className="flex items-center justify-between gap-3 py-1"
            >
              <label className={`flex items-center gap-2 cursor-pointer group p-1 rounded-lg transition-colors ${checkboxShake ? 'bg-red-50' : 'hover:bg-slate-50'}`}>
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-md border-gray-300 focus:ring-red-600 accent-[#E1261C]" 
                />
                <span className={`text-[11px] font-bold uppercase tracking-wider ${checkboxShake ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'} transition-colors`}>
                  Stay Authenticated
                </span>
              </label>
              <button type="button" className="text-[11px] font-black uppercase tracking-widest text-[#E1261C] hover:opacity-70 transition-opacity">
                Recovery?
              </button>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.01, boxShadow: '0 20px 40px -10px rgba(225, 38, 28, 0.2)' }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading || isSuccess}
              className="w-full bg-[#E1261C] hover:bg-[#c41e15] text-white py-4 rounded-xl font-black text-[12px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-3 overflow-hidden relative mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" 
                  />
                  <span>Verifying...</span>
                </div>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </motion.button>
          </motion.form>

          {/* Social Login */}
          <motion.div variants={itemVariants} className="mt-10">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <div className="relative flex justify-center text-[10px]">
                <span className="px-6 bg-white text-gray-400 uppercase tracking-[0.4em] font-bold">social gateway</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {['google', 'facebook', 'apple'].map((platform) => (
                <motion.button 
                  key={platform}
                  whileHover={{ scale: 1.05, backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                  whileTap={{ scale: 0.95 }}
                  className="flex justify-center items-center py-4 border border-slate-100 rounded-xl transition-all shadow-sm"
                >
                  {platform === 'google' && (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.14-4.53z" fill="#EA4335"/>
                    </svg>
                  )}
                  {platform === 'facebook' && (
                    <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  )}
                  {platform === 'apple' && (
                    <svg className="w-5 h-5 fill-slate-900" viewBox="0 0 24 24">
                      <path d="M12.062 3.5c-2.316 0-4.593 1.258-5.748 3.33-1.848 3.33-.462 8.784 2.775 12.486.648.742 1.388 1.575 2.222 1.575.787 0 1.066-.464 2.037-.464.927 0 1.25.464 2.038.464.834 0 1.528-.788 2.223-1.575 1.157-1.343 2.13-3.66 2.13-3.707 0-.046-2.176-.833-2.176-3.33 0-2.083 1.667-3.056 1.759-3.148-1.018-1.482-2.546-1.667-3.055-1.667-.14 0-.649.047-.973.185-.324.139-.788.324-1.25.324-.464 0-1.066-.185-1.389-.324-.325-.138-.695-.185-.834-.185zM12 1c.532 0 1.545.295 2.155 1.037.663.788.943 1.898.663 3.195-1.343.14-2.438-.51-3.103-1.296-.717-.833-1.036-1.898-.806-2.936.438-.046.787-.046 1.091-.046z"/>
                    </svg>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div variants={itemVariants} className="mt-12 text-center text-sm">
            <span className="text-gray-400 font-medium">New to the network? </span>
            <Link to="/signup" className="font-black text-[#E1261C] hover:underline uppercase tracking-wider text-[11px] ml-1">
              Create an account
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;
