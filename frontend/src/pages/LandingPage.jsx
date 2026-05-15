import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Rss, Cpu, ImageIcon, Share2, Settings, Shield, Edit3, ArrowRight, CheckCircle, MapPin, ChevronLeft, ChevronRight, Zap, Clock, ShieldCheck, Layers, PlayCircle, Sparkles, Disc, Globe, ChevronDown, Search, History, DollarSign, Activity } from 'lucide-react';


const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const FeatureCard = ({ icon: Icon, title, desc, children }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      viewport={{ once: false, amount: 0.2 }}
      className="relative group rounded-3xl p-[1px] bg-gradient-to-br from-gray-300 via-gray-100 to-gray-400 shadow-xl overflow-hidden transition-all duration-500"
    >
      {/* Silver Glow Backdrop */}
      <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 via-white to-gray-200 opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500" />
      
      <div className="relative h-full bg-white/60 backdrop-blur-3xl rounded-[23px] p-8 flex flex-col items-center text-center border border-white/50">
        <div className="flex flex-col items-center gap-5 mb-6">
          <div className="p-4 rounded-2xl bg-white shadow-xl border border-gray-100 group-hover:border-[#E1261C] transition-all duration-500 transform group-hover:scale-110">
            <Icon className="w-8 h-8 text-[#121212] group-hover:text-[#E1261C] transition-colors duration-500" />
          </div>
          <h3 className="font-garamond font-black text-2xl md:text-3xl text-[#121212] tracking-tighter uppercase">{title}</h3>
        </div>
        
        <p className="font-merriweather text-[14px] text-gray-500 leading-relaxed mb-10 opacity-80 group-hover:opacity-100 transition-opacity">
          {desc}
        </p>
        
        {/* INTERACTIVE PREVIEW WINDOW - Unified Glass Design */}
        <div className="mt-auto relative h-52 w-full bg-[#121212]/5 rounded-2xl border border-black/5 overflow-hidden flex flex-col items-center justify-center p-6 shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
          {children}
          
          {/* Progress Bar Loader */}
          <div className="absolute bottom-3 left-3 right-3 h-1 bg-black/5 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-[#E1261C] to-purple-600"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ParticleNetwork = () => {
  const [dimensions, setDimensions] = useState({ width: 1000, height: 1000 });

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 opacity-[0.05]">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-[#121212] rounded-full"
            initial={{
              x: Math.random() * dimensions.width,
              y: Math.random() * dimensions.height,
              opacity: Math.random() * 0.5 + 0.1
            }}
            animate={{
              y: [null, Math.random() * dimensions.height],
              x: [null, Math.random() * dimensions.width],
              opacity: [null, Math.random() * 0.8 + 0.2, 0.1]
            }}
            transition={{
              duration: Math.random() * 25 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
    </div>
  );
};

const TopStatusBar = () => {
  const [location, setLocation] = useState('Detecting...');

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Switching to ipinfo.io (free tier)
        const response = await fetch('https://ipinfo.io/json');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        // ipinfo provides 'city' and 'region'
        if (data.city && data.region) {
          setLocation(`${data.city}, ${data.region}`);
        } else {
          setLocation('Ahmedabad, India'); // Fallback
        }
      } catch (error) {
        console.warn("Location Service Unavailable (CORS/Rate-Limit). Using default.");
        setLocation('Ahmedabad, India'); // Robust fallback
      }
    };
    fetchLocation();
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="absolute top-0 left-0 w-full h-10 bg-[#F9F9F9] border-b border-gray-200 flex justify-between items-center px-4 md:px-6 z-30">
      {/* Left: Date */}
      <div className="font-playfair text-[12px] md:text-[13px] tracking-wide text-[#121212] font-bold">
        {currentDate}
      </div>

      {/* Center: Location */}
      <div className="flex items-center gap-1 md:gap-1.5 font-mono text-[8px] md:text-[9px] uppercase tracking-[0.1em] md:tracking-[0.2em] text-gray-500 max-w-[100px] md:max-w-none truncate">
        <MapPin className="w-2.5 h-2.5 md:w-3 h-3 text-[#E1261C] shrink-0" />
        <span className="truncate">{location}</span>
      </div>

      {/* Right: Market Status */}
      <div className="hidden sm:flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-gray-500">
        <span>Market Status: <span className="text-[#121212] font-bold">Open</span></span>
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
      </div>
    </div>
  );
};

