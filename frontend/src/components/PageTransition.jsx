import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  in:      { opacity: 1,  y: 0  },
  out:     { opacity: 0,  y: -15 },
};

const pageTransition = {
  type:     'tween',
  ease:     'anticipate',
  duration: 0.4,
};

/**
 * PageTransition — wraps every page in a consistent enter/exit animation.
 *
 * IMPORTANT: `style={{ position: 'relative' }}` is set as an inline style
 * (not only via Tailwind className) because Framer Motion's useScroll uses
 * getComputedStyle() at runtime. Relying solely on a Tailwind class can cause
 * a race condition where the stylesheet hasn't applied yet, making the computed
 * position read as "static" and triggering the non-static position warning.
 */
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="relative flex-grow flex flex-col min-h-screen w-full overflow-hidden"
      style={{ position: 'relative', zIndex: 10 }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
