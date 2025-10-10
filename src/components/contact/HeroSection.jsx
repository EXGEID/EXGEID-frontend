import { useState, useEffect } from 'react';
import FadeInSection from '../FadeInSection';

const TypingText = ({ text, delay = 0, typingSpeed = 100, className, colorClass = "text-white", disableCursorOnMobile = false }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsTypingComplete(true);
          setShowCursor(false);
        }
      }, typingSpeed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [text, delay, typingSpeed]);

  useEffect(() => {
    if (isTypingComplete) return;
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [isTypingComplete]);

  return (
    <span className={`inline ${className}`}>
      <span>{displayedText}</span>
      {showCursor && (
        <span className={`${colorClass} ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 ${disableCursorOnMobile ? 'hidden md:inline' : ''}`}>|</span>
      )}
    </span>
  );
};

const HeroSection = () => {
  const titleText = "Contact Us";

  return (
    <section className="bg-[#06031E] text-center lg:px-24 md:px-16 px-6 lg:pb-20 lg:pt-44 md:pb-16 md:pt-40 pb-16 pt-32">
      <h1 className="text-[#FEC84D] font-semibold lg:text-[48px] md:text-[36px] text-[24px] lg:leading-[69px] md:leading-[51.75px] leading-[38.81px] lg:mb-6 mb-4">
        <TypingText 
          text={titleText}
          typingSpeed={150}
          className="text-[#FEC84D]"
          colorClass="text-[#FEC84D]"
        />
      </h1>
      <FadeInSection type="zoom" className="text-[#CACACA] font-semibold lg:text-[16px] md:text-[14px] text-[10px] lg:leading-[33px] md:leading-[24.75px] leading-[18.56px]">
        Have a question, want to collaborate, or need support? We’d love to hear from you.
      </FadeInSection>
    </section>
  );
};

export default HeroSection;
