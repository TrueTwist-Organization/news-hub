import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const PostGenerator = ({ imageUrl, initialScript }) => {
  const [caption, setCaption] = useState(initialScript || '');
  const [isPosting, setIsPosting] = useState(false);
  const [postStatus, setPostStatus] = useState(null);

  const handlePost = async () => {
    setIsPosting(true);
    setPostStatus(null);
    try {
      const response = await axios.post('/api/post-to-facebook', {
        imageUrl,
        caption
      });
      if (response.data.success) {
        setPostStatus('success');
      } else {
        setPostStatus('error');
      }
    } catch (error) {
      console.error('Failed to post to Facebook:', error);
      setPostStatus('error');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <motion.div
      initial={{ y: 80, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 100, 
        damping: 20, 
        mass: 1.2 
      }}
      className="relative w-full max-w-4xl mx-auto rounded-3xl overflow-hidden backdrop-blur-2xl bg-white/5 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6 md:p-10 font-inter"
    >
      {/* Decorative Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-[#E1261C]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-[#005689]/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Image Preview */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
          <div className="relative w-full aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black/50 group">
            <img 
              src={imageUrl || 'https://images.unsplash.com/photo-1585829365234-781f8c429471?q=80&w=800'} 
              alt="Post Preview" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Facebook Style Overlays */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              <span className="font-montserrat text-[10px] text-white uppercase tracking-widest">Preview</span>
            </div>
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Right Side: Caption & Actions */}
        <div className="w-full md:w-1/2 flex flex-col justify-between">
          
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#E1261C] animate-pulse" />
              <h3 className="font-montserrat font-black text-sm uppercase tracking-[0.2em] text-white/90">
                Neural Script Editor
              </h3>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 blur" />
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write or edit your caption here..."
                className="relative w-full h-48 md:h-64 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-5 text-white/80 text-sm leading-relaxed resize-none focus:outline-none focus:border-[#E1261C]/50 focus:ring-1 focus:ring-[#E1261C]/50 transition-all scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-auto">
            {postStatus === 'success' && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2.5 rounded-lg text-xs text-center font-montserrat uppercase tracking-wider">
                Successfully posted to network
              </div>
            )}
            
            {postStatus === 'error' && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-lg text-xs text-center font-montserrat uppercase tracking-wider">
                Transmission Failed
              </div>
            )}

            {/* Premium Neon Glow Button */}
            <motion.button
              onClick={handlePost}
              disabled={isPosting || !caption}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-[#E1261C] via-[#ff4d4d] to-[#E1261C] rounded-xl blur opacity-70 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse" />
              <div className="relative w-full bg-[#121212] flex items-center justify-center gap-3 py-4 rounded-xl border border-white/10 overflow-hidden">
                {isPosting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="font-montserrat font-bold text-xs uppercase tracking-[0.2em] text-white">Transmitting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="font-montserrat font-bold text-xs uppercase tracking-[0.2em] text-white">Post to Facebook</span>
                  </>
                )}
                {/* Shine effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
            </motion.button>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default PostGenerator;
