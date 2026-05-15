import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Phone, Mail, Globe } from 'lucide-react';
import PageTransition from './PageTransition';

const ContactPage = () => {
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <PageTransition>
      <div className="w-full min-h-screen bg-[#fdfaf5] text-black font-serif pt-32 md:pt-48 pb-32 px-4 md:px-12 xl:px-24 selection:bg-red-600 selection:text-white">
        <div className="max-w-[1400px] mx-auto">
          
          <div className="text-center mb-16 border-b-4 border-black pb-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="font-sans font-black text-[10px] uppercase tracking-[0.5em] text-gray-400">Communication Node</span>
            </motion.div>
            <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tighter italic leading-none mb-6">Contact the Bureau.</h1>
            <p className="font-lora text-lg md:text-xl text-gray-500 italic max-w-2xl mx-auto">"Direct line to the Neural Times editorial and technical support teams. All signals are encrypted and prioritized."</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-7 bg-white border-2 border-black p-8 md:p-12 shadow-[20px_20px_0_rgba(0,0,0,0.05)]"
            >
              <h2 className="text-2xl font-black uppercase mb-8 border-b-2 border-black pb-4 italic">Dispatch Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="font-sans font-black text-[11px] uppercase tracking-widest text-gray-400">Your Identity</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Name / Designation"
                      className="w-full bg-gray-50 border-b-2 border-black p-4 font-serif text-lg focus:bg-white focus:outline-none transition-colors"
                      value={formState.name}
                      onChange={(e) => setFormState({...formState, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans font-black text-[11px] uppercase tracking-widest text-gray-400">Signal Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="email@example.com"
                      className="w-full bg-gray-50 border-b-2 border-black p-4 font-serif text-lg focus:bg-white focus:outline-none transition-colors"
                      value={formState.email}
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-sans font-black text-[11px] uppercase tracking-widest text-gray-400">Subject Protocol</label>
                  <input 
                    type="text" 
                    required
                    placeholder="General Inquiry / Editorial Leak / Support"
                    className="w-full bg-gray-50 border-b-2 border-black p-4 font-serif text-lg focus:bg-white focus:outline-none transition-colors"
                    value={formState.subject}
                    onChange={(e) => setFormState({...formState, subject: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-sans font-black text-[11px] uppercase tracking-widest text-gray-400">Message Payload</label>
                  <textarea 
                    required
                    rows="6"
                    placeholder="Type your message here..."
                    className="w-full bg-gray-50 border-b-2 border-black p-4 font-serif text-lg focus:bg-white focus:outline-none transition-colors resize-none"
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-black text-white py-6 font-sans font-black text-[11px] uppercase tracking-[0.4em] hover:bg-red-600 transition-all flex items-center justify-center gap-4"
                >
                  {submitted ? 'Signal Transmitted' : 'Transmit Signal'}
                  <Send className={`w-4 h-4 ${submitted ? 'animate-ping' : ''}`} />
                </button>
              </form>
            </motion.div>

            {/* Side Info */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-5 space-y-12"
            >
              <div className="bg-white border-2 border-black p-8 shadow-[12px_12px_0_rgba(0,0,0,1)]">
                <h3 className="text-xl font-black uppercase mb-8 italic">Global Hubs</h3>
                <div className="space-y-8">
                  {[
                    { city: 'Ahmedabad HQ', icon: MapPin, text: '903 - Fortune business hub, Nr. Shell Petrol pump, Science city - sola road, Ahmedabad - 380060' },
                    { city: 'Global Signals', icon: Globe, text: 'Main Transmission Node: Western Region' },
                    { city: 'Direct Line', icon: Phone, text: '+91 84019 26323' },
                    { city: 'Support', icon: Mail, text: 'intelligence@neuraltimes.com' }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-6 group">
                      <div className="w-12 h-12 bg-gray-50 border border-black flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-sans font-black text-[9px] md:text-[11px] uppercase tracking-widest text-gray-400 mb-1">{item.city}</h4>
                        <p className="text-base md:text-lg leading-snug break-words">{item.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-600 text-white p-8 shadow-[12px_12px_0_rgba(0,0,0,0.1)]">
                <h3 className="text-xl font-black uppercase mb-4 italic text-white">Press Inquiry?</h3>
                <p className="text-lg leading-relaxed mb-8 opacity-90 italic text-white/90">"For official press statements or interview requests with our lead AI architects, please use the 'Editorial' protocol in the form."</p>
                <div className="border-t border-white/20 pt-6">
                  <span className="font-sans font-black text-[10px] uppercase tracking-widest opacity-60">Status: Secure Line Active</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ContactPage;
