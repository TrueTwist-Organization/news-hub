import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Disc, ArrowRight, ShieldCheck } from 'lucide-react';

const LandingPageCommandCenter = () => {
  const commandSteps = [
    { 
      id: '01',
      videoUrl: '/post.mp4', 
      title: 'Auto-Posting Protocol', 
      desc: 'Deploy high-velocity content clusters across Meta social graphs instantly with zero manual oversight. Our neural engine handles scheduling, caption optimization, and API handshakes automatically.',
      badge: 'Operational'
    },
    { 
      id: '02',
      videoUrl: '/admin.mp4', 
      title: 'Operational Oversight', 
      desc: 'Access the full-spectrum admin panel to monitor active pipelines in real-time. Manage neural sources, audit AI-generated outputs, and maintain complete control over your agency fleet.',
      badge: 'Active'
    },
    { 
      id: '03',
      videoUrl: '/secure.mp4', 
      title: 'Encrypted Security', 
      desc: 'Experience end-to-end cryptographic protection for all editorial data. Our infrastructure ensures that every packet of news is shielded from unauthorized access across the global network.',
      badge: 'Shielded'
    },
    { 
      id: '04',
      videoUrl: '/news.mp4', 
      title: 'Neural Synthesis+', 
      desc: 'The heart of the system—an advanced AI-driven content generation engine that synthesizes raw satellite data into premium, ready-to-publish editorial stories in seconds.',
      badge: 'Running'
    }
  ];

  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleNext = () => {
    setDirection(1);
    setActiveStep((prev) => (prev + 1) % commandSteps.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveStep((prev) => (prev - 1 + commandSteps.length) % commandSteps.length);
  };

  return (
    <section className="py-20 md:py-32 px-6 bg-[#FAFAFA] relative overflow-hidden">
      {/* High-Fidelity Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
        style={{ backgroundImage: 'linear-gradient(#121212 1px, transparent 1px), linear-gradient(90deg, #121212 1px, transparent 1px)', backgroundSize: '60px 60px' }} 
      />
      
      <div className="max-w-[1400px] mx-auto relative z-10">
        
        {/* SPECIFIC HEADING STYLE: The Blur Effect */}
        <div className="relative text-center mb-8 flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Disc className="w-3.5 h-3.5 text-[#E1261C] animate-spin-slow" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-[#E1261C]">Neural Command Console</span>
          </motion.div>
          
          <div className="relative group">
            {/* Blurred Background Layer */}
            <h2 className="absolute inset-0 font-playfair font-black text-4xl md:text-6xl lg:text-7xl text-[#121212]/20 tracking-tighter uppercase blur-[10px] select-none">
              Command Center
            </h2>
            
            {/* Main Sharp Layer */}
            <h2 className="relative font-playfair font-black text-4xl md:text-6xl lg:text-7xl text-[#121212] tracking-tighter uppercase">
              Command Center
            </h2>
          </div>

          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: false, amount: 0.1 }}
            className="mt-8 w-2 h-2 rounded-full bg-[#E1261C] shadow-[0_0_15px_#E1261C] animate-pulse" 
          />
        </div>

        {/* Dual Column Layout: Flex Split */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: direction * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -20 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center justify-center"
          >
            {/* Left Column: Video Area (55%) */}
            <div className="w-full md:w-[55%] relative group">
              <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-white border border-gray-200 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
                <video
                  src={commandSteps[activeStep].videoUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                
                {/* Floating Shield Badge */}
                <div className="absolute top-8 left-8 px-5 py-2.5 bg-white/90 backdrop-blur-md border border-gray-100 rounded-2xl flex items-center gap-2.5 shadow-xl">
                  <ShieldCheck className="w-4 h-4 text-[#E1261C]" />
                  <span className="font-mono text-[10px] text-[#121212] uppercase tracking-[0.2em] font-bold">
                    {commandSteps[activeStep].badge}
                  </span>
                </div>
              </div>
              
              {/* Decorative Accent Dots */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[radial-gradient(#E1261C_1.5px,transparent_1.5px)] bg-[size:12px_12px] opacity-20" />
            </div>

            {/* Right Column: Info Area (45%) */}
            <div className="w-full md:w-[45%] flex flex-col justify-center">
              <div className="space-y-8">
                {/* Step Marker & Accent Line */}
                <div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-[#E1261C]">Institutional Stage</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                      <span className="font-mono text-[12px] font-black text-[#E1261C] uppercase tracking-[0.3em] mb-1">Step</span>
                      <span className="font-playfair italic text-6xl md:text-9xl font-black text-gray-200/90 leading-none tracking-tighter">
                        {commandSteps[activeStep].id}
                      </span>
                    </div>
                    <div className="h-[2.5px] w-16 bg-[#E1261C] mt-10" />
                  </div>
                </div>

                {/* Title with Vertical Red Bar */}
                <div className="flex gap-8 justify-center md:justify-start">
                  <div className="w-[3px] md:w-[4px] bg-[#E1261C] shrink-0" />
                  <h3 className="font-playfair font-black text-3xl md:text-5xl lg:text-6xl text-[#121212] tracking-tighter uppercase leading-[0.9] max-w-md">
                    {commandSteps[activeStep].title}
                  </h3>
                </div>

                <p className="font-inter text-lg md:text-xl text-gray-500 leading-relaxed max-w-lg">
                  {commandSteps[activeStep].desc}
                </p>

                <div className="pt-6 flex justify-center md:justify-start">
                  <button onClick={handleNext} className="btn-premium group w-fit">
                    <span className="relative z-10 flex items-center justify-center gap-4 text-sm font-bold tracking-[0.2em]">
                      NEXT PROTOCOL
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Global Navigation Pulse Indicator */}
        <div className="mt-20 flex justify-center items-center gap-4">
          <div className="font-mono text-[10px] text-gray-300 uppercase tracking-[0.8em] font-bold">
            Systems Synchronized
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      ` }} />
    </section>
  );
};

export default LandingPageCommandCenter;
