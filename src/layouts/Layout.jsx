// src/layouts/Layout.jsx
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 bg-[#0f0f25] text-white min-h-screen">
        <Topbar />
        <div className="p-6">
          <Outlet /> {/* This loads the active page */}
        </div>
      </main>
    </div>
  );
};

export default Layout;
