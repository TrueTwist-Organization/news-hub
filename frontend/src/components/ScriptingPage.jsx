import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import PageTransition from './PageTransition';
import api from '../api';
import TypewriterHeading from './TypewriterHeading';
import FacebookPostGenerator from './FacebookPostGenerator';

/* ── Animated typing bars ── */
const TypingBars = () => (
  <div className="flex items-end gap-[3px] h-8">
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="w-[3px] rounded-sm bg-[#E1261C]"
        style={{
          animation: `scriptBar 0.${5 + (i % 4)}s ease-in-out infinite alternate`,
          animationDelay: `${i * 0.07}s`,
          height: `${10 + (i % 4) * 6}px`,
          opacity: 0.5 + (i % 3) * 0.17,
        }}
      />
    ))}
  </div>
);

const EDITOR_PHRASES = ['Script Generator.', 'AI Scripting.', 'Write the Story.'];

const ScriptingPage = () => {
  const { id }   = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const article  = location.state?.article || null;

  const [scriptText,     setScriptText]     = useState('');
  const [isGenerating,   setIsGenerating]   = useState(false);
  const [isEditing,      setIsEditing]      = useState(false);
  const [error,          setError]          = useState(null);
  const [typewriterDone, setTypewriterDone] = useState(false);
  const [charCount,      setCharCount]      = useState(0);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const intervalRef = useRef(null);
  useEffect(() => () => clearInterval(intervalRef.current), []);


  const handleGenerate = async (target) => {
    if (!target) return;
    setIsGenerating(true);
    setError(null);
    setScriptText('');
    setTypewriterDone(false);
    setCharCount(0);

    // Build the richest possible content from the article
    const fullContent = [
      target.description,
      target.content,
    ].filter(Boolean).join(' ').trim() || target.title;

    try {
      const res = await api.post('/script', {
        title:       target.title,
        description: fullContent,
        language:    i18n.language
      });
      let full = res.data?.script || '';
      if (!full) throw new Error('AI returned an empty script.');
      
      // Clean up any rogue Markdown or labels (in case Gemini ignores the prompt)
      full = full.replace(/\[?(HOOK|BODY|OUTRO|Hook|Body|Outro)\]?:?\s*/gi, '')
                 .replace(/\*\*(.*?)\*\*:?/g, '')
                 .replace(/^\s*[-*•]\s*/gm, '') // remove bullet points
                 .trim();

      let i = 0;
      intervalRef.current = setInterval(() => {
        setScriptText(full.slice(0, i));
        setCharCount(i);
        i++;
        if (i > full.length) {
          clearInterval(intervalRef.current);
          setTypewriterDone(true);
        }
      }, 14);
    } catch (err) {
      // DEBUG: Log the exact response from the server to find "Tree Chart"
      console.error('--- SCRIPT GENERATION DEBUG ---');
      if (err.response) {
        console.error('Server Data:', err.response.data);
        console.error('Server Status:', err.response.status);
        setError(`Server Error: ${err.response.data?.error || 'Malformed Response'}`);
      } else {
        console.error('Error Message:', err.message);
        setError('Connection failed. Please check if the backend is running.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (article) handleGenerate(article);
  }, [article]); // Added article to dependency array as recommended by linter

  const wordCount = scriptText.trim() ? scriptText.trim().split(/\s+/).length : 0;

  const handleConfirm = async () => {
    try {
      await api.post('/creations', {
        title: article?.title || 'Untitled Script',
        script: scriptText,
        imageUrl: article?.image || '',
        category: article?.category || 'General'
      });
      navigate('/creations');
    } catch (err) {
      setError('Failed to save script to archive.');
    }
  };

  return (
    <PageTransition>
      <style>{`
        @keyframes scriptBar { from { transform: scaleY(0.3); } to { transform: scaleY(1); } }
      `}</style>

      <div className="w-full min-h-screen bg-[#fdfbf7] font-serif text-[#121212] overflow-x-hidden">
        {/* Subtle Paper Texture */}
        <div className="fixed inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")' }} />

        {/* ── Page Header ── */}
        <div className="border-b-4 border-black pt-24 bg-white/50 backdrop-blur-md">

          <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-24">

            {/* Breadcrumb / Masthead Info */}
            <div className="flex justify-between items-center pt-8 mb-6 border-b border-black/10 pb-4">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate(-1)} 
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#121212] text-white font-sans font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#E1261C] transition-all rounded-sm shadow-md"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                  </svg>
                  BACK
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-gray-300">|</span>
                  <span className="font-sans font-black text-[10px] uppercase tracking-[0.2em] text-red-600">Neural Studio v4.5</span>
                </div>
              </div>
              <div className="hidden md:block font-sans font-black text-[10px] uppercase tracking-[0.2em]">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>


            {/* Title row */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-[#E1261C] animate-pulse' : typewriterDone ? 'bg-green-500' : 'bg-[#121212]/10'}`} />

                  <span className="font-montserrat font-medium text-[10px] uppercase tracking-[0.2em] text-[#444444]">
                    {isGenerating ? 'Generating Script...' : typewriterDone ? 'Script Ready' : article ? 'Processing' : 'Awaiting Input'}
                  </span>
                </div>
                <h1 className="font-playfair font-bold text-[#121212] text-4xl md:text-5xl">
                  <TypewriterHeading phrases={EDITOR_PHRASES} />
                </h1>
              </div>

              {/* Metrics removed from header for cleaner aesthetic */}
            </div>
          </div>

          {/* Red progress bar while generating */}
          {isGenerating && (
            <div className="h-[3px] bg-[#FFFFFF]">

              <motion.div className="h-full bg-[#E1261C]"
                animate={{ width: ['0%', '70%', '85%'] }}
                transition={{ duration: 8, ease: 'easeInOut' }}
              />
            </div>
          )}
          {typewriterDone && <div className="h-[3px] bg-[#E1261C]" />}
          {!isGenerating && !typewriterDone && <div className="h-[3px] bg-[#121212]/10" />}

        </div>

        {/* ── Main Content Grid ── */}
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-24 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* ── LEFT: Article Source Panel ── */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
              className="lg:col-span-1">

              {/* Article card */}
              <div className="border border-[#121212]/10 bg-white">
                <div className="h-[3px] bg-[#005689]" />
                <div className="px-5 py-4 border-b border-[#121212]/10 bg-[#FFFFFF] flex items-center justify-between">

                  <span className="font-montserrat font-medium text-[10px] uppercase tracking-[0.2em] text-[#005689]">
                    Article Source
                  </span>
                  {article?.source?.name && (
                    <span className="font-inter text-[10px] text-[#444444] opacity-60">{article.source.name}</span>
                  )}
                </div>

                {article ? (
                  <div>
                    {article.image && (
                      <div className="aspect-video overflow-hidden">
                        <img src={article.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-5 space-y-4">
                      <div>
                        <p className="font-montserrat font-medium text-[9px] uppercase tracking-[0.2em] text-[#E1261C] mb-1.5">Headline</p>
                        <h3 className="font-lora font-semibold text-[#121212] text-sm leading-snug">{article.title}</h3>
                      </div>
                      {article.description && (
                        <div className="border-t border-[#121212]/10 pt-4">

                          <p className="font-montserrat font-medium text-[9px] uppercase tracking-[0.2em] text-[#444444] mb-1.5">Summary</p>
                          <p className="font-inter text-[#444444] text-xs leading-relaxed opacity-70">{article.description}</p>
                        </div>
                      )}
                      {article.publishedAt && (
                        <div className="border-t border-[#121212]/10 pt-4 flex items-center gap-2">

                          <svg className="w-3 h-3 text-[#444444] opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                          <span className="font-inter text-[10px] text-[#444444] opacity-50">
                            {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-10 text-center">
                    <div className="w-12 h-12 border-2 border-dashed border-[#121212/10] flex items-center justify-center mx-auto mb-3">
                      <svg className="w-5 h-5 text-[#121212/10]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="font-inter text-[#444444] text-xs opacity-50">No article selected.</p>
                    <button onClick={() => navigate('/hub')}
                      className="mt-3 font-montserrat font-medium text-[10px] uppercase tracking-[0.1em] text-[#E1261C] border-b border-[#E1261C]">
                      Go to News Hub
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-4 border border-[#121212]/10 bg-[#FFFFFF] px-4 py-3 flex gap-3">
                <div className="w-4 h-4 bg-[#005689] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                </div>
                <p className="font-inter text-[#444444] text-[11px] leading-relaxed opacity-70">
                  Script is generated by Gemini AI and can be saved directly to your personal archive.
                </p>
              </div>
            </motion.div>

            {/* ── RIGHT: Script Output Panel ── */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2">
              <div className="border border-[#121212]/10 bg-white min-h-[560px] flex flex-col">


                {/* Panel header */}
                <div className="h-[3px] bg-[#E1261C]" />
                <div className="px-5 py-4 border-b border-[#121212]/10 bg-[#FFFFFF] flex items-center justify-between">

                  <div className="flex items-center gap-3">
                    <span className="font-montserrat font-medium text-[10px] uppercase tracking-[0.2em] text-[#444444]">
                      {t('Gemini Insight')}
                    </span>
                    {isGenerating && <TypingBars />}
                  </div>
                  <AnimatePresence>
                    {typewriterDone && (
                      <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-1.5 bg-green-50 border border-green-200 px-3 py-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="font-montserrat font-medium text-[9px] uppercase tracking-[0.15em] text-green-700">Ready</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Body */}
                <div className="flex-grow flex flex-col p-6">
                  <AnimatePresence mode="wait">

                    {/* Generating state */}
                    {isGenerating && (
                      <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex-grow flex flex-col items-center justify-center gap-5">
                        <TypingBars />
                        <div className="text-center">
                          <p className="font-playfair font-bold text-[#121212] text-lg mb-1">Writing your script...</p>
                          <p className="font-inter text-[#444444] text-xs opacity-60">Gemini AI is generating a broadcast-ready script</p>
                        </div>
                        <div className="flex gap-1.5 mt-2">
                          {[0,1,2].map(i => (
                            <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-[#E1261C]"
                              animate={{ opacity: [0.2, 1, 0.2] }}
                              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.3 }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Error state */}
                    {!isGenerating && error && (
                      <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex-grow flex flex-col items-center justify-center gap-4 text-center">
                        <div className="w-10 h-10 bg-[#E1261C] flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </div>
                        <div>
                          <p className="font-lora font-semibold text-[#121212] text-base mb-1">Generation Failed</p>
                          <p className="font-inter text-[#444444] text-sm opacity-70">{error}</p>
                        </div>
                        <button onClick={() => handleGenerate(article)}
                          className="px-6 py-2.5 bg-[#E1261C] text-white font-montserrat font-medium text-[11px] uppercase tracking-[0.1em] hover:bg-[#c0201a] transition-colors">
                          Try Again
                        </button>
                      </motion.div>
                    )}

                    {/* Script output */}
                    {!isGenerating && !error && (
                      <motion.div key="script" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-grow flex flex-col relative group">
                        
                        {/* Premium Neural Editor Container */}
                        <div className={`relative flex-grow rounded-2xl overflow-hidden transition-all duration-500 ${isEditing ? 'shadow-[0_0_40px_rgba(225,38,28,0.15)] ring-1 ring-[#E1261C]/30' : 'bg-[#121212] shadow-2xl'}`}>
                          
                          {/* Animated Border Glow (only visible when not empty) */}
                          {scriptText && (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#E1261C]/20 via-transparent to-[#005689]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                          )}

                          {!scriptText && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#f8f9fa] pointer-events-none">
                              <div className="w-16 h-16 rounded-full bg-[#121212]/5 flex items-center justify-center">
                                <svg className="w-8 h-8 text-[#121212]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <p className="font-montserrat font-medium text-[11px] uppercase tracking-[0.15em] text-[#121212]/40">Awaiting Neural Link</p>
                            </div>
                          )}

                          {scriptText && (
                            <div className="absolute top-0 left-0 right-0 h-10 bg-black/40 backdrop-blur-md border-b border-white/10 flex items-center px-4 justify-between pointer-events-none z-10">
                              <span className="font-montserrat font-bold text-[9px] uppercase tracking-[0.2em] text-[#E1261C]">Neural Editor Active</span>
                              <div className="flex gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                <div className="w-2 h-2 rounded-full bg-green-500/50" />
                              </div>
                            </div>
                          )}

                          <textarea
                            readOnly={!isEditing}
                            value={scriptText}
                            onChange={e => setScriptText(e.target.value)}
                            className={`w-full h-full min-h-[400px] pt-14 pb-12 px-6 md:px-10 font-inter text-[15px] leading-[2.2] resize-none focus:outline-none transition-all duration-300 custom-scrollbar ${
                              isEditing 
                                ? 'bg-white text-[#121212] selection:bg-[#E1261C]/20' 
                                : 'bg-[#121212]/95 backdrop-blur-xl text-white/80 selection:bg-white/20'
                            }`}
                            placeholder=""
                            style={{ 
                              scrollbarWidth: 'thin',
                              scrollbarColor: isEditing ? '#E1261C transparent' : 'rgba(255,255,255,0.2) transparent' 
                            }}
                          />

                          {/* Subtle HUD in the editor footer */}
                          {scriptText && (
                            <div className="absolute bottom-4 right-6 flex items-center gap-4 pointer-events-none">
                              <div className={`font-sans font-black text-[9px] uppercase tracking-[0.2em] ${isEditing ? 'text-gray-300' : 'text-white/20'}`}>
                                {wordCount} Words
                              </div>
                              <div className={`w-[1px] h-2 ${isEditing ? 'bg-gray-200' : 'bg-white/10'}`} />
                              <div className={`font-sans font-black text-[9px] uppercase tracking-[0.2em] ${isEditing ? 'text-gray-300' : 'text-white/20'}`}>
                                {scriptText.length} Chars
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action bar */}
                        <div className="flex flex-wrap gap-3 items-center justify-between pt-5 mt-5 border-t border-[#121212]/10">

                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(-1)}
                              className="px-5 py-2.5 font-montserrat font-medium text-[11px] uppercase tracking-[0.1em] border border-[#121212]/10 text-[#444444] hover:border-[#121212] hover:text-[#121212] transition-colors"
                            >
                              ← Back to Hub
                            </button>

                            <button
                              onClick={() => setIsEditing(!isEditing)}
                              disabled={!typewriterDone}
                              className={`px-5 py-2.5 font-montserrat font-medium text-[11px] uppercase tracking-[0.1em] transition-colors border ${
                                !typewriterDone
                                  ? 'border-[#121212]/10 text-[#121212]/20 cursor-not-allowed'
                                  : isEditing

                                    ? 'bg-[#121212] text-white border-[#121212]'
                                    : 'border-[#121212]/10 text-[#444444] hover:border-[#121212] hover:text-[#121212]'
                              }`}>

                              {isEditing ? '✓ Save Edits' : 'Edit Script'}
                            </button>

                              {article && (
                                <button
                                  onClick={() => handleGenerate(article)}
                                  disabled={isGenerating}
                                  className="px-5 py-2.5 font-montserrat font-medium text-[11px] uppercase tracking-[0.1em] border border-[#121212]/10 text-[#444444] hover:border-[#005689] hover:text-[#005689] transition-colors">
                                  Regenerate
                                </button>
                              )}

                             {typewriterDone && (
                               <button
                                 onClick={() => setIsPostModalOpen(true)}
                                 className="px-5 py-2.5 font-montserrat font-bold text-[11px] uppercase tracking-[0.15em] bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200">
                                 Create Facebook Post
                               </button>
                             )}
                           </div>

                          <motion.button
                            onClick={handleConfirm}
                            disabled={!typewriterDone && !isEditing}
                            whileHover={typewriterDone || isEditing ? { scale: 1.02 } : {}}
                            whileTap={typewriterDone || isEditing ? { scale: 0.98 } : {}}
                            className={`flex items-center gap-3 px-8 py-3 font-montserrat font-medium text-[12px] uppercase tracking-[0.12em] transition-all ${
                              typewriterDone || isEditing
                                ? 'bg-[#E1261C] text-white hover:bg-[#c0201a] shadow-md hover:shadow-lg'
                                : 'bg-[#FFFFFF] text-[#121212]/20 cursor-not-allowed border border-[#121212]/10'
                            }`}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            Save to Vault
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* ── Facebook Post Generator Modal ── */}
        <FacebookPostGenerator 
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          title={article?.title}
          imageUrl={article?.image || article?.urlToImage} 
          script={scriptText} 
        />

      </div>
    </PageTransition>
  );
};

export default ScriptingPage;
