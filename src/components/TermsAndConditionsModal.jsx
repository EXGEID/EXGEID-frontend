import { useState, useEffect } from 'react';
import FadeInSection from './FadeInSection';

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

const TermsAndConditionsModal = ({ onClose }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const titleText = "Terms and Conditions";

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  /*const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };*/

  const handleOverlayClick = (e) => {
    e.stopPropagation(); // Prevent closing when clicking inside modal
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ${isAnimated ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleOverlayClick}
    >
      <div
        className={`relative bg-[linear-gradient(to_bottom_left,#0E083C_55%,#06031E_100%)] rounded-2xl w-full max-w-[90%] md:max-w-md lg:max-w-[60%] transform transition-all duration-300 ${isAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} overflow-hidden max-h-[90vh]`}
      >
        <div className="overflow-hidden max-h-[90vh] px-4 md:px-8 py-12 md:pt-16 lg:pt-14 md:pb-16 lg:pb-36">
          <h2 className="lg:text-[36px] md:text-[27.92px] text-[24px] font-semibold text-[#FEC84D] lg:mb-6 mb-2">
            <TypingText 
              text={titleText}
              typingSpeed={100}
              className="text-[#FEC84D]"
              colorClass="text-[#FEC84D]"
            />
          </h2>
          <FadeInSection className="overflow-y-auto lg:max-h-[55vh] max-h-[63vh] pr-4 md:pr-12 text-[#CACACA] text-[12px] md:text-[16px] lg:text-[17px]">
           <p>EXGEID COOPERATIVE SOCIETY</p>
<p>Effective Date: June 20, 2025</p>
<p class="mt-4 sm:mt-6 md:mt-8 lg:mt-10">1. Acceptance of Terms</p>
<p>By creating an account, downloading, or using the EXGEID App, you agree to be bound by these Terms and Conditions, as well as our Privacy Policy.</p>
<p>You represent that you are at least 18 years old, or that you have parental/guardian consent if you are under 18.</p>
<p>If you do not agree, you must not use the App.</p>
<p class="mt-4 sm:mt-6 md:mt-8 lg:mt-10">2. Services Provided</p>
<p>The EXGEID App provides users with:</p>
<p className='ml-2 md:ml-6'>    • Streaming entertainment content,</p>
<p className='ml-2 md:ml-6'>    • Social connection services, and</p>
<p className='ml-2 md:ml-6'>    • On-demand amenities including healthcare support, food supplies, education support for wards, tuition assistance, and project fund advances.</p>
<p>We may add, modify, or remove services at any time, with or without prior notice. Certain services (such as healthcare or financial advances) may be subject to separate regulatory requirements, and availability may vary by jurisdiction.</p>
<p class="mt-4 sm:mt-6 md:mt-8 lg:mt-10">3. User Accounts</p>
<p className='ml-2 md:ml-6'>    • Users must register to become a member to access features of the App.</p>
<p className='ml-2 md:ml-6'>    • You agree to provide accurate and complete registration information.</p>
<p className='ml-2 md:ml-6'>    • You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.</p>
<p className='ml-2 md:ml-6'>    • EXGEID will not be liable for unauthorized access arising from your negligence.</p>
<p class="mt-4 sm:mt-6 md:mt-8 lg:mt-10">4. Subscriptions and Payments</p>
<p className='ml-2 md:ml-6'>    • Some features of the App require payment or subscription.</p>
<p className='ml-2 md:ml-6'>    • By subscribing, you agree to pay all fees displayed in the App.</p>
<p className='ml-2 md:ml-6'>    • Fees are non-refundable except as required by law.</p>
<p className='ml-2 md:ml-6'>    • EXGEID reserves the right to adjust pricing, with reasonable prior notice.</p>
<p class="mt-4 sm:mt-6 md:mt-8 lg:mt-10">5. User Conduct</p>
<p>When using the App, you agree not to:</p>
<p className='ml-2 md:ml-6'>    • Post or share unlawful, harmful, harassing, or offensive content.</p>
<p className='ml-2 md:ml-6'>    • Engage in abusive, fraudulent, or malicious activity.</p>
<p className='ml-2 md:ml-6'>    • Violate the intellectual property rights of EXGEID or any third party.</p>
<p className='ml-2 md:ml-6'>    • Interfere with or disrupt the functionality of the service.</p>
<p>Violations may result in suspension, termination, or legal action.</p>
<p class="mt-4 sm:mt-6 md:mt-8 lg:mt-10">6. Content Ownership and License</p>
<p>All trademarks, logos, software, and intellectual property within the App are the exclusive property of EXGEID Cooperative Society or its licensors.</p>
<p>Users retain ownership of any original content they upload but grant EXGEID a limited, worldwide, royalty-free, non-exclusive, revocable license to use such content solely for the operation of the service.</p>
<p>This license does not grant EXGEID ownership rights over your personal content.</p>
<p class="mt-4 sm:mt-6 md:mt-8 lg:mt-10">7. Termination of Service</p>
<p>EXGEID may suspend, restrict, or terminate your membership account at its discretion, with or without notice, if you:</p>
<p className='ml-2 md:ml-6'>    • Violate these Terms,</p>
<p className='ml-2 md:ml-6'>    • Misuse the platform, or</p>
<p className='ml-2 md:ml-6'>    • Engage in unlawful activity.</p>
<p>You may also terminate your membership account at any time by following the in-app account closure procedure.</p>
<p class="mt-4 sm:mt-6 md:mt-8 lg:mt-10">8. Disclaimers and Limitation of Liability</p>
<p>The App is provided “as is” and “as available”, without warranties of any kind, whether express or implied.</p>
<p>We do not guarantee uninterrupted service, error-free operation, or full security of the App.</p>
<p>To the fullest extent permitted by law, EXGEID shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use of our services.</p>
<p class="mt-4 sm:mt-6 md:mt-8 lg:mt-10">9. Privacy</p>
<p>Your personal information will be collected, stored, and used in accordance with our Privacy Policy. By using the App, you consent as a member to such processing.</p>
<p class="mt-4 sm:mt-6 md:mt-8 lg:mt-10">10. Changes to Terms</p>
<p>We may revise these Terms from time to time. If we make material changes, we will notify you through the App or via email. Continued use of the App after changes are published constitutes acceptance of the revised Terms.</p>
<p class="mt-4 sm:mt-6 md:mt-8 lg:mt-10">11. Governing Law</p>
<p>These Terms shall be governed by and interpreted in accordance with the laws of Lagos State, Nigeria. Any disputes arising shall be subject to the effective jurisdiction of the courts of Lagos State, Nigeria.</p>
<p class="mt-4 sm:mt-6 md:mt-8 lg:mt-10">12. Contact Information</p>
<p>For questions, complaints, or inquiries regarding these Terms, you may contact us at:</p>
<p>📧 Email: exgeid@gmail.com</p>
<p>📍 Address: EXGEID COOPERATIVE SOCIETY, Ajah. Lagos, Nigeria</p>
          </FadeInSection>
          <div className="flex w-full items-center justify-end gap-8 md:gap-12 lg:gap-16 mt-4 md:mt-6 lg:mt-12">
            <button onClick={onClose} className="text-[#FEC84D] hover:text-yellow-100 font-medium text-[10px] md:text-[14px] lg:text-[17px]">Cancel</button>
            <button onClick={onClose} className="bg-[#160B6D] hover:bg-blue-900 hover:scale-105 px-6 md:px-10 lg:px-12 py-2 md:py-3 lg:py-4 text-white font-medium text-[10px] md:text-[14px] lg:text-[17px]">Agree</button>
          </div>

        
        </div>
      </div>
    </div>
  );
};


export default TermsAndConditionsModal;