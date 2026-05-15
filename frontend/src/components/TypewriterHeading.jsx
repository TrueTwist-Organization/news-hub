import React, { useState, useEffect } from 'react';

const TypewriterHeading = ({
  phrases = [],
  className = '',
  speed = 70,
  deleteSpeed = 40,
  pauseTime = 2000,
}) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopIndex, setLoopIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(speed);

  useEffect(() => {
    if (!phrases || phrases.length === 0) return;

    const handleTyping = () => {
      const current = loopIndex % phrases.length;
      const fullText = phrases[current];

      if (isDeleting) {
        setText(fullText.substring(0, text.length - 1));
        setTypingSpeed(deleteSpeed);
      } else {
        setText(fullText.substring(0, text.length + 1));
        setTypingSpeed(speed);
      }

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopIndex(loopIndex + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopIndex, phrases, speed, deleteSpeed, pauseTime, typingSpeed]);

  return (
    <span className={`inline-block ${className}`}>
      {text}
      <span
        className="ml-1 border-r-[3px] border-[#E1261C] animate-pulse"
        aria-hidden="true"
        style={{ height: '0.8em', display: 'inline-block' }}
      />
    </span>
  );
};

export default TypewriterHeading;
