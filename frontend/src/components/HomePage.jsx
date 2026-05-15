import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNewsHub } from '../hooks/useNewsHub';
import NewsCard from './NewsCard';
import TranslatedText from './TranslatedText';
import TypewriterHeading from './TypewriterHeading';

const HomePage = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { news = [], loading, error, fetchNews } = useNewsHub('All');
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Safety guard: ensure news is always an array
  const safeNews = Array.isArray(news) ? news : [];

  // Institutional Distribution
  const topLead = safeNews[0] || { 
    title: "Global Intelligence: The Neural Shift", 
    description: "Our intelligence links are currently calibrating. Please stand by for the next signal burst.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000",
    source: "Neural Hub"
  };
  const subLeads = safeNews.slice(1, 3);
  const quickLinks = safeNews.slice(3, 10);
  const curatedStream = safeNews.slice(10, 16);

  if (loading && news.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-8">
          <div className="w-16 h-16 border-4 border-[#E1261C] border-t-transparent rounded-full animate-spin" />
          <span className="font-montserrat font-black text-[11px] tracking-[0.4em] uppercase text-gray-400 animate-pulse">Establishing Signal...</span>
        </div>
      </div>
    );
  }

  if (error && news.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center pt-20">
        <div className="max-w-xl text-center px-6">
          <div className="w-20 h-[2px] bg-[#E1261C] mx-auto mb-10" />
          <h2 className="font-playfair font-black text-4xl md:text-5xl mb-6 text-[#121212]">Neural Connection Offline</h2>
          <p className="font-lora text-gray-500 text-lg mb-10 leading-relaxed italic">
            "{error}"
          </p>
          <button 
            onClick={() => fetchNews()}
            className="bg-[#121212] text-white px-10 py-5 font-montserrat font-black text-[11px] uppercase tracking-[0.3em] hover:bg-[#E1261C] transition-all shadow-2xl"
          >
            Attempt Reconnection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#121212] pt-44 pb-20 selection:bg-[#E1261C] selection:text-white overflow-x-hidden">
      
      {/* ── MASTHEAD ── */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 border-b-4 border-black mb-10 pt-12">
        <div className="flex flex-col items-center text-center pb-8">
          <div className="flex items-center justify-center gap-6 mb-4 w-full">
            <div className="hidden md:block flex-1 text-left min-w-[150px]">
              <span className="font-montserrat font-black text-[11px] tracking-[0.3em] text-gray-400 uppercase">VOL CCXXIV</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 shrink-0">
              <span className="font-montserrat font-black text-[9px] md:text-[11px] tracking-[0.2em] md:tracking-[0.3em] text-[#E1261C] uppercase">{t('Global Edition')}</span>
              <div className="w-[1px] h-3 md:h-4 bg-gray-200" />
              <div>
                <span className="font-montserrat font-black text-[9px] md:text-[11px] tracking-[0.2em] md:tracking-[0.3em] text-gray-400 uppercase">
                  {new Date().toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : 'en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
                </span>
              </div>
            </div>

            <div className="hidden md:block flex-1 text-right min-w-[150px]">
              <span className="font-montserrat font-black text-[11px] tracking-[0.3em] text-gray-400 uppercase">NO. 124</span>
            </div>
          </div>
          
          <h1 className="font-playfair font-black text-3xl sm:text-4xl md:text-8xl tracking-tighter mb-4 text-[#121212] select-none uppercase w-full">
            <TypewriterHeading 
              phrases={[t('The Neural Times'), t('Global Intelligence'), t('Daily Signal')]} 
              speed={100} 
            />
          </h1>
          <div className="w-full h-[2px] bg-black mb-1" />
          <div className="w-full h-[1px] bg-black" />
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* ── LEFT: PRIMARY EDITORIAL (8 Cols) ── */}
          <div className="lg:col-span-8 border-r border-gray-100 pr-0 lg:pr-10">
            
            {/* Lead Story */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.8 }}
              className="border-b border-gray-100 pb-12 mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[#E1261C] text-white px-3 py-1 font-montserrat font-black text-[10px] tracking-widest uppercase">
                  {t('Lead Story')}
                </span>
                <span className="font-montserrat font-bold text-[10px] text-gray-400 uppercase tracking-widest">{topLead.source}</span>
              </div>
              
              <div className="min-h-[140px] mb-8">
                <h2 className="font-playfair font-black text-4xl md:text-6xl leading-[1.05] hover:text-[#E1261C] transition-colors cursor-pointer" onClick={() => setSelectedArticle(topLead)}>
                  <TranslatedText text={topLead.title} />
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="aspect-[16/10] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm group">
                  <img src={topLead.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
                </div>
                <div className="min-h-[200px]">
                  <p className="font-lora text-gray-600 text-xl leading-relaxed italic mb-8">
                    <TranslatedText text={topLead.description} type="description" />
                  </p>
                  <button onClick={() => setSelectedArticle(topLead)} className="font-montserrat font-black text-[11px] tracking-widest text-[#E1261C] border-b-2 border-[#E1261C] pb-1 uppercase">
                    {t('Read More')} →
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Sub Leads Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-gray-100 pb-12">
              {subLeads.map((story, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.1, margin: "-20px" }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="group cursor-pointer" 
                  onClick={() => setSelectedArticle(story)}
                >
                  <div className="aspect-video overflow-hidden mb-6 bg-gray-50 border border-gray-100 rounded-sm">
                    <img src={story.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                  </div>
                  <span className="text-[#E1261C] font-montserrat font-black text-[9px] tracking-widest uppercase mb-3 block">{story.source}</span>
                  <div className="min-h-[80px]">
                    <h3 className="font-playfair font-black text-2xl leading-tight group-hover:text-[#E1261C] transition-colors">
                      <TranslatedText text={story.title} />
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Stream */}
            <div className="mt-12">
              <h3 className="font-montserrat font-black text-xs tracking-[0.3em] uppercase mb-10 text-gray-400 border-b border-gray-100 pb-2">{t('Across the Neural Hub')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {curatedStream.map((story, i) => (
                  <NewsCard key={i} story={story} onClick={() => setSelectedArticle(story)} />
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT: INSTITUTIONAL SIDEBAR (4 Cols) ── */}
          <div className="lg:col-span-4">
            
            {/* Quick Links / Just In */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              className="bg-[#F8F9FA] p-8 border-t-4 border-[#E1261C] mb-12"
            >
              <h2 className="font-montserrat font-black text-[11px] tracking-[0.2em] uppercase mb-8">{t('Just In')}</h2>
              <div className="flex flex-col divide-y divide-gray-200">
                {quickLinks.map((story, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="py-6 first:pt-0 last:pb-0 group cursor-pointer" 
                    onClick={() => setSelectedArticle(story)}
                  >
                    <span className="text-gray-400 font-montserrat font-bold text-[9px] uppercase tracking-widest mb-2 block">{story.source}</span>
                    <div className="min-h-[60px]">
                      <h4 className="font-playfair font-bold text-lg leading-snug group-hover:text-[#E1261C] transition-colors">
                        <TranslatedText text={story.title} />
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Market Data */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.6 }}
              className="border border-gray-100 p-8 mb-12 rounded-sm hover:shadow-lg transition-shadow duration-300 bg-white"
            >
              <h3 className="font-montserrat font-black text-[10px] tracking-widest uppercase text-gray-400 mb-8">{t('World Indices')}</h3>
              <div className="space-y-6">
                {[
                  { label: 'SENSEX', val: '74,248.45', change: '+1.2%', up: true },
                  { label: 'NIFTY 50', val: '22,513.70', change: '+0.85%', up: true },
                  { label: 'NASDAQ', val: '16,306.64', change: '-0.32%', up: false }
                ].map(idx => (
                  <div key={idx.label} className="flex justify-between items-center border-b border-gray-50 pb-4 hover:bg-gray-50 transition-colors px-2 -mx-2 rounded">
                    <span className="font-montserrat font-bold text-xs">{idx.label}</span>
                    <div className="text-right">
                      <p className="font-montserrat font-black text-sm">{idx.val}</p>
                      <p className={`font-montserrat font-bold text-[10px] ${idx.up ? 'text-green-600' : 'text-red-600'}`}>{idx.change}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Editorial Pulse */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-[#121212] text-white p-8 rounded-sm hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="font-montserrat font-black text-[10px] tracking-widest uppercase text-[#E1261C] mb-8">{t('Editorial Pulse')}</h3>
              <div className="group cursor-pointer" onClick={() => navigate('/latest')}>
                <div className="aspect-square overflow-hidden mb-6 rounded-sm">
                  <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt="" />
                </div>
                <h3 className="font-playfair font-black text-2xl leading-tight group-hover:text-[#E1261C] transition-colors">Neural Era: Navigating the 2026 Shift</h3>
                <p className="mt-4 text-gray-400 font-lora italic">{t('By Neural AI Editor')}</p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ── ARTICLE READER MODAL ── */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-white flex flex-col"
          >
            <div className="flex items-center justify-between px-6 md:px-12 py-6 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="flex items-center gap-2 font-montserrat font-black text-[11px] uppercase tracking-[0.2em] text-gray-400 hover:text-[#E1261C] transition-all group"
                >
                  <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('Back')}
                </button>
                <div className="w-[1px] h-4 bg-gray-200" />
                <div className="flex items-center gap-4">
                  <span className="font-montserrat font-black text-[10px] uppercase tracking-[0.3em] text-[#E1261C]">World Report Intelligence</span>
                  <span className="text-gray-300">/</span>
                  <span className="font-serif font-bold text-sm text-[#121212]">{selectedArticle.source}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full hover:bg-[#E1261C] hover:text-white transition-all shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#FDFDFD]">
              <div className="max-w-[900px] mx-auto px-6 py-20">
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                  <span className="font-montserrat font-bold text-[11px] text-[#E1261C] uppercase tracking-[0.4em] mb-8 block">In-Depth Signal</span>
                  <h1 className="font-serif font-black text-[#121212] text-4xl md:text-6xl leading-[1.1] mb-10 tracking-tighter">
                    <TranslatedText text={selectedArticle.title} />
                  </h1>
                  <div className="aspect-video overflow-hidden mb-12 shadow-2xl border border-gray-100">
                    <img src={selectedArticle.image} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="md:col-span-1 border-r border-gray-100 pr-8">
                      <div className="mb-8">
                        <p className="font-montserrat font-bold text-[9px] uppercase text-gray-400 mb-2">Source</p>
                        <p className="font-serif italic text-sm">{selectedArticle.source}</p>
                      </div>
                      <div className="mb-8">
                        <p className="font-montserrat font-bold text-[9px] uppercase text-gray-400 mb-2">Published</p>
                        <p className="font-serif italic text-sm">{selectedArticle.pubDate ? new Date(selectedArticle.pubDate).toLocaleDateString() : 'Today'}</p>
                      </div>
                    </div>
                    <div className="md:col-span-3">
                      <div className="prose prose-lg prose-serif max-w-none">
                        <p className="font-lora text-xl md:text-2xl leading-relaxed text-[#444444] mb-12">
                          <TranslatedText text={selectedArticle.description} type="description" />
                        </p>
                      </div>
                      <div className="mt-12 pt-12 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                        <button 
                          onClick={() => navigate(`/scripting/new`, { state: { article: selectedArticle } })}
                          className="inline-flex items-center justify-center gap-4 bg-[#121212] text-white px-8 py-5 font-montserrat font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#E1261C] transition-all shadow-xl group"
                        >
                          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                          Create Facebook Post
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default HomePage;
