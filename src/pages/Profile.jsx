import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import angelVid from "../assets/angelVid.png";
import { mockProfileData } from "../api/mockProfileData";
import MockModeBadge from "../components/MockModeBadge";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          "https://exgeid-backend.onrender.com/users/get/profile-info"
        );
        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.warn("⚠️ Using mock profile data:", error.message);
        setProfile(mockProfileData);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("https://exgeid-backend.onrender.com/api/v1/auth/logout", {
        credentials: "include", // include cookies if used for auth
      });

      // Optionally clear local storage/session
      localStorage.removeItem("token");
      sessionStorage.clear();

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
    }
  };

  if (!profile) return <div className="text-white p-8">Loading profile...</div>;

  const { personalDetails, accountDetails } = profile;

  return (
    <div className="flex-1 bg-[#020109] text-white p-8 min-h-screen">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <img src={angelVid} alt="angel_top" className="w-20 h-20" />
        <h1 className="text-2xl font-semibold">Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RIGHT SIDE */}
        <div className="order-1 lg:order-2 bg-gradient-to-b from-[#0E083C] to-[#06031E] p-6 rounded-2xl shadow-lg flex flex-col items-center">
          <div className="relative">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="profile"
              className="w-48 h-48 rounded-full object-cover"
            />
            <button className="absolute bottom-2 right-2 bg-red-600 p-2 rounded-full shadow-lg">
              <FaEdit className="text-white" />
            </button>
          </div>

          <h2 className="text-xl font-semibold mt-4">{personalDetails.fullName}</h2>
          <span className="inline-flex items-center justify-center gap-2 text-yellow-500 bg-yellow-500/20 px-3 py-1 rounded-full text-xs font-medium m-2">
            Level {accountDetails.profileInfo.level} - Earner
          </span>
          <p className="text-gray-400 text-sm">@{personalDetails.fullName.split(" ")[0].toLowerCase()}</p>

          <button onClick={handleLogout} className="mt-6 bg-[#8F0406] w-full max-w-md mx-auto py-2 rounded-lg font-medium hover:bg-red-700">
            Log out
          </button>

          <div className="mt-6 w-full max-w-md mx-auto bg-[#020109] p-4 rounded-xl text-left">
            <h4 className="font-semibold mb-2 border-b border-gray-700 pb-2 text-center">
              Personal Information
            </h4>
            <div className="space-y-1 text-left">
              <p>{personalDetails.fullName}</p>
              <p>{personalDetails.gender}</p>
              <p>{personalDetails.phoneNumber}</p>
              <p>{personalDetails.email}</p>
              <p>{personalDetails.profession}</p>
              <p>{personalDetails.age}</p>
            </div>
          </div>
        </div>

        {/* LEFT SIDE */}
        <div className="order-2 lg:order-1 lg:col-span-2 flex flex-col gap-6">
          {/* Personal Details */}
          <div className="bg-gradient-to-b from-[#0E083C] to-[#06031E] p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Full name</label>
                <input
                  value={personalDetails.fullName}
                  readOnly
                  className="w-full bg-[#020109] p-3 rounded-md mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Gender</label>
                <input
                  value={personalDetails.gender}
                  readOnly
                  className="w-full bg-[#020109] p-3 rounded-md mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Phone Number</label>
                <input
                  value={personalDetails.phoneNumber}
                  readOnly
                  className="w-full bg-[#020109] p-3 rounded-md mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <input
                  value={personalDetails.email}
                  readOnly
                  className="w-full bg-[#020109] p-3 rounded-md mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Profession</label>
                <input
                  value={personalDetails.profession}
                  readOnly
                  className="w-full bg-[#020109] p-3 rounded-md mt-1"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Age</label>
                <input
                  value={personalDetails.age}
                  readOnly
                  className="w-full bg-[#020109] p-3 rounded-md mt-1"
                />
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="bg-gradient-to-b from-[#0E083C] to-[#06031E] p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Account Status</h3>

            <div className="flex items-center gap-4">
              <img
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt="avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium">{personalDetails.fullName}</p>
                <p className="text-sm text-gray-400">
                  Referred by: {accountDetails.profileInfo.referredBy}
                </p>
              </div>
            </div>

            <p className="mt-4 text-center font-medium">
              You are currently on Level {accountDetails.profileInfo.level}
            </p>

            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1 bg-white h-2 rounded-full">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{
                    width: `${(accountDetails.profileInfo.day /
                      accountDetails.profileInfo.totalDay) *
                      100}%`,
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-400">
                {Math.round(
                  (accountDetails.profileInfo.day /
                    accountDetails.profileInfo.totalDay) *
                    100
                )}
                %
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center mt-6">
              <div>
                <p className="text-sm text-gray-400">Videos watched</p>
                <p className="font-bold text-lg mt-1">
                  {accountDetails.dailyTaskInfo.watchedVideos}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Referrals</p>
                <p className="font-bold text-lg mt-1">
                  {accountDetails.dailyTaskInfo.referralCount}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Tasks completed</p>
                <p className="font-bold text-lg mt-1">
                  {accountDetails.dailyTaskInfo.accountsSubscribed}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 🧪 Mock mode badge (fixed at corner) */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-4 right-4 z-50">
          <MockModeBadge />
        </div>
      )}
    </div>
  );
};

export default Profile;
