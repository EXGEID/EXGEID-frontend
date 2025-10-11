// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layouts/Layout";
import Dashboard from "./pages/Dashboard";
import Referrals from "./pages/Referrals";
import Tasks from "./pages/Tasks";
import Profile from "./pages/Profile";
import Withdrawals from "./pages/Withdrawals";
import Videos from "./pages/Videos";

function App() {
  return (
    <Routes>
      {/* Redirect root path to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Main layout routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/withdrawals" element={<Withdrawals />} />
          <Route path="/videos" element={<Videos />} />
        </Route>
    </Routes>
  );
}

export default App;
