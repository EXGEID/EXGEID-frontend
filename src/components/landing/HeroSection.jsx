import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import toast, { Toaster } from "react-hot-toast";
import youtubeIcon from "../../assets/youtube.png";
import tiktokIcon from "../../assets/tiktok.png";
import referIcon from "../../assets/refer.png";
import EmailIcon from "../../assets/icons/email.svg";
import GoogleIcon from "../../assets/icons/Google.svg";
import FacebookIcon from "../../assets/icons/facebook.svg";
import AppleIcon from "../../assets/icons/Apple.svg";
import FadeInSection from "../FadeInSection";

const cards = [
    { ImageURL: youtubeIcon, title: "Earn up to ₦40,000 monthly (Level 4)" },
    { ImageURL: tiktokIcon, title: "Earn up to ₦100,000 monthly (Level 5)" },
    { ImageURL: referIcon, title: "Cash out — From ₦50,000 at Level 4" },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const GOOGLE_SIGNUP_URL = "https://exgeid-backend.onrender.com/api/v1/auth/google";
  const [googleLoading, setGoogleLoading] = useState(false);
  const fullText = 'Your gateway to Earning & Growing';
  const prefix = 'Your gateway to ';
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < fullText.length) {
          setDisplayedText(fullText.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsTypingComplete(true);
          setShowCursor(false);
        }
      }, 100); // Typing speed: 100ms per character

      return () => clearInterval(interval);
    }, 2000); // 2-second delay

    return () => clearTimeout(startTimer);
  }, []); // Run once on mount

  useEffect(() => {
    if (isTypingComplete) return;
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500); // Blinking speed: 500ms

    return () => clearInterval(cursorInterval);
  }, [isTypingComplete]);

  const renderText = () => {
    if (displayedText.length <= prefix.length) {
      return displayedText;
    }
    return (
      <>
        {prefix}
        <span className="text-[#FEC84D]">{displayedText.substring(prefix.length)}</span>
      </>
    );
  };

  const handleGoogleSignup = async () => {
      setGoogleLoading(true);
  
      try {
        const response = await fetch(GOOGLE_SIGNUP_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        const data = await response.json();
        setGoogleLoading(false);
  
        if (response.ok) {
          toast.success("Google login successful!", {
            style: {
              background: "#09052C",
              color: "#CACACA",
              border: "1px solid #FEC84D",
            },
            iconTheme: {
              primary: "#FEC84D",
              secondary: "#09052C",
            },
          });
          // Delay closing modal to allow toast to display
          setTimeout(() => {
            onClose();
            // Redirect to Google OAuth callback or handle response as needed
            // window.location.href = data.redirectUrl || '/google-callback';
          }, 5000); // Match toast duration
        } else {
          toast.error(data.message || "Google login failed. Please try again.", {
            style: {
              background: "#09052C",
              color: "#CACACA",
              border: "1px solid #ef4444",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "#09052C",
            },
          });
        }
      } catch (err) {
        setGoogleLoading(false);
        toast.error("An error occurred with Google login. Please try again later.", {
          style: {
            background: "#09052C",
            color: "#CACACA",
            border: "1px solid #ef4444",
          },
          iconTheme: {
            primary: "#ef4444",
            secondary: "#09052C",
          },
        });
      }
    };

  return (
    <div className="bg-[#06031E] pt-28 md:pt-36">
      <FadeInSection type="slideUp">
          <div className="bg-[url('/carousel.png')] bg-no-repeat bg-center bg-cover">
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 5000,
                style: {
                  zIndex: 9999,
                },
              }}
              containerStyle={{
                top: 20,
                zIndex: 9999,
              }}
            />
              <style jsx>{`
                  .spinner {
                  display: inline-block;
                  width: 1.5rem;
                  height: 1.5rem;
                  border: 3px solid #FEC84D;
                  border-top: 3px solid transparent;
                  border-radius: 50%;
                  animation: spin 1s linear infinite;
                  margin-right: 0.5rem;
                }
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
                <div className="mx-auto lg:py-12 md:py-6 py-4 lg:w-[40%] w-[65%]">
                    <p className="font-semibold text-white lg:text-[48px] md:text-[36px] text-[24px] text-center lg:leading-[69px] md:leading-[51.75px] leading-[38.81px] inline-block">
                      {renderText()}
                      {showCursor && (
                        <span className={`text-white ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>|</span>
                      )}
                    </p>
                    <p className="lg:mt-4 text-[#B5B5B5] font-semibold lg:text-[16px] md:text-[14px] text-[10px] text-center lg:leading-[33px] md:leading-[24.75px] leading-[18.56px]">Get rewarded for watching videos, following social links, and engaging with our community</p>
                </div>
            </div>
            <div className="lg:px-16 md:px-8 px-4 lg:py-12 md:py-6 py-4 grid md:grid-cols-2 gap-4">
                <div className="grid grid-cols-3 lg:gap-6 md:gap-4 gap-3">
                    {cards.map((card, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <Card imageURL={card.ImageURL} title={card.title} />
                        </div>
                    ))}
                </div>
                
    <div className="bg-[#09052C] p-6 lg:w-[80%] w-full mx-auto shadow-lg">
      {/* Title */}
      <h2 className="text-white text-center lg:text-[22px] text-[18px] font-semibold mb-4">Sign Up Today and Start Earning your bonuses</h2>

      {/* Email Input 
      <div className="flex items-center border border-gray-500 rounded-lg px-3 py-2 mb-4">
        <img
          src={EmailIcon}
          alt="Email Icon"
          className="mr-2"
        />
        <input
          type="email"
          placeholder="Enter email"
          className="bg-transparent outline-none text-white font-semibold lg:text-[16px] text-[12px] placeholder-gray-400 flex-1"
        />
      </div>*/}

      {/* Start Earning Button */}
      <button onClick={() => navigate('/?modal=signup')} className="w-full bg-[#8F0406] hover:bg-red-700 text-white lg:text-[16px] text-[14px] font-medium py-2 md:py-4 rounded-lg mb-4 hover:scale-105 transition">
        Start Earning
      </button>

      {/* Divider */}
      <div className="flex items-center justify-center mb-4">
        <hr className="w-full h-[2px] bg-white mt-1"/>
        <span className="text-white text-sm mx-2">Or</span>
        <hr className="w-full h-[2px] bg-white mt-1"/>
      </div>

      {/* Social Buttons */}
      <div className="flex flex-col space-y-3">
        <a href={GOOGLE_SIGNUP_URL}><button
          type="button"
          className={`w-full bg-gray-800 hover:bg-gray-600 text-white lg:text-[14px] md:text-[12px] text-[10px] font-bold py-2 md:py-4 rounded-lg mb-4 transition flex items-center justify-center ${googleLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
            ) : (
            <>
              <img src={GoogleIcon} alt="Google Icon" className="mr-2"/>Sign Up with Google
            </>
          )}
        </button></a>

        {/*<button className="flex items-center justify-center w-full bg-[#110854] hover:bg-blue-800 text-white lg:text-[14px] md:text-[12px] text-[10px] font-bold py-2 md:py-4  rounded-lg">
          <img
            src={FacebookIcon}
            alt="Facebook"
            className="mr-2"
          />
          Sign Up with Facebook
        </button>

        <button className="flex items-center justify-center w-full bg-black hover:bg-gray-900 text-white lg:text-[14px] md:text-[12px] text-[10px] font-bold py-2 md:py-4 rounded-lg">
          <img
            src={AppleIcon}
            alt="Apple"
            className="mr-2"
          />
          Sign Up with Apple
        </button>*/}
      </div>
    </div>
        </div>
      </FadeInSection>
    </div>
  );
};

export default HeroSection;