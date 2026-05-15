import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = e => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.tagName.toLowerCase() === 'a' ||
        e.target.closest('button') ||
        e.target.closest('a') ||
        e.target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 9999 }}>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] hidden md:flex items-center justify-center mix-blend-difference"
        animate={{ 
          x: mousePosition.x - (isHovering ? 24 : 16), 
          y: mousePosition.y - (isHovering ? 24 : 16) 
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      >
        <motion.div 
          animate={{
            width: isHovering ? 48 : 32,
            height: isHovering ? 48 : 32,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="border-[1.5px] border-[#E1261C] rounded-full flex items-center justify-center"
        >
          <div className="w-1.5 h-1.5 bg-[#E1261C] rounded-full" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CustomCursor;
