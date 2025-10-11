const EarningsCard = () => {
  return (
    <div className="bg-[#1a1a3a] p-4 rounded-xl">
      <h3 className="font-semibold">Total Earnings</h3>
      <p className="text-xl text-yellow-400">₦7,499.00</p>
      <div className="text-xs text-gray-400 mt-2">
        <p>Recent Earnings: ₦7,499.00</p>
        <p>Total Tasks: 3/7</p>
        <p>Total Videos: 5</p>
        <p>Total Clicks: 8</p>
      </div>
    </div>
  );
};

export default EarningsCard;
