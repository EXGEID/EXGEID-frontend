import { useState, useEffect } from 'react';
import WhoWeAreBanner from "../../assets/Who-we-are.png"
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

const WhoWeAre = () => {
  const titleText = "Who We Are";
  const paragraph1Text = "EXGEID Africa is a cooperative society and digital platform built to empower a new generation of skilled and unskilled entrepreneurs across Africa and the diaspora. We combine technology, teamwork, and financial incentives to create a system where everyday actions lead to real earnings and real impact.";
  const paragraph2Text = "We're not just helping people earn — we're building a powerful movement of growth, empowerment, and collaboration. Become a member today, let's support each other to grow our businesses by earning cash-transferrable bonuses";

  return (
    <section className="bg-[#06031E] flex flex-col md:flex-row justify-between lg:px-24 md:px-16 px-6 lg:pt-32 md:py-24 pt-32 lg:pb-4 pb-6">
      <div className="lg:w-[38%] lg:mt-24 md:mb-12">
        <h1 className="lg:mt-0 md:mt-[-48px] font-semibold lg:text-[48px] md:text-[36px] text-[24px] lg:leading-[69px] md:leading-[51.75px] lg:mb-4 mb-2">
          <TypingText 
            text={titleText} 
            typingSpeed={150}
            className="text-[#FEC84D]"
            colorClass="text-[#FEC84D]"
          />
        </h1>
        
        <FadeInSection type="slideUp"><p className="font-semibold lg:text-[16px] md:text-[14px] text-[10px] lg:leading-[33px] md:leading-[24.75px] leading-[18.56px] lg:mb-4 mb-2 text-[#CACACA]">
          {paragraph1Text}
        </p>
        
        <p className="font-semibold lg:text-[16px] md:text-[14px] text-[10px] lg:leading-[33px] md:leading-[24.75px] leading-[18.56px] text-[#CACACA]">
          {paragraph2Text}
        </p></FadeInSection>
      </div>
      <FadeInSection type='slideLeft' className="md:w-[60%] h-[60%]"><img alt="EXGEID Who We Are Banner" src={WhoWeAreBanner}/></FadeInSection>
    </section>
  );
};

export default WhoWeAre;