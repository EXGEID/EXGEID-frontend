const ActivityCard = () => {
  return (
    <div className="bg-[#1a1a3a] p-4 rounded-xl">
      <h3 className="font-semibold">Recent Activity</h3>
      <p className="text-2xl text-red-600 font-bold">8 Tasks</p>
      <ul className="text-xs text-gray-400 mt-2 space-y-1">
        <li>+ ₦500 earned</li>
        <li>+ 2 referrals joined</li>
        <li>You followed 3 TikTok accounts</li>
      </ul>
    </div>
  );
};

export default ActivityCard;
