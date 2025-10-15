import React, { useState, useEffect } from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import angelVid from "../assets/angelVid.png";
import { mockProfileData } from "../api/mockProfileData";
import MockModeBadge from "../components/MockModeBadge";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isMock, setIsMock] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // API Endpoints
  const PROFILE_API_URL = "https://exgeid-backend.onrender.com/api/v1/users/get/profile-info";
  const EDIT_PROFILE_API_URL = "https://exgeid-backend.onrender.com/api/v1/users/edit/profile-info";
  const LOGOUT_API_URL = "https://exgeid-backend.onrender.com/api/v1/auth/logout";
  const REFRESH_TOKEN_URL = "https://exgeid-backend.onrender.com/api/v1/refresh/token";

  // Generate initials from full name with dashboard styling
  const getInitials = (fullName) => {
    if (!fullName) return "U";
    const names = fullName.trim().split(" ");
    const initials = names.map(name => name[0].toUpperCase()).join("");
    return initials.length > 2 ? initials.substring(0, 2) : initials;
  };

  // Toast utility functions with dashboard styling
  const showSuccessToast = (message) => {
    toast.success(message, {
      duration: 3000,
      position: "top-center",
      style: {
        background: "#09052C",
        color: "#CACACA",
        border: "1px solid #FEC84D", // Updated to #FEC84D
        zIndex: 9999,
        borderRadius: "8px",
        fontSize: "14px",
        padding: "12px 16px",
        boxShadow: "0 4px 12px rgba(198, 5, 8, 0.15)",
      },
      iconTheme: {
        primary: "#FEC84D", // Updated icon color to match border
        secondary: "#09052C",
      },
    });
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      duration: 5000,
      position: "top-right",
      style: {
        background: "#0E083C",
        color: "#CACACA",
        border: "1px solid #C60508",
        borderRadius: "8px",
        fontSize: "14px",
        padding: "12px 16px",
        boxShadow: "0 4px 12px rgba(198, 5, 8, 0.15)",
      },
      iconTheme: {
        primary: "#C60508",
        secondary: "#CACACA",
      },
    });
  };

  const showWarningToast = (message) => {
    toast(message, {
      duration: 5000,
      position: "top-right",
      style: {
        background: "#0E083C",
        color: "#CACACA",
        border: "1px solid #C60508",
        borderRadius: "8px",
        fontSize: "14px",
        padding: "12px 16px",
        boxShadow: "0 4px 12px rgba(198, 5, 8, 0.15)",
      },
      iconTheme: {
        primary: "#C60508",
        secondary: "#CACACA",
      },
      icon: "⚠️",
    });
  };

  // Generic API fetch with refresh token logic
  const apiFetchWithRefresh = async (url, options = {}) => {
    const accessToken = sessionStorage.getItem("accessToken");
    
    if (!accessToken) {
      throw new Error("No access token found");
    }

    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    try {
      const res = await fetch(url, options);
      
      if (!res.ok) {
        // If 401, try to refresh token
        if (res.status === 401) {
          return await refreshAndRetry(url, options);
        }
        const errorText = await res.text();
        throw new Error(`API request failed: ${res.status} - ${errorText}`);
      }

      return await res.json();
    } catch (err) {
      if (err.message.includes("refresh")) {
        return await refreshAndRetry(url, options, true);
      }
      throw err;
    }
  };

  // Refresh token and retry logic
  const refreshAndRetry = async (url, options, forceMock = false) => {
    try {
      console.log("Attempting to refresh token...");
      const refreshRes = await fetch(REFRESH_TOKEN_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!refreshRes.ok) {
        throw new Error(`Token refresh failed: ${refreshRes.status}`);
      }

      const refreshResponse = await refreshRes.json();
      console.log("Refresh token response:", refreshResponse);
      
      const newAccessToken = refreshResponse.data?.accessToken || refreshResponse.accessToken;
      
      if (!newAccessToken) {
        throw new Error("No new access token received from refresh");
      }

      console.log("New Access Token obtained");
      sessionStorage.setItem("accessToken", newAccessToken);

      // Retry original request with new token
      const retryOptions = {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
      };

      const retryRes = await fetch(url, retryOptions);
      
      if (!retryRes.ok) {
        const errorText = await retryRes.text();
        throw new Error(`Retry request failed: ${retryRes.status} - ${errorText}`);
      }

      return await retryRes.json();
    } catch (refreshErr) {
      console.warn("Token refresh failed:", refreshErr.message);
      if (forceMock) {
        throw new Error("Authentication failed after refresh attempt");
      }
      // Fallback to mock data
      setIsMock(true);
      showWarningToast("Backend unavailable. Using mock data.");
      throw refreshErr;
    }
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      
      const accessToken = sessionStorage.getItem("accessToken");
      
      if (!accessToken) {
        console.warn("⚠️ No access token found, using mock data");
        setIsMock(true);
        setProfile(mockProfileData);
        setLoading(false);
        showWarningToast("No authentication token. Using mock data.");
        return;
      }

      try {
        const response = await apiFetchWithRefresh(PROFILE_API_URL, { method: "GET" });
        console.log("Profile data fetched successfully", response);
        const data = response.data || response;
        setProfile(data);
        setEditData({
          fullName: data.personalDetails?.fullName || "",
          gender: data.personalDetails?.gender || "",
          phoneNumber: data.personalDetails?.phoneNumber || "",
          profession: data.personalDetails?.profession || "",
          age: data.personalDetails?.age || "",
        });
        showSuccessToast("Profile loaded successfully!");
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.message);
        setIsMock(true);
        setProfile(mockProfileData);
        showErrorToast("Failed to load profile. Using mock data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle edit toggle
  const toggleEdit = () => {
    if (isMock) {
      showWarningToast("Edit functionality disabled in mock mode");
      return;
    }
    setIsEditing(!isEditing);
    if (!isEditing) {
      // Populate edit data when starting edit
      setEditData({
        fullName: profile.personalDetails?.fullName || "",
        gender: profile.personalDetails?.gender || "",
        phoneNumber: profile.personalDetails?.phoneNumber || "",
        profession: profile.personalDetails?.profession || "",
        age: profile.personalDetails?.age || "",
      });
      showWarningToast("Edit mode enabled. Make your changes and save.");
    }
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    if (isMock) {
      showWarningToast("Cannot save in mock mode");
      return;
    }
    
    // Basic validation
    if (!editData.fullName.trim()) {
      showErrorToast("Full name is required");
      return;
    }
    
    if (!editData.age || editData.age < 18 || editData.age > 100) {
      showErrorToast("Age must be between 18 and 100");
      return;
    }
    
    setSaving(true);
    
    try {
      const response = await apiFetchWithRefresh(EDIT_PROFILE_API_URL, {
        method: "PUT",
        body: JSON.stringify(editData),
      });

      console.log("Profile updated successfully", response);
      
      // Update local state
      setProfile({
        ...profile,
        personalDetails: {
          ...profile.personalDetails,
          fullName: editData.fullName,
          gender: editData.gender,
          phoneNumber: editData.phoneNumber,
          profession: editData.profession,
          age: editData.age,
        },
      });
      
      setIsEditing(false);
      showSuccessToast("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      showErrorToast(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");
      
      if (accessToken) {
        try {
          await apiFetchWithRefresh(LOGOUT_API_URL, { 
            method: "GET",
            credentials: "include",
          });
        } catch (logoutErr) {
          console.warn("Logout API failed, but clearing session:", logoutErr);
          // Continue with logout even if API fails
        }
      }

      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      
      showSuccessToast("Logged out successfully");
      setTimeout(() => navigate("/"), 1500); // Small delay for toast visibility
    } catch (error) {
      console.error("Logout failed:", error);
      showErrorToast("Logout failed. Clearing session anyway.");
      // Clear storage even if everything fails
      localStorage.clear();
      sessionStorage.clear();
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-[#020109] flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">Loading profile...</div>
        <Toaster />
      </div>
    );
  }

  if (error && !isMock) {
    return (
      <div className="flex-1 bg-[#020109] flex items-center justify-center min-h-screen">
        <div className="text-red-400 text-center p-8 max-w-md">
          <h2 className="text-xl mb-4 font-semibold text-white">Error loading profile</h2>
          <p className="mb-6 text-[#CACACA]">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#C60508] text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
        <Toaster />
      </div>
    );
  }

  const dataSource = profile || mockProfileData;
  const { personalDetails, accountDetails } = dataSource;

  return (
    <>
      <div className="flex-1 bg-[#020109] text-[#CACACA] p-8 min-h-screen relative">
        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <img src={angelVid} alt="angel_top" className="w-20 h-20" />
          <h1 className="text-2xl md:text-[28px] font-semibold text-white">Profile</h1>
          {isMock && <span className="text-yellow-400 text-sm ml-2">(Mock Data - Backend Unavailable)</span>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* RIGHT SIDE */}
          <div className="order-1 lg:order-2 bg-gradient-to-b from-[#0E083C] to-[#06031E] p-6 md:p-8 rounded-2xl shadow-lg flex flex-col items-center text-center">
            <div className="relative">
              {/* Profile initials with dashboard styling */}
              <div className="w-48 h-48 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-4xl shadow-lg">
                {getInitials(personalDetails?.fullName)}
              </div>
              {!isEditing && (
                <button 
                  onClick={toggleEdit}
                  className="absolute bottom-2 right-2 bg-[#C60508] p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Edit Profile"
                  disabled={isMock}
                >
                  <FaEdit className="text-white text-sm" />
                </button>
              )}
            </div>

            <h2 className="text-xl font-semibold mt-4 text-white">
              {isEditing ? editData.fullName : personalDetails?.fullName || "User"}
            </h2>
            <span className="inline-flex items-center justify-center gap-2 text-yellow-500 bg-yellow-500/20 px-4 py-2 rounded-full text-sm font-medium m-2">
              Level {accountDetails?.profileInfo?.level || 1} - Earner
            </span>
            <p className="text-gray-400 text-sm">
              @{isEditing ? editData.fullName?.split(" ")[0]?.toLowerCase() || "user" : 
                personalDetails?.fullName?.split(" ")[0]?.toLowerCase() || "user"}
            </p>

            <button 
              onClick={handleLogout} 
              className="mt-6 bg-[#8F0406] hover:bg-red-700 w-full max-w-md mx-auto py-3 rounded-lg font-medium transition-colors text-white"
            >
              Log out
            </button>

            <div className="mt-6 w-full max-w-md mx-auto bg-[#020109] p-4 rounded-xl text-left">
              <h4 className="font-semibold mb-2 border-b border-gray-700 pb-2 text-center text-white">
                Personal Information
              </h4>
              <div className="space-y-2 text-left">
                <p className="font-medium text-white">{isEditing ? editData.fullName : personalDetails?.fullName || "N/A"}</p>
                <p className="text-[#CACACA]">{isEditing ? editData.gender : personalDetails?.gender || "N/A"}</p>
                <p className="text-[#CACACA]">{isEditing ? editData.phoneNumber : personalDetails?.phoneNumber || "N/A"}</p>
                <p className="text-blue-400">{personalDetails?.email || "N/A"}</p>
                <p className="text-[#CACACA]">{isEditing ? editData.profession : personalDetails?.profession || "N/A"}</p>
                <p className="text-[#CACACA]">{isEditing ? editData.age : personalDetails?.age || "N/A"} years</p>
              </div>
            </div>

            {/* Edit Controls */}
            {isEditing && (
              <div className="mt-4 flex gap-2 w-full max-w-md">
                <button 
                  onClick={handleSaveProfile} 
                  disabled={saving || isMock}
                  className="flex-1 bg-[#C60508] hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  {saving ? "Saving..." : <><FaSave className="inline mr-2" />Save Changes</>}
                </button>
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setEditData({
                      fullName: profile.personalDetails?.fullName || "",
                      gender: profile.personalDetails?.gender || "",
                      phoneNumber: profile.personalDetails?.phoneNumber || "",
                      profession: profile.personalDetails?.profession || "",
                      age: profile.personalDetails?.age || "",
                    });
                    showWarningToast("Edit mode cancelled.");
                  }}
                  className="px-4 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
                  disabled={saving}
                >
                  <FaTimes />
                </button>
              </div>
            )}
          </div>

          {/* LEFT SIDE */}
          <div className="order-2 lg:order-1 lg:col-span-2 flex flex-col gap-6">
            {/* Personal Details Form */}
            <div className="bg-gradient-to-b from-[#0E083C] to-[#06031E] p-6 md:p-8 rounded-2xl shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Personal Details</h2>
                {!isEditing && (
                  <button 
                    onClick={toggleEdit}
                    className="flex items-center gap-2 bg-[#C60508] hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isMock}
                  >
                    <FaEdit className="text-sm" /> Edit
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1 font-medium">Full name *</label>
                  <input
                    value={isEditing ? editData.fullName : personalDetails?.fullName || ""}
                    onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                    readOnly={!isEditing}
                    className={`w-full bg-[#020109] p-3 rounded-md mt-1 border transition-all text-white focus:outline-none ${
                      isEditing 
                        ? "border-[#C60508] focus:border-red-400 focus:ring-2 focus:ring-[#C60508]" 
                        : "border-transparent bg-opacity-70"
                    } ${isMock ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!isEditing || isMock}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1 font-medium">Gender</label>
                  <select
                    value={isEditing ? editData.gender : personalDetails?.gender || ""}
                    onChange={(e) => setEditData({...editData, gender: e.target.value})}
                    disabled={!isEditing || isMock}
                    className={`w-full bg-[#020109] p-3 rounded-md mt-1 border transition-all text-white focus:outline-none ${
                      isEditing 
                        ? "border-[#C60508] focus:border-red-400 focus:ring-2 focus:ring-[#C60508]" 
                        : "border-transparent bg-opacity-70"
                    } ${isMock ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="None">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    value={isEditing ? editData.phoneNumber : personalDetails?.phoneNumber || ""}
                    onChange={(e) => setEditData({...editData, phoneNumber: e.target.value})}
                    readOnly={!isEditing}
                    className={`w-full bg-[#020109] p-3 rounded-md mt-1 border transition-all text-white focus:outline-none ${
                      isEditing 
                        ? "border-[#C60508] focus:border-red-400 focus:ring-2 focus:ring-[#C60508]" 
                        : "border-transparent bg-opacity-70"
                    } ${isMock ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!isEditing || isMock}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1 font-medium">Email</label>
                  <input
                    value={personalDetails?.email || ""}
                    readOnly
                    className="w-full bg-[#020109] p-3 rounded-md mt-1 border border-transparent bg-opacity-50 cursor-not-allowed text-blue-400"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1 font-medium">Profession</label>
                  <input
                    value={isEditing ? editData.profession : personalDetails?.profession || ""}
                    onChange={(e) => setEditData({...editData, profession: e.target.value})}
                    readOnly={!isEditing}
                    className={`w-full bg-[#020109] p-3 rounded-md mt-1 border transition-all text-white focus:outline-none ${
                      isEditing 
                        ? "border-[#C60508] focus:border-red-400 focus:ring-2 focus:ring-[#C60508]" 
                        : "border-transparent bg-opacity-70"
                    } ${isMock ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!isEditing || isMock}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1 font-medium">Age</label>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={isEditing ? editData.age : personalDetails?.age || ""}
                    onChange={(e) => setEditData({...editData, age: e.target.value})}
                    readOnly={!isEditing}
                    className={`w-full bg-[#020109] p-3 rounded-md mt-1 border transition-all text-white focus:outline-none ${
                      isEditing 
                        ? "border-[#C60508] focus:border-red-400 focus:ring-2 focus:ring-[#C60508]" 
                        : "border-transparent bg-opacity-70"
                    } ${isMock ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!isEditing || isMock}
                  />
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-gradient-to-b from-[#0E083C] to-[#06031E] p-6 md:p-8 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-white">Account Status</h3>

              <div className="flex items-center gap-4 mb-4">
                {/* Small initials avatar with dashboard styling */}
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">
                  {getInitials(personalDetails?.fullName)}
                </div>
                <div>
                  <p className="font-medium text-white">{personalDetails?.fullName || "User"}</p>
                  <p className="text-sm text-gray-400">
                    Referred by: {accountDetails?.profileInfo?.referredBy || "Unknown"}
                  </p>
                </div>
              </div>

              <p className="text-center font-medium mb-3 text-white">
                You are currently on Level {accountDetails?.profileInfo?.level || 1}
              </p>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 bg-white h-2 rounded-full">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        accountDetails?.profileInfo?.totalDay > 0
                          ? Math.min(
                              (accountDetails.profileInfo.day / accountDetails.profileInfo.totalDay) * 100,
                              100
                            )
                          : 0
                      }%`,
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-400 min-w-[40px]">
                  {accountDetails?.profileInfo?.totalDay > 0
                    ? Math.round(
                        (accountDetails.profileInfo.day / accountDetails.profileInfo.totalDay) * 100
                      )
                    : 0}
                  %
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-400">Videos watched</p>
                  <p className="font-bold text-lg mt-1 text-white">
                    {accountDetails?.dailyTaskInfo?.watchedVideos || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total Referrals</p>
                  <p className="font-bold text-lg mt-1 text-white">
                    {accountDetails?.dailyTaskInfo?.referralCount || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Accounts Subscribed</p>
                  <p className="font-bold text-lg mt-1 text-white">
                    {accountDetails?.dailyTaskInfo?.accountsSubscribed || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 🧪 Mock mode badge */}
        {process.env.NODE_ENV === "development" && (
          <div className="absolute top-4 right-4 z-50">
            <MockModeBadge />
          </div>
        )}
      </div>

      {/* Toaster component with dashboard styling */}
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
    </>
  );
};

export default Profile;