const UserLevelCard = () => {
  return (
    <div className="bg-[#1a1a3a] p-4 rounded-xl">
      <div className="flex items-center gap-2">
        <img src="https://via.placeholder.com/30" alt="avatar" className="w-8 h-8 rounded-full" />
        <div>
          <p>Ashley</p>
          <span className="text-xs text-gray-400">Referred by: XYZ</span>
        </div>
      </div>
      <div className="mt-4">
        <p>Level 1 🔑</p>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div className="bg-red-600 h-2 rounded-full w-[40%]"></div>
        </div>
        <p className="text-xs mt-2">You are currently on Level 1</p>
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        <li>✅ Watch 10 YouTube videos</li>
        <li>✅ Subscribe & Like</li>
        <li>✅ Follow 5 IG links</li>
      </ul>
    </div>
  );
};

export default UserLevelCard;
