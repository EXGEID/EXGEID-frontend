import { useState, useEffect } from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import angelVid from "../assets/angelVid.png";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // API Endpoints
  const PROFILE_API_URL = "https://exgeid-backend.onrender.com/api/v1/users/get/profile-info";
  const EDIT_PROFILE_API_URL = "https://exgeid-backend.onrender.com/api/v1/users/edit/profile-info";
  const LOGOUT_API_URL = "https://exgeid-backend.onrender.com/api/v1/auth/logout";
  const REFRESH_TOKEN_URL = "https://exgeid-backend.onrender.com/api/v1/refresh/token";

  const defaultProfile = {
    personalDetails: {
      fullName: "User",
      gender: "",
      phoneNumber: "",
      profession: "",
      age: "",
      email: "N/A",
    },
    accountDetails: {
      profileInfo: {
        level: 1,
        referredBy: "Unknown",
        day: 0,
        totalDay: 0,
      },
      dailyTaskInfo: {
        watchedVideos: 0,
        referralCount: 0,
        accountsSubscribed: 0,
      },
    },
  };

  // Generate initials from full name
  const getInitials = (fullName) => {
    if (!fullName) return "U";
    const names = fullName.trim().split(" ");
    const initials = names.map(name => name[0].toUpperCase()).join("");
    return initials.length > 2 ? initials.substring(0, 2) : initials;
  };

  // Toast utility functions
  const showSuccessToast = (message) => {
    toast.success(message, {
      id: `success-${Date.now()}`,
      duration: 3000,
      position: "top-center",
      style: {
        background: "#09052C",
        color: "#CACACA",
        border: "1px solid #FEC84D",
        borderRadius: "8px",
        fontSize: "14px",
        padding: "12px 16px",
        boxShadow: "0 4px 12px rgba(198, 5, 8, 0.15)",
        zIndex: 9999,
      },
      iconTheme: {
        primary: "#FEC84D",
        secondary: "#09052C",
      },
    });
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      id: `error-${Date.now()}`,
      duration: 5000,
      position: "top-center",
      style: {
        background: "#0E083C",
        color: "#CACACA",
        border: "1px solid #C60508",
        borderRadius: "8px",
        fontSize: "14px",
        padding: "12px 16px",
        boxShadow: "0 4px 12px rgba(198, 5, 8, 0.15)",
        zIndex: 9999,
      },
      iconTheme: {
        primary: "#C60508",
        secondary: "#CACACA",
      },
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
        if (res.status === 401) {
          return await refreshAndRetry(url, options);
        }
        const errorText = await res.text();
        throw new Error(`API request failed: ${res.status} - ${errorText}`);
      }

      return await res.json();
    } catch (err) {
      throw err;
    }
  };

  const refreshAndRetry = async (url, options) => {
    try {
      const refreshRes = await fetch(REFRESH_TOKEN_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!refreshRes.ok) {
        throw new Error(`Token refresh failed: ${refreshRes.status}`);
      }

      const refreshResponse = await refreshRes.json();
      const newAccessToken = refreshResponse.data?.accessToken || refreshResponse.accessToken;
      
      if (!newAccessToken) {
        throw new Error("No new access token received");
      }

      sessionStorage.setItem("accessToken", newAccessToken);

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
      throw refreshErr;
    }
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      
      const accessToken = sessionStorage.getItem("accessToken");
      
      if (!accessToken) {
        setProfile(defaultProfile);
        setLoading(false);
        showErrorToast("No authentication token. Using default data.");
        return;
      }

      try {
        const response = await apiFetchWithRefresh(PROFILE_API_URL, { method: "GET" });
        const data = response.data || response;
        setProfile(data);

        // Convert age to number when initializing editData
        setEditData({
          fullName: data.personalDetails?.fullName || "",
          gender: data.personalDetails?.gender || "",
          phoneNumber: data.personalDetails?.phoneNumber || "",
          profession: data.personalDetails?.profession || "",
          age: data.personalDetails?.age ? parseInt(data.personalDetails.age, 10) : "",
        });
        showSuccessToast("Profile loaded successfully!");
      } catch (err) {
        setProfile(defaultProfile);
        showErrorToast("Failed to load profile. Using default data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle edit toggle
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditData({
        fullName: profile.personalDetails?.fullName || "",
        gender: profile.personalDetails?.gender || "",
        phoneNumber: profile.personalDetails?.phoneNumber || "",
        profession: profile.personalDetails?.profession || "",
        age: profile.personalDetails?.age ? parseInt(profile.personalDetails.age, 10) : "",
      });
    }
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    const accessToken = sessionStorage.getItem("accessToken");
    
    if (!editData.fullName?.trim()) {
      showErrorToast("Full name is required");
      return;
    }
    
    const ageNum = parseInt(editData.age, 10);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      showErrorToast("Age must be a number between 18 and 100");
      return;
    }
    
    setSaving(true);
    
    // Payload with age as number
    const payload = {
      fullName: editData.fullName,
      gender: editData.gender,
      phoneNumber: editData.phoneNumber,
      profession: editData.profession,
      age: ageNum, // ← Critical: number, not string
    };

    try {
      await apiFetchWithRefresh(EDIT_PROFILE_API_URL, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Update profile state
      setProfile({
        ...profile,
        personalDetails: {
          ...profile.personalDetails,
          fullName: editData.fullName,
          gender: editData.gender,
          phoneNumber: editData.phoneNumber,
          profession: editData.profession,
          age: ageNum,
        },
      });
      
      setIsEditing(false);
      showSuccessToast("Profile updated successfully!");
    } catch (err) {
      console.log(err.message);
      showErrorToast("Failed to update profile");
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
        }
      }

      localStorage.clear();
      sessionStorage.clear();
      
      showSuccessToast("Logged out successfully");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      showErrorToast("Logout failed. Clearing session anyway.");
      localStorage.clear();
      sessionStorage.clear();
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-[#020109] flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">Loading profile...</div>
      </div>
    );
  }

  const dataSource = profile || defaultProfile;
  const { personalDetails, accountDetails } = dataSource;

  return (
    <>
      <div className="flex-1 bg-[#020109] text-[#CACACA] min-h-screen relative">
        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <img src={angelVid} alt="angel_top" className="w-20 h-20" />
          <h1 className="text-2xl md:text-[28px] font-semibold text-white">Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* RIGHT SIDE - Profile Card */}
          <div className="order-1 lg:order-2 bg-gradient-to-b from-[#0E083C] to-[#06031E] p-6 md:p-8 rounded-2xl shadow-lg flex flex-col items-center text-center">
            <div className="md:w-64 md:h-64 w-32 h-32 rounded-full bg-gradient-to-br from-red-200 to-red-300 flex items-center justify-center text-[#ef4444] font-bold md:text-6xl text-3xl shadow-lg">
              {getInitials(personalDetails?.fullName)}
            </div>

            <h2 className="text-xl font-semibold mt-4 text-white">
              {personalDetails?.fullName || "User"}
            </h2>
            <span className="inline-flex items-center justify-center gap-2 text-yellow-500 bg-yellow-500/20 px-4 py-2 rounded-full text-sm font-medium m-2">
              Level {accountDetails?.profileInfo?.level || 1} - Earner
            </span>
            <p className="text-gray-400 text-sm">
              @{personalDetails?.fullName?.split(" ")[0]?.toLowerCase() || "user"}
            </p>

            <button 
              onClick={handleLogout} 
              className="mt-6 bg-[#8F0406] hover:bg-red-700 w-full max-w-md mx-auto py-3 rounded-lg font-medium transition-colors text-white"
            >
              Log out
            </button>

            {/* Personal Information Summary */}
            <div className="bg-[#020109] p-4 rounded-xl text-left w-full mt-2">
              <h4 className="font-semibold mb-2 border-b border-gray-700 pb-2 text-center text-white">
                Personal Information
              </h4>
              <div className="space-y-2 text-left">
                <p className="font-medium text-white">{personalDetails?.fullName || "N/A"}</p>
                <p className="text-[#CACACA]">{personalDetails?.gender || "N/A"}</p>
                <p className="text-[#CACACA]">{personalDetails?.phoneNumber || "N/A"}</p>
                <p className="text-blue-400">{personalDetails?.email || "N/A"}</p>
                <p className="text-[#CACACA]">{personalDetails?.profession || "N/A"}</p>
                <p className="text-[#CACACA]">{personalDetails?.age || "N/A"} years</p>
              </div>
            </div>
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
                    className="flex items-center gap-2 bg-[#8F0406] hover:bg-red-700 hover:scale-110 text-white px-4 py-2 rounded-lg transition-colors"
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
                    disabled={!isEditing}
                    className={`w-full bg-[#020109] p-3 rounded-md mt-1 border transition-all text-white focus:outline-none ${
                      isEditing 
                        ? "border-[#C60508] focus:border-red-400 focus:ring-2 focus:ring-[#C60508]" 
                        : "border-transparent bg-opacity-70"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1 font-medium">Gender</label>
                  <select
                    value={isEditing ? editData.gender : personalDetails?.gender || ""}
                    onChange={(e) => setEditData({...editData, gender: e.target.value})}
                    disabled={!isEditing}
                    className={`w-full bg-[#020109] p-3 rounded-md mt-1 border transition-all text-white focus:outline-none ${
                      isEditing 
                        ? "border-[#C60508] focus:border-red-400 focus:ring-2 focus:ring-[#C60508]" 
                        : "border-transparent bg-opacity-70"
                    }`}
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
                    disabled={!isEditing}
                    className={`w-full bg-[#020109] p-3 rounded-md mt-1 border transition-all text-white focus:outline-none ${
                      isEditing 
                        ? "border-[#C60508] focus:border-red-400 focus:ring-2 focus:ring-[#C60508]" 
                        : "border-transparent bg-opacity-70"
                    }`}
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
                    disabled={!isEditing}
                    className={`w-full bg-[#020109] p-3 rounded-md mt-1 border transition-all text-white focus:outline-none ${
                      isEditing 
                        ? "border-[#C60508] focus:border-red-400 focus:ring-2 focus:ring-[#C60508]" 
                        : "border-transparent bg-opacity-70"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1 font-medium">Age</label>
                  <input
                    type="number"
                    min="18"
                    max="100"
                    value={isEditing ? (editData.age || "") : (personalDetails?.age || "")}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow digits or empty
                      if (value === "" || /^\d+$/.test(value)) {
                        setEditData({ ...editData, age: value === "" ? "" : parseInt(value, 10) });
                      }
                    }}
                    readOnly={!isEditing}
                    disabled={!isEditing}
                    className={`w-full bg-[#020109] p-3 rounded-md mt-1 border transition-all text-white focus:outline-none ${
                      isEditing 
                        ? "border-[#C60508] focus:border-red-400 focus:ring-2 focus:ring-[#C60508]" 
                        : "border-transparent bg-opacity-70"
                    }`}
                  />
                </div>
              </div>

              {/* Save/Cancel buttons */}
              {isEditing && (
                <div className="mt-6 flex gap-2">
                  <button 
                    onClick={handleSaveProfile} 
                    disabled={saving}
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
                        age: profile.personalDetails?.age ? parseInt(profile.personalDetails.age, 10) : "",
                      });
                    }}
                    className="px-4 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition-colors"
                    disabled={saving}
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>

            {/* Account Status */}
            <div className="bg-gradient-to-b from-[#0E083C] to-[#06031E] p-6 md:p-8 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4 text-white">Account Status</h3>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-200 to-red-300 flex items-center justify-center text-[#ef4444] font-bold text-sm">
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
                    : 0
                  }%
                </span>
              </div>

              <div className="grid md:grid-cols-4 grid-cols-2 gap-4 text-center">
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
                <div>
                  <p className="text-sm text-gray-400">Number of Points Gained</p>
                  <p className="font-bold text-lg mt-1 text-white">
                    {accountDetails?.dailyTaskInfo?.accountsSubscribed + accountDetails?.dailyTaskInfo?.referralCount + accountDetails?.dailyTaskInfo?.watchedVideos || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toaster 
        position="top-center"
        containerStyle={{
          top: 20,
          zIndex: 9999,
        }}
        toastOptions={{
          duration: 5000,
          style: {
            background: "#09052C",
            color: "#CACACA",
            borderRadius: "8px",
            padding: "12px 16px",
            fontSize: "14px",
            boxShadow: "0 4px 12px rgba(198, 5, 8, 0.15)",
          },
          success: {
            style: {
              background: "#09052C",
              color: "#CACACA",
              border: "1px solid #FEC84D",
            },
            iconTheme: {
              primary: "#FEC84D",
              secondary: "#09052C",
            },
          },
          error: {
            style: {
              background: "#0E083C",
              color: "#CACACA",
              border: "1px solid #C60508",
            },
            iconTheme: {
              primary: "#C60508",
              secondary: "#CACACA",
            },
          },
        }}
      />
    </>
  );
};

export default Profile;