const CheckinCard = () => {
  return (
    <div className="bg-[#1a1a3a] p-4 rounded-xl">
      <h3 className="font-semibold">Daily Check-In</h3>
      <p className="text-yellow-400">₦300</p>
      <button className="mt-3 bg-red-600 w-full py-2 rounded-lg">Claim</button>
      <p className="text-xs text-gray-400 mt-2">
        Checked in 4 days straight! 🎉
      </p>
    </div>
  );
};

export default CheckinCard;
