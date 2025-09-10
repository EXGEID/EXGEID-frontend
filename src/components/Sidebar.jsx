// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const Sidebar = () => {
  const links = [
    { name: "Home", path: "/dashboard", icon: "🏠" },
    { name: "Videos", path: "/videos", icon: "🎬" },
    { name: "Referrals", path: "/referrals", icon: "👥" },
    { name: "Tasks", path: "/tasks", icon: "📝" },
    { name: "Withdrawals", path: "/withdrawals", icon: "💳" },
    { name: "Profile", path: "/profile", icon: "👤" },
  ];

  return (
    <aside className="w-64 bg-[#0f0f25] text-white min-h-screen border-r border-gray-700 p-6 space-y-10">
      {/* Logo */}
      <div className="flex items-center justify-center">
        <img src={logo} alt="Logo" className="w-40 h-auto" />
      </div>

      {/* Links */}
      <nav className="flex flex-col space-y-6">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors block w-full
              ${isActive ? "bg-[#430417] text-white" : "text-gray-300 hover:bg-[#430417] hover:text-white"}`
            }
          >
            <span className="text-lg">{link.icon}</span>
            <span className="text-base">{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
