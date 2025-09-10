import React from "react";
import { FaEdit } from "react-icons/fa";

const Profile = () => {
  return (
    <div className="flex min-h-screen bg-[#0a0a1a] text-white">

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Main Profile Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Details */}
            <div className="bg-gradient-to-b from-[#1a1a3a] to-[#0a0a1a] p-6 rounded-2xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">👼</span> Profile
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Full name</label>
                  <input
                    type="text"
                    value="Anyaralu E. Ashley"
                    readOnly
                    className="w-full bg-[#111122] p-2 rounded-md mt-1"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Gender</label>
                  <select
                    className="w-full bg-[#111122] p-2 rounded-md mt-1"
                    defaultValue="Female"
                  >
                    <option>Female</option>
                    <option>Male</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Phone Number</label>
                  <input
                    type="password"
                    value="***********"
                    readOnly
                    className="w-full bg-[#111122] p-2 rounded-md mt-1"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Email</label>
                  <input
                    type="text"
                    value="anya*****@gmail.com"
                    readOnly
                    className="w-full bg-[#111122] p-2 rounded-md mt-1"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Profession</label>
                  <input
                    type="text"
                    value="Product Designer"
                    readOnly
                    className="w-full bg-[#111122] p-2 rounded-md mt-1"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Age</label>
                  <input
                    type="number"
                    value="29"
                    readOnly
                    className="w-full bg-[#111122] p-2 rounded-md mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-gray-400 text-sm">
                    Password (Change/Reset option)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="password"
                      value="***********"
                      readOnly
                      className="w-full bg-[#111122] p-2 rounded-md mt-1"
                    />
                    <button className="text-yellow-400 text-sm">Reset</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-gradient-to-b from-[#1a1a3a] to-[#0a0a1a] p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Account Status</h3>
              <div className="flex items-center gap-4">
                <img
                  src="https://via.placeholder.com/40"
                  alt="avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p>Ashley</p>
                  <span className="text-gray-400 text-sm">
                    Referred by: XYZ
                  </span>
                </div>
              </div>

              <p className="mt-4">You are currently on Level 1</p>
              <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                <div className="bg-red-500 h-2 rounded-full w-[40%]" />
              </div>
              <p className="mt-2 text-sm text-gray-400">40%</p>

              <div className="grid grid-cols-3 text-center mt-6">
                <div>
                  <p className="font-bold">5</p>
                  <p className="text-sm text-gray-400">Videos watched</p>
                </div>
                <div>
                  <p className="font-bold">8</p>
                  <p className="text-sm text-gray-400">Total Referrals</p>
                </div>
                <div>
                  <p className="font-bold">7</p>
                  <p className="text-sm text-gray-400">Tasks completed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Profile Card */}
          <div className="bg-gradient-to-b from-[#1a1a3a] to-[#0a0a1a] p-6 rounded-2xl shadow-lg flex flex-col items-center">
            <div className="relative">
              <img
                src="https://via.placeholder.com/120"
                alt="profile"
                className="w-32 h-32 rounded-full object-cover"
              />
              <button className="absolute bottom-2 right-2 bg-red-600 p-2 rounded-full">
                <FaEdit size={14} />
              </button>
            </div>

            <h2 className="text-xl font-semibold mt-4">Ashley Anyaralu</h2>
            <span className="text-yellow-400 text-sm mt-1">
              Level 1 - Earner
            </span>
            <p className="text-gray-400 text-sm">@lorem ipsum</p>

            <button className="mt-4 bg-red-600 px-6 py-2 rounded-lg font-medium hover:bg-red-700">
              Log out
            </button>

            <div className="mt-6 w-full bg-[#111122] p-4 rounded-xl text-sm space-y-1">
              <p>Anyaralu E. Ashley</p>
              <p>Female</p>
              <p>080********</p>
              <p>anya*****@gmail.com</p>
              <p>Product Designer</p>
              <p>29</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
