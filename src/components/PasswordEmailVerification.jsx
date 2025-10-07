import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import EmailBanner from "../assets/Mail.png"

const PasswordEmailVerificationModal = ({ onClose, onLoginClick, Email }) => {
  const [isAnimated, setIsAnimated] = useState(false);

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
        className={`relative bg-[linear-gradient(to_bottom_left,#0E083C_55%,#06031E_100%)] rounded-2xl w-full max-w-[90%] md:max-w-md lg:max-w-[55%] transform transition-all duration-300 ${isAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} overflow-hidden max-h-[80vh]`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-8 md:right-8 text-[#CACACA] text-2xl md:text-5xl font-bold rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center z-50"
        >
          ×
        </button>
        <div className="overflow-y-auto max-h-[80vh] px-4 md:px-12 lg:px-28 py-12">
          {/* Logo */}
          <img src={EmailBanner} alt="EXGEID Logo" className="lg:mb-6 md:mb-4 mb-1 scale-[72%] origin-center md:scale-[100%] mx-auto" />
          <h2 className="lg:text-[40px] md:text-[32px] text-[24px] font-bold text-[#CACACA] lg:mb-2 mb-1 text-center">Email Sent</h2>
          <p className="font-regular lg:w-[80%] mx-auto text-[#CACACA] text-center lg:text-[18px] md:text-[14px] text-[10px] lg:mb-4 mb-2 leading-relaxed">Please follow the reset instructions in the email we sent to the following address: {Email}</p>

          <button
            type="submit"
            className="w-full bg-[#8F0406] hover:bg-red-700 hover:scale-110 text-white lg:text-[18px] md:text-[14px] text-[16px] font-semibold py-2 md:py-4 rounded-lg mb-4 transition mt-8 md:mt-12"
          >
            Resend Instructions
          </button>

          <p className="text-center text-white font-regular lg:text-[16px] md:text-[12.41px] text-[12px] mt-5 md:mt-8">
            I already have an account? <Link onClick={onLoginClick} className="text-[#FEC84D] hover:text-yellow-200 underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};


export default PasswordEmailVerificationModal;