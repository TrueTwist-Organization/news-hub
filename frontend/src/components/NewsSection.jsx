import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, ShieldCheck, ArrowRight, ExternalLink, RefreshCw, AlertCircle, Database, Globe } from 'lucide-react';
// REQUIREMENT: Strictly verify named import
import { useNewsHub } from '../hooks/useNewsHub';

const NewsSection = () => {
  // REQUIREMENT: Safe access check for the hook
  const hookData = useNewsHub('All');
  
  if (!hookData) {
    return (
      <div className="w-full py-12 flex justify-center">
        <RefreshCw className="w-8 h-8 text-gray-300 animate-spin" />
      </div>
    );
  }

  const { news, loading, error, fetchNews } = hookData;

  // Audit Log for Visibility (Silenced for Production)
  // console.log('FRONTEND DATA RECEIVED (via Hook):', news);

  const SilverSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-[32px] p-8 h-[480px] overflow-hidden border border-white/50">
          <motion.div 
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent z-10"
          />
          <div className="w-12 h-12 bg-white/60 rounded-2xl mb-8" />
          <div className="w-24 h-3 bg-white/60 rounded-full mb-6" />
          <div className="w-full h-10 bg-white/60 rounded-lg mb-4" />
          <div className="w-full h-24 bg-white/40 rounded-xl mb-8" />
          <div className="mt-auto flex justify-between">
            <div className="w-20 h-4 bg-white/60 rounded-full" />
            <div className="w-12 h-4 bg-white/60 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full relative py-12 z-50 min-h-[500px]">
      {/* Header with Integrated Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 px-2">
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="relative flex items-center gap-4"
          >
            <div className="p-2 rounded-xl bg-[#E1261C]/5 border border-[#E1261C]/10">
              <Database className="w-5 h-5 text-[#E1261C]" />
            </div>
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.5em] text-[#E1261C]">Institutional Feed</span>
          </motion.div>
          <h2 className="font-playfair font-black text-5xl md:text-7xl text-[#111111] tracking-tighter leading-[0.9]">
            Latest <span className="italic text-gray-300">Intelligence.</span>
          </h2>
        </div>

        <div className="flex items-center gap-8 bg-white/50 backdrop-blur-md p-6 rounded-[24px] border border-gray-100 shadow-sm">
          <div className="text-right">
            <span className="block font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1.5 font-bold">Network Load</span>
            <div className="flex items-center justify-end gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="font-mono text-[10px] font-black uppercase text-[#111111]">Active Sync</span>
            </div>
          </div>
          <div className="h-8 w-[1px] bg-gray-200" />
          <button 
            onClick={fetchNews}
            disabled={loading}
            className="p-4 rounded-2xl bg-[#111111] text-white hover:bg-[#E1261C] transition-all duration-500 group shadow-lg shadow-black/5"
            title="Refresh Protocol"
          >
            <RefreshCw className={`w-5 h-5 transition-transform duration-700 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="loading" className="relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SilverSkeleton />
          </motion.div>
        ) : (error || !news || news.length === 0) ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gray-50/50 border border-dashed border-gray-200 rounded-[40px] p-24 text-center flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8 border border-gray-100 relative">
              <RefreshCw className="w-10 h-10 text-[#E1261C] animate-spin-slow" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#E1261C] animate-ping" />
              </div>
            </div>
            <h3 className="font-playfair font-black text-3xl text-[#111111] mb-4">
              {(!news || news.length === 0) && !error ? 'No Neural Signals Detected' : 'Sync Connection Failed'}
            </h3>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed mb-10 font-inter">
              {error || "The gateway is active but no institutional signals were retrieved. Check your proxy connections or backend logs for 'RSS_SYNC' status."}
            </p>
            <button 
              onClick={fetchNews}
              className="px-10 py-4 bg-[#111111] text-white rounded-2xl font-mono text-[11px] font-bold uppercase tracking-widest hover:bg-[#E1261C] hover:scale-105 transition-all shadow-xl shadow-black/10"
            >
              Force Protocol Reboot
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {news.slice(0, 9).map((item, idx) => (
              <motion.div
                key={item.link || idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col h-[480px] bg-white/40 backdrop-blur-2xl border border-white/40 rounded-[40px] p-10 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.06)] hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] transition-all duration-700 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-gray-200/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3 px-4 py-2 bg-white/80 rounded-full border border-gray-100 shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-mono text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      {item.pubDate ? new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'JUST NOW'}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-[#E1261C]/5 flex items-center justify-center border border-[#E1261C]/10 shadow-sm">
                    <Zap className="w-5 h-5 text-[#E1261C]" />
                  </div>
                </div>

                <div className="space-y-5 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E1261C]" />
                    <span className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-[#E1261C]">
                      {item.source || 'Global Feed'}
                    </span>
                  </div>
                  <h3 className="font-playfair font-black text-3xl text-[#111111] leading-[1.1] tracking-tight group-hover:text-[#E1261C] transition-colors duration-500 line-clamp-3">
                    {item.title || item.headline || 'Institutional Intelligence Update'}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-inter line-clamp-4 opacity-70 group-hover:opacity-90 transition-opacity">
                    {item.description || 'Institutional briefing summary is currently being processed by the neural engine.'}
                  </p>
                </div>

                <div className="mt-12 pt-8 border-t border-black/[0.04] flex items-center justify-between">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[11px] font-mono font-black uppercase tracking-[0.2em] text-[#111111] group/link">
                    Analyze Report
                    <ArrowRight className="w-4 h-4 text-[#E1261C] group-hover/link:translate-x-2 transition-transform duration-300" />
                  </a>
                  <div className="flex items-center gap-5 text-gray-300">
                    <ShieldCheck className="w-5 h-5" />
                    <ExternalLink className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewsSection;
