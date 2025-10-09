import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import {
  FaHome,
  FaVideo,
  FaUserFriends,
  FaTasks,
  FaCreditCard,
  FaUser,
} from "react-icons/fa";

const Sidebar = ({ isOpen, setIsOpen }) => {
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
      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[60%] md:w-64 bg-[#06031E] text-white border-r border-[#343434]
        transform transition-transform duration-300 z-[60]
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center p-6">
          <img src={logo} alt="Logo" className="w-40 h-auto" />
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col space-y-6 mt-10">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-12 py-8 transition-colors block w-full
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

      {/* Dim + blurred background */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

    </>
  );
};

export default Sidebar;
