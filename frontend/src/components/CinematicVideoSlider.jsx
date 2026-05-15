import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Keyboard, Navigation, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Sparkles, Globe, BrainCircuit, Layers, Share2, Activity, Database, CheckCircle2, Zap, Code, MessageSquare, ThumbsUp, Rss, Disc } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const pipelineSteps = [
  {
    id: '01',
    stepLabel: 'STEP 01',
    title: 'Live News Ingestion',
    video: '/data.mp4',
    statusText: 'Fetching...',
    statusColor: 'bg-blue-500',
    iconColor: 'text-blue-400',
    statusGlow: 'rgba(59, 130, 246, 0.5)',
    glow: 'rgba(59, 130, 246, 0.3)',
    features: ['Google Trends Data', 'Times of India RSS', 'Yahoo Headlines', 'RSS News Streams'],
  },
  {
    id: '02',
    stepLabel: 'STEP 02',
    title: 'AI Content Intelligence',
    video: '/script.mp4',
    statusText: 'Processing...',
    statusColor: 'bg-purple-500',
    iconColor: 'text-purple-400',
    statusGlow: 'rgba(168, 85, 247, 0.5)',
    glow: 'rgba(168, 85, 247, 0.3)',
    features: ['Headline Analysis', 'Engagement Optimization', 'Script Generation', 'Social-Ready Captions', 'Content Rewrite', 'AI Decision Engine'],
  },
  {
    id: '03',
    stepLabel: 'STEP 03',
    title: 'AI Visual Generation',
    video: '/cloud.mp4',
    statusText: 'Generating...',
    statusColor: 'bg-cyan-500',
    iconColor: 'text-cyan-400',
    statusGlow: 'rgba(6, 182, 212, 0.5)',
    glow: 'rgba(6, 182, 212, 0.3)',
    features: ['Cloudinary Pipeline', 'AI Visual Rendering', 'Dynamic Optimization', 'Branded Media Generation'],
  },
  {
    id: '04',
    stepLabel: 'STEP 04',
    title: 'Social Media Automation',
    video: '/fbdep.mp4',
    statusText: 'Publishing...',
    statusColor: 'bg-green-500',
    iconColor: 'text-green-400',
    statusGlow: 'rgba(34, 197, 94, 0.5)',
    glow: 'rgba(34, 197, 94, 0.3)',
    features: ['Facebook Meta API', 'Access Token Auth', 'Automated Publishing', 'Social Content Deployment'],
  }
];

// Double the array for loop stability as requested
const doubledSteps = [...pipelineSteps, ...pipelineSteps];

