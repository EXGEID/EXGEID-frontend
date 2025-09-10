import { FaGift } from "react-icons/fa";

const OpportunityCard = ({ title, bonus, earnings, status }) => {
  return (
    <div className="bg-gradient-to-br from-[#1c1c3c] to-[#0d0d1f] p-4 rounded-xl flex flex-col md:flex-row justify-between items-center mt-4">
      <div className="flex items-center gap-2">
        <FaGift className="text-green-400" />
        <div>
          <h4 className="font-semibold">{title}</h4>
          <p className="text-sm text-gray-400">{bonus}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 mt-3 md:mt-0">
        <div className="text-right">
          <p className="text-sm text-gray-400">Earnings</p>
          <p className="text-orange-400 font-bold">₦{earnings}</p>
        </div>
        <p className="text-yellow-400 font-medium">{status}</p>
      </div>
    </div>
  );
};

export default OpportunityCard;
