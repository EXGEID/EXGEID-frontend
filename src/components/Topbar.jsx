import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import Sidebar from "./Sidebar";

const Topbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({ 
    name: "Loading...", 
    avatar: null,
    hasError: false,
    isLoading: true
  });
  
  const DAILY_TASK_API_URL = "https://exgeid-backend.onrender.com/api/v1/task/fetch/daily-task";
  const PROFILE_API_URL = "https://exgeid-backend.onrender.com/api/v1/users/get/profile-info";
  const REFRESH_TOKEN_URL = "https://exgeid-backend.onrender.com/api/v1/refresh/token";

  // Utility function to get initials from name
  const getInitials = (fullName) => {
    if (!fullName || user.hasError) return "?";
    return fullName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  // Show error toast with custom styling
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

  // Show success toast with #FEC84D border and icon
  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-center",
      style: {
        background: "#09052C",
        color: "#CACACA",
        border: "1px solid #FEC84D", // Updated to #FEC84D
        zIndex: 9999,
      },
      iconTheme: {
        primary: "#FEC84D", // Updated icon color to match border
        secondary: "#09052C",
      },
      duration: 3000,
    });
  };

  useEffect(() => {
    const fetchUserData = async (token) => {
      setUser(prev => ({ ...prev, isLoading: true }));
      
      try {
        // 1. ALWAYS fetch daily tasks FIRST
        console.log("Fetching daily task data...");
        const taskRes = await fetch(DAILY_TASK_API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!taskRes.ok) {
          throw new Error(`Daily task request failed: ${taskRes.status}`);
        }

        const taskData = await taskRes.json();
        console.log("Daily task data:", taskData);

        // 2. THEN fetch profile data
        console.log("Fetching profile data...");
        const profileRes = await fetch(PROFILE_API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!profileRes.ok) {
          throw new Error(`Profile request failed: ${profileRes.status}`);
        }

        const profileData = await profileRes.json();
        console.log("Profile data:", profileData);
        
        // Validate and set user data
        const fullName = profileData.data.personalDetails?.fullName;
        if (!fullName) {
          throw new Error("Invalid profile data: missing full name");
        }

        setUser({
          name: fullName,
          avatar: null,
          hasError: false,
          isLoading: false
        });

      } catch (err) {
        console.error("Fetch failed:", err.message);
        showErrorToast("Failed to load user data. Please refresh or log in again.");
        setUser({
          name: "Loading failed",
          avatar: null,
          hasError: true,
          isLoading: false
        });
        throw err; // Re-throw for token refresh handling
      }
    };

    const attemptTokenRefresh = async () => {
      try {
        console.log("Attempting to refresh token...");
        const refreshRes = await fetch(REFRESH_TOKEN_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!refreshRes.ok) {
          throw new Error(`Token refresh failed: ${refreshRes.status}`);
        }

        const refreshData = await refreshRes.json();
        const { accessToken: newAccessToken } = refreshData;
        
        if (!newAccessToken) {
          throw new Error("No new access token received");
        }

        console.log("New Access Token received, retrying requests...");
        sessionStorage.setItem("accessToken", newAccessToken);
        showSuccessToast("Session refreshed successfully!");

        // Retry with new token: DAILY TASKS FIRST, then PROFILE
        await fetchUserData(newAccessToken);

      } catch (refreshErr) {
        console.error("Token refresh failed:", refreshErr.message);
        showErrorToast("Session expired. Please log in again.");
        setUser({
          name: "Session Expired",
          avatar: null,
          hasError: true,
          isLoading: false
        });
        // Optionally redirect to login
        // window.location.href = '/login';
      }
    };

    const initialize = async () => {
      const accessToken = sessionStorage.getItem("accessToken");
      
      if (!accessToken) {
        showErrorToast("Authentication required. Please log in.");
        setUser({
          name: "Not Logged In",
          avatar: null,
          hasError: true,
          isLoading: false
        });
        return;
      }

      try {
        await fetchUserData(accessToken);
      } catch (err) {
        // Attempt token refresh only for auth-related errors
        if (err.message.includes("401") || err.message.includes("403")) {
          await attemptTokenRefresh();
        }
      }
    };

    initialize();
  }, []);

  const AvatarInitials = () => (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-[#FEC84D] flex items-center justify-center text-sm font-semibold flex-shrink-0 relative">
      {user.isLoading ? (
        <div className="w-4 h-4 border-2 border-[#1A202C] border-t-transparent rounded-full animate-spin"></div> // Updated spinner color to #FEC84D
      ) : (
        <span className="font-bold text-[#1A202C]">{getInitials(user.name)}</span>
      )}
    </div>
  );

  return (
    <>
      {/* Toaster with high z-index positioned within this component */}
      <Toaster 
        position="top-center"
        containerStyle={{
          zIndex: 9999,
          top: '20px',
        }}
        toastOptions={{
          style: {
            background: "#09052C",
            color: "#CACACA",
            zIndex: 9999,
          },
          duration: 5000,
        }}
      />
      
      <div className="fixed top-0 left-0 w-full md:w-[calc(100%-16rem)] bg-[#06031E] flex justify-between items-center px-4 md:px-8 py-4 md:py-8 md:pl-8 md:pr-16 border-b border-[#343434] md:ml-64 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="text-white text-xl md:hidden"
          disabled={user.isLoading}
        >
          <FaBars />
        </button>

        <div className="flex items-center ml-auto">
          {/* Circular avatar with initials and loading spinner */}
          <AvatarInitials />
          <span 
            className={`ml-3 font-medium transition-colors ${
              user.isLoading 
                ? 'text-gray-400' 
                : user.hasError 
                ? 'text-red-400' 
                : 'text-white'
            }`}
          >
            {user.isLoading ? "Loading..." : user.name}
          </span>
        </div>
      </div>

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Topbar;
