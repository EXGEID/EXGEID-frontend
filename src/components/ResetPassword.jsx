import { useState, useEffect } from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast, { Toaster } from 'react-hot-toast';
import Logo from "../assets/logo2.png";
import PadlockIcon from "../assets/icons/padlock.svg";
import FadeInSection from './FadeInSection';

const API_URL = "https://exgeid-backend.onrender.com/api/v1/auth/password/reset-password";

const ResetPasswordModal = ({ onClose, onSuccess }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    reEnteredPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    setIsAnimated(true);
    // Retrieve accessToken from URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('accessToken');
    if (token) {
      setAccessToken(token);
    } else {
      toast.error("No access token found in URL.", {
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

    if (name === "password") {
      validatePassword(value);
    }
    if (name === "reEnteredPassword" || name === "password") {
      validateConfirmPassword(formData.password, name === "reEnteredPassword" ? value : formData.reEnteredPassword);
    }
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      setPasswordError("Password must be at least 8 characters long");
      setPasswordSuccess("");
      return false;
    }
    if (!hasUpperCase) {
      setPasswordError("Password must contain at least one uppercase letter");
      setPasswordSuccess("");
      return false;
    }
    if (!hasLowerCase) {
      setPasswordError("Password must contain at least one lowercase letter");
      setPasswordSuccess("");
      return false;
    }
    if (!hasNumber) {
      setPasswordError("Password must contain at least one number");
      setPasswordSuccess("");
      return false;
    }
    if (!hasSpecialChar) {
      setPasswordError("Password must contain at least one special character");
      setPasswordSuccess("");
      return false;
    }
    setPasswordError("");
    setPasswordSuccess("Password is valid");
    return true;
  };

  const validateConfirmPassword = (password, reEnteredPassword) => {
    if (password && reEnteredPassword && password !== reEnteredPassword) {
      setConfirmPasswordError("Passwords must match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError("");
    setPasswordSuccess("");
    setConfirmPasswordError("");

    if (!accessToken) {
      setLoading(false);
      toast.error("No access token available. Please try again.", {
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
      return;
    }

    if (!validatePassword(formData.password)) {
      setLoading(false);
      return;
    }

    if (formData.password !== formData.reEnteredPassword) {
      setConfirmPasswordError("Passwords must match");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        password: formData.password,
        reEnteredPassword: formData.reEnteredPassword
      };
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        toast.success("Password reset successful!", {
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
        console.log("Form submitted successfully:", data);
        // Delay closing modal to allow toast to display
        setTimeout(() => {
          onSuccess("login"); // Call onSuccess callback to redirect to login page
        }, 5000); // Match toast duration
      } else {
        toast.error(data.message || "Password reset failed. Please try again.", {
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
        console.error("Form submission error:", data);
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

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ${isAnimated ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleOverlayClick}
    >
      <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
      <div
        className={`relative bg-[linear-gradient(to_bottom_left,#0E083C_55%,#06031E_100%)] rounded-2xl w-full max-w-[90%] md:max-w-md lg:max-w-[45%] transform transition-all duration-300 ${isAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} overflow-hidden max-h-[90vh]`}
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
        <div className="overflow-y-auto max-h-[90vh] px-4 md:px-12 lg:px-28 py-12">
          <img src={Logo} alt="EXGEID Logo" className="lg:mb-6 md:mb-4 mb-1 scale-[72%] origin-left md:scale-[100%]" />
          <h2 className="lg:text-[36px] md:text-[27.92px] text-[24px] font-semibold text-[#CACACA] lg:mb-2 mb-0">Reset Password</h2>
          <p className="font-medium text-[#CACACA] lg:text-[20px] md:text-[15.51px] text-[14px] lg:mb-4 mb-2 leading-relaxed">Create a new and secure password to protect your account.</p>

          <form className="mt-4 sm:mt-6" onSubmit={handleSubmit}>
            <label className="block font-medium text-[#CACACA] md:text-[14px] text-[10px] mt-3 sm:mt-4">New Password</label>
            <div className="relative">
              <img src={PadlockIcon} className="absolute left-3 md:top-[52%] top-[55%] transform -translate-y-1/2 text-gray-400 scale-[95%] md:scale-[100%]" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your new Password"
                className="w-full pl-10 pr-4 py-3 md:py-4 bg-[#09052C] text-white rounded-md mt-1 font-regular md:text-[16px] text-[12px] focus:outline-none focus:border-[#FEC84D] focus:ring-1 focus:ring-[#FEC84D]"
                required
              />
              <span className="absolute right-4 lg:top-3 top-2.5 mt-4 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <FiEye size={20} className="text-[#CACACA] scale-[85%] md:scale-[100%]"/> : <FiEyeOff size={20} className="text-[#CACACA] scale-[85%] md:scale-[100%]"/>}
              </span>
            </div>
            {passwordError && <FadeInSection><p className="text-red-500 text-[12px] mt-1">{passwordError}</p></FadeInSection>}
            {passwordSuccess && <FadeInSection><p className="text-green-500 text-[12px] mt-1">{passwordSuccess}</p></FadeInSection>}

            <label className="block font-medium text-[#CACACA] md:text-[14px] text-[10px] mt-3 sm:mt-4">Re-enter Password</label>
            <div className="relative">
              <img src={PadlockIcon} className="absolute left-3 md:top-[52%] top-[55%] transform -translate-y-1/2 text-gray-400 scale-[95%] md:scale-[100%]" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="reEnteredPassword"
                value={formData.reEnteredPassword}
                onChange={handleInputChange}
                placeholder="Confirm new Password"
                className="w-full pl-10 pr-4 py-3 md:py-4 bg-[#09052C] text-white rounded-md mt-1 font-regular md:text-[16px] text-[12px] focus:outline-none focus:border-[#FEC84D] focus:ring-1 focus:ring-[#FEC84D]"
                required
              />
              <span className="absolute right-4 lg:top-3 top-2.5 mt-4 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <FiEye size={20} className="text-[#CACACA] scale-[85%] md:scale-[100%]"/> : <FiEyeOff size={20} className="text-[#CACACA] scale-[85%] md:scale-[100%]"/>}
              </span>
            </div>
            {confirmPasswordError && <FadeInSection><p className="text-red-500 text-[12px] mt-1">{confirmPasswordError}</p></FadeInSection>}

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
                "Reset Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;