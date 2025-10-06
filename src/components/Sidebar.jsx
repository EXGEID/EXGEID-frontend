import { NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";


import {
  FaHome,
  FaVideo,
  FaUserFriends,
  FaTasks,
  FaCreditCard,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: "Home", path: "/dashboard", icon: <FaHome /> },
    { name: "Videos", path: "/videos", icon: <FaVideo /> },
    { name: "Referrals", path: "/referrals", icon: <FaUserFriends /> },
    { name: "Tasks", path: "/tasks", icon: <FaTasks /> },
    { name: "Withdrawals", path: "/withdrawals", icon: <FaCreditCard /> },
    { name: "Profile", path: "/profile", icon: <FaUser /> },
  ];

  return (
    <>

      <div className="md:hidden flex items-center justify-between bg-[#0f0f25] px-4 py-3 text-white fixed top-0 left-0 w-full z-50">
        <img src={logo} alt="Logo" className="w-28 h-auto" />
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>


      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#0f0f25] text-white border-r border-gray-700 transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >

        <div className="hidden md:flex items-center justify-center p-6">
          <img src={logo} alt="Logo" className="w-40 h-auto" />
        </div>


        <nav
          className={`flex flex-col space-y-6 ${
            isOpen ? "mt-20" : "mt-10"
          } md:mt-10`}
        >
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 transition-colors block w-full
                ${
                  isActive
                    ? "bg-[#430417] text-white"
                    : "text-gray-300 hover:bg-[#430417] hover:text-white"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <span className="text-lg text-white">{link.icon}</span>
              <span className="text-base">{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>


      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
