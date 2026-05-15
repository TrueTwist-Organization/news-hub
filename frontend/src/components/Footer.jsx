import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  const { t } = useTranslation();

  const socialLinks = [
    { icon: FaFacebookF, url: 'https://www.facebook.com/login', name: 'Facebook' },
    { icon: FaTwitter, url: 'https://x.com/i/flow/login', name: 'Twitter' },
    { icon: FaInstagram, url: 'https://www.instagram.com/accounts/login/', name: 'Instagram' },
    { icon: FaLinkedinIn, url: 'https://www.linkedin.com/login', name: 'Linkedin' }
  ];

  const sections = [
    {
      title: t('Sections'),
      links: [
        { name: t('Home'), path: '/home' },
        { name: t('Latest'), path: '/latest' },
        { name: t('Categories'), path: '/intelligence' },
        { name: t('Saved'), path: '/creations' }
      ]
    },
    {
      title: t('Intelligence'),
      links: [
        { name: 'India News', path: '/intelligence' },
        { name: 'World News', path: '/intelligence' },
        { name: 'Business', path: '/intelligence' },
        { name: 'Tech Pulse', path: '/intelligence' }
      ]
    },
    {
      title: t('Company'),
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Privacy Policy', path: '/privacy' }
      ]
    }
  ];

  return (
    <footer className="bg-[#FFFFFF] border-t border-gray-100 pt-20 pb-10 mt-20">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-[1440px] mx-auto px-6 md:px-12"
      >
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link to="/" className="inline-block mb-8">
              <span className="font-playfair font-black text-[#121212] text-3xl md:text-4xl tracking-tighter uppercase italic">
                THE NEURAL <span className="text-[#E1261C]">TIMES</span>
              </span>
            </Link>
            <p className="font-lora text-gray-500 text-lg leading-relaxed max-w-md italic mb-10">
              "The premier destination for real-time global intelligence and AI-driven news analysis. Reporting the future, today."
            </p>
            <div className="flex items-center gap-6">
              {socialLinks.map(social => (
                <a 
                  key={social.name} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-[#E1261C] transition-all duration-300 transform hover:scale-110"
                  aria-label={social.name}
                >
                  <social.icon size={18} strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h4 className="font-montserrat font-black text-[10px] tracking-[0.2em] uppercase text-[#121212] mb-8 border-b border-gray-100 pb-2">
                  {section.title}
                </h4>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link to={link.path} className="font-montserrat font-bold text-[10px] text-gray-400 hover:text-[#E1261C] transition-colors uppercase tracking-widest">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Office Hub */}
            <div>
              <h4 className="font-montserrat font-black text-[10px] tracking-[0.2em] uppercase text-[#121212] mb-8 border-b border-gray-100 pb-2">
                Office Hub
              </h4>
              <ul className="space-y-4 font-montserrat font-bold text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed">
                <li>903 - Fortune Business Hub</li>
                <li>Nr. Shell Petrol Pump</li>
                <li>Science City Road</li>
                <li>Ahmedabad - 380060</li>
                <li className="pt-4 text-[#E1261C]">
                  <a href="tel:+918401926323" className="hover:underline">+91 84019 26323</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Strip */}
        <div className="border-t border-gray-100 pt-10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <span className="font-montserrat font-bold text-[10px] text-gray-400 uppercase tracking-widest">
              © {new Date().getFullYear()} NEURAL MEDIA GROUP
            </span>
            <div className="hidden md:block w-1 h-1 rounded-full bg-gray-200" />
            <div className="flex flex-wrap justify-center items-center gap-4">
              <a 
                href="https://truetwist.in/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-montserrat font-bold text-[9px] text-gray-400 hover:text-[#E1261C] transition-colors uppercase tracking-widest"
              >
                Design by TrueTwist
              </a>
              <div className="w-1 h-1 rounded-full bg-gray-200" />
              <a 
                href="https://369network.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-montserrat font-bold text-[9px] text-gray-400 hover:text-[#E1261C] transition-colors uppercase tracking-widest"
              >
                Marketing by 369 Network
              </a>
            </div>
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-montserrat font-black text-[10px] tracking-widest text-[#121212] hover:text-[#E1261C] transition-colors uppercase"
          >
            Back to Top ↑
          </button>
        </div>

      </motion.div>
    </footer>
  );
};

export default Footer;
