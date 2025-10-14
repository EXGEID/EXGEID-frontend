import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { mockProfileData } from "../api/mockProfileData";
import MockModeBadge from "../components/MockModeBadge";

const Topbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({ name: "Loading...", avatar: "" });
  const DAILY_TASK_API_URL = "https://exgeid-backend.onrender.com/api/v1/task/fetch/daily-task";
  const PROFILE_API_URL = "https://exgeid-backend.onrender.com/api/v1/users/get/profile-info";
  const REFRESH_TOKEN_URL = "https://exgeid-backend.onrender.com/api/v1/refresh/token";

  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = sessionStorage.getItem("accessToken");
      console.log("Access Token:", accessToken); // Debug token

      if (!accessToken) {
        console.warn("⚠️ No access token found, using mock data");
        const data = mockProfileData;
        setUser({
          name: data.personalDetails?.fullName || "User",
          avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        });
        return;
      }

      try {
        // First, fetch daily task data
        console.log("Fetching daily task data...");
        const taskRes = await fetch(DAILY_TASK_API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!taskRes.ok) {
          throw new Error(`Daily task request failed: ${taskRes.status}`);
        }

        const taskData = await taskRes.json();
        console.log("Daily task data:", taskData);

        // Then fetch profile data
        console.log("Fetching profile data...");
        const profileRes = await fetch(PROFILE_API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!profileRes.ok) {
          throw new Error(`Profile request failed: ${profileRes.status}`);
        }

        const profileData = await profileRes.json();
        console.log("Profile data:", profileData);
        
        setUser({
          name: profileData.personalDetails?.fullName || "User",
          avatar: "https://randomuser.me/api/portraits/men/75.jpg",
        });

      } catch (err) {
        console.error("Initial fetch failed:", err.message);
        
        // Attempt to refresh token on failure
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
          console.log("Refresh data:", refreshData);

          const { accessToken: newAccessToken } = refreshData;
          console.log("New Access Token:", newAccessToken);
          sessionStorage.setItem("accessToken", newAccessToken);

          // Retry both requests with new token
          console.log("Retrying daily task fetch with new token...");
          const retryTaskRes = await fetch(DAILY_TASK_API_URL, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              "Content-Type": "application/json",
            },
          });

          if (!retryTaskRes.ok) {
            console.warn("Daily task retry failed:", retryTaskRes.status);
          } else {
            const retryTaskData = await retryTaskRes.json();
            console.log("Retry daily task data:", retryTaskData);
          }

          // Retry profile fetch
          console.log("Retrying profile fetch with new token...");
          const retryProfileRes = await fetch(PROFILE_API_URL, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              "Content-Type": "application/json",
            },
          });

          if (!retryProfileRes.ok) {
            throw new Error(`Retry profile request failed: ${retryProfileRes.status}`);
          }

          const profileData = await retryProfileRes.json();
          setUser({
            name: profileData.personalDetails?.fullName || "User",
            avatar: "https://randomuser.me/api/portraits/men/75.jpg",
          });

        } catch (refreshErr) {
          console.warn("⚠️ Backend not reachable, using mock profile data:", refreshErr.message);
          const data = mockProfileData;
          setUser({
            name: data.personalDetails?.fullName || "User",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
          });
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      <div className="bg-[#06031E] flex justify-between items-center px-8 py-8 border-b border-[#343434] relative z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="text-white text-xl md:hidden"
        >
          <FaBars />
        </button>

        <div className="flex items-center ml-auto">
          <img
            src={user.avatar}
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
          <span className="ml-3 text-white font-medium">{user.name}</span>
        </div>
        {/* 🧪 Show Mock Badge */}
        {process.env.NODE_ENV === "development" && <MockModeBadge />}
      </div>

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Topbar;
