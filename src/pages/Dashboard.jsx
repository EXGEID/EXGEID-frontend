import { useEffect, useState } from "react";
import angel1 from "../assets/angel1.png";
import angel2 from "../assets/angel2.png";
import angel from "../assets/angel.png";
import badge from "../assets/icons/oi_badge.svg";
import copy from "../assets/icons/copy.svg";
import facebook from "../assets/icons/facebook2.svg";
import whatsapp from "../assets/icons/whatsapp.svg";
import instagram from "../assets/icons/instagram.svg";
import Xlogo from "../assets/icons/x-line.svg";
import snapchat from "../assets/icons/snapchat.svg";
import {
  FaWallet,
  FaSyncAlt,
  FaUsers,
  FaTasks,
  FaVideo,
} from "react-icons/fa";
import { PieChart, Pie, Cell } from "recharts";
import { Toaster, toast } from "react-hot-toast";

const COLORS = ["#C60508", "#C0D2D4"];

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  
  const DASHBOARD_API_URL = "https://exgeid-backend.onrender.com/api/v1/users/dashboard-info";
  const PROFILE_API_URL = "https://exgeid-backend.onrender.com/api/v1/users/get/profile-info";
  const REFRESH_TOKEN_URL = "https://exgeid-backend.onrender.com/api/v1/refresh/token";

  const defaultDashboardData = {
    userFullName: "User",
    userProfileData: {
      referredBy: "Unknown",
      level: 1,
      referralCode: undefined,
    },
    dailyTaskData: {
      tasksTrack: {
        completedTask: 0,
        totalTask: 0,
      },
      completedTasks: {
        watchedVideos: 0,
        accountsSubscribed: 0,
        referralCount: 0,
      },
      totalTasks: {
        totalVideos: 0,
        accountsToSubscribe: 0,
      },
    },
    userWalletData: {
      paidAmount: 0,
    },
  };

  const defaultProfileData = {
    accountDetails: {
      profileInfo: {
        day: 0,
        totalDay: 0,
        level: 1,
      },
    },
  };

  // === Toast Functions (Same as Topbar) ===
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

  // Generate initials from full name
  const getInitials = (fullName) => {
    if (!fullName) return "U";
    const names = fullName.trim().split(" ");
    const initials = names.map(name => name[0].toUpperCase()).join("");
    return initials.length > 2 ? initials.substring(0, 2) : initials;
  };

  // Copy referral code to clipboard
  const copyReferralCode = async (code) => {
    if (code === "No referral code") {
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      const accessToken = sessionStorage.getItem("accessToken");

      if (!accessToken) {
        showErrorToast("Authentication required. Please log in.");
        setDashboardData(defaultDashboardData);
        setProfileData(defaultProfileData);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(DASHBOARD_API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Dashboard request failed: ${res.status} - ${errorText}`);
        }

        const response = await res.json();
        const data = response.data || response;
        setDashboardData(data);

        // Fetch profile after dashboard success
        const profRes = await fetch(PROFILE_API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!profRes.ok) {
          const profErrorText = await profRes.text();
          throw new Error(`Profile request failed: ${profRes.status} - ${profErrorText}`);
        }

        const profResponse = await profRes.json();
        const prof = profResponse.data || profResponse;
        setProfileData(prof);

        // Success: All data loaded
        showSuccessToast("Dashboard loaded successfully!");

      } catch (err) {
        console.error("Fetch error:", err);
        
        // Attempt to refresh token
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
          
          if (newAccessToken) {
            sessionStorage.setItem("accessToken", newAccessToken);
            showSuccessToast("Session refreshed! Reloading data...");

            // Retry dashboard fetch
            const retryRes = await fetch(DASHBOARD_API_URL, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
                "Content-Type": "application/json",
              },
            });

            if (!retryRes.ok) {
              throw new Error(`Retry dashboard failed: ${retryRes.status}`);
            }

            const retryResponse = await retryRes.json();
            const retryData = retryResponse.data || retryResponse;
            setDashboardData(retryData);

            // Retry profile fetch
            const retryProfRes = await fetch(PROFILE_API_URL, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
                "Content-Type": "application/json",
              },
            });

            if (!retryProfRes.ok) {
              throw new Error(`Retry profile failed: ${retryProfRes.status}`);
            }

            const retryProfResponse = await retryProfRes.json();
            const retryProf = retryProfResponse.data || retryProfResponse;
            setProfileData(retryProf);

            showSuccessToast("Data reloaded successfully!");

          } else {
            throw new Error("No new access token received");
          }
        } catch (refreshErr) {
          showErrorToast("Backend unavailable. Using default data.");
          setError("Backend temporarily unavailable. Using default data.");
          setDashboardData(defaultDashboardData);
          setProfileData(defaultProfileData);
        }
      } finally {
        setLoading(false);
      }
    };

    setTimeout(() => fetchData(), 5000);
  }, []);

  // Calculate progress data for pie chart
  const getPieChartData = () => {
    if (!dashboardData) {
      return [
        { name: "Completed", value: 0 },
        { name: "Not Completed", value: 100 },
      ];
    }

    const completedTasks = dashboardData.dailyTaskData?.tasksTrack?.completedTask || 0;
    const totalTasks = dashboardData.dailyTaskData?.tasksTrack?.totalTask || 1;
    const total = totalTasks || 100;
    const completedPercentage = totalTasks > 0 ? (completedTasks / total) * 100 : 0;
  
    return [
      { name: "Completed", value: Math.min(completedPercentage, 100) },
      { name: "Not Completed", value: 100 - Math.min(completedPercentage, 100) },
    ];
  };

  const totalTasksCount = dashboardData?.dailyTaskData?.tasksTrack?.totalTask || 0;
  const completedTasksCount = dashboardData?.dailyTaskData?.tasksTrack?.completedTask || 0;

  const pieData = getPieChartData();

  if (loading) {
    return (
      <div className="bg-[#020109] min-h-screen flex items-center justify-center">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  const dataSource = dashboardData || defaultDashboardData;

  return (
    <>
      {/* Toaster (Same as Topbar) */}
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

      <div className="bg-[#020109] min-h-screen">
        <div className="md:p-6 space-y-8 text-[#CACACA]">
          {/* Greeting */}
          <div>
            <h1 className="text-[22px] md:text-[28px] lg:text-[32px] text-white font-regular flex items-center gap-2">
              <img src={angel} alt="angel_top" className="w-20 h-20" />
              Hi {dataSource.userFullName || "User"}!! 
            </h1>
          </div>

          {/* ---------- SECTION 1: Profile + Earnings ---------- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Profile Card */}
            <div className="relative bg-gradient-to-br from-[#0E083C] to-[#06031E] rounded-2xl md:p-15 p-8 overflow-y-auto">
              <div className="relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-200 to-red-300 flex items-center justify-center font-bold text-[#ef4444] font-bold text-lg">
                    {getInitials(dataSource.userFullName)}
                  </div>
                  <div>
                    <p className="text-[13px] lg:text-[17.5px] font-semibold">
                      {dataSource.userFullName || "User"}
                    </p>
                    <p className="text-[12px] lg:text-[15px] font-medium mt-1">
                      Referred by: {dataSource.userProfileData?.referredBy || "Unknown"}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mt-2 gap-2">
                    <div className="w-full bg-white md:h-3 h-2 rounded-full">
                      <div
                        className="md:h-3 h-2 rounded-full bg-red-600 transition-all duration-300"
                        style={{
                          width: `${profileData?.accountDetails?.profileInfo?.totalDay > 0 
                            ? Math.min(
                                (profileData.accountDetails.profileInfo.day / 
                                profileData.accountDetails.profileInfo.totalDay) * 100,
                                100
                              )
                            : 0
                            }%`,
                        }}
                      />
                    </div>
                    <div className="text-[11px] lg:text-[15px] text-[#9EA2AD]">
                      {profileData?.accountDetails?.profileInfo?.totalDay > 0 
                        ? Math.round(
                          (profileData.accountDetails.profileInfo.day / 
                          profileData.accountDetails.profileInfo.totalDay) * 100
                        )
                        : 0   
                      }%
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 text-[11px] lg:text-[15px] text-gray-400">
                    <div className="flex items-center gap-1">
                      <span>Level 1</span>
                      <img src={badge} className="w-4 h-4 rounded-sm" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Level 2</span>
                      <img src={badge} className="w-4 h-4 rounded-sm" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-[14px] lg:text-[17.5px] font-medium">
                    You are currently on Level {profileData?.accountDetails?.profileInfo?.level || 1} with {profileData?.accountDetails?.profileInfo?.day || 0} points
                  </p>
                </div>

                {/* Tasks */}
                <div className="mt-8 space-y-6 text-[12px] lg:text-[14px] font-medium">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      readOnly
                      checked={dataSource.dailyTaskData?.completedTasks?.watchedVideos >= 5}
                      className="w-4 h-4 accent-red-900 rounded-lg"
                    />
                    <span className="">Watch videos ({dataSource.dailyTaskData?.completedTasks?.watchedVideos || 0}/{dataSource.dailyTaskData?.totalTasks?.totalVideos || 0})</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      readOnly
                      checked={dataSource.dailyTaskData?.completedTasks?.accountsSubscribed >= 2}
                      className="w-4 h-4 accent-red-900 rounded-lg"
                    />
                    <span className="">Subscribe &amp; Like ({dataSource.dailyTaskData?.completedTasks?.accountsSubscribed || 0}/{dataSource.dailyTaskData?.totalTasks?.accountsToSubscribe || 0})</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      readOnly
                      className="w-4 h-4 accent-red-900 rounded-lg"
                    />
                    <span className="">Follow social links</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Earnings Card */}
            <div className="relative bg-gradient-to-br from-[#0E083C] to-[#06031E] rounded-2xl md:p-15 p-8 overflow-y-auto">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <img src={angel1} alt="angel" className="max-w-[60%] object-contain" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[12px] md:text-[15px] font-semibold">Total Earnings</h3>
                    <p className="text-[15px] md:text-[19px] font-bold text-yellow-400">
                      ₦{(dataSource.userWalletData?.paidAmount || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
                    <FaWallet className="text-white text-xl" />
                  </div>
                </div>
                <div className="border-t border-gray-700 my-4" />
                <div className="grid grid-cols-2 gap-10 text-[12px] md:text-[15px] text-gray-300">
                  <div className="flex items-center justify-start gap-4">
                    <div className="min-w-[120px]">
                      <div className="font-bold text-[#CACACA] mt-2">Recent Earnings</div>
                      <div className="font-semibold text-[#B5B5B5] mt-2">
                        ₦{(dataSource.userWalletData?.paidAmount || 0).toLocaleString()}
                      </div>
                    </div>
                    <FaSyncAlt className="text-white text-lg" />
                  </div>
                  <div className="flex items-center justify-start gap-4">
                    <div className="min-w-[120px]">
                      <div className="font-bold text-[#CACACA] mt-2">Referrals</div>
                      <div className="font-semibold text-[#B5B5B5] mt-2">
                        {dataSource.dailyTaskData?.completedTasks?.referralCount || 0}
                      </div>
                    </div>
                    <FaUsers className="text-white text-lg" />
                  </div>
                  <div className="flex items-center justify-start gap-4">
                    <div className="min-w-[120px]">
                      <div className="font-bold text-[#CACACA] mt-2">Total Tasks</div>
                      <div className="font-semibold text-[#B5B5B5] mt-2">
                        {completedTasksCount}/{totalTasksCount} tasks
                      </div>
                    </div>
                    <FaTasks className="text-white text-lg" />
                  </div>
                  <div className="flex items-center justify-start gap-4">
                    <div className="min-w-[120px]">
                      <div className="font-bold text-[#CACACA] mt-2">Total Videos</div>
                      <div className="font-semibold text-[#B5B5B5] mt-2">
                        {dataSource.dailyTaskData?.completedTasks?.watchedVideos || 0} videos
                      </div>
                    </div>
                    <FaVideo className="text-white text-lg" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------- SECTION 2: Level Progress + Activity/Checkin ---------- */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 text-[#CACACA]">
            {/* Level Progress */}
            <div className="relative bg-gradient-to-br from-[#0E083C] to-[#06031E] rounded-2xl md:p-15 p-8 overflow-y-auto">
              <div className="relative z-10">
                <div className="flex">
                  <div className="flex justify-between items-center text-[14px] lg:text-[17.5px] font-semibold w-full">
                    <h3 className="">Level {profileData?.accountDetails?.profileInfo?.level || 1} - In Progress</h3>
                    <div className="flex gap-2 items-center">
                      <span>Day {profileData?.accountDetails?.profileInfo?.day || 0}/{profileData?.accountDetails?.profileInfo?.totalDay || 0}</span>
                      <div className="w-5 h-5 rounded flex items-center justify-center">⏳</div>
                    </div>
                  </div>
                </div>
                <p className="text-[12px] lg:text-[14px] font-medium mt-3">
                  Complete all tasks within {profileData?.accountDetails?.profileInfo?.totalDay || 0} days to unlock your bonus!
                </p>
                <div className="mt-6 space-y-6 text-[12px] lg:text-[14px] font-medium">
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={dataSource.dailyTaskData?.completedTasks?.watchedVideos >= 5} 
                      readOnly 
                      className="w-4 h-4 accent-red-900" 
                    />
                    <span className="">Watch videos</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={dataSource.dailyTaskData?.completedTasks?.accountsSubscribed >= 2} 
                      readOnly 
                      className="w-4 h-4 accent-red-900" 
                    />
                    <span className="">Subscribe &amp; Like</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" readOnly className="w-4 h-4 accent-red-900" />
                    <span className="">Follow social links</span>
                  </label>
                </div>
                <div className="mt-6 flex justify-end">
                  <button className="bg-[#8F0406] text-white md:text-[14px] text-[12px] px-5 py-2 rounded-lg">
                    Continue
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Activity + Daily Check-in */}
            <div className="space-y-6">
              {/* Activity */}
              <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] rounded-2xl md:p-13 p-8 overflow-y-auto md:h-60">
                <div className="relative grid grid-cols-2 gap-8 z-10 flex h-full">
                  <div className="flex-1 flex flex-col items-center justify-center relative">
                    <PieChart width={120} height={120}>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={55}
                        dataKey="value"
                        cornerRadius={10}
                        stroke="none"
                        className="md:scale-[100%] scale-[80%] origin-bottom"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <text
                        x="50%"
                        y="65%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="md:hidden block fill-white font-bold text-sm"
                      >
                        {totalTasksCount}
                      </text>
                      <text
                        x="50%"
                        y="75%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="md:hidden block fill-white text-xs"
                      >
                        tasks
                      </text>
                      <text
                        x="50%"
                        y="45%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="hidden md:block fill-white font-bold text-sm"
                      >
                        {totalTasksCount}
                      </text>
                      <text
                        x="50%"
                        y="55%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="hidden md:block fill-white text-xs"
                      >
                        tasks
                      </text>
                    </PieChart>
                    <div className="flex md:gap-4 gap-2 md:mt-2 mt-4 text-[10px] md:text-[12px] font-semibold">
                      <div className="flex items-center gap-1">
                        <span className="md:w-3 md:h-3 h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[0] }}></span>
                        <span>Completed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="md:w-3 md:h-3 h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[1] }}></span>
                        <span>Not Completed</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="lg:text-[16px] text-[12px] font-semibold mb-3">Recent Activity</h4>
                    <ul className="space-y-2 md:text-[12px] text-[10px] list-disc list-outside marker:text-red-500">
                      <li>+{dataSource.dailyTaskData?.completedTasks?.watchedVideos || 0} videos watched</li>
                      <li>{dataSource.dailyTaskData?.completedTasks?.referralCount || 0} new referrals</li>
                      <li>{dataSource.dailyTaskData?.completedTasks?.accountsSubscribed || 0} accounts subscribed</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Daily Check-in */}
              <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] rounded-2xl md:p-13 p-8">
                <div className="flex items-center justify-between h-25">
                  <div>
                    <div className="text-[12px] md:text-[16px] font-semibold">Days Streak</div>
                    <div className="text-[15px] md:text-[19px] font-semibold text-yellow-400">{profileData?.accountDetails?.profileInfo?.day || 0} days 🔥</div>
                  </div>
                </div>
                <div className="items-center h-15">
                  <div className="text-[12px] md:text-[16px]">
                    You've checked in for {profileData?.accountDetails?.profileInfo?.day || 0} days straight!
                  </div>
                  <div className="text-[12px] md:text-[16px]">Keep your streak going and keep earning!!!</div>
                </div>
              </div>
            </div>
          </div>

          {/* ---------- SECTION 3: Referrals + Subscribers ---------- */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
            {/* Referrals */}
            <div className="relative bg-gradient-to-br from-[#0E083C] to-[#06031E] rounded-2xl md:p-15 p-8 overflow-y-auto">
              <div className="relative z-10">
                <h3 className="text-[14px] md:text-[24px] font-semibold mb-3">Referral Section</h3>
                <p className="text-[10px] md:text-[14px] mb-4">
                  <span className="text-yellow-400">
                    Invite more people to unlock your bonus!!!
                  </span>
                </p>
                <div className="flex items-center gap-3">
                  <p className="text-[10px] md:text-[14px]">Your Referral Code: </p>
                  <div className="relative flex items-center gap-3 bg-[#343434] p-2 rounded w-[60%] md:w-[70%]">
                    <input 
                      type="text" 
                      className="bg-transparent text-[8px] mt-1 text-yellow-500 md:text-[12px]" 
                      value={dataSource.userProfileData?.referralCode || "No referral code"} 
                      readOnly 
                    />
                    <button 
                      onClick={() => copyReferralCode(dataSource.userProfileData?.referralCode || "No referral code")}
                      className="hover:scale-110 transition-transform absolute top-2 right-2 md:right-4 md:top-3"
                      title="Copy referral code"
                    >
                      <img src={copy} alt="Copy" />
                    </button>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-5 md:gap-4 items-center justify-center">
                  <img src={facebook} className="scale-[160%] md:scale-[110%]" />
                  <img src={whatsapp} className="scale-[80%] md:scale-[100%] mb-4"/>
                  <img src={instagram} className="scale-[160%] md:scale-[110%] ml-[-10px] md:ml-[-30px]" />
                  <img src={Xlogo} className="scale-[80%] md:scale-[100%] mb-4 ml-[-5px]" />
                  <img src={snapchat} className="scale-[80%] md:scale-[100%] mb-4" />
                </div>
                <ol className="mt-6 list-decimal list-inside text-[10px] md:text-[14px] text-white space-y-5">
                  <li>Share your referral link with friends and family on any of these platforms</li>
                  <li>Receive ₦500 each time someone clicks your link</li>
                  <li>Earn ₦1500 bonus when someone creates an account through your link</li>
                  <li>New Users get ₦10,000 Naira Sign-Up Bonus</li>
                </ol>
              </div>
            </div>

            {/* Subscribers */}
            <div className="relative bg-gradient-to-br from-[#0E083C] to-[#06031E] rounded-2xl md:p-15 p-8 overflow-y-auto">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <img src={angel2} alt="angel" className="max-w-xs object-contain" />
              </div>
              <div className="relative z-10">
                <h3 className="text-[14px] md:text-[24px] text-[#CACACA] font-semibold">New Subscribers</h3>
                <ul className="space-y-8 mt-8">
                  {[
                    { name: "John Doe", amount: "₦12,000.00", initials: "JD" },
                    { name: "Jane Smith", amount: "₦12,000.00", initials: "JS" },
                    { name: "Mike Johnson", amount: "₦12,000.00", initials: "MJ" },
                    { name: "Sarah Wilson", amount: "₦12,000.00", initials: "SW" },
                  ].map((t, idx) => (
                    <li key={idx} className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-200 to-red-300 flex items-center justify-center font-bold text-[#ef4444] font-bold text-sm overflow-hidden">
                          {t.initials}
                        </div>
                        <span className="font-medium text-[12px] md:text-[14px]">{t.name}</span>
                      </div>
                      <div className="text-yellow-400 font-semibold text-[12px] md:text-[14px]">
                        {t.amount}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;