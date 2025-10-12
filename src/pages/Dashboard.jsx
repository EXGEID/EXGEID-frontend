import React, { useEffect, useState } from "react";
import angel1 from "../assets/angel1.png";
import angel2 from "../assets/angel2.png";
import angel from "../assets/angel.png";
import {
  FaWallet,
  FaSyncAlt,
  FaUsers,
  FaTasks,
  FaVideo,
} from "react-icons/fa";
import { PieChart, Pie, Cell } from "recharts";
import { mockDashboardData } from "../api/mockDashboardData";

const data = [
  { name: "Completed", value: 45 },
  { name: "Not Completed", value: 55 },
];
const COLORS = ["#C60508", "#C0D2D4"];

const Dashboard = () => {
  const [userData, setUserData] = useState({
    name: "Loading...",
    referredBy: "Loading...",
    totalEarnings: 0,
    referrals: 0,
    tasksCompleted: 0,
    totalTasks: 0,
    videos: 0,
  });

  const [isMock, setIsMock] = useState(false);
  const DASHBOARD_API_URL = "https://exgeid-backend.onrender.com/api/v1/users/dashboard-info";
  const REFRESH_TOKEN_URL = "https://exgeid-backend.onrender.com/api/v1/refresh/token";

  useEffect(() => {
    const fetchDashboardData = async () => {
      const accessToken = sessionStorage.getItem("accessToken");
      console.log("Access Token:", accessToken); // Debug token

      if (!accessToken) {
        console.warn("⚠️ No access token found, using mock data");
        setIsMock(true);
        setUserData({
          name: mockDashboardData.userFullName || "User",
          referredBy: mockDashboardData.userProfileData?.referredBy || "Unknown",
          totalEarnings: mockDashboardData.userWalletData?.paidAmount || 0,
          referrals: mockDashboardData.dailyTaskData?.completedTasks?.referralCount || 0,
          tasksCompleted:
            (mockDashboardData.dailyTaskData?.completedTasks?.accountsSubscribed || 0) +
            (mockDashboardData.dailyTaskData?.completedTasks?.watchedVideos || 0),
          totalTasks:
            (mockDashboardData.dailyTaskData?.totalTasks?.accountsToSubscribe || 0) +
            (mockDashboardData.dailyTaskData?.totalTasks?.totalVideos || 0),
          videos: mockDashboardData.dailyTaskData?.completedTasks?.watchedVideos || 0,
        });
        return;
      }

      try {
        const res = await fetch(DASHBOARD_API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          //credentials: "include", // Include cookies if needed
        });

        if (!res.ok) {
          throw new Error(`Dashboard request failed: ${res.status}`);
        }

        const data = await res.json();
        console.log("Dashboard info fetched successfully", data);

        // ✅ Map API data into the structure your component needs
        setUserData({
          name: data.userFullName || "User",
          referredBy: data.userProfileData?.referredBy || "Unknown",
          totalEarnings: data.userWalletData?.paidAmount || 0,
          referrals: data.dailyTaskData?.completedTasks?.referralCount || 0,
          tasksCompleted:
            (data.dailyTaskData?.completedTasks?.accountsSubscribed || 0) +
            (data.dailyTaskData?.completedTasks?.watchedVideos || 0),
          totalTasks:
            (data.dailyTaskData?.totalTasks?.accountsToSubscribe || 0) +
            (data.dailyTaskData?.totalTasks?.totalVideos || 0),
          videos: data.dailyTaskData?.completedTasks?.watchedVideos || 0,
        });
      } catch (err) {
        // Attempt to refresh token on failure
        try {
          console.log("Attempting to refresh token...");
          const refreshRes = await fetch(REFRESH_TOKEN_URL, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            //credentials: "include", // Include cookies for refresh token
          });

          if (!refreshRes.ok) {
            throw new Error(`Token refresh failed: ${refreshRes.status}`);
          }

          const refreshData = await refreshRes.json();
          console.log("Refresh token data...", refreshData);

          const { accessToken: newAccessToken } = await refreshData.accessToken;
          console.log("New Access Token:", newAccessToken); // Debug new token
          sessionStorage.setItem("accessToken", newAccessToken);

          // Retry the dashboard data fetch with new token
          const retryRes = await fetch(DASHBOARD_API_URL, {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          if (!retryRes.ok) {
            throw new Error(`Retry request failed: ${retryRes.status}`);
          }

          const data = await retryRes.json();
          console.log("Dashboard info after token refresh fetched successfully", data);

          setUserData({
            name: data.userFullName || "User",
            referredBy: data.userProfileData?.referredBy || "Unknown",
            totalEarnings: data.userWalletData?.paidAmount || 0,
            referrals: data.dailyTaskData?.completedTasks?.referralCount || 0,
            tasksCompleted:
              (data.dailyTaskData?.completedTasks?.accountsSubscribed || 0) +
              (data.dailyTaskData?.completedTasks?.watchedVideos || 0),
            totalTasks:
              (data.dailyTaskData?.totalTasks?.accountsToSubscribe || 0) +
              (data.dailyTaskData?.totalTasks?.totalVideos || 0),
            videos: data.dailyTaskData?.completedTasks?.watchedVideos || 0,
          });
        } catch (refreshErr) {
          console.warn("⚠️ Backend not reachable, using mock data:", refreshErr.message);
          setIsMock(true);

          // ✅ Use mock data when backend fails
          const data = mockDashboardData;

          setUserData({
            name: data.userFullName || "User",
            referredBy: data.userProfileData?.referredBy || "Unknown",
            totalEarnings: data.userWalletData?.paidAmount || 0,
            referrals: data.dailyTaskData?.completedTasks?.referralCount || 0,
            tasksCompleted:
              (data.dailyTaskData?.completedTasks?.accountsSubscribed || 0) +
              (data.dailyTaskData?.completedTasks?.watchedVideos || 0),
            totalTasks:
              (data.dailyTaskData?.totalTasks?.accountsToSubscribe || 0) +
              (data.dailyTaskData?.totalTasks?.totalVideos || 0),
            videos: data.dailyTaskData?.completedTasks?.watchedVideos || 0,
          });
        }
      }
    };

    fetchDashboardData();
  }, []);

  const transactions = [
    { name: "Lorem Amaka", amount: "₦12,000.00" },
    { name: "Ifeoma N", amount: "₦12,000.00" },
    { name: "Suleiman K", amount: "₦12,000.00" },
    { name: "Tunde P", amount: "₦12,000.00" },
  ];

  return (
    <div className="bg-[#020109] min-h-screen">
      <div className="p-6 space-y-8 text-white">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
            <img src={angel} alt="angel_top" className="w-20 h-20" />
            Hi {userData.name}!! {isMock && <span>(Mock)</span>}
          </h1>
        </div>

        {/* ---------- SECTION 1: Profile + Earnings ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="relative bg-gradient-to-br from-[#0E083C] to-[#06031E] rounded-2xl p-15 overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <img
                  src="https://randomuser.me/api/portraits/men/75.jpg"
                  alt="avatar"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="text-lg font-semibold">{userData.name}</p>
                  <p className="text-sm text-gray-400">
                    Referred by: {userData.referredBy}
                  </p>
                </div>
              </div>

              {/* progress bar */}
              <div className="mt-8">
                <div className="flex items-center justify-between mt-2 gap-2">
                  <div className="w-full bg-white h-3 rounded-full">
                    <div
                      className="h-3 rounded-full bg-red-600"
                      style={{
                        width: `${
                          (userData.tasksCompleted / userData.totalTasks) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <div className="text-sm text-gray-300">
                    {Math.round(
                      (userData.tasksCompleted / userData.totalTasks) * 100
                    )}
                    %
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <span>Level 1</span>
                    <div className="w-4 h-4 bg-gray-700 rounded-sm" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span>Level 2</span>
                    <div className="w-4 h-4 bg-gray-700 rounded-sm" />
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-base font-medium">
                  You are currently on Level 1
                </p>
              </div>

              {/* tasks */}
              <div className="mt-8 space-y-6 text-gray-300">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    readOnly
                    className="w-4 h-4 accent-red-900"
                  />
                  <span className="text-sm">
                    Watch 10 YouTube videos (completed fully)
                  </span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    readOnly
                    className="w-4 h-4 accent-red-900"
                  />
                  <span className="text-sm">Subscribe &amp; Like</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    readOnly
                    className="w-4 h-4 accent-red-900"
                  />
                  <span className="text-sm">Follow 5 IG links</span>
                </label>
              </div>
            </div>
          </div>

          {/* Earnings Card */}
          <div className="relative bg-gradient-to-br from-[#0E083C] to-[#06031E] rounded-2xl p-15 overflow-hidden">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <img
                src={angel1}
                alt="angel"
                className="max-w-[60%] object-contain"
              />
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Total Earnings</h3>
                  <p className="text-2xl font-bold text-yellow-400">
                    ₦{userData.totalEarnings.toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
                  <FaWallet className="text-white text-xl" />
                </div>
              </div>
              <div className="border-t border-gray-700 my-4" />
              <div className="grid grid-cols-2 gap-10 text-sm text-gray-300">
                <div className="flex items-center justify-start gap-4">
                  <div className="min-w-[120px]">
                    <div className="font-bold text-[#CACACA] mt-2">
                      Recent Earnings
                    </div>
                    <div className="font-semibold text-[#B5B5B5] mt-2">
                      ₦{userData.totalEarnings.toLocaleString()}
                    </div>
                  </div>
                  <FaSyncAlt className="text-white text-lg" />
                </div>
                <div className="flex items-center justify-start gap-4">
                  <div className="min-w-[120px]">
                    <div className="font-bold text-[#CACACA] mt-2">
                      Referrals
                    </div>
                    <div className="font-semibold text-[#B5B5B5] mt-2">
                      {userData.referrals}
                    </div>
                  </div>
                  <FaUsers className="text-white text-lg" />
                </div>
                <div className="flex items-center justify-start gap-4">
                  <div className="min-w-[120px]">
                    <div className="font-bold text-[#CACACA] mt-2">
                      Total Tasks
                    </div>
                    <div className="font-semibold text-[#B5B5B5] mt-2">
                      {userData.tasksCompleted}/{userData.totalTasks} tasks
                    </div>
                  </div>
                  <FaTasks className="text-white text-lg" />
                </div>
                <div className="flex items-center justify-start gap-4">
                  <div className="min-w-[120px]">
                    <div className="font-bold text-[#CACACA] mt-2">
                      Total Videos
                    </div>
                    <div className="font-semibold text-[#B5B5B5] mt-2">
                      {userData.videos} videos
                    </div>
                  </div>
                  <FaVideo className="text-white text-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- SECTION 2: Level Progress + Activity/Checkin ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
          {/* Level Progress */}
          <div className="relative bg-gradient-to-br from-[#0E083C] to-[#06031E] rounded-2xl p-15 overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-400 flex items-center gap-1">
                    <h3 className="text-lg font-semibold">Level 1 - In Progress</h3>
                    <span>Day 3/5</span>
                    <div className="w-5 h-5 bg-gray-700 rounded flex items-center justify-center">
                      ⏳
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-3">
                Complete all tasks within 5 days to unlock your ₦10,000 bonus!
              </p>
              <div className="mt-6 space-y-6">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked readOnly className="w-4 h-4 accent-red-900" />
                  <span className="text-sm">Watch 10 YouTube videos (must complete fully)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked readOnly className="w-4 h-4 accent-red-900" />
                  <span className="text-sm">Subscribe &amp; Like</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked readOnly className="w-4 h-4 accent-red-900" />
                  <span className="text-sm">Follow 5 IG links</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 accent-red-900" />
                  <span className="text-sm">Follow 5 TikTok links</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 accent-red-900" />
                  <span className="text-sm">Bring in 8 referrals (current: 6/8)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 accent-red-900" />
                  <span className="text-sm">Join Telegram Group</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 accent-red-900" />
                  <span className="text-sm">Join WhatsApp Group</span>
                </label>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="bg-[#8F0406] text-white px-5 py-2 rounded-lg">
                  Continue
                </button>
              </div>
            </div>
          </div>

          {/* Right: Activity + Daily Check-in */}
          <div className="space-y-6">
            {/* Activity */}
            <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] rounded-2xl p-13 overflow-hidden h-60">
              <div className="relative z-10 gap-5 flex h-full">
                <div className="flex-1 flex flex-col items-center justify-center">
                  <PieChart width={120} height={120}>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={55}
                      dataKey="value"
                      cornerRadius={10}
                      stroke="none"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="flex gap-4 mt-2 text-sm text-gray-300">
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[0] }}></span>
                      <span>Completed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[1] }}></span>
                      <span>Not Completed</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h4 className="text-lg font-semibold mb-3">Recent Activity</h4>
                  <ul className="space-y-2 text-sm text-gray-300 list-disc list-outside marker:text-red-500">
                    <li>
                      +₦500 earned from completed YouTube task
                    </li>
                    <li>2 new referrals joined</li>
                    <li>You followed 3 TikTok accounts today</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Daily Check-in */}
            <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] rounded-2xl p-15">
              <div className="flex items-center justify-between h-25">
                <div>
                  <div className="text-sm text-gray-300">Daily Check-In</div>
                  <div className="text-lg font-semibold text-yellow-400">₦300</div>
                </div>
                <div>
                  <button className="bg-[#8F0406] px-6 py-2 rounded-lg text-white font-medium">
                    Claim
                  </button>
                </div>
              </div>
              <div className="items-center h-15">
                <div className="text-sm text-gray-300">You've checked in for 4 days straight!</div>
                <div className="text-sm text-gray-300">Tap to claim today's ₦300 bonus</div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- SECTION 3: Referrals + Subscribers ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
          {/* Referrals */}
          <div className="relative bg-gradient-to-br from-[#0E083C] to-[#06031E] rounded-2xl p-15 overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold mb-3">Referral Section</h3>
              <p className="text-sm text-gray-400 mb-4">
                <span className="text-yellow-400">Invite 3 more people to unlock your bonus!!!</span>
              </p>
              <div className="flex items-center gap-3 bg-[#343434] p-2 rounded">
                <input type="text" className="bg-transparent flex-1 text-sm" value="EXG-A3421" readOnly />
                <button className="bg-yellow-500 text-black px-3 py-1 rounded">Copy</button>
              </div>
              <div className="mt-6 grid grid-cols-5 gap-4">
                <div className="h-12 w-12 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center">f</div>
                <div className="h-12 w-12 bg-gradient-to-tr from-green-500 to-green-300 rounded-full flex items-center justify-center">wa</div>
                <div className="h-12 w-12 bg-gradient-to-tr from-pink-500 to-pink-300 rounded-full flex items-center justify-center">ig</div>
                <div className="h-12 w-12 bg-gradient-to-tr from-gray-400 to-gray-200 rounded-full flex items-center justify-center">x</div>
                <div className="h-12 w-12 bg-gradient-to-tr from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center">sc</div>
              </div>
              <ol className="mt-6 list-decimal list-inside text-sm text-gray-300 space-y-5">
                <li>Share your referral link with friends and family on any of these platforms</li>
                <li>Receive ₦500 each time someone clicks your link</li>
                <li>Earn ₦1500 bonus when someone creates an account through your link</li>
                <li>New Users get ₦10,000 Naira Sign-Up Bonus</li>
              </ol>
            </div>
          </div>

          {/* Subscribers */}
          <div className="relative bg-gradient-to-br from-[#0E083C] to-[#06031E] rounded-2xl p-15 overflow-hidden">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <img
                src={angel2}
                alt="angel"
                className="max-w-xs object-contain"
              />
            </div>
            <div className="relative z-10">
              <h3 className="text-lg text-[#CACACA] font-semibold">New Subscribers</h3>
              <ul className="space-y-8 mt-8">
                {transactions.map((t, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between gap-1"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                        <img
                          src="https://randomuser.me/api/portraits/men/75.jpg"
                          alt="avatar"
                          className="w-10 h-10 rounded-full"
                        />
                      </div>
                      <span className="font-medium">{t.name}</span>
                    </div>
                    <div className="text-yellow-400 font-semibold">
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
  );
};

export default Dashboard;
