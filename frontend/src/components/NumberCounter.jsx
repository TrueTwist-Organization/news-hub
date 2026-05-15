import React, { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

const NumberCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const endNum = parseInt(end);
      if (isNaN(endNum)) return;

      const totalFrames = 60;
      const increment = endNum / totalFrames;
      let frame = 0;

      const timer = setInterval(() => {
        frame++;
        setCount(Math.floor(increment * frame));
        if (frame >= totalFrames) {
          setCount(endNum);
          clearInterval(timer);
        }
      }, duration / totalFrames);

      return () => clearInterval(timer);
    } else {
        // Reset count when out of view if you want it to replay
        setCount(0);
    }
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

export default NumberCounter;
