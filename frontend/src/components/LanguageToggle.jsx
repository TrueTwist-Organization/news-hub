import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language && i18n.language.startsWith('hi');

  const toggleLanguage = () => {
    i18n.changeLanguage(isHindi ? 'en' : 'hi');
  };

  return (
    <div className="flex items-center">
      <button
        onClick={toggleLanguage}
        className="group relative flex items-center gap-4 px-5 py-2 bg-white border-2 border-[#121212] rounded-sm transition-all duration-200"
      >
        {/* Globe Icon */}
        <svg 
          className={`w-4 h-4 transition-colors duration-300 ${isHindi ? 'text-[#E1261C]' : 'text-[#121212]'}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>

        <div className="flex items-center gap-3">
          <span className={`font-montserrat font-black text-[11px] tracking-widest transition-colors duration-300 ${!isHindi ? 'text-[#E1261C]' : 'text-[#121212]'}`}>
            ENG
          </span>
          <div className="w-[2px] h-3 bg-gray-200" />
          <span className={`font-montserrat font-black text-[11px] tracking-widest transition-colors duration-300 ${isHindi ? 'text-[#E1261C]' : 'text-[#121212]'}`}>
            हिन्दी
          </span>
        </div>

        {/* Minimal Highlight Bar instead of full black background */}
        <div className={`absolute bottom-0 left-0 right-0 h-[3px] transition-all duration-300 ${isHindi ? 'bg-[#E1261C]' : 'bg-[#121212]'}`} />
      </button>
    </div>
  );
};

export default LanguageToggle;
