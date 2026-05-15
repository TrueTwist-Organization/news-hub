import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../api';

const translationCache = new Map();

const NewsCard = ({ story, onClick, variant = 'default' }) => {
  const { i18n, t } = useTranslation();
  
  // Defensive guard: Prevent crash if story is malformed or missing
  if (!story || !story.title) {
    return null; 
  }

  const [displayData, setDisplayData] = useState({ title: story.title, description: story.description });
  const [isTranslating, setIsTranslating] = useState(false);
  const isHindi = i18n.language && i18n.language.startsWith('hi');

  useEffect(() => {
    const handleTranslation = async () => {
      if (!isHindi) {
        setDisplayData({ title: story.title, description: story.description });
        setIsTranslating(false);
        return;
      }

      const cacheKey = `${story.title}_${i18n.language}`;
      if (translationCache.has(cacheKey)) {
        setDisplayData(translationCache.get(cacheKey));
        return;
      }

      setIsTranslating(true);
      try {
        const res = await api.post('/news/translate-card', {
          title: story.title,
          description: story.description,
          language: 'hi'
        });

        if (res.data.success) {
          const translated = {
            title: res.data.title,
            description: res.data.description
          };
          setDisplayData(translated);
          translationCache.set(cacheKey, translated);
        }
      } catch (error) {
        console.error('[TRANSLATION ERROR]', error);
        setDisplayData({ title: story.title, description: story.description });
      } finally {
        setIsTranslating(false);
      }
    };

    handleTranslation();
  }, [i18n.language, story.title, story.description, isHindi]);

  const SkeletonBlock = ({ className }) => (
    <div className={`bg-gray-100 animate-pulse rounded-sm ${className}`} />
  );

  const handleReadMore = (e) => {
    e.stopPropagation(); 
    onClick(); 
  };

  const revealVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }
    }
  };

  if (variant === 'hero') {
    return (
      <motion.div 
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1, margin: "-50px" }}
        className="cursor-pointer group overflow-hidden" 
        onClick={onClick}
      >
        <div className="relative aspect-[4/3] overflow-hidden mb-8 bg-gray-50 border border-gray-100">
          <img 
            src={story.image} 
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" 
            alt="" 
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200'; }}
          />
          <div className="absolute top-4 left-4 bg-[#E1261C] text-white px-3 py-1 font-montserrat font-black text-[10px] uppercase tracking-widest">
            {t('Latest')}
          </div>
        </div>
        
        <div className="min-h-[220px]">
          <AnimatePresence mode="wait">
            {isTranslating ? (
              <motion.div 
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <SkeletonBlock className="h-12 w-full" />
                  <SkeletonBlock className="h-12 w-4/5" />
                </div>
                <div className="space-y-2">
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-4 w-full" />
                  <SkeletonBlock className="h-4 w-3/4" />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="font-playfair font-black text-[#121212] text-4xl md:text-5xl lg:text-[52px] leading-[1.05] tracking-tight group-hover:text-[#E1261C] transition-colors mb-6">
                  {displayData.title}
                </h1>
                <p className="font-lora text-gray-600 text-lg md:text-xl leading-relaxed mb-8 line-clamp-3">
                  {displayData.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
          <span className="bg-[#E1261C] text-white px-2 py-0.5 font-montserrat font-black text-[9px] uppercase tracking-widest">{t('Lead Story')}</span>
          <span className="font-montserrat font-bold text-[9px] text-gray-400 uppercase tracking-widest">{story.source}</span>
          <button 
            onClick={handleReadMore}
            className="ml-auto font-montserrat font-black text-[11px] text-[#121212] uppercase tracking-widest hover:text-[#E1261C] transition-colors"
          >
            {isHindi ? 'और पढ़ें' : 'Read More'} →
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.1, margin: "-20px" }}
      className="flex flex-col group cursor-pointer h-full"
      onClick={onClick}
    >
      <div className="relative aspect-[16/10] overflow-hidden mb-6 border border-gray-100 bg-gray-50 shrink-0 rounded-sm">
        <img
          src={story.image}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt=""
          loading="lazy"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800'; }}
        />
        <div className="absolute top-3 left-3 bg-[#E1261C] text-white px-2 py-0.5 font-montserrat font-black text-[8px] tracking-widest uppercase">
          {t('Signal')}
        </div>
      </div>

      <div className="flex-1 min-h-[140px]">
        <AnimatePresence mode="wait">
          {isTranslating ? (
            <motion.div
              key="skeleton-default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <SkeletonBlock className="h-6 w-full" />
                <SkeletonBlock className="h-6 w-5/6" />
              </div>
              <div className="space-y-2">
                <SkeletonBlock className="h-3 w-full" />
                <SkeletonBlock className="h-3 w-2/3" />
              </div>
            </motion.div>
          ) : (
            <div key="content">
              <h3 className="font-playfair font-black mb-4 text-xl leading-tight group-hover:text-[#E1261C] transition-colors">
                {displayData.title}
              </h3>
              <p className="font-lora text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6">
                {displayData.description}
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <span className="font-montserrat font-bold text-[9px] text-gray-400 uppercase tracking-widest">
          {story.pubDate ? new Date(story.pubDate).toLocaleDateString() : ''}
        </span>
        <button
          onClick={handleReadMore}
          className="font-montserrat font-black text-[10px] text-[#E1261C] uppercase tracking-widest border-b-2 border-transparent hover:border-[#E1261C] transition-all"
        >
          {t('Read More')} →
        </button>
      </div>
    </motion.div>
  );
};

export default NewsCard;
