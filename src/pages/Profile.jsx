// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import angelVid from "../assets/angelVid.png";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("https://exgeid-backend.onrender.com/users/get/profile-info");
        setProfile(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile info:", err);
        setError("Failed to load profile data");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-white p-8">Loading profile...</p>;
  if (error) return <p className="text-red-500 p-8">{error}</p>;

  const personal = profile?.personalDetails || {};
  const account = profile?.accountDetails || {};
  const daily = account?.dailyTaskInfo || {};
  const profileInfo = account?.profileInfo || {};

  return (
    <div className="flex-1 bg-[#020109] text-white p-8 min-h-screen">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <img src={angelVid} alt="angel_top" className="w-20 h-20" />
        <h1 className="text-2xl font-semibold">Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RIGHT SIDE (Profile Info) */}
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

          <h2 className="text-xl font-semibold mt-4">{personal.fullName}</h2>
          <span className="inline-flex items-center justify-center gap-2 text-yellow-500 bg-yellow-500/20 px-3 py-1 rounded-full text-xs font-medium m-2">
            Level {profileInfo.level || 1} - Earner
          </span>
          <p className="text-gray-400 text-sm">{personal.email}</p>

          <button className="mt-6 bg-[#8F0406] w-full max-w-md mx-auto py-2 rounded-lg font-medium hover:bg-red-700">
            Log out
          </button>

          <div className="mt-6 w-full max-w-md mx-auto bg-[#020109] p-4 rounded-xl text-left">
            <h4 className="font-semibold mb-2 border-b border-gray-700 pb-2 text-center">
              Personal Information
            </h4>
            <div className="space-y-1 text-left">
              <p>{personal.fullName}</p>
              <p>{personal.gender}</p>
              <p>{personal.phoneNumber}</p>
              <p>{personal.email}</p>
              <p>{personal.profession}</p>
              <p>{personal.age}</p>
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
                  value={personal.fullName || ""}
                  readOnly
                  className="w-full bg-[#020109] p-3 rounded-md mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Gender</label>
                <input
                  value={personal.gender || ""}
                  readOnly
                  className="w-full bg-[#020109] p-3 rounded-md mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Phone Number</label>
                <input
                  value={personal.phoneNumber || ""}
                  readOnly
                  className="w-full bg-[#020109] p-3 rounded-md mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Email</label>
                <input
                  value={personal.email || ""}
                  readOnly
                  className="w-full bg-[#020109] p-3 rounded-md mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Profession</label>
                <input
                  value={personal.profession || ""}
                  readOnly
                  className="w-full bg-[#020109] p-3 rounded-md mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Age</label>
                <input
                  value={personal.age || ""}
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
                <p className="font-medium">{personal.fullName?.split(" ")[0]}</p>
                <p className="text-sm text-gray-400">
                  Referred by: N/A
                </p>
              </div>
            </div>

            <p className="mt-4 text-center font-medium">
              You are currently on Level {profileInfo.level || 1}
            </p>

            {/* Progress bar */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1 bg-white h-2 rounded-full">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{
                    width: `${((profileInfo.day || 0) / (profileInfo.totalDay || 1)) * 100}%`,
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-400">
                {profileInfo.day || 0}/{profileInfo.totalDay || 0}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center mt-6">
              <div>
                <p className="text-sm text-gray-400">Videos watched</p>
                <p className="font-bold text-lg mt-1">{daily.watchedVideos || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Referrals</p>
                <p className="font-bold text-lg mt-1">{daily.referralCount || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Tasks completed</p>
                <p className="font-bold text-lg mt-1">{daily.accountsSubscribed || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
