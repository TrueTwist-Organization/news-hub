import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNewsHub } from '../hooks/useNewsHub';
import PageTransition from './PageTransition';
import NewsCard from './NewsCard';
import TypewriterHeading from './TypewriterHeading';

const GlobalNewsHub = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { news = [], loading, error, fetchNews } = useNewsHub('All');
  const [selectedArticle, setSelectedArticle] = useState(null);
  
  // REQUIREMENT: Standardize safe news access
  const safeNews = Array.isArray(news) ? news : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] } }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-[#E1261C] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // REQUIREMENT: Consistent fallback for mainHero
  const mainHero = safeNews[0] || {
    title: "Global Intelligence: Establishing Connection",
    description: "The neural feed is currently synchronizing with global satellites. Please stand by for live updates.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000",
    source: "Neural Hub",
    pubDate: new Date().toISOString()
  };
  const secondaryStories = safeNews.slice(1, 4);
  const remainingNews = safeNews.slice(4);

  if (error && safeNews.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-[2px] bg-[#E1261C] mb-8" />
        <h2 className="font-playfair font-black text-3xl mb-4 uppercase">Signal Lost</h2>
        <p className="font-lora text-gray-500 mb-8 italic">{error}</p>
        <button 
          onClick={() => fetchNews?.()}
          className="bg-[#121212] text-white px-8 py-4 font-montserrat font-black text-[10px] tracking-widest uppercase hover:bg-[#E1261C] transition-all"
        >
          Attempt Sync
        </button>
      </div>
    );
  }

  if (!loading && safeNews.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-[2px] bg-gray-200 mb-8" />
        <h2 className="font-playfair font-black text-3xl mb-4 uppercase text-gray-300">No Signals Detected</h2>
        <p className="font-lora text-gray-400 mb-8 italic">The intelligence hub is currently quiet. Check back shortly.</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-white pt-44 pb-20 px-4 md:px-12 xl:px-24">
        
        <div className="max-w-[1440px] mx-auto border-b-4 border-black mb-20 pb-10">
          <div className="flex items-center gap-4 mb-4">
            <span className="font-montserrat font-black text-[10px] uppercase tracking-[0.4em] text-[#E1261C]">Institutional Feed</span>
            <div className="flex-1 h-[1px] bg-black/10" />
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none italic whitespace-nowrap overflow-hidden">
            <TypewriterHeading 
              phrases={[t('Global Intelligence'), t('World Signals'), t('Latest Briefings')]} 
              speed={100} 
            />
          </h1>
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative max-w-[1440px] mx-auto border-t border-gray-100 pt-8 z-10"
        >
          
          <div className="relative grid grid-cols-1 xl:grid-cols-12 gap-0 border-b border-gray-100">
            
            {/* HERO SECTION */}
            <motion.div 
              variants={itemVariants}
              className="xl:col-span-5 border-r border-gray-100 pr-0 xl:pr-10 pb-12"
            >
              <NewsCard 
                story={mainHero} 
                variant="hero" 
                onClick={() => setSelectedArticle(mainHero)} 
              />
            </motion.div>

            {/* SECONDARY STORIES */}
            <div className="xl:col-span-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
              {secondaryStories.map((story, i) => (
                <motion.div 
                  key={i}
                  variants={itemVariants}
                  className={`p-8 border-b md:border-b-0 border-gray-100 flex flex-col ${i < 2 ? 'md:border-r' : ''}`}
                >
                  <NewsCard story={story} onClick={() => setSelectedArticle(story)} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* LOWER GRID */}
          {remainingNews.length > 0 && (
            <div className="relative mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16">
              {remainingNews.map((story, i) => (
                <motion.div 
                  key={i}
                  variants={itemVariants}
                >
                  <NewsCard story={story} onClick={() => setSelectedArticle(story)} />
                </motion.div>
              ))}
            </div>
          )}

          {safeNews.length === 0 && !loading && (
            <div className="py-20 text-center">
              <span className="font-montserrat font-black text-[10px] tracking-[0.4em] text-gray-300 uppercase">
                End of Stream / No Active Signals
              </span>
            </div>
          )}

        </motion.div>

        {/* Reader Modal */}
        <AnimatePresence>
          {selectedArticle && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-white flex flex-col"
            >
              <div className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <span className="font-montserrat font-black text-[10px] uppercase tracking-[0.3em] text-[#E1261C]">World Report Intelligence</span>
                  <span className="text-gray-300">/</span>
                  <span className="font-serif font-bold text-sm">{selectedArticle.source}</span>
                </div>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full hover:bg-[#E1261C] hover:text-white transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="max-w-[900px] mx-auto px-6 py-20">
                  <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <span className="font-montserrat font-bold text-[11px] text-[#E1261C] uppercase tracking-[0.4em] mb-8 block">In-Depth Signal</span>
                    <h1 className="font-serif font-black text-[#121212] text-4xl md:text-6xl leading-[1.1] mb-10 tracking-tighter">
                      {selectedArticle.title}
                    </h1>
                    <div className="aspect-video overflow-hidden mb-12 shadow-2xl">
                      <img src={selectedArticle.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                      <div className="md:col-span-1 border-r border-gray-100 pr-8">
                        <div className="mb-8">
                          <p className="font-montserrat font-bold text-[9px] uppercase text-gray-400 mb-2">Published</p>
                          <p className="font-serif italic text-sm">{new Date(selectedArticle.pubDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="md:col-span-3">
                        <p className="font-serif text-xl md:text-2xl leading-relaxed text-[#444444] mb-10">
                          {selectedArticle.description}
                        </p>
                        <button 
                          onClick={() => navigate(`/scripting/new`, { state: { article: selectedArticle } })}
                          className="inline-flex items-center gap-4 bg-[#E1261C] text-white px-10 py-5 font-montserrat font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#121212] transition-all shadow-lg hover:shadow-red-500/20"
                        >
                          Create Facebook Post
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
};

export default GlobalNewsHub;
