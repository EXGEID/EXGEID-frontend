import { useState, useEffect } from 'react';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from "react-router-dom";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import toast, { Toaster } from 'react-hot-toast';
import { z } from "zod";
import leoProfanity from "leo-profanity";
import Logo from "../assets/logo2.png";
import EmailIcon from "../assets/icons/email.svg";
import PadlockIcon from "../assets/icons/padlock.svg";
import GoogleIcon from "../assets/icons/Google.svg";
import FadeInSection from './FadeInSection';

// ✅ Load English dictionary explicitly
leoProfanity.loadDictionary("en");

// 🧼 Clean text: remove emojis, symbols, diacritics, and extra spaces
const cleanText = (input) => {
  return (
    input
      // remove emojis and special Unicode symbols
      .replace(
        /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]|\p{Extended_Pictographic})/gu,
        ""
      )
      // normalize diacritics (é -> e)
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      // collapse multiple spaces
      .replace(/\s+/g, " ")
      .trim()
  );
};

// ✅ Importable Zod schema
const fullNameSchema = z
  .string({ invalid_type_error: "Name must be a string." })
  .min(1, { message: "Name is required." })
  .transform((val) => cleanText(val))
  .refine(
    (val) => val.length > 0, // Ensure non-empty after cleaning
    { message: "Name cannot be empty or spaces only." }
  )
  .refine(
    (val) => /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(val),
    { message: "Name must contain only letters, spaces, apostrophes, or hyphens." }
  )
  .refine(
    (val) => val.length >= 2 && val.length <= 50,
    { message: "Name must be between 2 and 50 characters." }
  )
  .refine(
    (val) => !leoProfanity.check(val),
    { message: "Name contains inappropriate or sensitive words." }
  );

const API_URL = "https://exgeid-backend.onrender.com/api/v1/auth/sign-up";
const GOOGLE_SIGNUP_URL = "https://exgeid-backend.onrender.com/api/v1/auth/google";

