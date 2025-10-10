import { useState, useEffect } from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import Logo from "../assets/logo2.png";
import EmailIcon from "../assets/icons/email.svg";
import PadlockIcon from "../assets/icons/padlock.svg";
import GoogleIcon from "../assets/icons/Google.svg";

const API_URL = "https://exgeid-backend.onrender.com/api/v1/auth/login";
const GOOGLE_LOGIN_URL = "https://exgeid-backend.onrender.com/api/v1/auth/google";

const LoginModal = ({ onClose, openModal, closeCurrentAndOpenNext }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const handleOverlayClick = (e) => {
    e.stopPropagation();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        email: formData.email,
        password: formData.password
      };
      console.log("API payload:", payload); // Debug: Verify payload
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        //credentials: 'include' // Include refresh token cookie
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        // Store accessToken in sessionStorage for Authorization headers
        if (data.accessToken) {
          sessionStorage.setItem('accessToken', data.accessToken);
          console.log("Stored accessToken in sessionStorage:", data.accessToken);
        }
        // Store user data in localStorage for UI purposes
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          console.log("Stored user data in localStorage:", data.user);
        }
        toast.success("Login successful!", {
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
        console.log("Login successful:", data);
        // Delay closing modal and navigation to allow toast to display
        setTimeout(() => {
          onClose();
          navigate("/dashboard");
        }, 5000); // Match toast duration
      } else {
        toast.error(data.message || "Login failed. Please try again.", {
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
        console.error("Login error:", data);
      }
    } catch (err) {
      setLoading(false);
      toast.error("An error occurred. Please try again later.", {
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
      console.error("Network error:", err);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    try {
      const response = await fetch(GOOGLE_LOGIN_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        //credentials: 'include' // Include refresh token cookie if needed
      });

      const data = await response.json();
      setGoogleLoading(false);

      if (response.ok) {
        // Store accessToken in sessionStorage for Authorization headers
        if (data.accessToken) {
          sessionStorage.setItem('accessToken', data.accessToken);
          console.log("Stored accessToken in sessionStorage:", data.accessToken);
        }
        // Store user data in localStorage for UI purposes
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
          console.log("Stored user data in localStorage:", data.user);
        }
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
        // Delay closing modal and navigation to allow toast to display
        setTimeout(() => {
          onClose();
          navigate("/dashboard");
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
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ${isAnimated ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleOverlayClick}
    >
      <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
      <div
        className={`relative bg-[linear-gradient(to_bottom_left,#0E083C_55%,#06031E_100%)] rounded-2xl w-full max-w-[90%] md:max-w-md lg:max-w-[50%] transform transition-all duration-300 ${isAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} overflow-hidden max-h-[90vh]`}
      >
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
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-8 md:right-8 text-[#CACACA] text-2xl md:text-5xl font-bold rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center z-50"
        >
          ×
        </button>
        <div className="overflow-y-auto max-h-[90vh] px-4 md:px-12 lg:px-28 py-12 md:pt-16 lg:pt-20 md:pb-16 lg:pb-36">
          <img src={Logo} alt="EXGEID Logo" className="lg:mb-6 md:mb-4 mb-1 scale-[72%] origin-left md:scale-[100%]" />
          <h2 className="lg:text-[36px] md:text-[27.92px] text-[24px] font-semibold text-[#CACACA] lg:mb-6 mb-2">Welcome back!!</h2>

          <form className="mt-4 sm:mt-6" onSubmit={handleSubmit}>
            <label className="block font-medium text-[#CACACA] md:text-[14px] text-[10px] mt-3 sm:mt-4">Email</label>
            <div className="relative">
              <img src={EmailIcon} className="absolute left-3 md:top-[52%] top-[55%] transform -translate-y-1/2 text-gray-400 scale-[90%] md:scale-[100%]" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-3 md:py-4 bg-[#09052C] text-white rounded-md mt-1 font-regular md:text-[16px] text-[12px] focus:outline-none focus:border-[#FEC84D] focus:ring-1 focus:ring-[#FEC84D]"
                required
              />
            </div>

            <label className="block font-medium text-[#CACACA] md:text-[14px] text-[10px] mt-3 sm:mt-4">Password</label>
            <div className="relative">
              <img src={PadlockIcon} className="absolute left-3 md:top-[52%] top-[55%] transform -translate-y-1/2 text-gray-400 scale-[95%] md:scale-[100%]" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your Password"
                className="w-full pl-10 pr-4 py-3 md:py-4 bg-[#09052C] text-white rounded-md mt-1 font-regular md:text-[16px] text-[12px] focus:outline-none focus:border-[#FEC84D] focus:ring-1 focus:ring-[#FEC84D]"
                required
              />
              <span className="absolute right-4 lg:top-3 top-2.5 mt-4 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <FiEye size={20} className="text-[#CACACA] scale-[85%] md:scale-[100%]"/> : <FiEyeOff size={20} className="text-[#CACACA] scale-[85%] md:scale-[100%]"/>}
              </span>
            </div>

            <div className="flex justify-between items-center lg:text-[18px] md:text-[16.25px] text-[12.19px] font-regular md:mt-8 mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-[#FEC84D] focus:ring-[#FEC84D] border-[#09052C] bg-[#09052C]"
                />
                <label className="lg:ml-2 ml-1 text-white">Remember me</label>
              </div>
              <Link onClick={() => openModal('forgot-password')} className="text-[#FEC84D] hover:text-yellow-200">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              className={`w-full bg-[#8F0406] hover:bg-red-700 hover:scale-110 text-white lg:text-[18px] md:text-[14px] text-[16px] font-semibold py-2 md:py-4 rounded-lg mb-4 transition mt-8 md:mt-12 flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="flex items-center justify-center mb-4 md:mb-6">
            <hr className="w-full h-[2px] bg-[#B0C9E5] mt-1"/>
            <span className="text-[#B0C9E5] font-regular lg:text-[16px] md:text-[12.41px] text-[12px] md:mx-5 mx-3">Or</span>
            <hr className="w-full h-[2px] bg-[#B0C9E5] mt-1"/>
          </div>

          <a href={GOOGLE_LOGIN_URL}><button
            type="button"
            className={`w-full bg-[#110B41] hover:bg-blue-900 hover:scale-110 text-white lg:text-[18px] md:text-[14px] text-[14px] font-semibold py-2 md:py-4 rounded-lg mb-4 transition flex items-center justify-center ${googleLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              <>
                <img src={GoogleIcon} alt="Google Icon" className="lg:mx-4 mx-2"/>Continue with Google
              </>
            )}
          </button></a>

          <p className="text-center text-white font-regular lg:text-[16px] md:text-[12.41px] text-[12px] mt-5 md:mt-8">
            Don't have an account? <Link onClick={() => closeCurrentAndOpenNext('signup')} className="text-[#FEC84D] hover:text-yellow-200 underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;