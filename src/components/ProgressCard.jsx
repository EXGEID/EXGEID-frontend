const ProgressCard = () => {
  return (
    <div className="bg-[#1a1a3a] p-4 rounded-xl">
      <h3 className="font-semibold mb-2">Your Level Progress</h3>
      <p className="text-xs text-gray-400">Day 3/5</p>
      <ul className="mt-2 space-y-1 text-sm">
        <li>✅ Watch 10 YouTube videos</li>
        <li>✅ Subscribe & Like</li>
        <li>✅ Follow 5 IG links</li>
        <li>⬜ Follow 5 TikTok links</li>
        <li>⬜ Bring in 8 referrals (6/8)</li>
        <li>⬜ Join Telegram Group</li>
        <li>⬜ Join WhatsApp Group</li>
      </ul>
      <button className="mt-3 bg-red-600 w-full py-2 rounded-lg">Continue</button>
    </div>
  );
};

export default ProgressCard;
