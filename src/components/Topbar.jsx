// src/components/Topbar.jsx
const Topbar = () => {
  return (
    <div className="flex justify-end items-center px-8 py-4 border-b border-gray-700">
      <span className="mr-4">Username</span>
      <img
        src="https://via.placeholder.com/40"
        alt="Profile"
        className="w-10 h-10 rounded-full"
      />
    </div>
  );
};

export default Topbar;
