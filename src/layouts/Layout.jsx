// src/layouts/Layout.jsx
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex">
      {/* Sidebar (fixed) */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 bg-[#020109] text-white min-h-screen 
        md:ml-64 transition-all duration-300">
        <Topbar />
        <div className="md:p-6 p-4 pt-28 md:pt-28 pb-8 bg-[#020109]">
          <Outlet /> {/* This loads the active page */}
        </div>
      </main>
    </div>
  );
};

export default Layout;
