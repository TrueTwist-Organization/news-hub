import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageTransition from './PageTransition';
import TypewriterHeading from './TypewriterHeading';
import FacebookPostGenerator from './FacebookPostGenerator';
import { API_BASE_URL } from '../config';

const MyCreations = () => {
  const [creations, setCreations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [generatorItem, setGeneratorItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCreations();
  }, []);

  const fetchCreations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/creations`);
      
      // 1. Explicitly handle 404 Not Found to prevent parsing errors
      if (response.status === 404) {
        console.warn('[VAULT] Data source not found (404). Returning empty archive.');
        setCreations([]);
        return;
      }

      // 2. Handle other HTTP errors
      if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
      }

      // 3. Verify Content-Type before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Data format mismatch: Expected JSON but received different type.');
      }

      const data = await response.json();
      setCreations(data.data || []);
    } catch (error) {
      console.error('[VAULT] Error fetching creations:', error.message);
      setCreations([]); // Safe fallback to empty list
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this edition from the archive?')) return;
    try {
      await fetch(`${API_BASE_URL}/creations/${id}`, { method: 'DELETE' });
      setCreations(creations.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting creation:', error);
    }
  };

  const filtered = creations.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'visuals') return item.imageUrl || item.image;
    if (activeTab === 'scripts') return !(item.imageUrl || item.image);
    return true;
  });

  return (
    <PageTransition>
      <div className="w-full min-h-screen bg-[#fdfaf5] font-serif relative overflow-x-hidden no-scrollbar selection:bg-red-600 selection:text-white">
        
        <div 
          className="fixed inset-0 opacity-[0.05] pointer-events-none z-0" 
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper.png")' }}
        />

        <header className="pt-32 pb-16 px-6 md:px-12 xl:px-24 bg-white/50 border-b-4 border-black relative z-10">
          <div className="max-w-[1400px] mx-auto mb-10">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 font-sans font-black text-[11px] uppercase tracking-[0.3em] text-[#444444] hover:text-red-600 transition-colors group">
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Newsroom
            </button>
          </div>

          <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <span className="font-sans font-black text-[10px] uppercase tracking-[0.4em] text-red-600">The Neural Vault</span>
                <div className="flex-1 h-[1px] bg-black/10" />
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none italic">
                <TypewriterHeading phrases={['Archived News.', 'Daily Editions.', 'The Vault.']} speed={100} />
              </h1>
            </div>
            <div className="text-right border-l-4 border-black pl-10 hidden lg:block">
              <p className="text-7xl font-black leading-none">{creations.length}</p>
              <p className="font-sans font-black text-[10px] uppercase tracking-widest text-gray-400">Preserved Records</p>
            </div>
          </div>
        </header>

        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b-2 border-black px-6 md:px-12 xl:px-24">
          <div className="max-w-[1400px] mx-auto flex gap-12">
            {['all', 'visuals', 'scripts'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`py-6 font-sans font-black text-[11px] uppercase tracking-[0.3em] relative transition-all ${
                  activeTab === tab ? 'text-red-600' : 'text-gray-400 hover:text-black'
                }`}>
                {tab} Records
                {activeTab === tab && (
                  <motion.div layoutId="archive-tab" className="absolute bottom-[-2px] left-0 right-0 h-[4px] bg-red-600" />
                )}
              </button>
            ))}
          </div>
        </nav>

        <main className="max-w-[1400px] mx-auto px-6 md:px-12 xl:px-24 py-20 relative z-10">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {[1,2,3,4,5,6].map(id => <div key={id} className="h-[500px] bg-white border-2 border-black/5 animate-pulse shadow-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-40 text-center border-4 border-dashed border-black/10">
              <h3 className="text-4xl font-black uppercase tracking-tighter opacity-20">Archive Empty</h3>
              <p className="mt-4 text-gray-400 italic">No historical records preserved yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <AnimatePresence mode="popLayout">
                {filtered.map((item, i) => (
                  <motion.div 
                    key={item.id} layout initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: (i % 3) * 0.1 }}
                    className="bg-white border-2 border-black flex flex-col shadow-[15px_15px_0_rgba(0,0,0,0.05)] group hover:shadow-[15px_15px_0_rgba(204,0,0,0.1)] transition-all duration-500"
                  >
                    <div className="px-6 py-4 border-b-2 border-black flex justify-between items-center bg-gray-50/50">
                      <span className="font-sans font-black text-[9px] uppercase tracking-widest text-red-600">Edition No. {item.id.slice(0, 4)}</span>
                      <span className="font-sans font-black text-[9px] uppercase tracking-widest text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="h-48 overflow-hidden border-b-2 border-black relative">
                      {(item.imageUrl || item.image) ? (
                        <img src={item.imageUrl || item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                      ) : (
                        <div className="w-full h-full bg-[#fdfaf5] flex items-center justify-center opacity-10 font-sans font-black text-[10px] uppercase tracking-[0.5em] rotate-[-45deg]">Neural Text Script</div>
                      )}
                    </div>

                    <div className="p-8 flex-grow flex flex-col">
                      <h3 className="text-2xl font-black tracking-tighter uppercase leading-tight mb-6 group-hover:text-red-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-base font-serif italic text-gray-600 leading-relaxed line-clamp-3 mb-8">"{item.script || item.description}"</p>
                      
                      <div className="mt-auto pt-8 border-t border-black/10 grid grid-cols-2 gap-4">
                        <button onClick={() => setGeneratorItem(item)}
                          className="flex items-center justify-center gap-2 p-4 bg-black text-white hover:bg-red-600 transition-all font-sans font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeWidth={2} /></svg>
                          View Post
                        </button>
                        <button onClick={() => handleDelete(item.id)}
                          className="flex items-center justify-center gap-2 p-4 border-2 border-black hover:bg-black hover:text-white transition-all font-sans font-black text-[10px] uppercase tracking-widest active:scale-95">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>

        <AnimatePresence>
          {generatorItem && (
            <FacebookPostGenerator 
              isOpen={true} 
              onClose={() => setGeneratorItem(null)} 
              title={generatorItem.title} 
              script={generatorItem.script || generatorItem.description} 
              imageUrl={generatorItem.imageUrl || generatorItem.image} 
              viewOnly={true}
            />
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
};

export default MyCreations;
