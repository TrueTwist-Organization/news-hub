import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import LanguageToggle from './LanguageToggle';
import { useNewsHub } from '../hooks/useNewsHub';
import TranslatedText from './TranslatedText';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { news } = useNewsHub('All');
  
  const isLoggedIn = !!sessionStorage.getItem('token');

  const handleLogout = () => {
    sessionStorage.clear(); // Clear everything for a fresh start
    navigate('/', { replace: true });
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('Home'),         path: '/home' },
    { name: t('Latest'),       path: '/latest' },
    { name: t('Categories'),   path: '/intelligence' },
    { name: t('Saved'),        path: '/creations' },
    { name: 'Subscription',    path: '/subscription' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 glass-panel border-b border-gray-200 shadow-sm`}>

      {/* Red Top Accent Bar — pointer-events-none so it never blocks clicks */}
      <div className="h-[4px] bg-[#E1261C] absolute top-0 left-0 right-0 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="flex flex-col">
          
          {/* Top Row: Masthead Style Logo */}
          <div className="flex items-center justify-between py-4 border-b border-gray-50/20 gap-2">
            <Link to="/home" className="flex-shrink-0">
              <span className="font-playfair font-black text-[#121212] text-lg sm:text-2xl md:text-4xl tracking-tighter uppercase italic">
                THE NEURAL <span className="text-[#E1261C]">TIMES</span>
              </span>
            </Link>
            
            <div className="hidden lg:flex items-center justify-end gap-6 min-w-[500px]">
              <LanguageToggle />
              <div className="min-w-[220px] text-right">
                <span className="font-montserrat font-bold text-[10px] text-gray-500 tracking-widest uppercase">
                  {new Date().toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <Link to="/latest" className="bg-[#121212] text-white px-5 py-2 font-montserrat font-black text-[10px] tracking-widest uppercase hover:bg-[#E1261C] transition-all shrink-0">
                {t('Live Updates')}
              </Link>
              {isLoggedIn && (
                <button 
                  onClick={handleLogout}
                  className="px-5 py-2 border border-[#121212] text-[#121212] bg-transparent font-montserrat font-black text-[10px] tracking-widest uppercase hover:bg-[#E1261C] hover:border-[#E1261C] hover:text-white transition-all shrink-0"
                >
                  Logout
                </button>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="text-[#121212] p-3 flex flex-col items-center justify-center bg-gray-50 rounded-md active:bg-gray-100 transition-colors shadow-sm"
                aria-label="Toggle Menu"
              >
                <div className="w-6 h-[2px] bg-black mb-1.5 transition-all" style={{ transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></div>
                <div className="w-6 h-[2px] bg-black transition-all mb-1.5" style={{ opacity: isOpen ? 0 : 1 }}></div>
                <div className="w-6 h-[2px] bg-black transition-all" style={{ transform: isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></div>
              </button>
            </div>
          </div>

          <div className="relative hidden lg:flex items-center justify-center gap-2 h-12 border-b border-gray-50/20 pointer-events-auto">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative group px-4 py-2 min-w-[110px] text-center cursor-pointer"
                >
                  <span className={`font-montserrat font-bold text-[11px] tracking-[0.1em] transition-colors duration-200 ${
                    isActive ? 'text-[#E1261C]' : 'text-[#555555] group-hover:text-[#121212]'
                  }`}>
                    {link.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-line"
                      className="absolute bottom-0 left-4 right-4 h-[2px] bg-[#E1261C]"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Info Row (Date) */}
          <div className="lg:hidden flex justify-center border-b border-gray-100/50 py-1 bg-gray-50/50">
            <span className="font-montserrat font-bold text-[8px] text-gray-400 tracking-[0.2em] uppercase">
              {new Date().toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}
            </span>
          </div>

          {/* Bottom Row: Live Ticker Strip */}
          <div className="bg-black/5 h-10 flex items-center overflow-hidden">
            <div className="bg-[#121212] h-full px-4 flex items-center gap-2 shrink-0 z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-[#005689] animate-pulse" />
              <span className="text-white font-montserrat font-black text-[8px] uppercase tracking-[0.2em]">{t('Just In')}</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <motion.div 
                animate={{ x: ["100%", "-100%"] }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                className="whitespace-nowrap flex items-center gap-12"
              >
                {news.slice(0, 8).map((item, i) => (
                  <span key={i} className="text-[#121212] font-playfair italic text-xs hover:text-[#005689] transition-colors cursor-pointer flex items-center gap-4">
                    <TranslatedText text={item.title} />
                    <span className="text-gray-400">/</span>
                  </span>
                ))}
              </motion.div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-0 w-full h-screen bg-white z-[200] lg:hidden flex flex-col pt-32 px-8"
          >
            {/* Close Button in Menu */}
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-gray-50 rounded-full"
            >
              <div className="w-6 h-[2px] bg-black rotate-45 absolute" />
              <div className="w-6 h-[2px] bg-black -rotate-45 absolute" />
            </button>

            <div className="flex flex-col divide-y divide-gray-100 mb-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`py-5 font-montserrat font-black text-[15px] tracking-[0.2em] uppercase ${
                    location.pathname === link.path ? 'text-[#E1261C]' : 'text-[#121212]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {isLoggedIn && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="py-5 font-montserrat font-black text-[15px] tracking-[0.2em] uppercase text-[#121212] text-left hover:text-[#E1261C]"
                >
                  LOGOUT
                </button>
              )}
            </div>
            
            <div className="mt-auto pb-12 flex flex-col gap-6">
              <div className="h-[2px] bg-black/5" />
              <div className="bg-gray-50 p-6 rounded-xl">
                <p className="font-montserrat font-black text-[10px] uppercase tracking-widest text-gray-400 mb-4">Choose Language</p>
                <LanguageToggle />
              </div>
              <span className="font-montserrat font-bold text-[10px] text-gray-300 uppercase tracking-widest text-center">
                Neural Gazette // Global Hub
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
