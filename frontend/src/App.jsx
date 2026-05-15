import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnimatedRoutes from './components/AnimatedRoutes';
import CustomCursor from './components/CustomCursor';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleReset = () => {
    // Attempt to reload Facebook SDK
    if (window.FB) delete window.FB;
    const existing = document.getElementById('facebook-jssdk');
    if (existing) existing.remove();

    const js = document.createElement('script');
    js.id = 'facebook-jssdk';
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    document.body.appendChild(js);

    // Redirect and clear state
    window.location.replace('/home');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-12">
          <div className="max-w-2xl w-full border-2 border-black p-12 bg-white shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-3 h-3 bg-[#E1261C] animate-pulse" />
              <span className="font-montserrat font-black text-[10px] tracking-[0.3em] uppercase text-gray-400">Neural System Recovery</span>
            </div>
            <h1 className="font-playfair font-black text-4xl mb-6">Component Failure Detected</h1>
            <p className="font-lora text-gray-500 mb-10 italic">"The neural interface has encountered an unexpected sequence error. Our diagnostic protocols have been initiated."</p>
            <div className="bg-gray-50 p-6 mb-10 border border-gray-100 font-mono text-[11px] text-red-600 overflow-auto max-h-40">
              {this.state.error?.toString()}
            </div>
            <button
              onClick={this.handleReset}
              className="w-full bg-[#121212] text-white py-5 font-montserrat font-black text-[11px] uppercase tracking-[0.4em] hover:bg-[#E1261C] transition-all"
            >
              Reset Core Interface
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on auth/landing pages
  if (location.pathname === '/' || location.pathname === '/signup' || location.pathname === '/welcome') {
    return null;
  }

  const handleBack = () => {
    const isLoggedIn = !!sessionStorage.getItem('token');

    // Rule 1: Hard boundary at Home -> Go to Landing Page (/welcome)
    if (location.pathname === '/home') {
      navigate('/welcome');
    } 
    // Rule 2: Hard boundary at Landing Page -> Stop (Shield Login)
    else if (location.pathname === '/welcome') {
      return;
    }
    // Rule 3: Sequential Back through history
    else {
      // If we are authenticated and the next "back" is the very first page (Login),
      // we prevent it and default to Home.
      if (isLoggedIn && window.history.state && window.history.state.idx <= 1) {
        navigate('/home');
      } else {
        navigate(-1);
      }
    }
  };

  return (
    <button
      onClick={handleBack}
      title="Go Back"
      className="fixed left-0 top-1/2 -translate-y-1/2 z-[90] flex items-center justify-center w-8 h-12 md:w-10 md:h-16 bg-white/90 backdrop-blur-sm border-y border-r border-gray-200 rounded-r-lg shadow-[4px_0_12px_rgba(0,0,0,0.05)] text-[#121212] hover:bg-[#121212] hover:text-white transition-all group"
    >
      <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
};

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === '/' || location.pathname === '/signup' || location.pathname === '/welcome';

  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (!startX || !startY) return;
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      const diffX = startX - x;
      const diffY = startY - y;

      // Detect if it's primarily a horizontal swipe
      if (Math.abs(diffX) > Math.abs(diffY)) {
        const isNearLeftEdge = startX < 40;
        const isNearRightEdge = startX > window.innerWidth - 40;

        // If swipe starts near the edges, prevent default to block navigation
        if (isNearLeftEdge || isNearRightEdge) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className="relative overflow-x-hidden min-h-screen bg-[#FFFFFF] text-[#444444]">
      <CustomCursor />
      <ScrollToTop />
      {!isAuthPage && <Navbar />}
      <BackButton />
      <main className="flex-grow w-full max-w-[100vw]">
        <AnimatedRoutes />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

export default App;
