// src/pages/Profile.jsx
import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import angelVid from "../assets/angelVid.png";

const Profile = () => {
  const [fullName, setFullName] = useState("Anyaralu E. Ashley");
  const [gender, setGender] = useState("Female");
  const [phone, setPhone] = useState("080********");
  const [email, setEmail] = useState("anya*****@gmail.com");
  const [profession, setProfession] = useState("Product Designer");
  const [age, setAge] = useState("29");

  return (
    <div className="flex-1 bg-[#020109] text-white p-8 min-h-screen">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <img src={angelVid} alt="angel_top" className="w-20 h-20" />
        <h1 className="text-2xl font-semibold">Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RIGHT SIDE (Profile Info) — appear first on mobile */}
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

          <h2 className="text-xl font-semibold mt-4">Ashley Anyaralu</h2>
          <span className="inline-flex items-center justify-center gap-2 text-yellow-500 bg-yellow-500/20 px-3 py-1 rounded-full text-xs font-medium m-2">
            Level 1 - Earner
          </span>
          <p className="text-gray-400 text-sm">@lorem ipsum</p>

          <button className="mt-6 bg-[#8F0406] w-full max-w-md mx-auto py-2 rounded-lg font-medium hover:bg-red-700">
            Log out
          </button>

          <div className="mt-6 w-full max-w-md mx-auto bg-[#020109] p-4 rounded-xl text-left">
            <h4 className="font-semibold mb-2 border-b border-gray-700 pb-2 text-center">
              Personal Information
            </h4>
            <div className="space-y-1 text-left">
              <p>Anyaralu E. Ashley</p>
              <p>Female</p>
              <p>080********</p>
              <p>anya*****@gmail.com</p>
              <p>Product Designer</p>
              <p>29</p>
            </div>
          </div>
        </div>

        {/* LEFT SIDE (2 cols) — appear below profile on mobile */}
        <div className="order-2 lg:order-1 lg:col-span-2 flex flex-col gap-6">
          {/* Personal Details */}
          <div className="bg-gradient-to-b from-[#0E083C] to-[#06031E] p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="text-sm text-gray-400">Full name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#020109] p-3 rounded-md mt-1"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="text-sm text-gray-400">Gender</label>
                <input
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-[#020109] p-3 rounded-md mt-1"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm text-gray-400">Phone Number</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#020109] p-3 rounded-md mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#020109] p-3 rounded-md mt-1"
                />
              </div>

              {/* Profession */}
              <div>
                <label className="text-sm text-gray-400">Profession</label>
                <input
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  className="w-full bg-[#020109] p-3 rounded-md mt-1"
                />
              </div>

              {/* Age */}
              <div>
                <label className="text-sm text-gray-400">Age</label>
                <input
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-[#020109] p-3 rounded-md mt-1"
                />
              </div>

              {/* Password */}
              <div className="col-span-1 md:col-span-2">
                <label className="text-sm text-gray-400">
                  Password (Change/Reset option)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value="***********"
                    readOnly
                    className="w-full bg-[#020109] p-3 rounded-md pr-14"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-400 font-medium">
                    Reset
                  </button>
                </div>
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
                <p className="font-medium">Ashley</p>
                <p className="text-sm text-gray-400">Referred by: XYZ</p>
              </div>
            </div>

            <p className="mt-4 text-center font-medium">
              You are currently on Level 1
            </p>

            {/* Progress bar */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1 bg-white h-2 rounded-full">
                <div className="bg-red-600 h-2 w-[40%] rounded-full"></div>
              </div>
              <span className="text-sm text-gray-400">40%</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center mt-6">
              <div>
                <p className="text-sm text-gray-400">Videos watched</p>
                <p className="font-bold text-lg mt-1">5</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Referrals</p>
                <p className="font-bold text-lg mt-1">8</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Tasks completed</p>
                <p className="font-bold text-lg mt-1">7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