const NewsTicker = () => {
  return (
    <div className="absolute top-10 left-0 w-full h-8 bg-[#121212] border-b border-gray-800 flex items-center overflow-hidden z-20 shadow-sm">
      <motion.div
        animate={{ x: [0, -1500] }}
        transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        className="whitespace-nowrap flex items-center gap-16 font-mono text-[10px] text-gray-300 tracking-[0.2em] uppercase"
      >
        {[...Array(3)].map((_, i) => (
          <React.Fragment key={i}>
            <span><span className="text-[#E1261C] mr-3 font-bold">● LIVE</span> GLOBAL MARKETS SURGE 4.5%</span>
            <span><span className="text-[#E1261C] mr-3 font-bold">● UPDATE</span> AI REGULATION BILL PASSED</span>
            <span><span className="text-[#E1261C] mr-3 font-bold">● TECH</span> NEW QUANTUM CHIP ANNOUNCED</span>
            <span><span className="text-[#E1261C] mr-3 font-bold">● EXCLUSIVE</span> AUTOMATION ERA BEGINS</span>
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

const TypewriterText = ({ phrases, className }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === phrases[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 2500); // Pause at end
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % phrases.length); // Cycle phrases
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 40 : 80); // Speed

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, phrases]);

  return (
    <span className={className}>
      {phrases[index].substring(0, subIndex)}
      <motion.span 
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-[2px] h-[0.9em] bg-[#121212] ml-1 align-middle"
      />
    </span>
  );
};

const SectionHeader = ({ badge, title, subtitle, light = false }) => (
  <div className="relative text-center mb-10 sm:mb-12 flex flex-col items-center">
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      className="flex items-center justify-center gap-3 mb-5"
    >
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${light ? 'border-white/10 bg-white/5' : 'border-[#E1261C]/10 bg-[#E1261C]/5'}`}>
        <Disc className={`w-3 h-3 animate-spin-slow ${light ? 'text-white/60' : 'text-[#E1261C]'}`} />
        <span className={`font-mono text-[10px] font-bold uppercase tracking-[0.4em] ${light ? 'text-white/60' : 'text-[#E1261C]'}`}>
          {badge}
        </span>
      </div>
    </motion.div>
    
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ delay: 0.1 }}
      className={`font-garamond font-black text-2xl sm:text-3xl md:text-4xl tracking-tighter leading-[1.0] mb-5 max-w-[900px] uppercase ${light ? 'text-white' : 'text-[#121212]'}`}
    >
      {title}
    </motion.h2>
    
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ delay: 0.2 }}
        className={`font-merriweather text-sm md:text-base max-w-[600px] leading-relaxed mb-6 opacity-80 ${light ? 'text-white' : 'text-gray-500'}`}
      >
        {subtitle}
      </motion.p>
    )}

    {/* Signature Red Underline */}
    <motion.div 
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: false, amount: 0.5 }}
      className="flex flex-col items-center"
    >
      <div className={`w-24 h-[1.5px] ${light ? 'bg-white/20' : 'bg-gray-200'}`} />
      <div className="mt-3 w-2 h-2 rounded-full bg-[#E1261C] shadow-[0_0_12px_#E1261C] animate-pulse" />
    </motion.div>
  </div>
);

const PipelineVideoContainer = ({ video, isFull = false, isContain = false }) => {
  return (
    <div className={`relative w-full h-full group overflow-hidden ${!isFull && 'max-w-[500px] aspect-video rounded-2xl'}`}>
      {/* Tech-Silver Border Overlay */}
      <div className="absolute inset-0 border border-white/20 z-10 pointer-events-none group-hover:border-[#E1261C]/30 transition-colors duration-700" />
      
      {/* The Video */}
      <video 
        src={video}
        autoPlay 
        muted 
        loop 
        playsInline
        className={`w-full h-full transition-opacity duration-700 ${isContain ? 'object-contain' : 'object-cover'} opacity-90 group-hover:opacity-100`}
      />
      
      {/* Glassmorphism Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#E1261C]/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none shadow-[inset_0_0_50px_rgba(255,255,255,0.05)]" />
      
      {/* Subtle Scanline / Cyber Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
    </div>
  );
};



const StatCounter = ({ value, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      let startTime;
      let animationFrame;

      const updateCount = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        // Easing function for smoother finish
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentCount = easedProgress * value;
        
        setCount(currentCount);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(updateCount);
        }
      };

      animationFrame = requestAnimationFrame(updateCount);
      return () => cancelAnimationFrame(animationFrame);
    } else {
      setCount(0);
    }
  }, [isInView, value, duration]);

  return (
    <span ref={ref}>
      {value % 1 === 0 ? Math.floor(count) : count.toFixed(1)}
      {suffix}
    </span>
  );
};

const ServiceSlider = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    {
      title: 'ELIMINATE MISINFORMATION',
      text: 'We provide 100% authentic, real-time updates. Our AI filters out fake news and noise, ensuring your audience only receives verified, high-integrity information.',
      image: '/true.jpeg',
      badge: 'Trust Factor',
      metrics: [
        { label: 'Accuracy', value: '99.9%', sub: 'Verification' },
        { label: 'Latency', value: '< 10ms', sub: 'Signal Check' },
        { label: 'Source', value: 'Verified', sub: 'Protocol' }
      ]
    },
    {
      title: '24/7 AUTOMATED NEWS DESK',
      text: 'Scale your operations without the overhead. Our software acts as your tireless digital journalist, fetching and processing global signals every second of the day.',
      image: '/ai.jpeg',
      badge: 'Operation',
      metrics: [
        { label: 'Uptime', value: '100%', sub: 'Operational' },
        { label: 'Signals', value: '50k/m', sub: 'Throughput' },
        { label: 'Mode', value: 'Auto', sub: 'Publishing' }
      ]
    },
    {
      title: 'STRATEGIC AUDIENCE REACH',
      text: 'We help you stay ahead of the curve. By automating content distribution, we ensure your brand is the first to deliver breaking news across all social channels.',
      image: '/social.jpeg',
      badge: 'Growth',
      metrics: [
        { label: 'Reach', value: 'Global', sub: 'Distribution' },
        { label: 'Speed', value: '< 60s', sub: 'Processing' },
        { label: 'Network', value: 'Multi', sub: 'Platform' }
      ]
    }
  ];

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.2 }
        }
      }}
      className="relative max-w-7xl mx-auto px-4 group/main"
    >
      <div className="flex flex-col md:flex-row gap-10 md:gap-0 items-center justify-center min-h-[500px] md:h-[600px] bg-white/80 backdrop-blur-2xl rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border border-white/50 relative">
        
        {/* Left Side: Image Cyber-Architecture (60%) */}
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
          className="md:w-[60%] w-full h-auto min-h-[300px] sm:min-h-[400px] md:h-full bg-[#f8f9fa] flex items-center justify-center p-0 md:p-16 relative overflow-hidden group/img mt-0"
        >
          <AnimatePresence mode="wait">
            <motion.div 
              key={`img-${activeSlide}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full relative"
            >
              <motion.img 
                whileHover={{ scale: 1.05 }}
                src={slides[activeSlide].image} 
                alt={slides[activeSlide].title}
                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-700"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800";
                }}
              />
              
              {/* Floating Silver Glow Border on Hover */}
              <div className="absolute inset-0 border-[2px] border-transparent group-hover/img:border-white/40 group-hover/img:shadow-[inset_0_0_50px_rgba(255,255,255,0.3)] transition-all duration-700 rounded-3xl pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Floating Micro-Badges */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-10 px-4 py-2 bg-white/40 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-2 shadow-sm z-20"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#E1261C] animate-pulse" />
            <span className="font-mono text-[9px] text-[#121212] uppercase tracking-[0.2em] font-bold">Live Sync Active</span>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-10 right-10 px-4 py-2 bg-black/5 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-2 shadow-sm z-20"
          >
            <span className="font-mono text-[8px] sm:text-[9px] text-gray-500 uppercase tracking-[0.2em] font-bold">Signal: 100% Secure</span>
          </motion.div>
        </motion.div>

        {/* Right Side: Elite Info & Stats (40%) */}
        <div className="md:w-[40%] w-full flex h-auto md:h-full md:border-l border-slate-100">
          <AnimatePresence mode="wait">
            <motion.div 
              key={`info-${activeSlide}`}
              variants={{ hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } }}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.6 }}
              className="w-full p-6 sm:p-10 md:p-16 flex flex-col items-center text-center md:items-start md:text-left justify-center relative bg-white h-full"
            >
              <div className="relative z-10 flex-1 flex flex-col items-center md:items-start justify-center">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center md:justify-start gap-3 mb-8 group/badge"
                >
                  <div className="w-8 h-[2px] bg-[#E1261C]" />
                  <span className="font-mono text-[10px] font-bold text-[#E1261C] group-hover/main:text-[#E1261C] uppercase tracking-[0.4em] transition-colors duration-500">
                    Elite {slides[activeSlide].badge}
                  </span>
                </motion.div>

                <h3 className="font-garamond font-black text-xl sm:text-2xl md:text-3xl text-[#121212] mb-4 sm:mb-6 tracking-tight uppercase italic leading-tight drop-shadow-[0_0_15px_rgba(0,0,0,0.05)]">
                  {slides[activeSlide].title}
                </h3>

                <p className="font-merriweather text-slate-500 text-sm sm:text-base lg:text-lg leading-[1.6] sm:leading-[1.8] mb-8 sm:mb-10 tracking-wide">
                  {slides[activeSlide].text}
                </p>

                {/* Dynamic Stats Row */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 py-6 sm:py-8 border-y border-slate-50 w-full">
                  {slides[activeSlide].metrics.map((stat, i) => (
                    <div key={i} className="flex flex-col items-center md:items-start">
                      <span className="font-mono text-[8px] sm:text-[9px] text-gray-400 uppercase tracking-widest mb-1">{stat.label}</span>
                      <span className="font-garamond font-black text-base sm:text-xl text-[#121212]">{stat.value}</span>
                      <span className="font-ptsans text-[7px] sm:text-[8px] text-[#E1261C] uppercase font-bold mt-1 opacity-70">{stat.sub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Glassmorphic Navigation Arrows */}
              <div className="flex items-center gap-4 sm:gap-6 justify-center md:justify-end mt-8 sm:mt-12 w-full">
                <button 
                  onClick={prevSlide}
                  className="group relative w-14 h-14 rounded-full flex items-center justify-center bg-white/40 backdrop-blur-xl border border-slate-200 hover:border-slate-400 transition-all duration-500 overflow-hidden group-hover/main:animate-pulse"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-gray-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <ChevronLeft className="relative z-10 w-6 h-6 text-slate-400 group-hover:text-[#121212] transition-colors" />
                </button>
                
                <button 
                  onClick={nextSlide}
                  title="Next Slide"
                  className="group relative w-14 h-14 rounded-full flex items-center justify-center bg-white/40 backdrop-blur-xl border border-slate-200 hover:border-slate-400 transition-all duration-500 overflow-hidden group-hover/main:animate-pulse"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-gray-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <ChevronRight className="relative z-10 w-6 h-6 text-slate-400 group-hover:text-[#121212] transition-colors" />
                </button>
              </div>

              {/* Animated Loading Bar */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-50">
                <motion.div 
                  key={`loader-${activeSlide}`}
                  className="h-full bg-[#E1261C] shadow-[0_0_10px_#E1261C]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 8, ease: "linear" }}
                  onAnimationComplete={nextSlide}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const LandingPage = () => {
  return (
    <div className="relative min-h-screen bg-[#FAFAFA] text-[#444444] font-merriweather selection:bg-[#E1261C] selection:text-white overflow-x-hidden cursor-default w-full">
      <TopStatusBar />
      <NewsTicker />
      
      {/* ─── NEW HERO SECTION ─── */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-24 sm:pt-28 lg:pt-32 pb-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neural-glow opacity-50 -translate-y-1/2 translate-x-1/2" />
          <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[150px]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(var(--neural-black) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: Content (lg:col-span-5) */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            variants={staggerContainer}
            className="lg:col-span-5 flex flex-col gap-6 sm:gap-8 items-center text-center lg:items-start lg:text-left px-2 sm:px-0"
          >
            <motion.div variants={fadeIn} className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-[#E1261C]/10">
                <Sparkles className="w-4 h-4 text-[#E1261C]" />
              </div>
              <span className="font-mono font-bold text-[10px] uppercase tracking-[0.3em] text-gray-500">
                The Neural Times 2.0
              </span>
            </motion.div>
            
            <motion.h1 
              className="font-garamond font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.15] sm:leading-[1.2] tracking-tighter text-[#121212]"
            >
              Latest News,<br />
              <TypewriterText 
                phrases={["Now Automated.", "Now AI-Powered.", "Now Intelligent."]}
                className="bg-gradient-to-r from-[#E1261C] via-purple-600 to-[#E1261C] bg-[length:200%_auto] bg-clip-text text-transparent inline-block whitespace-nowrap"
              />
            </motion.h1>

            {/* Add global style for the gradient animation if not present */}
            <style>{`
              @keyframes gradientMove {
                0% { background-position: 0% 50%; }
                100% { background-position: 200% 50%; }
              }
            `}</style>
            
            <motion.p 
              variants={fadeIn}
              className="font-merriweather text-lg text-gray-500 max-w-md leading-relaxed"
            >
              AI-powered news aggregation that filters the noise and delivers what matters — <span className="text-purple-600 font-bold italic">instantly.</span>
            </motion.p>
            
            {/* Feature Grid */}
            <motion.div variants={fadeIn} className="grid grid-cols-2 gap-3 mt-2 w-full max-w-sm lg:max-w-none mx-auto lg:mx-0">
              {[
                { icon: Zap, label: 'AI-Powered Summaries', bg: 'bg-red-50', color: 'text-red-500' },
                { icon: Clock, label: 'Real-time Updates', bg: 'bg-purple-50', color: 'text-purple-500' },
                { icon: ShieldCheck, label: 'Trusted Sources', bg: 'bg-blue-50', color: 'text-blue-500' },
                { icon: Layers, label: 'Custom Feed', bg: 'bg-orange-50', color: 'text-orange-500' }
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`p-2 rounded-lg ${f.bg}`}>
                    <f.icon className={`w-4 h-4 ${f.color}`} />
                  </div>
                  <span className="font-ptsans font-bold text-[10px] text-gray-700 leading-tight uppercase tracking-tight">{f.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Buttons */}
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 md:gap-6 mt-2 sm:mt-4 w-full max-w-sm lg:max-w-none mx-auto lg:mx-0">
              <Link 
                to="/home"
                className="btn-premium group text-center"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Explore Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              
              <button 
                onClick={() => document.getElementById('intelligent-services')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex items-center justify-center gap-3 px-8 py-4 font-montserrat font-bold text-[11px] uppercase tracking-[0.2em] text-gray-500 border-2 border-gray-100 rounded-lg backdrop-blur-xl bg-white/40 hover:bg-white hover:shadow-[0_0_20px_rgba(192,192,192,0.5)] hover:border-gray-300 transition-all duration-300"
              >
                Explore Services
                <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all" />
              </button>
            </motion.div>

            {/* Bottom Features */}
            <motion.div variants={fadeIn} className="flex flex-wrap items-center gap-8 mt-6">
              {[
                { icon: Shield, label: 'No Ads' },
                { icon: Sparkles, label: 'AI Summaries' },
                { icon: Rss, label: 'Custom RSS' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 text-purple-600" />
                  <span className="font-ptsans font-bold text-[10px] uppercase tracking-widest text-gray-400">{item.label}</span>
                </div>
              ))}
            </motion.div>

            {/* Social Proof */}
            <motion.div variants={fadeIn} className="flex items-center gap-4 mt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="font-inter text-[11px] text-gray-400 leading-relaxed">
                Join <span className="text-[#121212] font-bold">20,000+ smart readers</span><br />
                who get news differently.
              </p>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN: Browser Mockup (lg:col-span-7) */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-7 relative w-full max-w-full overflow-hidden"
          >
            {/* The Browser Frame */}
            <div className="relative rounded-3xl overflow-hidden bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-100 ring-1 ring-black/5">
              {/* Browser Header */}
              <div className="h-10 sm:h-14 bg-gray-50/80 backdrop-blur-md border-b border-gray-200 flex items-center px-3 sm:px-6 justify-between">
                <div className="flex gap-1.5 sm:gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-400" />
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 max-w-[180px] sm:max-w-md mx-auto h-6 sm:h-8 bg-white/80 border border-gray-200 rounded-lg flex items-center px-2 sm:px-4 gap-1.5 sm:gap-2">
                  <ShieldCheck className="w-3 h-3 text-gray-400 shrink-0" />
                  <span className="text-[9px] sm:text-[10px] font-inter text-gray-500 truncate">neural-times.com</span>
                </div>
                <div className="w-8 sm:w-20" />
              </div>

              {/* Browser Content */}
              <div className="bg-white p-4 sm:p-6 lg:p-8 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
                  
                  {/* Mockup Main Content */}
                  <div className="md:col-span-8 space-y-6 lg:space-y-8">
                    <div className="flex justify-between items-end border-b-2 border-gray-100 pb-3 sm:pb-4">
                      <h2 className="font-garamond font-black text-lg sm:text-2xl lg:text-3xl text-[#121212] tracking-tighter italic">THE NEURAL TIMES</h2>
                      <div className="flex items-center gap-2 font-mono text-[9px] text-gray-400 uppercase tracking-widest">
                        GLOBAL FEED <Layers className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Top Story */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E1261C] animate-pulse" />
                        <span className="font-montserrat font-black text-[9px] uppercase tracking-[0.3em] text-[#E1261C]">Viral Signal Detected</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 items-center bg-gray-50/50 rounded-2xl p-4 sm:p-6 border border-gray-100">
                        <div className="space-y-4">
                          <h3 className="font-garamond font-black text-lg sm:text-2xl text-[#121212] leading-tight hover:text-[#E1261C] transition-colors cursor-pointer tracking-tight">
                            AIADMK Faction Support to TVK: Political Shift
                          </h3>
                          <p className="text-[11px] text-gray-500 leading-relaxed font-inter opacity-80">
                            Neural analysis identifies major narrative surge across Tamil Nadu digital platforms.
                          </p>
                          <div className="flex items-center gap-4 text-[9px] text-gray-400 font-mono uppercase tracking-widest">
                            <span>High Velocity</span>
                            <span>•</span>
                            <span>Verified</span>
                          </div>
                        </div>
                        <div className="rounded-xl overflow-hidden bg-white shadow-md aspect-[4/3] border border-gray-100 p-2">
                          <img 
                            src="/political_shift.png" 
                            alt="Political Shift" 
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=400";
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Smaller News Cards */}
                    <div className="space-y-4 pt-6 border-t border-gray-100">
                      {[
                        { title: 'Global Markets Stabilize Amid Policy Shift', tag: 'MARKETS', color: 'text-blue-500', img: '/market_shift.png', fallback: 'https://images.unsplash.com/photo-1611974714652-7624bf999b80?auto=format&fit=crop&q=80&w=200' },
                        { title: 'Neural Synthesis+ Reaches 99% Accuracy', tag: 'SYSTEM', color: 'text-[#E1261C]', img: '/ai_editor.png', fallback: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=200' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
                          <div className="w-14 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                            <img 
                              src={item.img} 
                              alt={item.tag} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = item.fallback;
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <span className={`font-montserrat font-bold text-[8px] uppercase tracking-widest ${item.color}`}>{item.tag}</span>
                            <h4 className="font-garamond font-black text-sm text-[#121212] leading-tight mt-1">{item.title}</h4>
                          </div>
                          <ArrowRight className="w-3 h-3 text-gray-300" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mockup Sidebar (hidden on mobile, shown md+) */}
                  <div className="hidden md:block md:col-span-4 space-y-8">
                    {/* Market Overview */}
                    <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-montserrat font-bold text-[10px] uppercase tracking-widest text-gray-500">Market Overview</h4>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span className="text-[8px] font-mono font-bold text-green-600">LIVE</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {[
                          { name: 'S&P 500', price: '5,344.20', change: '+1.23%', color: 'text-green-500' },
                          { name: 'NIFTY 50', price: '22,957.10', change: '+0.85%', color: 'text-green-500' },
                          { name: 'NASDAQ', price: '16,832.90', change: '+1.68%', color: 'text-green-500' }
                        ].map((m, i) => (
                          <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-2">
                            <div>
                              <p className="text-[10px] font-bold text-[#121212]">{m.name}</p>
                              <p className="text-[9px] text-gray-400 font-mono">{m.price}</p>
                            </div>
                            <div className="text-right">
                              <p className={`text-[9px] font-bold ${m.color}`}>{m.change}</p>
                              <div className="w-8 h-4 bg-green-500/10 rounded-sm overflow-hidden mt-1">
                                <svg className="w-full h-full" viewBox="0 0 30 10">
                                  <path d="M0 8 Q 15 2, 30 5" stroke="#22C55E" strokeWidth="1" fill="none" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="w-full py-2 bg-white border border-gray-200 rounded-lg text-[8px] font-bold text-gray-400 hover:bg-gray-100 transition-colors">
                        View Full Market
                      </button>
                    </div>

                    {/* Trending Topics */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-200 space-y-4 shadow-sm">
                      <h4 className="font-montserrat font-bold text-[10px] uppercase tracking-widest text-gray-500">Trending Topics</h4>
                      <div className="space-y-4">
                        {[
                          { topic: 'QuantumComputing', count: '12.5K articles', color: 'text-purple-500' },
                          { topic: 'AIRegulation', count: '8.2K articles', color: 'text-blue-500' },
                          { topic: 'AutomationEra', count: '6.7K articles', color: 'text-pink-500' }
                        ].map((t, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className={`w-1.5 h-1.5 rotate-45 ${t.color.replace('text', 'bg')}`} />
                            <div>
                              <p className={`text-[9px] font-bold ${t.color}`}>#{t.topic}</p>
                              <p className="text-[8px] text-gray-400 uppercase tracking-tighter">{t.count}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="w-full py-2 text-[8px] font-bold text-gray-400 border-t border-gray-100 mt-2 hover:text-[#121212] transition-colors">
                        Explore All Trends
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Stats Banner in Mockup */}
                <div className="mt-6 lg:mt-8 rounded-2xl bg-gradient-to-r from-purple-600 to-[#E1261C] p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                  <div className="text-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white">20,000+ Articles Processed Today</p>
                    <p className="text-[8px] text-white/90 uppercase tracking-tighter">From 500+ Verified Sources</p>
                  </div>
                  <div className="flex -space-x-1.5 sm:-space-x-2 shrink-0">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-6 h-6 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-[8px] text-white">
                         <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="User" className="w-full h-full rounded-full object-cover" />
                      </div>
                    ))}
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] text-white font-bold backdrop-blur-sm">+</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements around Mockup */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-[#E1261C]/10 rounded-full blur-3xl" />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-gray-400">Scroll to discover</span>
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center"
          >
            <div className="w-1 h-2 bg-[#E1261C] rounded-full" />
          </motion.div>
        </motion.div>
      </section>


      {/* ─── INTELLIGENT SERVICES FOR GLOBAL IMPACT ─── */}
      <section id="intelligent-services" className="py-16 sm:py-20 px-4 sm:px-6 bg-[#FAFAFA] relative overflow-hidden border-y border-gray-100">
        {/* Technical Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
          style={{ backgroundImage: 'linear-gradient(#121212 1px, transparent 1px), linear-gradient(90deg, #121212 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />

        {/* Silver Ambient Glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gray-200/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gray-300/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-[#E1261C] shadow-[0_0_8px_#E1261C]" />
              <span className="font-mono text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Our Services</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              className="font-garamond font-black text-2xl sm:text-3xl md:text-4xl text-[#121212] tracking-tighter uppercase mb-4 leading-tight"
            >
              INTELLIGENT SERVICES <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-gray-600 via-gray-400 to-gray-600 bg-clip-text text-transparent italic">FOR GLOBAL IMPACT.</span>
            </motion.h2>
            
            <motion.p
               initial={{ opacity: 0 }}
               whileInView={{ opacity: 1 }}
               viewport={{ once: false, amount: 0.2 }}
               className="font-merriweather text-sm md:text-base text-gray-500 max-w-2xl mx-auto"
            >
              How True Twist AI Empowers Your Newsroom.
            </motion.p>
          </div>

          {/* ─── PREMIUM SERVICE SLIDER ─── */}
          <div className="relative mt-12">
            <ServiceSlider />
          </div>

          {/* Operational Status Badge */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex justify-center"
          >
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-gray-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)]">
              <div className="w-2 h-2 rounded-full bg-[#E1261C] animate-pulse shadow-[0_0_10px_#E1261C]" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#E1261C]">
                Operational Status: SECURE
              </span>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ─── AI EDITORIAL ENGINE: DATA-TO-STORY SHOWCASE ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#ffffff] relative overflow-hidden">
        {/* Subtle Background Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#111111 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
          <div className="absolute top-1/4 -left-10 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 -right-10 w-80 h-80 bg-[#E1261C]/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-[1320px] mx-auto relative z-10">
          <SectionHeader 
            badge="AI Editorial Engine"
            title="From Data to Story in Milliseconds"
            subtitle={<>Transform raw signals into <span className="bg-gradient-to-r from-[#E1261C] to-purple-600 bg-clip-text text-transparent font-bold">publication-ready editorial graphics</span> with AI-powered automation.</>}
          />

          {/* Main Showcase Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-[28px] items-stretch mt-10">
            
            {/* LEFT PANEL: RAW DATA PROCESSING */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              className="bg-white border border-[#e8ecf3] rounded-[24px] p-4 sm:p-5 md:p-7 shadow-[0_20px_60px_rgba(15,23,42,0.06)] relative flex flex-col min-h-[460px] sm:min-h-[500px] lg:h-[620px] overflow-hidden"
            >
              <div className="flex justify-between items-center mb-7 h-[40px]">
                <div className="px-3.5 py-1.5 border border-[#e8ecf3] rounded-full bg-gray-50 flex items-center gap-2">
                  <Cpu className="w-3 h-3 text-purple-600" />
                  <span className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest">Raw Data Ingestion</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">Live Syncing</span>
                </div>
              </div>

              {/* Code Editor Container */}
              <div className="bg-[#f8fafc] border border-[#e8ecf3] rounded-[20px] p-4 sm:p-6 lg:p-8 font-mono text-[11px] sm:text-[12px] lg:text-[14px] leading-[1.8] sm:leading-[2] shadow-sm relative z-10 flex-1 overflow-x-auto overflow-y-hidden">
                <div className="space-y-0 text-gray-500 min-w-[240px]">
                  <span className="text-gray-400">{"{"}</span>
                  <div className="pl-4 sm:pl-6"><span className="text-[#2563eb]">"source"</span><span className="text-gray-300">:</span> <span className="text-gray-600">"GlobalTrends"</span>,</div>
                  <div className="pl-4 sm:pl-6"><span className="text-[#2563eb]">"topic"</span><span className="text-gray-300">:</span> <span className="text-gray-600">"Global Markets"</span>,</div>
                  <div className="pl-4 sm:pl-6"><span className="text-[#2563eb]">"velocity"</span><span className="text-gray-300">:</span> <span className="text-gray-600">"High"</span>,</div>
                  <div className="pl-4 sm:pl-6"><span className="text-[#2563eb]">"raw_text"</span><span className="text-gray-300">:</span> <span className="text-gray-600">"Tech stocks surge..."</span>,</div>
                  <div className="pl-4 sm:pl-6"><span className="text-[#2563eb]">"sentiment"</span><span className="text-gray-300">:</span> <span className="text-gray-600">0.84</span>,</div>
                  <div className="pl-4 sm:pl-6"><span className="text-[#2563eb]">"action"</span><span className="text-gray-300">:</span> <span className="text-gray-600">"process"</span></div>
                  <span className="text-gray-400">{"}"}</span>
                </div>

                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200/30 space-y-1">
                  <div className="text-[#7c3aed] font-bold text-[10px] sm:text-[11px] uppercase tracking-widest">[FETCHING IMAGE: SEC_14_AI]</div>
                  <div className="text-[#7c3aed] font-bold text-[10px] sm:text-[11px] uppercase tracking-widest">[APPLYING FILTER: CONTRAST_MAX]</div>
                  <div className="text-[#7c3aed] font-bold text-[10px] sm:text-[11px] uppercase tracking-widest">[OVERLAY TEXT: "MARKET SURGE"]</div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-green-500" />
                    <span className="text-green-600 font-bold text-[10px] sm:text-[11px] uppercase tracking-widest">[STATUS: COMPLETE]</span>
                  </div>
                </div>
              </div>

              {/* Bottom Metrics Bar: 2x2 on mobile, 4-col on md+ */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-[10px] sm:gap-[12px] mt-5 sm:mt-6">
                {[
                  { icon: Zap, val: '152ms', label: 'Processing' },
                  { icon: ShieldCheck, val: '99.9%', label: 'Accuracy' },
                  { icon: Layers, val: '12', label: 'Streams' },
                  { icon: CheckCircle, val: 'Live', label: 'Status' }
                ].map((m, i) => (
                  <div key={i} className="bg-[#f8fafc] rounded-xl p-2.5 sm:p-3 border border-[#e8ecf3] flex flex-col items-center justify-center text-center h-[76px] sm:h-[92px]">
                    <m.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 mb-1 sm:mb-1.5" />
                    <span className="text-[13px] sm:text-[14px] font-black text-[#111111] leading-none mb-1">{m.val}</span>
                    <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest">{m.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT PANEL: AI GENERATED STORY */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              className="bg-white border border-[#e8ecf3] rounded-[24px] p-4 sm:p-5 md:p-7 shadow-[0_20px_60px_rgba(15,23,42,0.06)] relative flex flex-col min-h-[400px] sm:min-h-[500px] lg:h-[620px] overflow-hidden"
            >
              <div className="bg-[#05070d] rounded-[20px] sm:rounded-[22px] h-full relative overflow-hidden flex flex-col shadow-2xl p-4 sm:p-6 lg:p-7 w-full">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
                
                {/* Top Label Bar */}
                <div className="flex justify-between items-start relative z-10 mb-8">
                  <div className="bg-[#ff4d4f] px-2.5 py-1 rounded text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-white">Neural Graphic</div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/10 p-2.5 rounded-lg text-right w-[110px] h-[72px] flex flex-col justify-center">
                    <p className="text-green-400 font-black text-[15px] leading-none mb-1">+4.35%</p>
                    <p className="text-[8px] font-bold text-white/50 uppercase tracking-widest leading-none">Market Move</p>
                  </div>
                </div>

                {/* Main Visual: Enhanced Candlestick Chart */}
                <div className="flex-1 relative mb-8">
                  <svg className="w-full h-full opacity-60" viewBox="0 0 400 160">
                    {[0, 40, 80, 120, 160].map(y => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />)}
                    
                    {/* Multi-Trend Lines */}
                    <motion.path d="M0 120 Q 50 130, 100 100 T 200 110 T 300 80 T 400 60" stroke="#22d3ee" strokeWidth="1.5" fill="none" opacity="0.6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.5 }} />
                    <motion.path d="M0 110 Q 70 120, 150 90 T 300 100 T 400 70" stroke="#facc15" strokeWidth="1" fill="none" opacity="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 0.5 }} />
                    <motion.path d="M0 130 Q 30 140, 120 110 T 250 120 T 400 80" stroke="#a855f7" strokeWidth="1" fill="none" opacity="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 0.8 }} />

                    {[...Array(12)].map((_, i) => {
                      const x = 30 + (i * 30);
                      const isUp = i % 3 !== 0;
                      const h = 20 + (Math.abs(Math.sin(i)) * 40);
                      const y = 80 - h/2 + (Math.cos(i) * 15);
                      return (
                        <g key={i}>
                          <line x1={x} y1={y-4} x2={x} y2={y+h+4} stroke={isUp ? "#10b981" : "#ef4444"} strokeWidth="1" />
                          <rect x={x-3} y={y} width="6" height={h} fill={isUp ? "#10b981" : "#ef4444"} fillOpacity="0.8" />
                        </g>
                      )
                    })}
                    <motion.circle cx="270" cy="90" r="12" stroke="#ff4d4f" strokeWidth="1.5" fill="none" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                  </svg>

                  {/* Confidence Score Overlay */}
                  <div className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 text-right">
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Confidence Score</p>
                    <p className="text-[32px] sm:text-[44px] font-black text-[#ff4d4f] tracking-tighter leading-none">98.7% <span className="text-green-400 text-base sm:text-xl">↗</span></p>
                  </div>
                </div>

                {/* Headline Section */}
                <div className="relative z-10">
                  <div className="w-10 h-[2px] bg-[#E1261C] mb-3 sm:mb-5" />
                  <h3 className="font-playfair font-black text-white tracking-tighter leading-[0.95] mb-4 sm:mb-6 uppercase"
                    style={{ fontSize: 'clamp(1.6rem, 5vw, 3.25rem)' }}>
                    Tech Stocks Surge Following AI Pivot.
                  </h3>
                  <div className="flex justify-between items-center opacity-40">
                    <p className="font-mono text-[9px] text-white uppercase tracking-[0.4em]">Via The Neural Times</p>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 rounded-full bg-red-500" />
                      <div className="w-1 h-1 rounded-full bg-white" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Feature Strip (20% height target) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            className="relative mt-[36px] bg-white border border-[#e8ecf3] rounded-[24px] p-6 lg:p-8 min-h-[150px] shadow-[0_20px_60px_rgba(15,23,42,0.06)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-center"
          >
            {[
              { t: 'AI-Powered Synthesis', d: 'Transforms complex data into meaningful stories.', icon: Cpu, c: 'bg-purple-50 text-purple-600' },
              { t: 'Instant Visualization', d: 'Publication-ready graphics in milliseconds.', icon: ImageIcon, c: 'bg-blue-50 text-blue-600' },
              { t: 'Verified & Reliable', d: 'Multi-layer validation ensures accuracy and trust.', icon: ShieldCheck, c: 'bg-green-50 text-green-600' },
              { t: 'Automated Workflow', d: 'End-to-end automation from ingestion to publication.', icon: Zap, c: 'bg-red-50 text-red-600' }
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${f.c}`}>
                  <f.icon className="w-7 h-7" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-playfair font-black text-[18px] text-[#111111] uppercase tracking-tighter mb-0.5 truncate">{f.t}</h4>
                  <p className="font-inter text-[13px] text-[#6b7280] leading-tight truncate">{f.d}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── LIVE STATISTICS SECTION ─── */}
      <section className="py-16 sm:py-20 border-y border-gray-100 bg-[#FAFAFA] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#121212 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <SectionHeader 
            badge="Live Ecosystem"
            title="Institutional Growth & Reach"
            subtitle="Real-time performance metrics from the global neural network."
          />
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {[
              { value: 1000, suffix: '+', label: 'News Fetched Daily' },
              { value: 300, suffix: '+', label: 'Automated Posts' },
              { value: 99.9, suffix: '%', label: 'AI Accuracy' }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative text-center py-6"
              >
                <h3 className="font-garamond text-4xl md:text-6xl font-black text-[#121212] mb-3">
                  <StatCounter value={stat.value} suffix={stat.suffix} />
                </h3>
                <p className="font-ptsans text-[10px] uppercase tracking-[0.3em] text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── THE FUTURE OF AI-DRIVEN MEDIA SECTION ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 bg-[#f6f4f3] relative overflow-hidden">
        {/* Subtle Luxury Grid Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.04]" 
            style={{ 
              backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', 
              backgroundSize: '60px 60px' 
            }} 
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Heading */}
          <div className="text-center mb-12 sm:mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-5"
            >
              <span className="font-garamond text-xs md:text-sm text-gray-400 tracking-[0.4em] uppercase font-bold">The Future of</span>
              <span className="font-garamond font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#1a1a1a] tracking-tighter uppercase leading-[0.95] italic">
                AI-Driven Media.
              </span>
            </motion.h2>
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ width: '120px', opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="h-[3px] bg-[#ff4d4d] mx-auto mt-12 rounded-full shadow-[0_0_15px_rgba(255,77,77,0.3)]"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-stretch mt-12 sm:mt-16 px-2 sm:px-0">
            {/* LEFT CARD — “LEGACY MEDIA FRICTION” */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group relative p-6 sm:p-10 md:p-12 rounded-[24px] bg-white border border-black/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.02)] flex flex-col justify-between overflow-hidden min-h-[460px] sm:min-h-[480px] transition-all duration-500"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8 sm:mb-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                    <History className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                  </div>
                  <h3 className="font-garamond font-black text-2xl sm:text-3xl text-gray-800 uppercase tracking-tight leading-none">Legacy Media Friction</h3>
                </div>
                
                <ul className="space-y-8 sm:space-y-8">
                  {[
                    { t: 'Manual Research', d: 'Hours spent scouring endless feeds for relevant signals.', icon: Search },
                    { t: 'Slow Publishing', d: 'News becomes stale by the time it passes manual review.', icon: Clock },
                    { t: 'High Editing Costs', d: 'Expensive overhead for manual script and media creation.', icon: DollarSign }
                  ].map((item, i) => (
                    <li key={i} className="flex gap-5 sm:gap-8 group/item">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 transition-colors group-hover/item:bg-gray-100">
                        <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="font-ptsans font-bold text-[13px] sm:text-sm text-gray-800 uppercase tracking-[0.1em] mb-1.5">{item.t}</h4>
                        <p className="font-merriweather text-[13px] sm:text-[14px] text-gray-500 leading-relaxed max-w-sm">{item.d}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-12 opacity-30 grayscale pointer-events-none">
                <div className="h-1 bg-gray-200 w-full rounded-full overflow-hidden">
                  <div className="h-full bg-gray-400 w-1/3" />
                </div>
                <p className="font-mono text-[9px] mt-2 text-gray-500 uppercase tracking-widest">Inefficiency Detected</p>
              </div>
            </motion.div>

            {/* RIGHT CARD — “THE TRUE TWIST ADVANTAGE” */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, boxShadow: '0 40px 80px -20px rgba(255, 77, 77, 0.12)' }}
              className="group relative p-6 sm:p-10 md:p-12 rounded-[24px] bg-white border border-[#ff4d4d]/10 shadow-[0_20px_50px_rgba(255,77,77,0.03)] flex flex-col justify-between overflow-hidden min-h-[460px] sm:min-h-[480px] transition-all duration-500"
            >
              {/* Soft Red Glow Orb */}
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#ff4d4d]/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-[#ff4d4d]/10 transition-colors duration-700" />
              
              {/* Floating Particles (CSS Animation) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                 {[...Array(5)].map((_, i) => (
                   <motion.div 
                     key={i}
                     animate={{ 
                       y: [0, -100], 
                       opacity: [0, 0.3, 0],
                       x: [0, (i % 2 === 0 ? 20 : -20)]
                     }}
                     transition={{ 
                       duration: 4 + i, 
                       repeat: Infinity, 
                       delay: i * 0.8,
                       ease: "linear"
                     }}
                     className="absolute bottom-0 w-1 h-1 bg-[#ff4d4d] rounded-full"
                     style={{ left: `${20 + i * 15}%` }}
                   />
                 ))}
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8 sm:mb-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#ff4d4d]/5 flex items-center justify-center border border-[#ff4d4d]/10 shadow-[0_0_20px_rgba(255,77,77,0.1)] group-hover:scale-110 transition-transform duration-500 shrink-0">
                    <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-[#ff4d4d]" />
                  </div>
                  <h3 className="font-garamond font-black text-2xl sm:text-3xl text-gray-900 uppercase tracking-tight italic leading-none">The True Twist Advantage</h3>
                </div>
                
                <ul className="space-y-8 sm:space-y-8">
                  {[
                    { t: 'Uninterrupted Market Presence', d: 'Your platform stays active around the clock, capturing and publishing trending stories while you sleep.', icon: Globe },
                    { t: 'High-Engagement Content Engine', d: "Generate professional-grade editorial content tailored to your audience's voice, ensuring maximum reach and impact.", icon: Activity },
                    { t: 'Infinite Creative Output', d: 'Automatically produce high-quality visual assets and social media graphics for every story without needing a design team.', icon: Sparkles }
                  ].map((item, i) => (
                    <li key={i} className="flex gap-5 sm:gap-8 group/item">
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#ff4d4d]/5 flex items-center justify-center shrink-0 border border-[#ff4d4d]/10 transition-all group-hover/item:border-[#ff4d4d]/30 group-hover/item:shadow-[0_0_15px_rgba(255,77,77,0.2)]">
                        <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff4d4d]" />
                        <motion.div 
                          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-lg border border-[#ff4d4d] opacity-0 group-hover/item:opacity-100"
                        />
                      </div>
                      <div>
                        <h4 className="font-ptsans font-bold text-[13px] sm:text-sm text-gray-900 uppercase tracking-[0.1em] mb-1.5">{item.t}</h4>
                        <p className="font-merriweather text-[13px] sm:text-[14px] text-gray-600 leading-relaxed max-w-sm">{item.d}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Neural Activity Indicator */}
              <div className="mt-12 flex items-center justify-between bg-gray-50/50 border border-black/[0.03] rounded-2xl p-6 relative overflow-hidden group/indicator">
                <div className="flex items-center gap-4 relative z-10">
                  <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
                  </div>
                  <span className="font-mono text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">Neural Engine: Active</span>
                </div>
                <div className="flex gap-1 relative z-10">
                  {[...Array(4)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [4, 12, 4] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-1 bg-[#ff4d4d]/40 rounded-full"
                    />
                  ))}
                </div>
                <motion.div 
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-[#ff4d4d]/5 to-transparent pointer-events-none"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      {/* ─── BOTTOM CTA ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 border-t border-gray-200 bg-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#E1261C]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
          >
            <h2 className="font-garamond font-black text-3xl sm:text-5xl md:text-6xl text-[#121212] mb-6 tracking-tighter leading-[0.95]">
              Secure Your <span className="text-[#E1261C]">Market Advantage.</span>
            </h2>
            <p className="font-merriweather italic text-gray-500 text-base md:text-xl mb-10 max-w-2xl mx-auto">
              Deploy the world's most advanced autonomous news architecture today.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                to="/subscription" 
                className="group relative inline-flex items-center justify-center px-12 py-6 font-ptsans font-black text-[12px] uppercase tracking-[0.4em] text-white bg-[#121212] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all"
              >
                <div className="absolute inset-0 bg-[#E1261C] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                <span className="relative flex items-center gap-4 z-10">
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </Link>

              <button className="px-12 py-6 font-ptsans font-bold text-[11px] uppercase tracking-[0.3em] text-gray-400 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
                Book Enterprise Demo
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 opacity-40">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span className="font-mono text-[9px] uppercase tracking-widest font-bold">No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-mono text-[9px] uppercase tracking-widest font-bold">GDPR Compliant</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── ELITE FOOTER ─── */}
      <footer className="py-12 border-t border-gray-200 bg-[#FAFAFA] text-center cursor-default">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="font-garamond font-black text-2xl italic text-gray-300 tracking-tighter">
            THE NEURAL TIMES
          </div>
          <div className="w-12 h-[2px] bg-[#E1261C]" />
          <p className="font-ptsans font-bold text-[8px] uppercase tracking-[0.4em] text-gray-400">
            © {new Date().getFullYear()} Neural Media Architecture. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4">
            <div className="flex items-center gap-2 text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="font-mono text-[8px] uppercase tracking-widest">System Online</span>
            </div>
            <div className="hidden sm:block w-[1px] h-3 bg-gray-200" />
            <a 
              href="https://truetwist.in/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-ptsans font-bold text-[8px] uppercase tracking-[0.2em] text-gray-400 hover:text-[#E1261C] transition-colors"
            >
              Design by TrueTwist
            </a>
            <div className="hidden sm:block w-[1px] h-3 bg-gray-200" />
            <a 
              href="https://369network.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-ptsans font-bold text-[8px] uppercase tracking-[0.2em] text-gray-400 hover:text-[#E1261C] transition-colors"
            >
              Marketing by 369 Network
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