const CinematicVideoSlider = () => {
  return (
    <section className="relative w-full flex flex-col justify-center bg-[#FAFAFA] text-[#121212] py-16 overflow-hidden font-inter border-y border-gray-100 selection:bg-[#E1261C] selection:text-white">

      {/* Premium Engineering Styles */}
      <style>{`
        .ai-pipeline-swiper {
          width: 100%;
          min-height: 500px;
          padding: 40px 0 80px 0 !important;
          overflow: hidden !important;
        }
        @media (min-width: 768px) {
          .ai-pipeline-swiper {
            min-height: 600px;
            padding: 80px 0 120px 0 !important;
          }
        }
        .ai-pipeline-slide {
          width: 90vw !important;
          max-width: 450px !important;
          height: 420px !important;
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          margin: 0 auto;
        }
        @media (min-width: 640px) {
          .ai-pipeline-slide { width: 400px !important; }
        }
        @media (min-width: 1024px) {
          .ai-pipeline-slide { width: 450px !important; height: 540px !important; min-height: 540px; }
        }
        
        /* Custom Pagination */
        .custom-bullet {
          width: 10px;
          height: 10px;
          background-color: rgba(18, 18, 18, 0.1);
          border-radius: 50%;
          display: inline-block;
          margin: 0 8px !important;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .swiper-pagination-bullet-active.custom-bullet {
          background-color: #E1261C;
          width: 48px;
          border-radius: 6px;
          box-shadow: 0 4px 20px rgba(225, 38, 28, 0.4);
        }

        /* Light Sweep Animation */
        @keyframes sweep {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        .animate-sweep {
          animation: sweep 10s infinite linear;
        }
      `}</style>

      {/* High-Impact Background System */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-0 left-0 w-[40%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-30 animate-sweep" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
      </div>

      {/* Header Section */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center mb-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border border-[#E1261C]/10 bg-[#E1261C]/5 mb-5"
        >
          <Disc className="w-3 h-3 text-[#E1261C] animate-spin-slow" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-[#E1261C]">
            Intelligent Pipeline
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ delay: 0.1 }}
          className="font-playfair text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-[0.95] mb-6 text-[#121212] uppercase"
        >
          Automated Intelligence Pipeline
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ delay: 0.2 }}
          className="font-inter text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-4"
        >
          From live news ingestion to fully automated AI-generated social publishing.
        </motion.p>

        {/* Signature Red Underline */}
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: false, amount: 0.1 }}
          className="flex flex-col items-center"
        >
          <div className="w-24 h-[1.5px] bg-gray-200" />
          <div className="mt-3 w-2 h-2 rounded-full bg-[#E1261C] shadow-[0_0_12px_#E1261C] animate-pulse" />
        </motion.div>
      </div>

      {/* Swiper Slider Section */}
      <div className="relative z-30 w-full overflow-visible">
        <Swiper
          modules={[Mousewheel, Keyboard, Navigation, Pagination]}
          initialSlide={0}
          centeredSlides={true}
          loop={true}
          slidesPerView={'auto'}
          spaceBetween={40}
          grabCursor={true}
          slideToClickedSlide={true}
          mousewheel={{ forceToAxis: true, sensitivity: 1, releaseOnEdges: true }}
          keyboard={{ enabled: true }}
          speed={1000}
          navigation={{
            prevEl: '.swiper-nav-prev',
            nextEl: '.swiper-nav-next',
          }}
          pagination={{
            el: '.swiper-pagination-custom',
            clickable: true,
            renderBullet: (index, className) => {
              return `<span class="${className} custom-bullet"></span>`;
            }
          }}
          className="ai-pipeline-swiper touch-auto"
        >
          {doubledSteps.map((step, idx) => (
            <SwiperSlide key={`${step.id}-slide-${idx}`} className="ai-pipeline-slide group">
              {({ isActive }) => (
                <div
                  className={`relative w-full h-full rounded-[2rem] p-[1px] transition-all duration-700 ease-out
                    ${isActive
                      ? 'shadow-[0_20px_60px_rgba(0,0,0,0.4)] scale-100 opacity-100 z-20 blur-none'
                      : 'shadow-lg scale-90 opacity-50 z-10 blur-[3px]'
                    }`}
                >

                  {/* Active Border Glow Animation */}
                  {isActive ? (
                    <div className="absolute inset-0 rounded-[2rem] z-0 overflow-hidden pointer-events-none">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2"
                        style={{ background: `conic-gradient(from 0deg, transparent 0 340deg, ${step.glow.replace('0.3', '1')} 360deg)` }}
                      />
                      <div className="absolute inset-[1.5px] bg-[#0A0E17] rounded-[2rem]" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-[#0A0E17] rounded-[2rem] border border-white/5" />
                  )}

                  {/* Inner Card Container - DARK UI */}
                  <div className={`absolute ${isActive ? 'inset-[2px]' : 'inset-[1px]'} bg-[#0A0E17] rounded-[1.9rem] overflow-hidden z-10 flex flex-col`}>

                    {/* Background Radial Glow */}
                    <div className="absolute top-0 w-full h-[60%] opacity-20 pointer-events-none transition-colors duration-1000" style={{ background: `radial-gradient(circle at top, ${step.glow}, transparent 70%)` }} />

                    {/* TOP AREA: Visual Component */}
                    <div className="relative w-full h-[52%] p-3 shrink-0">
                      <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden bg-black/50 border border-white/5">
                        <video 
                          key={`video-elem-${idx}`}
                          src={step.video} 
                          muted 
                          autoPlay 
                          loop 
                          playsInline 
                          className={`w-full h-full object-cover transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-50'}`} 
                        />

                        {/* Status Badge */}
                        <div className={`absolute top-4 left-4 z-30 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${step.statusColor} ${isActive ? 'animate-pulse' : ''}`} style={{ boxShadow: `0 0 8px ${step.statusGlow}` }} />
                          <span className={`${step.iconColor} font-mono text-[9px] uppercase tracking-widest font-bold`}>{step.statusText}</span>
                        </div>
                      </div>
                    </div>

                    {/* BOTTOM AREA: Content */}
                    <div className="relative z-20 flex flex-col flex-1 p-5 md:p-6 pt-4 transition-all duration-700">

                      <div className="flex items-center gap-3 mb-2.5">
                        <div className={`bg-white/5 border border-white/10 px-2.5 py-1 rounded-md text-[9px] uppercase tracking-widest font-mono ${step.iconColor}`}>
                          {step.stepLabel}
                        </div>
                      </div>

                      <h3 className="font-playfair font-black text-xl md:text-2xl text-white mb-4 tracking-tighter leading-none uppercase">
                        {step.title}
                      </h3>

                      {/* Feature List (Grid layout for more items) */}
                      <div className="mt-0 grid grid-cols-2 gap-y-3 gap-x-2">
                        {step.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <div className="mt-[2px] w-3.5 h-3.5 rounded-full flex items-center justify-center bg-white/5 border border-white/10 shrink-0">
                              <CheckCircle2 className={`w-2.5 h-2.5 ${isActive ? step.iconColor : 'text-gray-600'}`} />
                            </div>
                            <span className="text-[11px] md:text-xs text-gray-400 font-medium leading-snug">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                    </div>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Controls Container (Repositioned to not cover side cards) */}
        <div className="relative z-40 w-full flex items-center justify-center gap-6 mt-12 px-4 md:block md:static md:mt-0">

          <button className="swiper-nav-prev flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-200 bg-white/80 backdrop-blur-md hover:bg-white transition-all cursor-pointer shadow-lg group hover:scale-110
            md:absolute md:top-[50%] md:-translate-y-1/2 md:left-4 lg:left-8 xl:left-20 z-50">
            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-[#E1261C] transition-colors" />
          </button>

          <div className="swiper-pagination-custom flex items-center justify-center min-w-[80px]
            md:absolute md:-bottom-12 md:left-1/2 md:-translate-x-1/2 z-50" />

          <button className="swiper-nav-next flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full border border-gray-200 bg-white/80 backdrop-blur-md hover:bg-white transition-all cursor-pointer shadow-lg group hover:scale-110
            md:absolute md:top-[50%] md:-translate-y-1/2 md:right-4 lg:right-8 xl:right-20 z-50">
            <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-[#E1261C] transition-colors" />
          </button>

        </div>
      </div>
    </section>
  );
};

export default CinematicVideoSlider;
