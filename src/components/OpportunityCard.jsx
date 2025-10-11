const OpportunityCard = ({ title, bonus, earnings, status }) => {
  return (
    <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] p-6 rounded-xl flex flex-col md:flex-row justify-between items-center mt-4">
      {/* Left side */}
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-gray-400">{bonus}</p>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-400">Earnings</p>
        <p className="text-yellow-400 font-bold">₦{earnings}</p>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-2 mt-3 md:mt-0">
        {/* Earnings in the middle */}
        <div className="text-center">
          <p className="text-sm text-gray-400">Starts: Tomorrow - 9:00 AM</p>
        </div>

        {/* Status */}
        <span className="text-sm text-yellow-400">{status}</span>
      </div>
    </div>
  );
};

export default OpportunityCard;
