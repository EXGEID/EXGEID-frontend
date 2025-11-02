import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // New states for subscribers
  const [subscribers, setSubscribers] = useState([]);
  const [subscribersLoading, setSubscribersLoading] = useState(true);
  const [subscribersError, setSubscribersError] = useState(null);

  const DASHBOARD_API_URL = "https://exgeid-backend.onrender.com/api/v1/users/dashboard-info";
  const REFRESH_TOKEN_URL = "https://exgeid-backend.onrender.com/api/v1/refresh/token";
  const NEW_SUBSCRIBERS_API_URL = "https://exgeid-backend.onrender.com/api/v1/users/new-subscribers"; // New endpoint

  // === Toast Functions ===
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

  // === Fetch Subscribers with Retry Logic ===
  const fetchSubscribers = async (accessToken) => {
    setSubscribersLoading(true);
    setSubscribersError(null);

    try {
      const res = await fetch(NEW_SUBSCRIBERS_API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Subscribers request failed: ${res.status} - ${errorText}`);
      }

      const response = await res.json();
      const data = response.data || response;

      // Ensure data is array and has correct shape
      if (Array.isArray(data)) {
        setSubscribers(data);
      } else {
        setSubscribers([]);
        console.warn("Subscribers data is not an array:", data);
      }

    } catch (err) {
      console.error("Subscribers fetch error:", err);

      // Attempt token refresh
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

          // Retry with new token
          const retryRes = await fetch(NEW_SUBSCRIBERS_API_URL, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              "Content-Type": "application/json",
            },
          });

          if (!retryRes.ok) {
            throw new Error(`Retry subscribers failed: ${retryRes.status}`);
          }

          const retryResponse = await retryRes.json();
          const retryData = retryResponse.data || retryResponse;

          if (Array.isArray(retryData)) {
            setSubscribers(retryData);
          } else {
            setSubscribers([]);
          }

          showSuccessToast("Subscribers reloaded after session refresh.");
        } else {
          throw new Error("No new access token");
        }
      } catch (refreshErr) {
        setSubscribersError("Failed to load new subscribers.");
        showErrorToast("Could not load subscribers. Please try again later.");
        setSubscribers([]);
      }
    } finally {
      setSubscribersLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      const accessToken = sessionStorage.getItem("accessToken");

      if (!accessToken) {
        showErrorToast("Authentication required. Please log in.");
        setError("Please login to view dashboard.");
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

        // Now fetch subscribers
        await fetchSubscribers(accessToken);

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

            // Retry subscribers
            await fetchSubscribers(newAccessToken);

            showSuccessToast("Data reloaded successfully!");

          } else {
            throw new Error("No new access token received");
          }
        } catch (refreshErr) {
          setError("Failed to load dashboard. Please try again later.");
          showErrorToast("Could not load dashboard. Please try again.");
          setDashboardData(null);
          setSubscribersLoading(false);
          setSubscribers([]);
          setSubscribersError("Failed to load subscribers.");
        }
      } finally {
        setLoading(false);
      }
    };

    setTimeout(() => fetchData(), 2000);
  }, []);

  // Calculate progress data for pie chart
  const getPieChartData = () => {
    if (!dashboardData) {
      return [
        { name: "Completed", value: 0 },
        { name: "Not Completed", value: 100 },
      ];
    }

    const completedTasks = dashboardData.dailyTaskData?.tasksTrack?.completedTask;
    const totalTasks = dashboardData.dailyTaskData?.tasksTrack?.totalTask;
    const total = totalTasks;
    const completedPercentage = totalTasks > 0 ? (completedTasks / total) * 100 : 0;
  
    return [
      { name: "Completed", value: Math.min(completedPercentage, 100) },
      { name: "Not Completed", value: 100 - Math.min(completedPercentage, 100) },
    ];
  };

  const totalTasksCount = dashboardData?.dailyTaskData?.tasksTrack?.totalTask;
  const completedTasksCount = dashboardData?.dailyTaskData?.tasksTrack?.completedTask;

  const pieData = getPieChartData();

  if (loading) {
    return (
      <>
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
            {/* Greeting Skeleton */}
            <div className="h-12 bg-gradient-to-r from-[#0E083C] to-[#06031E] rounded-lg animate-pulse"></div>

            {/* Section 1 Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] rounded-2xl p-8 space-y-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-700 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-32"></div>
                    <div className="h-3 bg-gray-700 rounded w-40"></div>
                  </div>
                </div>
                <div className="h-3 bg-gray-700 rounded w-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-24"></div>
                  <div className="h-4 bg-gray-700 rounded w-20"></div>
                  <div className="h-4 bg-gray-700 rounded w-28"></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] rounded-2xl p-8 animate-pulse">
                <div className="h-8 bg-gray-700 rounded w-32 mb-4"></div>
                <div className="h-6 bg-gray-700 rounded w-24"></div>
                <div className="border-t border-gray-700 my-4"></div>
                <div className="grid grid-cols-2 gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-20"></div>
                      <div className="h-4 bg-gray-700 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 2 Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
              <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] rounded-2xl p-8 space-y-6 animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-40"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-5 bg-gray-700 rounded w-32"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] rounded-2xl p-8 h-60 animate-pulse">
                  <div className="grid grid-cols-2 gap-8 h-full">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-32 h-32 bg-gray-700 rounded-full"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-700 rounded w-24"></div>
                      <div className="h-4 bg-gray-700 rounded w-32"></div>
                      <div className="h-4 bg-gray-700 rounded w-28"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] rounded-2xl p-8 animate-pulse">
                  <div className="h-6 bg-gray-700 rounded w-32 mb-2"></div>
                  <div className="h-5 bg-gray-700 rounded w-20"></div>
                </div>
              </div>
            </div>

            {/* Section 3 Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
              <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] rounded-2xl p-8 space-y-6 animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-40"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-10 bg-gray-700 rounded w-48"></div>
                <div className="grid grid-cols-5 gap-4">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-12 h-12 bg-gray-700 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] rounded-2xl p-8 animate-pulse">
                <div className="h-6 bg-gray-700 rounded w-32 mb-4"></div>
                <div className="space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                        <div className="h-4 bg-gray-700 rounded w-24"></div>
                      </div>
                      <div className="h-4 bg-gray-700 rounded w-16"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
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
        <div className="bg-[#020109] min-h-screen flex items-center justify-center p-6">
          <div className="bg-gradient-to-r from-[#06031E] to-[#0E083C] rounded-xl p-8 text-center max-w-md">
            <p className="text-red-500 font-medium">{error || "No dashboard data available."}</p>
          </div>
        </div>
      </>
    );
  }

  const dataSource = dashboardData;

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
              Hi {dataSource.userFullName}!! 
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
                      {dataSource.userFullName}
                    </p>
                    <p className="text-[12px] lg:text-[15px] font-medium mt-1">
                      Referred by: {dataSource.userProfileData?.referredBy || "None"}
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
                          width: `${dataSource?.userProfileData?.totalDay > 0 
                            ? Math.min(
                                (dataSource?.userProfileData?.day / 
                                dataSource?.userProfileData?.totalDay) * 100,
                                100
                              )
                            : 0
                            }%`,
                        }}
                      />
                    </div>
                    <div className="text-[11px] lg:text-[15px] text-[#9EA2AD]">
                      {dataSource?.userProfileData?.totalDay > 0 
                        ? Math.round(
                          (dataSource?.userProfileData?.day / 
                          dataSource?.userProfileData?.totalDay) * 100
                        )
                        : 0   
                      }%
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 text-[11px] lg:text-[15px] text-gray-400">
                    <div className="flex items-center gap-1">
                      <span>Level {dataSource?.userProfileData?.level}</span>
                      <img src={badge} className="w-4 h-4 rounded-sm" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Level {dataSource?.userProfileData?.level != 10 ? dataSource?.userProfileData?.level + 1 : dataSource?.userProfileData?.level}</span>
                      <img src={badge} className="w-4 h-4 rounded-sm" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-[14px] lg:text-[17.5px] font-medium">
                    You are currently on Level {dataSource?.userProfileData?.level} with {dataSource?.pointsData?.totalDayPoint} points
                  </p>
                </div>

                {/* Tasks */}
                <div className="mt-8 space-y-6 text-[12px] lg:text-[14px] font-medium">
                  <label className={`flex items-center gap-2 ${dataSource.dailyTaskData?.totalTasks?.totalVideos == 0 ? "hidden": "block"}`}>
                    <input
                      type="checkbox"
                      readOnly
                      checked={dataSource.dailyTaskData?.completedTasks?.watchedVideos == dataSource.dailyTaskData?.totalTasks?.totalVideos}
                      className="w-4 h-4 accent-red-900 rounded-lg"
                    />
                    <span className="">Watch &amp; Like videos ({dataSource.dailyTaskData?.completedTasks?.watchedVideos}/{dataSource.dailyTaskData?.totalTasks?.totalVideos})</span>
                  </label>
                  <label className={`flex items-center gap-2 ${dataSource.dailyTaskData?.totalTasks?.accountsToSubscribe == 0 ? "hidden" : "block"}`}>
                    <input
                      type="checkbox"
                      readOnly
                      checked={dataSource.dailyTaskData?.completedTasks?.accountsSubscribed == dataSource.dailyTaskData?.totalTasks?.accountsToSubscribe}
                      className="w-4 h-4 accent-red-900 rounded-lg"
                    />
                    <span className="">Subscribe/Follow social links ({dataSource.dailyTaskData?.completedTasks?.accountsSubscribed}/{dataSource.dailyTaskData?.totalTasks?.accountsToSubscribe})</span>
                  </label>
                  {/*<label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      readOnly
                      className="w-4 h-4 accent-red-900 rounded-lg"
                    />
                    <span className="">Follow social links</span>
                  </label>*/}
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
                      ₦{(dataSource.userWalletData?.amountLeftInWallet).toLocaleString()}
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
                      <div className="font-bold text-[#CACACA] mt-2">Earned Points</div>
                      <div className="font-semibold text-[#B5B5B5] mt-2">
                        {(dataSource.pointsData?.totalDayPoint).toLocaleString()} points
                      </div>
                    </div>
                    <FaSyncAlt className="text-white text-lg" />
                  </div>
                  <div className="flex items-center justify-start gap-4">
                    <div className="min-w-[120px]">
                      <div className="font-bold text-[#CACACA] mt-2">Referrals</div>
                      <div className="font-semibold text-[#B5B5B5] mt-2">
                        {dataSource.dailyTaskData?.completedTasks?.referralCount}
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
                        {dataSource.dailyTaskData?.completedTasks?.watchedVideos} videos
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
                    <h3 className="">Level {dataSource?.userProfileData?.level} - In Progress</h3>
                    <div className="flex gap-2 items-center">
                      <span>Day {dataSource?.userProfileData?.day}/{dataSource?.userProfileData?.totalDay}</span>
                      <div className="w-5 h-5 rounded flex items-center justify-center">⏳</div>
                    </div>
                  </div>
                </div>
                <p className="text-[12px] lg:text-[14px] font-medium mt-3">
                  Complete all tasks within {dataSource?.userProfileData?.totalDay} days to unlock your bonus!
                </p>
                <div className="mt-6 space-y-6 text-[12px] lg:text-[14px] font-medium">
                  <label className={`flex items-center gap-2 ${dataSource.dailyTaskData?.totalTasks?.totalVideos == 0 ? "hidden": "block"}`}>
                    <input
                      type="checkbox"
                      readOnly
                      checked={dataSource.dailyTaskData?.completedTasks?.watchedVideos == dataSource.dailyTaskData?.totalTasks?.totalVideos}
                      className="w-4 h-4 accent-red-900 rounded-lg"
                    />
                    <span className="">Watch + Like videos</span>
                  </label>
                  <label className={`flex items-center gap-2 ${dataSource.dailyTaskData?.totalTasks?.accountsToSubscribe == 0 ? "hidden" : "block"}`}>
                    <input
                      type="checkbox"
                      readOnly
                      checked={dataSource.dailyTaskData?.completedTasks?.accountsSubscribed == dataSource.dailyTaskData?.totalTasks?.accountsToSubscribe}
                      className="w-4 h-4 accent-red-900 rounded-lg"
                    />
                    <span className="">Subscribe or Follow social links</span>
                  </label>
                  {/*<label className="flex items-center gap-2">
                    <input type="checkbox" readOnly className="w-4 h-4 accent-red-900" />
                    <span className="">Follow social links</span>
                  </label>*/}
                </div>
                <div className="mt-6 flex justify-end">
                  <button onClick={() => navigate("/tasks")} className="bg-[#8F0406] hover:bg-red-600 hover:scale-105 text-white md:text-[14px] text-[12px] px-5 py-2 rounded-lg">
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
                      <li>+{dataSource.dailyTaskData?.completedTasks?.watchedVideos} videos watched</li>
                      <li>{dataSource.dailyTaskData?.completedTasks?.referralCount} new referrals</li>
                      <li>{dataSource.dailyTaskData?.completedTasks?.accountsSubscribed} accounts subscribed</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Daily Check-in */}
              <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] rounded-2xl md:p-13 p-8">
                <div className="flex items-center justify-between h-25">
                  <div>
                    <div className="text-[12px] md:text-[16px] font-semibold">Days Streak</div>
                    <div className="text-[15px] md:text-[19px] font-semibold text-yellow-400">{dataSource?.userProfileData?.dayStreak} days 🔥</div>
                  </div>
                </div>
                <div className="items-center h-15">
                  <div className="text-[12px] md:text-[16px]">
                    You've checked in for {dataSource?.userProfileInfo?.day} days straight!
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

            {/* Subscribers - NOW DYNAMIC */}
            <div className="relative bg-gradient-to-br from-[#0E083C] to-[#06031E] rounded-2xl md:p-15 p-8 overflow-y-auto">
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <img src={angel2} alt="angel" className="max-w-xs object-contain" />
              </div>
              <div className="relative z-10">
                <h3 className="text-[14px] md:text-[24px] text-[#CACACA] font-semibold">New Subscribers</h3>

                {subscribersLoading ? (
                  <p className="mt-8 text-center text-gray-400 text-sm">Loading subscribers...</p>
                ) : subscribersError ? (
                  <p className="mt-8 text-center text-red-500 text-sm font-medium">{subscribersError}</p>
                ) : subscribers.length === 0 ? (
                  <p className="mt-8 text-center text-gray-500 text-sm">No new subscribers yet.</p>
                ) : (
                  <ul className="space-y-8 mt-8">
                    {subscribers.map((sub, idx) => (
                      <li key={idx} className="flex items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-200 to-red-300 flex items-center justify-center font-bold text-[#ef4444] text-sm overflow-hidden">
                            {getInitials(sub.fullName)}
                          </div>
                          <span className="font-medium text-[12px] md:text-[14px]">{sub.fullName}</span>
                        </div>
                        <div className="text-yellow-400 font-semibold text-[12px] md:text-[14px]">
                          ₦{Number(sub.amount).toLocaleString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;