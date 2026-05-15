import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database } from 'lucide-react';
import PageTransition from './PageTransition';

const PrivacyPolicy = () => {
  return (
    <PageTransition>
      <div className="w-full min-h-screen bg-[#fdfaf5] text-black font-serif pt-32 md:pt-48 pb-32 px-4 md:px-12 xl:px-24 selection:bg-red-600 selection:text-white">
        <div className="max-w-[1000px] mx-auto bg-white border-2 border-black p-6 md:p-20 shadow-[15px_15px_0_rgba(0,0,0,0.05)] md:shadow-[30px_30px_0_rgba(0,0,0,0.05)] relative overflow-hidden">
          
          {/* Decorative Stamps */}
          <div className="absolute top-4 right-4 md:top-10 md:right-10 w-24 h-24 md:w-32 md:h-32 border-4 border-red-600 rounded-full flex items-center justify-center -rotate-12 opacity-20 pointer-events-none">
            <span className="font-sans font-black text-[8px] md:text-[12px] uppercase text-red-600 text-center tracking-tighter">DE-CLASSIFIED<br/>PROTOCOL</span>
          </div>

          <div className="mb-12 border-b-4 border-black pb-8 md:pb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <Shield className="w-4 h-4 text-red-600" />
              <span className="font-sans font-black text-[10px] uppercase tracking-[0.5em] text-gray-400">Security Clearance Level 01</span>
            </motion.div>
            <h1 className="text-3xl md:text-7xl font-black uppercase tracking-tighter italic leading-none mb-6">Privacy Directive.</h1>
            <p className="font-lora text-xl text-gray-500 italic">"How the Neural Hub manages and protects your digital signature."</p>
          </div>

          <div className="space-y-16">
            
            <section className="space-y-6">
              <div className="flex items-center gap-4 border-b border-black/10 pb-4">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black">01</div>
                <h2 className="text-2xl font-black uppercase tracking-tight italic">Data Ingestion Protocols</h2>
              </div>
              <p className="text-xl leading-relaxed text-gray-700 font-serif">
                We only collect data that is essential for delivering personalized intelligence. This includes your reading preferences, location signals for regional news, and authentication tokens. Your "Neural Signature" is anonymized and never shared with third-party aggregators.
              </p>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 border-b border-black/10 pb-4">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black">02</div>
                <h2 className="text-2xl font-black uppercase tracking-tight italic">Encryption Standards</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                {[
                  { icon: Lock, title: 'AES-256 Bit', desc: 'Bank-grade encryption for all stored credentials.' },
                  { icon: Eye, title: 'Zero-Knowledge', desc: 'We cannot read your private drafts or saved signals.' },
                  { icon: Database, title: 'Decentralized', desc: 'Data is distributed across multiple secure neural nodes.' },
                  { icon: Shield, title: 'GDPR+', desc: 'Surpassing global standards for data sovereignty.' }
                ].map((item, i) => (
                  <div key={i} className="p-6 border border-black/5 bg-gray-50 group hover:bg-white transition-colors">
                    <item.icon className="w-6 h-6 mb-4 text-red-600" />
                    <h4 className="font-sans font-black text-[11px] uppercase tracking-widest mb-2">{item.title}</h4>
                    <p className="text-base font-serif italic text-gray-500 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-4 border-b border-black/10 pb-4">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black">03</div>
                <h2 className="text-2xl font-black uppercase tracking-tight italic">Your Sovereignty</h2>
              </div>
              <p className="text-xl leading-relaxed text-gray-700 font-serif">
                At any point, you may request a "Neural Purge." This action will permanently erase your account data, reading history, and saved creations from all global hubs within 24 milliseconds.
              </p>
            </section>

            <div className="pt-16 border-t-2 border-black flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                <p className="font-sans font-black text-[10px] uppercase tracking-[0.3em] text-gray-400">Directive Effective Date</p>
                <p className="text-lg font-black italic">January 01, 2026</p>
              </div>
              <button 
                onClick={() => window.print()}
                className="px-10 py-4 border-2 border-black font-sans font-black text-[11px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all shadow-[8px_8px_0_rgba(0,0,0,0.1)]"
              >
                Download Manifest ↑
              </button>
            </div>

          </div>

          <div className="mt-20 text-center opacity-20">
            <span className="font-sans font-black text-[9px] uppercase tracking-[1em]">END OF DIRECTIVE</span>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default PrivacyPolicy;
