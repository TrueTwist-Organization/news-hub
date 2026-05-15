import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const NEURAL_LOGO = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=80&h=80';
const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=1080';

const FacebookPostGenerator = ({ isOpen, onClose, title, script, imageUrl }) => {
  const navigate = useNavigate();
  const [caption, setCaption] = useState('');
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [postStatus, setPostStatus] = useState(null);
  const [copied, setCopied] = useState(false);
  const [isFbReady, setIsFbReady] = useState(false);

  useEffect(() => {
    // Load/Init Facebook SDK
    if (!window.FB) {
      window.fbAsyncInit = function() {
        window.FB.init({
          appId      : 'YOUR_APP_ID',
          cookie     : true,
          xfbml      : true,
          version    : 'v19.0'
        });
        setIsFbReady(true);
      };

      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    } else {
      setIsFbReady(true);
    }
  }, []);

  const displayImage = imageUrl || PLACEHOLDER_IMG;
  const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    if (isOpen && title && script && !caption) {
      generateCaption();
    }
  }, [isOpen]);

  const generateCaption = async () => {
    setIsGeneratingCaption(true);
    try {
      const res = await fetch(`${API_BASE_URL}/news/generate-fb-caption`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: script?.slice(0, 500) || title })
      });
      const data = await res.json();
      if (data.success) setCaption(data.caption);
      else setCaption(`Breaking: ${title}\n\n#NeuralTimes #BreakingNews #Trending #India #NewsUpdate`);
    } catch {
      setCaption(`Breaking: ${title}\n\n#NeuralTimes #BreakingNews #Trending #India #NewsUpdate`);
    } finally {
      setIsGeneratingCaption(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePost = async () => {
    setIsPosting(true);
    setPostStatus(null);
    try {
      const res = await fetch(`${API_BASE_URL}/news/automate-fb`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description: caption, imageUrl })
      });
      const data = await res.json();
      if (data.success) {
        setPostStatus({ type: 'success', message: 'Transmitted successfully to Facebook!' });
        setTimeout(() => { onClose(); navigate('/creations'); }, 2500);
      } else {
        setPostStatus({ type: 'error', message: data.error || 'Broadcast failed.' });
      }
    } catch (err) {
      setPostStatus({ type: 'error', message: 'Connection lost. Check backend.' });
    } finally {
      setIsPosting(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl">
      
      {/* Close Overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[95vh] overflow-y-auto"
      >
        {/* ── LEFT: FB Mobile Mockup ── */}
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">Live Preview</p>

          {/* Phone Frame */}
          <div className="w-[320px] rounded-[40px] bg-[#1c1c1e] border-[6px] border-[#2a2a2e] shadow-[0_60px_120px_rgba(0,0,0,0.6)] overflow-hidden">
            {/* Status Bar */}
            <div className="bg-[#1c1c1e] flex justify-between items-center px-6 py-2">
              <span className="text-white text-[10px] font-bold">9:41</span>
              <div className="flex gap-1 items-center">
                <div className="w-3 h-1.5 bg-white rounded-sm opacity-80" />
                <div className="w-1 h-1.5 bg-white rounded-sm opacity-40" />
              </div>
            </div>

            {/* FB Post Card */}
            <div className="bg-[#242526] mx-3 mb-3 rounded-2xl overflow-hidden shadow-lg">
              {/* Post Header */}
              <div className="flex items-center gap-3 p-3">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-500/50">
                  <img src={NEURAL_LOGO} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-[13px] font-bold truncate">The Neural Times</p>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400 text-[10px]">{dateStr}</span>
                    <span className="text-gray-600 text-[10px]">·</span>
                    <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>
                </div>
                <div className="text-gray-400 text-xl leading-none">···</div>
              </div>

              {/* Caption Preview */}
              <div className="px-3 pb-2">
                <p className="text-gray-200 text-[12px] leading-relaxed line-clamp-4">
                  {isGeneratingCaption ? 'Generating AI caption...' : caption || 'Your caption will appear here...'}
                </p>
              </div>

              {/* News Image */}
              <div className="relative w-full aspect-video bg-gray-800">
                <img
                  src={`https://images.weserv.nl/?url=${encodeURIComponent(displayImage.replace('http://', 'https://'))}&w=600&fit=cover`}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={e => { e.target.src = PLACEHOLDER_IMG; }}
                />
                {/* Source tag */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-3 py-1.5">
                  <p className="text-white text-[10px] font-bold uppercase tracking-widest truncate">The Neural Times</p>
                  <p className="text-gray-300 text-[9px] truncate">{title?.slice(0, 50)}...</p>
                </div>
              </div>

              {/* FB Actions */}
              <div className="flex justify-around px-3 py-2 border-t border-white/5">
                {['👍 Like', '💬 Comment', '↗ Share'].map(a => (
                  <button key={a} className="text-gray-400 text-[11px] font-semibold hover:text-white transition-colors">{a}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Caption Panel + Actions ── */}
        <div className="flex flex-col gap-5">
          
          {/* Caption Card */}
          <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">AI-Generated Caption</span>
              </div>
              <button
                onClick={generateCaption}
                disabled={isGeneratingCaption}
                className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest hover:text-white transition-colors disabled:opacity-40"
              >
                {isGeneratingCaption ? 'Generating...' : '↻ Regenerate'}
              </button>
            </div>

            {isGeneratingCaption ? (
              <div className="flex items-center gap-3 py-8 justify-center">
                <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-gray-500 text-sm font-mono">Gemini is crafting caption...</span>
              </div>
            ) : isEditingCaption ? (
              <textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                rows={8}
                className="w-full bg-black/40 border border-white/10 p-4 text-sm text-gray-200 leading-relaxed resize-none outline-none rounded-xl focus:border-cyan-500 transition-colors"
              />
            ) : (
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{caption}</p>
            )}

            {/* Caption Actions */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleCopy}
                className={`flex-1 py-3 text-[11px] font-mono uppercase tracking-widest border rounded-xl transition-all ${
                  copied
                    ? 'bg-green-500/20 border-green-500/50 text-green-400'
                    : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                }`}
              >
                {copied ? '✓ Copied!' : 'Copy Caption'}
              </button>
              <button
                onClick={() => setIsEditingCaption(!isEditingCaption)}
                className={`flex-1 py-3 text-[11px] font-mono uppercase tracking-widest border rounded-xl transition-all ${
                  isEditingCaption
                    ? 'bg-white/10 border-white/30 text-white'
                    : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                }`}
              >
                {isEditingCaption ? '✓ Save Edit' : 'Edit Caption'}
              </button>
            </div>
          </div>

          {/* Image Info */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-800">
              <img src={displayImage} alt="" className="w-full h-full object-cover" onError={e => { e.target.src = PLACEHOLDER_IMG; }} />
            </div>
            <div>
              <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest block mb-1">Visual Asset</span>
              <p className="text-gray-400 text-xs leading-snug">
                {imageUrl ? 'Cloudinary-processed image attached' : 'Using high-quality placeholder image'}
              </p>
            </div>
          </div>

          {/* Status and Limits */}
          <button
            onClick={handlePost}
            disabled={isPosting || !caption || !isFbReady}
            className="w-full py-5 bg-[#1877F2] text-white font-black text-[13px] uppercase tracking-[0.3em] rounded-2xl shadow-[0_20px_50px_rgba(24,119,242,0.3)] hover:bg-[#166fe5] hover:scale-[1.02] active:scale-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPosting ? 'Broadcasting...' : !isFbReady ? 'Initializing SDK...' : '📡  Confirm & Post to Facebook'}
          </button>

          <button
            onClick={onClose}
            className="w-full py-4 bg-white/5 border border-white/10 text-gray-300 font-mono text-[11px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 hover:text-white transition-all"
          >
            ← Back / Cancel
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default FacebookPostGenerator;
