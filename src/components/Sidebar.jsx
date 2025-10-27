import { NavLink, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import logo from "../assets/logo2.png";
import {
  FaHome,
  FaVideo,
  FaUserFriends,
  FaTasks,
  FaCreditCard,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { useState } from "react";

// API endpoint for logout
const LOGOUT_ENDPOINT = "https://exgeid-backend.onrender.com/api/v1/auth/logout";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Show error toast with custom styling
  const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-center",
      style: {
        background: "#09052C",
        color: "#CACACA",
        border: "1px solid #ef4444",
        zIndex: 9999,
      },
      iconTheme: {
        primary: "#ef4444",
        secondary: "#09052C",
      },
      duration: 5000,
    });
  };

  // Show success toast with #FEC84D border and icon
  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-center",
      style: {
        background: "#09052C",
        color: "#CACACA",
        border: "1px solid #FEC84D", // Updated to #FEC84D
        zIndex: 9999,
      },
      iconTheme: {
        primary: "#FEC84D", // Updated icon color to match border
        secondary: "#09052C",
      },
      duration: 3000,
    });
  };

  // Handle logout functionality
  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    console.log("Initiating logout request to:", LOGOUT_ENDPOINT);
    
    try {
      const response = await fetch(LOGOUT_ENDPOINT, {
        method: "GET",
        credentials: "include", // Include cookies for session management
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Logout response status:", response.status);

      if (response.ok) {
        console.log("Logout successful");
        showSuccessToast("Successfully logged out! Please wait...");
        // Clear any local storage/session storage if needed
        localStorage.clear();
        sessionStorage.clear();
        // Redirect to home page
        setTimeout((() => {navigate("/")}), 3000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Logout failed:", errorData);
        throw new Error(errorData.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      showErrorToast(error.message || "An error occurred during logout");
    } finally {
      setIsLoggingOut(false);
    }
  };

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
      {/* Toaster with high z-index positioned within this component */}
      <Toaster 
        position="top-center"
        containerStyle={{
          zIndex: 9999,
          top: '20px',
        }}
        toastOptions={{
          style: {
            background: "#09052C",
            color: "#CACACA",
            zIndex: 9999,
          },
          duration: 5000,
        }}
      />

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 h-[100%] w-[60%] md:w-64 bg-[#06031E] text-white lg:text-[16px] text-[12px] border-r border-[#343434]
        transform transition-transform duration-300 z-[60] flex flex-col 
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center p-6">
          <img src={logo} alt="Logo" className="w-40 h-auto" />
        </div>

        {/* Nav Links */}
        <nav className="flex-grow space-y-4 mt-10">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-12 py-[1em] transition-colors block w-full
                ${
                  isActive
                    ? "bg-[#430417] text-white"
                    : "text-gray-300 hover:bg-[#430417] hover:text-white"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <span>{link.icon}</span>
              <span className="">{link.name}</span>
            </NavLink>
          ))}
        </nav>

        <div 
          className={`flex border-t md:pl-12 py-4 md:py-8 px-16 cursor-pointer transition-colors ${
            isLoggingOut 
              ? "text-gray-500 cursor-not-allowed" 
              : "hover:text-red-500"
          }`}
          onClick={handleLogout}
        >
          <p className="pr-4 md:pr-6">{isLoggingOut ? "Logging out..." : "Logout"}</p>
          <FaSignOutAlt className={`my-auto ${isLoggingOut ? "animate-spin" : ""}`}/>
        </div>
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