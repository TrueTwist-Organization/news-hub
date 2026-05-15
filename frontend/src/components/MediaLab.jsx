import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PageTransition from './PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import TypewriterHeading from './TypewriterHeading';

/* ── Waveform animation bars ── */
const Waveform = ({ active }) => (
  <div className="flex items-end gap-[3px] h-10">
    {Array.from({ length: 18 }).map((_, i) => (
      <motion.div
        key={i}
        className="w-1 rounded-sm"
        style={{ backgroundColor: active ? '#E1261C' : '#121212' }}

        animate={active ? {
          height: [`${12 + Math.random() * 20}px`, `${28 + Math.random() * 12}px`, `${8 + Math.random() * 24}px`]
        } : { height: '6px' }}
        transition={{ repeat: Infinity, duration: 0.4 + (i % 5) * 0.1, delay: i * 0.04 }}
      />
    ))}
  </div>
);

const MediaLab = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const scriptText = location.state?.script || '';
  const article    = location.state?.article || null;

  const [phase,    setPhase]    = useState('loading'); // 'loading' | 'done' | 'error'
  const [audioUrl, setAudioUrl] = useState(null);
  const [error,    setError]    = useState(null);
  const [progress, setProgress] = useState(0);
  const hasTriggered = React.useRef(false);

  /* ── Auto-trigger pipeline on mount ── */
  useEffect(() => {
    if (!scriptText || !article?.title || hasTriggered.current) return;
    hasTriggered.current = true;

    const run = async () => {
      try {
        setPhase('loading');
        // Animate progress bar
        const tick = setInterval(() => setProgress(p => Math.min(p + 2, 88)), 180);

        const res = await api.post('/studio', { title: article.title, script: scriptText });

        clearInterval(tick);
        if (!res.data?.success) throw new Error(res.data?.error || 'Pipeline failed.');

        setProgress(100);
        setAudioUrl(res.data.audioUrl);
        setTimeout(() => setPhase('done'), 500);
      } catch (err) {
        setError(err.message || 'Audio generation failed.');
        setPhase('error');
      }
    };

    run();
  }, []);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <PageTransition>
      <div className="w-full min-h-screen bg-white font-inter overflow-x-hidden pt-24 pb-20">
        
        <div className="max-w-[1000px] mx-auto px-6 mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-sans font-black text-[11px] uppercase tracking-[0.3em] text-[#444444] hover:text-red-600 transition-colors group">
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Hub
          </button>
        </div>

        {/* ── Top red accent ── */}
        <div className="h-[3px] bg-[#E1261C] fixed top-0 left-0 right-0 z-[200]" />

        {/* ─────────────────── LOADING PHASE ─────────────────── */}
        <AnimatePresence mode="wait">
          {phase === 'loading' && (
            <motion.div key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[80vh] px-6">

              <div className="w-full max-w-xl">
                {/* Header */}
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-8 h-8 bg-[#E1261C] flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5a3 3 0 00-6 0v6c0 1.66 1.34 3 3 3z"/>
                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-montserrat font-medium text-[10px] uppercase tracking-[0.2em] text-[#E1261C]">Generating Audio</p>
                    <p className="font-lora font-semibold text-[#121212] text-sm truncate max-w-xs">{article?.title}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="w-full h-1.5 bg-[#FFFFFF] border border-[#121212]/10 mb-3 overflow-hidden">

                  <motion.div className="h-full bg-[#E1261C]" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
                </div>
                <div className="flex justify-between mb-10">
                  <span className="font-montserrat text-[10px] uppercase tracking-[0.15em] text-[#444444]">
                    {progress < 30 ? 'Processing script...' : progress < 70 ? 'Synthesizing voice...' : progress < 95 ? 'Rendering audio...' : 'Finalizing...'}
                  </span>
                  <span className="font-montserrat text-[10px] text-[#E1261C]">{progress}%</span>
                </div>

                {/* Live waveform */}
                <div className="border border-[#121212]/10 bg-[#FFFFFF] p-6 flex flex-col items-center gap-4">

                  <Waveform active={true} />
                  <p className="font-inter text-[#444444] text-xs opacity-60">ElevenLabs Neural Voice Synthesis · Live</p>
                </div>

                {/* Script preview */}
                <div className="mt-6 border border-[#121212]/10 bg-white p-5 max-h-32 overflow-hidden relative">

                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent" />
                  <p className="font-inter text-[#444444] text-xs leading-relaxed opacity-60 line-clamp-4">{scriptText}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─────────────────── ERROR PHASE ─────────────────── */}
          {phase === 'error' && (
            <motion.div key="error"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
              <div className="w-full max-w-md border border-[#121212]/10 bg-white p-10">

                <div className="w-12 h-12 bg-[#E1261C] flex items-center justify-center mx-auto mb-5">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h2 className="font-playfair font-bold text-[#121212] text-2xl mb-2">Generation Failed</h2>
                <p className="font-inter text-[#444444] text-sm mb-6 opacity-70">{error}</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button onClick={() => navigate(-1)}
                    className="px-5 py-2.5 border border-[#121212]/10 font-montserrat font-medium text-[11px] uppercase tracking-[0.1em] text-[#444444] hover:border-[#121212] transition-colors">
                    Go Back
                  </button>

                  <button onClick={() => setPhase('done')}
                    className="px-5 py-2.5 border border-[#005689] text-[#005689] font-montserrat font-medium text-[11px] uppercase tracking-[0.1em] hover:bg-[#005689] hover:text-white transition-colors">
                    View Script Anyway
                  </button>
                  <Link to="/hub">
                    <button className="px-5 py-2.5 bg-[#E1261C] text-white font-montserrat font-medium text-[11px] uppercase tracking-[0.1em] hover:bg-[#c0201a] transition-colors">
                      News Hub
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─────────────────── SUCCESS / NEWSPAPER RESULT ─────────────────── */}
          {phase === 'done' && (
            <motion.div key="done"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="max-w-[1000px] mx-auto px-6 md:px-12 py-10">

              {/* ── Newspaper Header ── */}
              <div className="border-b-4 border-black mb-16 pb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-montserrat font-black text-[10px] uppercase tracking-[0.4em] text-[#E1261C]">Neural Media Studio</span>
                  <div className="flex-1 h-[1px] bg-black/10" />
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none italic">
                  <TypewriterHeading 
                    phrases={['NewsLive Audio.', 'Digital Broadcast.', 'The Voice Edition.']} 
                    speed={100} 
                  />
                </h1>
              </div>

              {/* ── Success Banner ── */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                className="flex items-center gap-3 bg-green-50 border border-green-200 px-5 py-3 mb-8">
                <div className="w-5 h-5 bg-green-500 flex items-center justify-center rounded-full shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-montserrat font-medium text-[11px] uppercase tracking-[0.1em] text-green-700">
                  Audio Generated & Saved to Archive
                </p>
                <div className="ml-auto">
                  <Waveform active={false} />
                </div>
              </motion.div>

              {/* ── Main Newspaper Layout ── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                {/* Left: Story column (2/3) */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                  className="lg:col-span-2 border-r border-[#121212]/10 pr-0 lg:pr-8">


                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-[#E1261C] text-white font-montserrat font-medium text-[9px] px-2 py-0.5 uppercase tracking-[0.2em]">
                      Audio Brief
                    </span>
                    {article?.source?.name && (
                      <span className="font-montserrat text-[10px] text-[#005689] uppercase tracking-[0.1em]">{article.source.name}</span>
                    )}
                  </div>

                  <h2 className="font-playfair font-bold text-[#121212] text-2xl md:text-3xl leading-tight mb-4">
                    {article?.title || 'AI Generated News Script'}
                  </h2>

                  <div className="flex items-center gap-4 mb-5 pb-4 border-b border-[#121212]/10">

                    <p className="font-montserrat text-[10px] uppercase tracking-[0.1em] text-[#444444] opacity-60">By NewsLive AI</p>
                    <span className="text-[#121212]/10">|</span>
                    <p className="font-montserrat text-[10px] uppercase tracking-[0.1em] text-[#444444] opacity-60">{today}</p>

                  </div>

                  {/* Audio Player — styled as newspaper audio box */}
                  {audioUrl && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                      className="border-2 border-[#121212] bg-[#FFFFFF] p-5 mb-6">

                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-6 h-6 bg-[#E1261C] flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 14c1.66 0 3-1.34 3-3V5a3 3 0 00-6 0v6c0 1.66 1.34 3 3 3z"/>
                            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                          </svg>
                        </div>
                        <span className="font-montserrat font-medium text-[10px] uppercase tracking-[0.2em] text-[#121212]">Listen to AI Audio Brief</span>
                        <div className="ml-auto">
                          <Waveform active={true} />
                        </div>
                      </div>
                      <audio src={audioUrl} controls autoPlay className="w-full" style={{ height: '40px' }} />
                    </motion.div>
                  )}

                  {/* Script as newspaper column text */}
                  <div className="columns-2 gap-6">
                    {scriptText.split('\n\n').map((para, i) => (
                      <p key={i} className="font-inter text-[#444444] text-sm leading-relaxed mb-4 break-inside-avoid">
                        {para}
                      </p>
                    ))}
                  </div>
                </motion.div>

                {/* Right: Sidebar (1/3) */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                  className="flex flex-col gap-6">

                  {/* Article image */}
                  {article?.image && (
                    <div>
                      <div className="aspect-[4/3] overflow-hidden border border-[#121212]/10 mb-1">
                        <img src={article.image} className="w-full h-full object-cover" alt="" />
                      </div>

                      <p className="font-inter text-[10px] text-[#444444] opacity-50 italic">Image: {article.source?.name || 'NewsLive'}</p>
                    </div>
                  )}

                  {/* Archive info card */}
                  <div className="border border-[#121212]/10 bg-[#FFFFFF] p-5">

                    <p className="font-montserrat font-medium text-[10px] uppercase tracking-[0.2em] text-[#005689] mb-4">Saved to Archive</p>
                    <div className="space-y-3">
                      {[
                        { label: 'Format',  val: 'Audio + Script' },
                        { label: 'Engine',  val: 'ElevenLabs v3' },
                        { label: 'Date',    val: new Date().toLocaleDateString() },
                        { label: 'Status',  val: 'Completed' },
                      ].map(row => (
                        <div key={row.label} className="flex justify-between items-center border-b border-[#121212]/10 pb-2 last:border-0">
                          <span className="font-montserrat text-[10px] uppercase tracking-[0.1em] text-[#444444] opacity-60">{row.label}</span>

                          <span className="font-inter text-xs text-[#121212]">{row.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Download audio */}
                  {audioUrl && (
                    <a href={audioUrl} download className="block">
                      <button className="w-full py-3 border border-[#005689] text-[#005689] font-montserrat font-medium text-[11px] uppercase tracking-[0.1em] hover:bg-[#005689] hover:text-white transition-colors flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Audio
                      </button>
                    </a>
                  )}
                </motion.div>
              </div>

              {/* ── Bottom action bar ── */}
              <div className="border-t-2 border-[#121212] pt-6 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-[#E1261C]" />
                  <span className="font-montserrat font-medium text-[10px] uppercase tracking-[0.2em] text-[#444444]">NewsLive Audio Edition</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => navigate(-1)}
                    className="px-5 py-2.5 border border-[#121212]/10 font-montserrat font-medium text-[11px] uppercase tracking-[0.1em] text-[#444444] hover:border-[#121212] hover:text-[#121212] transition-colors">
                    ← Back to Hub
                  </button>

                  <Link to="/creations">
                    <button className="px-5 py-2.5 bg-[#E1261C] text-white font-montserrat font-medium text-[11px] uppercase tracking-[0.1em] hover:bg-[#c0201a] transition-colors flex items-center gap-2">
                      View All Scripts
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default MediaLab;
