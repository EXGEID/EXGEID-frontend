import { useEffect, useState } from "react";
import {
  FaVideo,
  FaUsers,
  FaLink,
} from "react-icons/fa";
import {
  IoLogoFacebook,
  IoLogoWhatsapp,
  IoLogoInstagram,
  IoLogoTwitter,
  IoLogoSnapchat,
  IoCopyOutline,
} from "react-icons/io5";
import { Toaster, toast } from "react-hot-toast";

const REFERRAL_API_URL = "https://exgeid-backend.onrender.com/api/v1/users/referral-info";
const REFRESH_TOKEN_URL = "https://exgeid-backend.onrender.com/api/v1/refresh/token";

const Referrals = () => {
  const [referralInfo, setReferralInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // === Toast Functions (Updated to match Dashboard/Videos) ===
  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-center",
      style: {
        background: "#09052C",
        color: "#CACACA",
        border: "1px solid #FEC84D",
        zIndex: 9999,
      },
      iconTheme: {
        primary: "#FEC84D",
        secondary: "#09052C",
      },
      duration: 3000,
    });
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-center",
      style: {
        background: "#09052C",
        color: "#CACACA",
        border: "1px solid #ef4444",
        zIndex: 9999,
      },
      iconTheme: {
        primary: "#ef4444",
        secondary: "#09052C",
      },
      duration: 5000,
    });
  };

  // === Copy Referral Code ===
  const copyReferralCode = async (code) => {
    if (!code || code === "No referral code") {
      showErrorToast("No referral code to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      showSuccessToast("Referral code copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      showSuccessToast("Referral code copied!");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // === Fetch Referral Info with Retry & Refresh ===
  const fetchReferralInfo = async (accessToken) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(REFERRAL_API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Referral request failed: ${res.status} - ${errorText}`);
      }

      const response = await res.json();
      const data = response.data || response;
      setReferralInfo(data);
      showSuccessToast("Referral info loaded!");

    } catch (err) {
      console.error("Referral fetch error:", err);

      // Try token refresh
      try {
        const refreshRes = await fetch(REFRESH_TOKEN_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!refreshRes.ok) throw new Error("Token refresh failed");

        const refreshResponse = await refreshRes.json();
        const newAccessToken = refreshResponse.data;

        if (!newAccessToken) throw new Error("No new access token");

        sessionStorage.setItem("accessToken", newAccessToken);
        showSuccessToast("Session refreshed! Reloading...");

        // Retry fetch
        const retryRes = await fetch(REFERRAL_API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!retryRes.ok) throw new Error("Retry failed");

        const retryResponse = await retryRes.json();
        const retryData = retryResponse.data || retryResponse;
        setReferralInfo(retryData);
        showSuccessToast("Referral info reloaded!");

      } catch (refreshErr) {
        setError("Failed to load referral info. Please try again later.");
        showErrorToast("Could not load referral info. Please try again.");
        setReferralInfo(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // === Initial Load ===
  useEffect(() => {
    const loadData = async () => {
      const accessToken = sessionStorage.getItem("accessToken");

      if (!accessToken) {
        showErrorToast("Authentication required. Please log in.");
        setError("Please login to view referral info.");
        setLoading(false);
        return;
      }

      await fetchReferralInfo(accessToken);
    };

    // Optional delay to match dashboard
    const timer = setTimeout(loadData, 2000);
    return () => clearTimeout(timer);
  }, []);

  // === Loading Skeleton (Matching actual layout, height, width) ===
  if (loading) {
    return (
      <>
        <Toaster
          position="top-center"
          containerStyle={{ zIndex: 9999, top: "20px" }}
          toastOptions={{
            style: { background: "#09052C", color: "#CACACA" },
            duration: 5000,
          }}
        />
        <div className="bg-[#020109] min-h-screen md:px-6 py-8 mx-auto">
          {/* Header Skeleton */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-[#0E083C] to-[#06031E] rounded-full mx-auto animate-pulse"></div>
            <div className="h-8 bg-gradient-to-r from-[#0E083C] to-[#06031E] rounded w-52 mx-auto animate-pulse"></div>
            <div className="h-5 bg-gradient-to-r from-[#0E083C] to-[#06031E] rounded w-68 md:w-96 mx-auto animate-pulse"></div>
          </div>

          {/* Level Steps Skeleton */}
          <div className="mt-8 flex justify-center items-center gap-6 flex-wrap">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-[#0E083C] to-[#06031E] rounded-full animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-[#0E083C] to-[#06031E] rounded w-16 animate-pulse"></div>
              </div>
            ))}
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gradient-to-br from-[#0E083C] to-[#06031E] p-6 rounded-xl space-y-3 animate-pulse">
                <div className="h-5 bg-gradient-to-r from-[#0E083C]/50 to-[#06031E]/50 rounded w-32"></div>
                <div className="h-6 bg-gradient-to-r from-[#0E083C]/50 to-[#06031E]/50 rounded w-24"></div>
              </div>
            ))}
          </div>

          {/* Referral Code Card Skeleton */}
          <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] p-6 rounded-xl mt-8 space-y-4 animate-pulse">
            <div className="h-5 bg-gradient-to-r from-[#0E083C]/50 to-[#06031E]/50 rounded w-40"></div>
            <div className="h-12 bg-gradient-to-r from-[#0E083C]/50 to-[#06031E]/50 rounded"></div>
            <div className="flex justify-around">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-10 h-10 bg-gradient-to-r from-[#0E083C]/50 to-[#06031E]/50 rounded-full"></div>
              ))}
            </div>
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-gradient-to-r from-[#0E083C]/50 to-[#06031E]/50 rounded w-full"></div>
              ))}
            </div>
          </div>

          {/* Day Indicator Skeleton */}
          <div className="text-center mt-6">
            <div className="h-4 bg-gradient-to-r from-[#0E083C] to-[#06031E] rounded w-48 mx-auto animate-pulse"></div>
          </div>
        </div>
      </>
    );
  }

  // === Error State (Matching Dashboard) ===
  if (error) {
    return (
      <>
        <Toaster
          position="top-center"
          containerStyle={{ zIndex: 9999, top: "20px" }}
          toastOptions={{
            style: { background: "#09052C", color: "#CACACA" },
            duration: 5000,
          }}
        />
        <div className="bg-[#020109] h-screen flex items-center justify-center p-6">
          <div className="bg-gradient-to-r from-[#06031E] to-[#0E083C] rounded-xl p-8 text-center max-w-md">
            <p className="text-red-500 font-medium">{error || "No Referral data available."}</p>
          </div>
        </div>
      </>
    );
  }

  // === No Data Guard ===
  if (!referralInfo) {
    return null;
  }

  const {
    userFullName,
    referralCode,
    dailyTaskInfo: { watchedVideos, accountsSubscribed, referralCount },
    profileInfo: { level, day },
  } = referralInfo;

  // === Level Steps ===
  const levels = [
    { label: "₦500", level: "Level 1" },
    { label: "₦1000", level: "Level 2" },
    { label: "₦1500", level: "Level 3" },
    { label: "₦2000", level: "Level 4" },
    { label: "₦2000", level: "Level 5" },
    { label: "₦2000", level: "Level 6" },
    { label: "₦2000", level: "Level 7" },
    { label: "₦2000", level: "Level 8" },
    { label: "₦2000", level: "Level 9" },
    { label: "₦2000", level: "Level 10" },
  ];

  return (
    <>
      {/* Toaster */}
      <Toaster
        position="top-center"
        containerStyle={{ zIndex: 9999, top: "20px" }}
        toastOptions={{
          style: { background: "#09052C", color: "#CACACA" },
          duration: 5000,
        }}
      />

      <div className="bg-[#020109] min-h-screen md:px-6 py-8 text-white">
        {/* Header */}
        <div className="text-center">
          <div className="text-5xl">🎁</div>
          <h2 className="text-2xl font-bold mt-2">Invite & Earn with Exgeid</h2>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto mt-2">
            Hi <span className="text-yellow-400 font-medium">{userFullName}</span>! The more friends you invite, the faster you level up and the bigger
          your monthly earnings. Share your link every day to level up faster!
          </p>
        </div>

        {/* Level Steps */}
        <div className="mt-8 flex justify-center items-center gap-6 flex-wrap">
          {levels.map((step, index) => {
            const currentLevel = index + 1;
            const isActive = currentLevel === level;
            const isPassed = currentLevel < level;

            return (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold transition-all
                    ${isActive
                      ? "bg-yellow-500 text-black border-yellow-500"
                      : isPassed
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-transparent text-gray-500 border-gray-500"
                    }`}
                >
                  {index + 1}
                </div>
                <p className={`text-xs mt-2 ${isActive ? "text-yellow-400 font-bold" : "text-gray-400"}`}>
                  {step.level}
                </p>
                {/*<p className={`text-xs ${isActive ? "text-white" : "text-gray-300"}`}>{step.label}</p>*/}
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] p-6 rounded-xl">
            <p className="font-medium flex items-center gap-2 md:pb-2">
              <FaVideo className="text-yellow-400" /> Total Videos Watched
            </p>
            <span className="text-yellow-400 md:text-lg font-semibold ">{watchedVideos} videos</span>
          </div>

          <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] p-6 rounded-xl">
            <p className="font-medium flex items-center gap-2 md:pb-2">
              <FaUsers className="text-yellow-400" /> Total Referrals
            </p>
            <span className="text-yellow-400 md:text-lg font-semibold">{referralCount} Referrals</span>
          </div>

          <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] p-6 rounded-xl">
            <p className="font-medium flex items-center gap-2 md:pb-2">
              <FaLink className="text-yellow-400" /> Accounts Followed
            </p>
            <span className="text-yellow-400 text-xl font-bold">{accountsSubscribed}</span>
          </div>
        </div>

        {/* Referral Code */}
        <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] p-6 rounded-xl mt-8">
          <p className="mb-2 font-medium">Your Referral Code:</p>
          <div className="flex items-center justify-between bg-yellow-500/15 rounded-md p-3">
            <span className="text-yellow-400 font-bold tracking-wider">
              {referralCode}
            </span>
            <button
              onClick={() => copyReferralCode(referralCode)}
              className="text-yellow-400 hover:text-yellow-300 transition-colors"
              title="Copy code"
            >
              {copied ? "Copied!" : <IoCopyOutline className="text-xl" />}
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex justify-around mt-6 text-3xl">
            <IoLogoFacebook className="text-blue-500 hover:scale-110 transition-transform cursor-pointer" />
            <IoLogoWhatsapp className="text-green-500 hover:scale-110 transition-transform cursor-pointer" />
            <IoLogoInstagram className="text-pink-500 hover:scale-110 transition-transform cursor-pointer" />
            <IoLogoTwitter className="text-sky-400 hover:scale-110 transition-transform cursor-pointer" />
            <IoLogoSnapchat className="text-yellow-400 hover:scale-110 transition-transform cursor-pointer" />
          </div>

          {/* Rules */}
          <div className="mt-6 space-y-2 text-sm text-gray-300">
            <p>1. Share your referral link with friends and family</p>
            <p>2. Receive ₦500 each time someone clicks your link</p>
            <p>3. Earn ₦1500 bonus when someone creates an account</p>
            <p>4. New Users get ₦10,000 Sign-Up Bonus</p>
          </div>
        </div>

        {/* Day Indicator */}
        <div className="text-center mt-6 text-xs text-gray-500">
          Day {day} of your journey in Level {level}
        </div>
      </div>
    </>
  );
};

export default Referrals;