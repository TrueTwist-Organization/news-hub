import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, Cpu, Globe, Database, Terminal, ArrowRight, Check, Lock, Star, Activity, Sparkles, ChevronLeft } from 'lucide-react';

/* ─── Plan Feature Row ─── */
const PlanFeature = ({ text }) => (
  <li className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
    <span className="font-montserrat text-[13px] leading-relaxed text-gray-700">{text}</span>
  </li>
);

export default function SubscriptionPage() {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async (planType) => {
    try {
      setLoadingPlan(planType);
      const authHeader = {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` }
      };

      const { data: orderData } = await axios.post('/api/payment/create-order', { planType }, authHeader);

      if (!orderData.success) {
        alert(orderData.message || 'Operation failed.');
        setLoadingPlan(null);
        return;
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'The Neural Times',
        description: orderData.planLabel,
        order_id: orderData.order_id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post('/api/payment/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              planType
            }, authHeader);

            if (verifyRes.data.success) {
              navigate('/home', { replace: true });
            }
          } catch (err) {
            alert('Verification failed.');
          }
        },
        theme: { color: '#e1261c' }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setLoadingPlan(null);
      });
      rzp.open();
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
      else alert('Payment processing error.');
      setLoadingPlan(null);
    }
  };

  const FALLBACK_SOURCES = [
    { name: 'Google News India', url: 'https://news.google.com/rss/headlines/section/geo/IN?hl=en-IN&gl=IN&ceid=IN:en' },
    { name: 'Times of India', url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms' },
    { name: 'Hindustan Times', url: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml' }
  ];

  const PLANS = [
    {
      id: 'reader',
      name: 'Neural Reader',
      price: '99',
      sub: 'Basic Digital Access',
      features: ['Unlimited Article Access', 'Morning News Briefings', 'Basic AI Summaries', 'Weekly Newsletter'],
      btnText: 'Subscribe Now',
    },
    {
      id: 'pro',
      name: 'Neural Pro',
      price: '799',
      sub: 'The Professional Choice',
      features: ['Advanced AI Script Data', 'Synthesis Tool Access', 'Custom News Alerts', 'Priority Content Delivery', 'Full Archive Access'],
      btnText: 'Go Pro',
      popular: true,
    },
    {
      id: 'engine',
      name: 'Engine Access',
      price: '4,999',
      sub: 'API & Business Solution',
      features: ['Full API Integration', 'Webhook Support', 'Raw Metadata Feeds', 'Dedicated Tech Support', 'Custom Search Endpoints'],
      btnText: 'Get Engine',
    },
    {
      id: 'institutional',
      name: 'Institutional',
      price: '49,999',
      sub: 'Enterprise Solution',
      priceDetail: '+ ₹2,499/mo Support',
      features: ['Private Cloud Infrastructure', 'White-label Deployment', 'Custom Branding Tools', '24/7 Managed Hosting', 'Direct Engineering Line'],
      btnText: 'Contact Sales',
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1a1a1a] selection:bg-[#e1261c]/10 selection:text-[#e1261c]">
      {/* ── Times of India Style Header ── */}
      <div className="pt-40 pb-20 px-8 text-center bg-white border-b border-gray-100">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex flex-col items-center"
        >
          <div className="w-16 h-1 bg-[#e1261c] mb-8" />
          <h1 className="font-playfair font-black text-5xl md:text-6xl text-[#1a1a1a] tracking-tight leading-tight mb-4">
            Subscription <span className="italic text-[#e1261c]">Plans.</span>
          </h1>
          <p className="font-montserrat text-gray-500 text-sm uppercase tracking-[0.3em] font-bold">Trusted News. Unbiased Perspective.</p>
        </motion.div>
      </div>

      <div className="max-w-[1300px] mx-auto px-8 py-24">
        {/* ── Plans Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden">
          {PLANS.map((plan, idx) => (
            <div
              key={plan.id}
              className={`p-10 flex flex-col justify-between border-r last:border-r-0 border-gray-200 transition-all hover:bg-gray-50/50
                ${plan.popular ? 'bg-blue-50/20' : ''}
              `}
            >
              <div>
                {plan.popular && (
                  <div className="mb-6">
                    <span className="bg-[#e1261c] text-white text-[9px] font-montserrat font-black uppercase tracking-widest px-3 py-1 rounded-sm">Recommended</span>
                  </div>
                )}
                
                <h3 className="font-playfair font-black text-2xl text-[#1a1a1a] mb-2">{plan.name}</h3>
                <p className="font-montserrat text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-10">{plan.sub}</p>

                <div className="mb-12">
                  <div className="flex items-baseline gap-1">
                    <span className="font-montserrat font-black text-3xl text-[#1a1a1a]">₹</span>
                    <span className="font-montserrat font-black text-5xl text-[#1a1a1a] tracking-tight">{plan.price}</span>
                    <span className="font-montserrat text-[12px] text-gray-400 font-bold">/month</span>
                  </div>
                  {plan.priceDetail && (
                    <p className="font-montserrat text-[10px] text-[#e1261c] mt-2 font-bold uppercase tracking-widest">{plan.priceDetail}</p>
                  )}
                </div>

                <ul className="space-y-1 mb-16">
                  {plan.features.map((f, i) => (
                    <PlanFeature key={i} text={f} />
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handlePayment(plan.id)}
                disabled={loadingPlan === plan.id}
                className={`w-full py-4 font-montserrat font-black text-[11px] uppercase tracking-widest transition-all
                  ${plan.popular 
                    ? 'bg-[#e1261c] text-white hover:bg-[#c11b13] shadow-lg shadow-red-500/20' 
                    : 'bg-[#1a1a1a] text-white hover:bg-black'
                  }`}
              >
                {loadingPlan === plan.id ? 'Processing...' : plan.btnText}
              </button>
            </div>
          ))}
        </div>

        {/* ── Knowledge & Support Section ── */}
        <div className="mt-40 space-y-32">
          
          {/* ── Strategic FAQs ── */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-16 border-t border-gray-100 pt-20">
            <div className="md:col-span-1">
              <h2 className="font-playfair font-black text-3xl italic tracking-tight text-[#1a1a1a] mb-6">Strategic FAQ</h2>
              <p className="font-montserrat text-xs text-gray-400 font-bold uppercase tracking-widest leading-loose">Addressing your deployment hesitations with absolute clarity.</p>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { 
                  q: "Can I upgrade or downgrade my plan at any time?", 
                  a: "Yes, you can transition between Reader, Pro, and Engine tiers instantly. For Institutional changes, please contact your dedicated account manager." 
                },
                { 
                  q: "What is included in the 'Synthesis Tool Access'?", 
                  a: "This includes our proprietary AI engine that transforms raw news data into ready-to-use scripts, podcasts, and social media formats." 
                },
                { 
                  q: "How does the API integration work for Engine Access?", 
                  a: "We provide a full REST API with high-rate limits and raw metadata feeds (JSON) for seamless integration into your own apps or newsrooms." 
                },
                { 
                  q: "What does the ₹2,499/mo Maintenance cover?", 
                  a: "This covers 24/7 server monitoring, private cloud security patches, and direct engineering support to ensure 99.9% uptime." 
                }
              ].map((faq, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="p-8 bg-white border border-gray-100 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(225,38,28,0.08)] transition-all duration-500 group border-l-4 hover:border-l-[#e1261c]"
                >
                  <h4 className="font-montserrat font-black text-[10px] uppercase tracking-widest text-[#e1261c] mb-4 flex items-center gap-2">
                    {faq.q}
                  </h4>
                  <p className="font-montserrat text-[13px] leading-relaxed text-gray-500 group-hover:text-gray-900 transition-colors">{faq.a}</p>
                </motion.div>
              ))}
            </div>

          </section>

          {/* ── Comparison & Institutional Insights ── */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 py-20 border-y border-gray-100">
            <div className="space-y-10">
              <h3 className="font-playfair font-black text-4xl italic tracking-tight text-[#1a1a1a]">Why Choose Neural?</h3>
              <p className="font-montserrat text-sm leading-loose text-gray-600">
                Unlike standard news outlets that provide static text, our <span className="text-[#e1261c] font-black">Neural Intelligence</span> architecture treats news as liquid data. We synthesize thousands of signals into actionable intelligence, allowing you to deploy professional content in seconds.
              </p>
              <div className="p-8 bg-gray-50 border-l-4 border-[#e1261c] rounded-r-lg">
                <h5 className="font-montserrat font-black text-[10px] uppercase tracking-widest text-[#1a1a1a] mb-3">The Direct Engineering Line</h5>
                <p className="font-montserrat text-[12px] leading-relaxed text-gray-500 italic">
                  Institutional clients receive a direct encrypted channel to our core developers. This isn't just "support"—it's a direct collaborative pipeline for custom feature requests and infrastructure tailoring.
                </p>
              </div>
            </div>

            <div className="space-y-10">
              <h3 className="font-playfair font-black text-4xl italic tracking-tight text-[#1a1a1a]">Institutional Onboarding</h3>
              <p className="font-montserrat text-sm leading-loose text-gray-600">
                The <span className="text-[#e1261c] font-black">White-label Protocol</span> allows for a complete takeover of the system. We deploy our engine under your own brand name and domain, ensuring your audience sees your identity while we handle the neural processing.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                {[
                  { label: "Deployment Time", val: "24-48 Hours" },
                  { label: "Support Tier", val: "Tier-1 Dedicated" },
                ].map((stat, i) => (
                  <div key={i} className="border border-gray-200 p-6 rounded-lg text-center">
                    <p className="font-montserrat text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">{stat.label}</p>
                    <p className="font-montserrat font-black text-lg text-[#1a1a1a]">{stat.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Security & Compliance ── */}
          <section className="flex flex-col md:flex-row items-center justify-between gap-12 bg-[#1a1a1a] p-12 rounded-2xl shadow-2xl">
            <div className="max-w-md">
              <h3 className="font-playfair font-black text-4xl italic tracking-tight mb-4 text-white">Security Standards</h3>
              <p className="font-montserrat text-xs leading-loose text-gray-400 uppercase tracking-[0.2em]">Enterprise-grade encryption protecting your intelligence node.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-12">
              {[
                { icon: ShieldCheck, text: "Enterprise Encryption" },
                { icon: Lock, text: "GDPR Compliant" },
                { icon: Activity, text: "Zero-Log API Policy" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-4 group cursor-help">
                  <div className="w-16 h-16 rounded-full border border-white/5 flex items-center justify-center group-hover:border-[#e1261c]/30 transition-all duration-500">
                    <item.icon className="w-8 h-8 text-[#e1261c] group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="font-montserrat font-bold text-[9px] uppercase tracking-widest text-gray-100 group-hover:text-white transition-colors">{item.text}</span>
                </div>
              ))}
            </div>
          </section>


          {/* ── Final CTA & Contact ── */}
          <div className="text-center pt-20 pb-32">
            <h4 className="font-playfair font-black text-2xl italic tracking-tight text-[#1a1a1a] mb-6">Not sure which plan is right for you?</h4>
            <div className="flex items-center justify-center gap-8">
              <button className="font-montserrat font-black text-[11px] uppercase tracking-[0.4em] text-[#e1261c] hover:tracking-[0.6em] transition-all flex items-center gap-3">
                <span className="w-8 h-[1px] bg-[#e1261c]" /> START LIVE CHAT
              </button>
              <button className="font-montserrat font-black text-[11px] uppercase tracking-[0.4em] text-gray-400 hover:text-[#1a1a1a] transition-all">
                TECHNICAL CONSULTATION
              </button>
            </div>
          </div>


        </div>
      </div>

      <style>{`
        body { background-color: #FDFDFD; }
        
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #999; }
      `}</style>
    </div>
  );
}




