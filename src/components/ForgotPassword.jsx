import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import Logo from "../assets/logo2.png";
import EmailIcon from "../assets/icons/email.svg";

const API_URL = "https://exgeid-backend.onrender.com/api/v1/auth/password/initiate-reset";

const ForgotPasswordModal = ({ onClose, onSuccess }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [formData, setFormData] = useState({
    email: ""
  });
  const [loading, setLoading] = useState(false);

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
        email: formData.email
      };

      console.log("Initiating password reset for:", payload);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log("Password reset initiation API response:", { 
        status: response.status, 
        ok: response.ok, 
        data 
      });

      if (response.ok) {
        console.log("Password reset initiation successful for email:", formData.email);
        toast.success("Password reset instructions sent!", {
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
        setTimeout(() => {
          setLoading(false);
          onSuccess("password-change-email-verification", {email: formData.email});
        }, 5000); // Match toast duration
      } else {
        console.error("Password reset initiation error:", err);
        setLoading(false);
        toast.error(data.message || "Failed to send reset request. Please try again.", {
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
      console.error("Password reset initiation error:", err);
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
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ${isAnimated ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleOverlayClick}
    >
      <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
      <div
        className={`relative bg-[linear-gradient(to_bottom_left,#0E083C_55%,#06031E_100%)] rounded-2xl w-full max-w-[90%] md:max-w-md lg:max-w-[55%] transform transition-all duration-300 ${isAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} overflow-hidden max-h-[80vh]`}
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
        <div className="overflow-y-auto max-h-[80vh] px-4 md:px-12 lg:px-28 py-12">
          <img src={Logo} alt="EXGEID Logo" className="lg:mb-6 md:mb-4 mb-1 scale-[72%] origin-center md:scale-[100%] mx-auto" />
          <h2 className="lg:text-[40px] md:text-[32px] text-[24px] font-bold text-[#CACACA] lg:mb-2 mb-1 text-center">Forgot password</h2>
          <p className="font-regular lg:w-[80%] mx-auto text-[#CACACA] text-center lg:text-[18px] md:text-[14px] text-[10px] lg:mb-4 mb-2 leading-relaxed">Enter your registered email below to receive your password reset instructions.</p>

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
                className="w-full pl-10 pr-4 py-3 md:py-5 bg-[#110B41] text-white rounded-md mt-1 font-regular md:text-[16px] text-[12px] focus:outline-none focus:border-[#FEC84D] focus:ring-1 focus:ring-[#FEC84D]"
                required
              />
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
                "Reset Password"
              )}
            </button>
          </form>

          <p className="text-center text-white font-regular lg:text-[16px] md:text-[12.41px] text-[12px] mt-5 md:mt-8">
            I already have an account? <Link onClick={onClose} className="text-[#FEC84D] hover:text-yellow-200 underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;