const SignupModal = ({ onClose, openModal, closeCurrentAndOpenNext }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    reEnteredPassword: "",
    fullName: "",
    phoneNumber: "",
    referralCode: ""
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [fullNameValid, setFullNameValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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

    if (name === "fullName") {
      validateFullName(value);
    }
    if (name === "password") {
      validatePassword(value);
    }
    if (name === "reEnteredPassword" || name === "password") {
      validateConfirmPassword(formData.password, name === "reEnteredPassword" ? value : formData.reEnteredPassword);
    }
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      phoneNumber: value // Includes country code, e.g., "+2348031234567"
    }));
  };

  const validateFullName = (value) => {
    // Skip validation for empty input to avoid premature errors
    if (!value || value.trim() === "") {
      setFullNameError("");
      setFullNameValid(false);
      return false;
    }

    // Ensure value is a string to prevent type errors
    if (typeof value !== "string") {
      setFullNameError("Invalid input type for name.");
      setFullNameValid(false);
      return false;
    }

    const result = fullNameSchema.safeParse(value);
    // console.log("Input:", value, "Cleaned:", cleanText(value), "Profanity:", leoProfanity.check(cleanText(value))); // Debug
    // console.log("Validation result:", result); // Debug
    if (result.success) {
      setFullNameError("");
      setFullNameValid(true);
      return true;
    } else {
      // Safely access the first error message, with fallback
      const errorMessage = result.error?.issues?.[0]?.message || "Invalid name format.";
      setFullNameError(errorMessage);
      setFullNameValid(false);
      return false;
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
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError("");
    setPasswordSuccess("");
    setConfirmPasswordError("");
    setFullNameError("");

    if (!validateFullName(formData.fullName)) {
      setLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setLoading(false);
      return;
    }

    if (!validateConfirmPassword(formData.password, formData.reEnteredPassword)) {
      setLoading(false);
      return;
    }

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        reEnteredPassword: formData.reEnteredPassword,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        referralCode: formData.referralCode || undefined
      };
      console.log("API payload:", payload); // Debug: Verify phoneNumber includes country code
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      setFormData({ fullName: '', email: '', password: '', reEnteredPassword: '', phoneNumber: '', referralCode: '' });
      setLoading(false);

      if (response.ok) {
        toast.success("Sign up successful! Please check your email for verification.", {
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
          onClose();
        }, 5000); // Match toast duration
      } else {
        toast.error(data.message || "Sign up failed. Please try again.", {
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
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ${isAnimated ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleOverlayClick}
    >
      <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
      <div
        className={`relative bg-[linear-gradient(to_bottom_left,#0E083C_55%,#06031E_100%)] rounded-2xl w-full max-w-[90%] md:max-w-md lg:max-w-[50%] transform transition-all duration-300 ${isAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} overflow-hidden max-h-[90vh]`}
      >
        <style jsx>{`
          .react-tel-input .country-list {
            background-color: #09052C;
            color: #CACACA;
          }
          .react-tel-input .country-list .country:hover,
          .react-tel-input .country-list .country.highlight {
            background-color: #FEC84D !important;
            color: #09052C;
          }
          .react-tel-input .flag {
            filter: brightness(1.2);
          }
          .react-tel-input .selected-flag {
            background-color: #110B41 !important;
            color: #CACACA;
          }
          .react-tel-input input {
            background-color: #09052C !important;
            color: white !important;
            border: 1px solid #09052C !important;
            width: 100% !important;
            box-sizing: border-box;
          }
          .react-tel-input input:focus {
            border-color: #FEC84D !important;
            box-shadow: 0 0 0 1px #FEC84D !important;
          }
          .react-tel-input .selected-flag {
            padding-left: 10px;
          }
          .react-tel-input {
            width: 100% !important;
          }
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
          <h2 className="lg:text-[36px] md:text-[27.92px] text-[24px] font-semibold text-[#CACACA] lg:mb-2 mb-0">Create an account</h2>
          <p className="font-medium text-[#CACACA] lg:text-[20px] md:text-[15.51px] text-[14px] lg:mb-4 mb-2 leading-relaxed">Sign up and start earning</p>

          <form className="mt-4 sm:mt-6" onSubmit={handleSubmit}>
            <label className="font-medium text-[#CACACA] md:text-[14px] text-[10px]">Full name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter name"
              className={`w-full bg-[#09052C] text-white p-2 lg:px-4 py-3 md:py-4 rounded-md mt-1 font-regular md:text-[16px] text-[12px] focus:outline-none focus:ring-1 focus:ring-[#FEC84D] focus:border ${
                fullNameError ? 'focus:border-red-500' : fullNameValid && formData.fullName ? 'focus:border-green-500' : 'focus:border-[#09052C]'
              }`}
              required
            />
            {fullNameError && <FadeInSection><p className="text-red-500 text-[12px] mt-1">{fullNameError}</p></FadeInSection>}
            {fullNameValid && formData.fullName && <FadeInSection><p className="text-green-500 text-[12px] mt-1">Name looks good!</p></FadeInSection>}

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

            <label className="block font-medium text-[#CACACA] md:text-[14px] text-[10px] mt-3 sm:mt-4">Phone number</label>
            <div className="mt-1 w-full">
              <PhoneInput
                country={'ng'}
                value={formData.phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Enter phone number"
                className="w-full font-regular md:text-[16px] text-[12px]"
                inputStyle={{
                  width: '100%',
                  background: '#09052C',
                  color: 'white',
                  padding: '0.75rem 1rem 0.75rem 3.5rem',
                  height: '2.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #09052C',
                  lineHeight: '1rem',
                }}
                buttonStyle={{
                  background: '#110B41',
                  border: '1px solid #09052C',
                  borderRadius: '0.375rem 0 0 0.375rem',
                  paddingLeft: '0.5rem',
                }}
                dropdownStyle={{
                  background: '#09052C',
                  color: '#CACACA',
                }}
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
                className={`w-full pl-10 pr-4 py-3 md:py-4 bg-[#09052C] text-white rounded-md mt-1 font-regular md:text-[16px] text-[12px] focus:outline-none focus:border-[#FEC84D] focus:ring-1 focus:ring-[#FEC84D] focus:border ${
                passwordError ? 'focus:border-red-500' : passwordSuccess ? 'focus:border-green-500' : 'focus:border-[#09052C]'
                }`}
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
                placeholder="Confirm Password"
                className={`w-full pl-10 pr-4 py-3 md:py-4 bg-[#09052C] text-white rounded-md mt-1 font-regular md:text-[16px] text-[12px] focus:outline-none focus:border-[#FEC84D] focus:ring-1 focus:ring-[#FEC84D] focus:border ${
                confirmPasswordError ? 'focus:border-red-500' :  'focus:border-green-500'
                }`}
                required
              />
              <span className="absolute right-4 lg:top-3 top-2.5 mt-4 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword((prev) => !prev)}>
                {showPassword ? <FiEye size={20} className="text-[#CACACA] scale-[85%] md:scale-[100%]"/> : <FiEyeOff size={20} className="text-[#CACACA] scale-[85%] md:scale-[100%]"/>}
              </span>
            </div>
            {confirmPasswordError && <FadeInSection><p className="text-red-500 text-[12px] mt-1">{confirmPasswordError}</p></FadeInSection>}

            <label className="block font-medium text-[#CACACA] md:text-[14px] text-[10px] mt-3 sm:mt-4">Referral code (optional)</label>
            <input
              type="text"
              name="referralCode"
              value={formData.referralCode}
              onChange={handleInputChange}
              placeholder="Enter referral code"
              className="w-full bg-[#09052C] text-white p-2 lg:px-4 py-3 md:py-4 rounded-md mt-1 font-regular md:text-[16px] text-[12px] focus:outline-none focus:border-[#FEC84D] focus:ring-1 focus:ring-[#FEC84D]"
            />

            <button
              type="submit"
              className={`w-full bg-[#8F0406] hover:bg-red-700 hover:scale-110 text-white lg:text-[18px] md:text-[14px] text-[16px] font-semibold py-2 md:py-4 rounded-lg mb-4 transition mt-8 md:mt-12 flex items-center justify-center ${loading || !fullNameValid ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading || !fullNameValid}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Loading...
                </>
              ) : (
                "Get Started"
              )}
            </button>
          </form>

          <div className="flex items-center justify-center mb-4 md:mb-6">
            <hr className="w-full h-[2px] bg-[#B0C9E5] mt-1"/>
            <span className="text-[#B0C9E5] font-regular lg:text-[16px] md:text-[12.41px] text-[12px] md:mx-5 mx-3">Or</span>
            <hr className="w-full h-[2px] bg-[#B0C9E5] mt-1"/>
          </div>

          <a href={GOOGLE_SIGNUP_URL}><button
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

          {/* Terms & Conditions */}
          <p className="font-regular lg:text-[16px] md:text-[12.41px] text-[12px] text-[#CACACA] text-center mt-4 mb-4">
              By clicking "Get Started" you acknowledge that you have read and understood our{" "}
              <Link onClick={() => openModal('terms-and-conditions')} className="text-[#FEC84D] hover:text-yellow-200 underline">Terms & Conditions</Link>
          </p>

          <p className="text-center text-white font-regular lg:text-[16px] md:text-[12.41px] text-[12px] mt-5 md:mt-8">
            I already have an account? <Link onClick={() => closeCurrentAndOpenNext('login')} className="text-[#FEC84D] hover:text-yellow-200 underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
