import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { mockProfileData } from "../api/mockProfileData";
import MockModeBadge from "../components/MockModeBadge";

const Topbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({ name: "Loading...", avatar: "" });
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
        const res = await fetch(PROFILE_API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          //credentials: "include", // Include cookies if needed
        });

        if (!res.ok) {
          throw new Error(`Profile request failed: ${res.status}`);
        }

        const data = await res.json();
        console.log("profile data:", data);
        setUser({
          name: data.personalDetails?.fullName || "User",
          avatar: "https://randomuser.me/api/portraits/men/75.jpg",
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
          console.log("profile data:", refreshData);

          const { accessToken: newAccessToken } = refreshData;
          console.log("New Access Token:", newAccessToken); // Debug new token
          sessionStorage.setItem("accessToken", newAccessToken);

          // Retry the profile data fetch with new token
          const retryRes = await fetch(PROFILE_API_URL, {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              "Content-Type": "application/json",
            },
            //credentials: "include",
          });

          if (!retryRes.ok) {
            throw new Error(`Retry request failed: ${retryRes.status}`);
          }

          const data = await retryRes.json();
          setUser({
            name: data.personalDetails?.fullName || "User",
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
