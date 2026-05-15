import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNewsHub } from '../hooks/useNewsHub';
import PageTransition from './PageTransition';
import NewsCard from './NewsCard';

const CATEGORIES = [
  { id: 'All',           label: 'Top Stories' },
  { id: 'India',         label: 'India' },
  { id: 'World',         label: 'World' },
  { id: 'Tech',          label: 'Tech' },
  { id: 'Business',      label: 'Business' },
  { id: 'Sports',        label: 'Sports' },
  { id: 'Entertainment', label: 'Entertainment' },
];

const CATEGORY_KEYWORDS = {
  'India': [
    'india', 'indian', 'modi', 'delhi', 'mumbai', 'bangalore', 'bengaluru',
    'chennai', 'kolkata', 'hyderabad', 'pune', 'government', 'parliament',
    'bharat', 'bjp', 'congress', 'minister', 'election', 'vote',
    'supreme court', 'high court', 'upi', 'lok sabha', 'rajya sabha',
    'pm', 'cm', 'national', 'nation', 'rupee',
  ],
  'World': [
    'us', 'usa', 'united states', 'china', 'russia', 'ukraine', 'israel',
    'global', 'world', 'international', 'united nations', 'europe',
    'asia', 'africa', 'middle east', 'pakistan', 'nato', 'war', 'conflict',
    'white house', 'president', 'biden', 'trump', 'putin', 'climate', 'g20', 'g7',
  ],
  'Tech': [
    'tech', 'technology', 'ai', 'artificial intelligence', 'machine learning',
    'google', 'apple', 'microsoft', 'amazon', 'meta', 'openai', 'samsung',
    'software', 'hardware', 'chip', 'semiconductor', 'digital', 'cyber',
    'smartphone', 'iphone', 'android', 'robot', 'automation', 'cloud',
    'gadget', 'app', 'innovation', 'internet', '5g', 'ev', 'tesla', 'isro', 'nasa',
  ],
  'Business': [
    'business', 'market', 'stock', 'economy', 'economic', 'finance', 'financial',
    'company', 'corporate', 'ceo', 'deal', 'merger', 'billion', 'million',
    'trade', 'investment', 'bank', 'ipo', 'profit', 'revenue', 'gdp',
    'inflation', 'sensex', 'nifty', 'nasdaq', 'tax', 'budget', 'rbi',
    'reliance', 'tata', 'adani', 'infosys', 'wipro', 'startup',
  ],
  'Sports': [
    'cricket', 'football', 'ipl', 'match', 'score', 'player', 'won', 'win',
    'cup', 'fifa', 'sport', 'sports', 'tournament', 'tennis', 'team',
    'goal', 'league', 'athlete', 'champion', 'medal', 'olympic', 'bcci',
    't20', 'kohli', 'dhoni', 'rohit', 'stadium', 'badminton', 'hockey',
    'wrestling', 'kabaddi', 'race', 'basketball',
  ],
  'Entertainment': [
    'movie', 'film', 'cinema', 'celebrity', 'bollywood', 'hollywood',
    'music', 'song', 'album', 'concert', 'netflix', 'amazon prime',
    'actor', 'actress', 'director', 'show', 'series', 'drama',
    'award', 'oscar', 'filmfare', 'trailer', 'release', 'box office',
    'ott', 'web series', 'entertainment', 'reality show',
  ],
};

const CategoriesPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedCat, setSelectedCat] = useState('All');
  const { rawNews, loading, error } = useNewsHub('All');
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Memoised — only recalculates when rawNews or selectedCat changes
  const news = useMemo(() => {
    if (selectedCat === 'All') return rawNews;
    const keywords = CATEGORY_KEYWORDS[selectedCat] || [];
    return rawNews.filter(item => {
      const haystack = (
        (item.title || '') + ' ' +
        (item.description || '') + ' ' +
        (item.source || '')
      ).toLowerCase();
      return keywords.some(kw => haystack.includes(kw));
    });
  }, [rawNews, selectedCat]);

  const currentLabel = CATEGORIES.find(c => c.id === selectedCat)?.label || 'Section';

  return (
    <PageTransition>
      <div className="min-h-screen bg-white pt-44 pb-20 selection:bg-[#E1261C] selection:text-white">

        {/* ── STICKY CATEGORY NAV ── */}
        <div className="sticky top-[80px] z-[90] bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar py-3 gap-2 md:gap-4 touch-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`whitespace-nowrap font-montserrat font-black text-[11px] tracking-widest transition-all duration-200 relative py-3 px-5 rounded-full ${
                  selectedCat === cat.id
                    ? 'text-white bg-[#E1261C] shadow-md'
                    : 'text-gray-500 hover:text-[#121212] hover:bg-gray-100'
                }`}
              >
                {t(cat.label)}
              </button>
            ))}
          </div>
        </div>

        {/* ── CONTENT AREA ── */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10">

          {/* Section Heading — lightweight fade, no typewriter */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCat}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-b-4 border-black mb-12 pb-8"
            >
              <div className="flex items-center gap-4 mb-3">
                <span className="font-montserrat font-black text-[10px] uppercase tracking-[0.4em] text-[#E1261C]">
                  Neural Intelligence
                </span>
                <div className="flex-1 h-[1px] bg-black/10" />
                {!loading && news.length > 0 && (
                  <span className="font-montserrat font-bold text-[10px] text-gray-400 uppercase tracking-widest">
                    {news.length} Stories
                  </span>
                )}
              </div>
              <h1 className="text-fluid-h1 font-black tracking-tighter uppercase italic">
                {t(currentLabel)}
                <span className="ml-4 text-[#E1261C]">{t('Archive')}</span>
              </h1>
            </motion.div>
          </AnimatePresence>

          {/* ── NEWS GRID ── */}
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-6">
              <div className="w-12 h-12 border-4 border-[#E1261C] border-t-transparent rounded-full animate-spin" />
              <span className="font-montserrat font-black text-[10px] tracking-widest uppercase text-gray-400 animate-pulse">
                Fetching Intelligence...
              </span>
            </div>
          ) : error ? (
            <div className="py-40 text-center">
              <h3 className="font-playfair font-black text-[#121212] text-3xl mb-4">Signal Lost</h3>
              <p className="text-gray-400 font-lora text-lg italic">{error}</p>
            </div>
          ) : news.length > 0 ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCat}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12"
              >
                {news.map((story, i) => (
                  <div
                    key={story.guid || story.link || i}
                    style={{
                      animationDelay: `${Math.min(i * 25, 250)}ms`,
                      animation: 'fadeSlideIn 0.35s ease both',
                    }}
                  >
                    <NewsCard story={story} onClick={() => setSelectedArticle(story)} />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="py-40 text-center border-4 border-dashed border-gray-100 rounded-3xl">
              <div className="text-6xl mb-6">📡</div>
              <h3 className="font-playfair font-black text-[#121212] text-3xl mb-4">No Sector Signals</h3>
              <p className="text-gray-400 font-lora text-lg italic">
                No {t(currentLabel)} news found. Try refreshing or check another category.
              </p>
            </div>
          )}
        </div>

        {/* ── ARTICLE READER MODAL ── */}
        <AnimatePresence>
          {selectedArticle && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-0 z-[200] bg-white flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="flex items-center gap-2 font-montserrat font-black text-[11px] uppercase tracking-[0.2em] text-gray-400 hover:text-[#E1261C] transition-all group"
                  >
                    <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                  <div className="w-[1px] h-4 bg-gray-200" />
                  <span className="font-montserrat font-black text-[10px] uppercase tracking-[0.3em] text-[#E1261C]">
                    {selectedArticle.source}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="w-9 h-9 flex items-center justify-center bg-gray-50 rounded-full hover:bg-[#E1261C] hover:text-white transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <div className="max-w-[860px] mx-auto px-6 py-16">
                  <span className="font-montserrat font-bold text-[11px] text-[#E1261C] uppercase tracking-[0.4em] mb-6 block">
                    Sector Deep Dive
                  </span>
                  <h1 className="font-playfair font-black text-[#121212] text-fluid-h2 mb-8 tracking-tighter">
                    {selectedArticle.title}
                  </h1>
                  <div className="aspect-video overflow-hidden mb-10 shadow-xl border border-gray-100">
                    <img
                      src={selectedArticle.image}
                      className="w-full h-full object-cover"
                      alt={selectedArticle.title}
                      loading="lazy"
                    />
                  </div>
                  <p className="font-lora text-fluid-p text-[#444444] mb-8">
                    {selectedArticle.description}
                  </p>
                  {selectedArticle.pubDate && (
                    <p className="font-montserrat text-[10px] text-gray-400 mb-10">
                      Published: {new Date(selectedArticle.pubDate).toLocaleDateString()}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                    <button
                      onClick={() => navigate('/scripting/new', { state: { article: selectedArticle } })}
                      className="inline-flex items-center justify-center gap-3 bg-[#E1261C] text-white px-10 py-5 font-montserrat font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#121212] transition-all shadow-lg"
                    >
                      Create Facebook Post
                    </button>
                    <a
                      href={selectedArticle.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-3 border-2 border-black text-black px-8 py-5 font-montserrat font-black text-[11px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all"
                    >
                      Read Full Article ↗
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inline keyframe for card fade-in */}
        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0);    }
          }
        `}</style>
      </div>
    </PageTransition>
  );
};

export default CategoriesPage;
