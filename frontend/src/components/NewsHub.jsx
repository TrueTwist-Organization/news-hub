import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageTransition from './PageTransition';
import TypewriterHeading from './TypewriterHeading';
import { useNewsHub } from '../hooks/useNewsHub';

const NewsHub = () => {
  const navigate = useNavigate();
  const { news, loading: isLoading, error } = useNewsHub('All');

  if (error) {
    return (
      <PageTransition>
        <div className="w-full h-screen bg-white flex items-center justify-center p-6 text-center">
          <div>
            <h2 className="font-playfair font-black text-3xl text-[#121212] mb-4">Connection Failed</h2>
            <p className="text-[#444444]/60 mb-8">{error}</p>
            <button onClick={() => window.location.reload()} className="px-8 py-3 bg-[#E1261C] text-white font-bold">Retry</button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="w-full min-h-screen bg-white pt-24 pb-20 font-inter overflow-x-hidden">
        
        {/* Header Section */}
        <section className="px-6 md:px-12 xl:px-24 py-12 bg-white border-b border-[#121212]/10">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="block w-8 h-[3px] bg-[#E1261C]" />
              <span className="font-montserrat font-bold text-[10px] uppercase tracking-[0.2em] text-[#E1261C]">Live Feed</span>
            </div>
            <h1 className="font-playfair font-black text-[#121212] text-5xl md:text-7xl leading-none mb-6">
              <TypewriterHeading phrases={['LATEST NEWS.', 'GLOBAL UPDATE.', 'RESOURCES.']} />
            </h1>
            <p className="font-lora italic text-[#444444] text-xl opacity-70 max-w-2xl">
              Stay ahead with real-time global narratives, curated and verified for the modern professional.
            </p>
          </div>
        </section>

        {/* Featured News Grid */}
        <main className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-24 py-16">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="aspect-[4/3] bg-[#121212]/5 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {news.map((article, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer flex flex-col"
                  onClick={() => navigate(`/scripting/n-${i}`, { state: { article } })}
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-sm mb-6 shadow-sm group-hover:shadow-xl transition-all duration-500">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800";
                      }}
                    />
                    <div className="absolute top-4 left-4 bg-[#E1261C] px-3 py-1">
                      <span className="font-montserrat font-bold text-[8px] text-white uppercase tracking-widest">{article.category}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-montserrat font-bold text-[9px] uppercase tracking-[0.2em] text-[#005689]">{article.source?.name}</span>
                    <span className="w-1 h-1 rounded-full bg-[#121212]/20" />
                    <span className="font-inter text-[10px] text-[#444444] opacity-50">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h2 className="font-playfair font-black text-xl md:text-2xl text-[#121212] leading-[1.2] mb-4 group-hover:text-[#E1261C] transition-colors duration-300 line-clamp-2">
                    {article.title}
                  </h2>
                  
                  <p className="font-inter text-[#444444] text-sm leading-relaxed line-clamp-3 opacity-80 mb-6">
                    {article.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-[#121212]/10 flex items-center justify-between">
                    <span className="font-montserrat font-black text-[10px] uppercase tracking-[0.2em] text-[#121212] group-hover:text-[#E1261C] transition-colors">
                      Process Story →
                    </span>
                    <button className="text-[#121212]/30 group-hover:text-[#E1261C] transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </PageTransition>
  );
};

export default NewsHub;
