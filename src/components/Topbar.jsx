import { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { mockProfileData } from "../api/mockProfileData";
import MockModeBadge from "../components/MockModeBadge";

const Topbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({ name: "Loading...", avatar: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          "https://exgeid-backend.onrender.com/users/get/profile-info"
        );
        const data = await res.json();
        setUser({
          name: data.personalDetails?.fullName || "User",
          avatar: "https://randomuser.me/api/portraits/men/75.jpg",
        });
      } catch (error) {
        console.warn("⚠️ Using mock profile data:", error.message);
        const data = mockProfileData;
        setUser({
          name: data.personalDetails?.fullName,
          avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        });
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
