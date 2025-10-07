// src/components/Topbar.jsx
const Topbar = () => {
  return (
    <div className="bg-[#0f0f25] flex justify-end items-center px-8 py-4 border-b border-gray-700">
      <span className="mr-4">Ashley</span>
      <img
        src="https://randomuser.me/api/portraits/men/75.jpg"
        alt="avatar"
        className="w-10 h-10 rounded-full"
      />
    </div>
  );
};

export default Topbar;
