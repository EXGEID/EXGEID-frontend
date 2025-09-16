// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

// import icons from react-icons
import { FaHome, FaVideo, FaUserFriends, FaTasks, FaCreditCard, FaUser } from "react-icons/fa";

const Sidebar = () => {
  const links = [
    { name: "Home", path: "/dashboard", icon: <FaHome /> },
    { name: "Videos", path: "/videos", icon: <FaVideo /> },
    { name: "Referrals", path: "/referrals", icon: <FaUserFriends /> },
    { name: "Tasks", path: "/tasks", icon: <FaTasks /> },
    { name: "Withdrawals", path: "/withdrawals", icon: <FaCreditCard /> },
    { name: "Profile", path: "/profile", icon: <FaUser /> },
  ];

  return (
    <aside className="w-64 bg-[#0f0f25] text-white min-h-screen border-r border-gray-700 space-y-20">
      {/* Logo */}
      <div className="flex items-center justify-center p-6">
        <img src={logo} alt="Logo" className="w-40 h-auto" />
      </div>

      {/* Links */}
      <nav className="flex flex-col space-y-10">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition-colors block w-full
              ${isActive ? "bg-[#430417] text-white" : "text-gray-300 hover:bg-[#430417] hover:text-white"}`
            }
          >
            {/* White icon */}
            <span className="text-lg text-white">{link.icon}</span>
            <span className="text-base">{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
