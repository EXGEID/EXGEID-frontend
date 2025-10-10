import { useState } from "react";
import { FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar";

const Topbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Topbar */}
      <div className="bg-[#06031E] flex justify-between items-center px-8 py-8 border-b border-[#343434] relative z-50">
        {/* Hamburger icon (visible only on mobile) */}
        <button
          onClick={() => setIsOpen(true)}
          className="text-white text-xl md:hidden"
        >
          <FaBars />
        </button>

        {/* User info */}
        <div className="flex items-center ml-auto">
          <img
            src="https://randomuser.me/api/portraits/men/75.jpg"
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
          <span className="ml-3 text-white font-medium">Ashley</span>
        </div>
      </div>

      {/* Sidebar (handles slide-in and backdrop blur) */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Topbar;
