import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageTransition from './PageTransition';
import NumberCounter from './NumberCounter';

const letterVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: (i) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.03,
      duration: 0.6,
      ease: [0.2, 1, 0.2, 1]
    }
  })
};

const AnimatedHeading = ({ text, className }) => {
  return (
    <motion.h2 
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.3 }}
      className={className}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={letterVariants}
          style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
    </motion.h2>
  );
};

const AboutPage = () => {
  const navigate = useNavigate();

  const stats = [
    { value: 10000, suffix: 'K+', label: 'Active Readers', color: '#cc0000' },
    { value: 2500,  suffix: 'K+', label: 'News Sources', color: '#121212' },
    { value: 24,    suffix: '/7',  label: 'Live Coverage', color: '#cc0000' },
    { value: 50,    suffix: '+',   label: 'Countries',     color: '#121212' },
  ];

  const steps = [
    { num: '01', title: 'Deep-Tech Analysis',    desc: 'Neural networks process global data, extracting key insights and trends in real-time.', color: '#cc0000' },
    { num: '02', title: 'Human-Driven Curation', desc: 'Our editorial team adds nuance and context, ensuring journalistic integrity.', color: '#121212' },
    { num: '03', title: 'Dynamic Storytelling',  desc: 'Insights are translated into compelling, personalized audio narratives.', color: '#cc0000' },
    { num: '04', title: 'Global Delivery',       desc: 'Content is published and broadcast to a connected, engaged audience.', color: '#121212' },
  ];

  const values = [
    { title: 'Accuracy First',   desc: 'We verify every story through multiple sources before it reaches you.' },
    { title: 'Speed & Depth',    desc: 'Breaking news delivered instantly, with the context and depth you need.' },
    { title: 'AI-Powered',       desc: 'Cutting-edge AI helps us find, analyze, and present stories faster than ever.' },
    { title: 'Always On',        desc: '24/7 global coverage so you never miss what matters most.' },
  ];

  const hubs = [
    { city: 'New Delhi', status: 'Master Hub', time: 'GMT +5:30' },
    { city: 'Mumbai', status: 'Financial Bureau', time: 'GMT +5:30' },
    { city: 'London', status: 'Global Desk', time: 'GMT +0:00' },
    { city: 'New York', status: 'America Node', time: 'GMT -5:00' },
    { city: 'Tokyo', status: 'Asia Pacific', time: 'GMT +9:00' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 1, 0.2, 1] } }
  };

  return (
    <PageTransition>
      <div className="w-full min-h-screen bg-[#fdfaf5] text-black font-serif overflow-x-hidden selection:bg-red-600 selection:text-white pt-48 pb-24">
        {/* Paper Texture Overlay */}
        <motion.div 
          className="fixed inset-0 opacity-[0.05] pointer-events-none z-0" 
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")' }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        {/* ── NEWSPAPER MASTHEAD ── */}
        <header className="pt-32 pb-16 border-b-4 border-black px-6 md:px-12 xl:px-24 bg-white/50 relative z-10 overflow-hidden">
          <div className="max-w-[1400px] mx-auto text-center relative">
            <motion.div initial="hidden" whileInView="visible" className="flex justify-between items-center mb-4 px-2">
              <motion.span variants={itemVariants} className="text-[10px] font-sans font-black uppercase tracking-[0.3em] opacity-40">Issue No. 001 // Special Editorial</motion.span>
              <motion.span variants={itemVariants} className="text-[10px] font-sans font-black uppercase tracking-[0.3em] opacity-40 text-right">Location: New Delhi Global Hub</motion.span>
            </motion.div>
            
            <div className="overflow-hidden mb-6 border-b border-black/10 pb-6">
              <AnimatedHeading text="Neural Gazette" className="text-3xl md:text-[80px] font-black tracking-[-0.04em] uppercase leading-none" />
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex justify-between items-center font-sans font-black text-[11px] uppercase tracking-[0.25em] pt-4"
            >
              <span className="hidden md:block">Est. 2026 // Neural Group</span>
              <div className="bg-black text-white px-8 py-2 mx-auto md:mx-0 italic skew-x-[-12deg] shadow-lg">
                The Archive: About Our Mission
              </div>
              <span className="hidden md:block">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </motion.div>
          </div>
        </header>

        {/* ── HERO SECTION ── */}
        <section className="py-24 px-6 md:px-12 xl:px-24 border-b-2 border-black relative z-10 bg-white/30">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              variants={containerVariants}
              className="lg:col-span-8 border-r-2 border-black/10 pr-0 lg:pr-16"
            >
              <motion.div variants={itemVariants} className="bg-red-600 text-white inline-block px-5 py-1.5 font-sans font-black text-[11px] uppercase tracking-widest mb-8 shadow-md">
                Master Editorial
              </motion.div>
              
              <div className="mb-10">
                <AnimatedHeading text="The Future of News is Rewritten Every Single Day." className="text-2xl md:text-[60px] font-black leading-[1.1] tracking-tighter italic" />
              </div>

              <div className="flex flex-col md:flex-row gap-12">
                <motion.p variants={itemVariants} className="text-2xl leading-relaxed text-gray-800 font-serif first-letter:text-8xl first-letter:font-black first-letter:float-left first-letter:mr-4 first-letter:leading-[0.8] first-letter:text-black">
                  In an era of information overload, Neural Gazette stands as a beacon of clarity. We combine the raw processing power of artificial intelligence with the refined judgment of seasoned journalists. Our mission is simple: to deliver news that is as deep as it is fast, ensuring transparency in every byte.
                </motion.p>
                <motion.div variants={itemVariants} className="shrink-0 w-full md:w-72 space-y-8">
                  <div className="border-t-4 border-black pt-6">
                    <p className="font-sans font-black text-[11px] uppercase tracking-[0.2em] text-red-600 mb-3">Editor's Vision</p>
                    <p className="text-base font-bold italic leading-snug text-gray-700">"AI is our engine, but human integrity remains our compass. We don't just report news; we synthesize the global truth for the connected mind."</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* STATS SECTION */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              variants={itemVariants}
              className="lg:col-span-4 bg-white p-10 border-2 border-black shadow-[20px_20px_0_rgba(0,0,0,0.05)] h-fit sticky top-32"
            >
              <AnimatedHeading text="Gazette Metrics" className="text-2xl font-black uppercase tracking-tighter border-b-4 border-black mb-10 pb-2 italic" />
              <div className="grid grid-cols-1 gap-10">
                {stats.map((stat, i) => (
                  <div key={i} className="flex justify-between items-end border-b border-black/5 pb-6 group overflow-hidden">
                    <p className="font-sans font-black text-[11px] uppercase tracking-[0.3em] text-gray-400 group-hover:text-red-600 transition-colors">{stat.label}</p>
                    <motion.p 
                      whileHover={{ scale: 1.1 }}
                      className="text-5xl font-black tracking-tighter" style={{ color: stat.color }}>
                      <NumberCounter end={stat.value} suffix={stat.suffix} duration={3000} />
                    </motion.p>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </section>

        {/* ── HOW WE WORK ── */}
        <section className="py-32 px-6 md:px-12 xl:px-24 bg-white/50 border-b-2 border-black relative z-10">
          <div className="max-w-[1400px] mx-auto text-center">
            <div className="mb-16">
              <AnimatedHeading text="The Production Cycle" className="text-3xl md:text-6xl font-black uppercase tracking-tighter italic inline-block border-b-4 border-red-600 pb-2" />
              <p className="font-sans font-black text-[10px] uppercase tracking-[0.5em] mt-6 text-gray-400">Transforming Data into Narratives</p>
            </div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.1 }}
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-2 border-black divide-x-2 divide-y-2 lg:divide-y-0 divide-black bg-white shadow-2xl"
            >
              {steps.map((step, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  whileHover={{ backgroundColor: "#fdfaf5", transition: { duration: 0.2 } }}
                  className="p-12 transition-colors group relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-10">
                    <span className="text-6xl font-black tracking-tighter opacity-10 group-hover:opacity-100 group-hover:text-red-600 transition-all duration-500">{step.num}</span>
                    <motion.div 
                      whileHover={{ width: "100%" }}
                      className="w-12 h-[2px] bg-black/10 group-hover:bg-red-600 transition-all duration-500" 
                    />
                  </div>
                  <h3 className="text-2xl font-black uppercase leading-tight mb-8 tracking-tighter">{step.title}</h3>
                  <p className="text-lg leading-relaxed text-gray-600 font-serif italic">"{step.desc}"</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── VALUES ── */}
        <section className="py-32 px-6 md:px-12 xl:px-24 relative z-10 border-b-2 border-black">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
              <div className="lg:col-span-4 lg:sticky lg:top-40">
                <AnimatedHeading text="Our Core Pillars" className="text-4xl font-black uppercase tracking-tighter leading-tight mb-6 italic" />
                <div className="w-16 h-2 bg-black mb-8" />
                <p className="text-lg leading-relaxed text-gray-500 font-serif">The Gazette is built on four non-negotiable principles that serve as the foundation for every story we synthesize and publish globally.</p>
              </div>
              
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                {values.map((val, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -10, rotate: i % 2 === 0 ? 1 : -1 }}
                    className="p-12 border-2 border-black bg-white shadow-[12px_12px_0_rgba(0,0,0,1)] cursor-default"
                  >
                    <div className="w-14 h-1.5 bg-red-600 mb-6" />
                    <h3 className="text-3xl font-black uppercase mb-6 tracking-tighter">{val.title}</h3>
                    <p className="text-gray-600 leading-relaxed italic text-lg font-serif">"{val.desc}"</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── GLOBAL HUBS ── */}
        <section className="py-32 px-6 md:px-12 xl:px-24 relative z-10 bg-[#fdfaf5]">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end border-b-4 border-black pb-10 mb-16">
              <div className="space-y-4">
                <span className="font-sans font-black text-[10px] uppercase tracking-[0.5em] text-red-600 block">World Presence</span>
                <AnimatedHeading text="Global Editions" className="text-3xl md:text-6xl font-black uppercase tracking-tighter italic" />
              </div>
              <div className="text-right max-w-md">
                <p className="text-lg font-serif italic text-gray-500 leading-relaxed">"Operating across five continents, our correspondents provide live updates from the world's most critical neural nodes."</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-0 border-2 border-black bg-white overflow-hidden shadow-2xl">
              {hubs.map((hub, i) => (
                <motion.div 
                  key={i} 
                  whileInView={{ opacity: [0, 1], y: [30, 0] }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5, borderColor: "#cc0000" }}
                  className="p-10 border-r-2 last:border-r-0 border-black/10 transition-all duration-300 group bg-white"
                >
                  <p className="font-sans font-black text-[10px] uppercase tracking-[0.3em] mb-8 text-gray-400 group-hover:text-red-600 transition-colors">{hub.time}</p>
                  <h3 className="text-3xl font-black uppercase mb-2 tracking-tighter group-hover:text-red-600 transition-colors">{hub.city}</h3>
                  <p className="text-xs font-sans font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100">{hub.status}</p>
                  <div className="mt-12 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-sans font-black uppercase tracking-widest">Active Hub</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <footer className="py-20 border-t-8 border-black px-6 md:px-12 xl:px-24 bg-white text-center">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="font-sans font-black text-[11px] uppercase tracking-[0.6em] text-gray-400">
            © 2026 NEURAL HUB PUBLISHING SYSTEMS // GLOBAL PRESS SYNDICATE // PRINTED ON RECYCLED BYTES
          </motion.p>
        </footer>
      </div>
    </PageTransition>
  );
};

export default AboutPage;
