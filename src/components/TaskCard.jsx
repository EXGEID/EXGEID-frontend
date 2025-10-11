import { FaClock } from "react-icons/fa";

const TaskCard = ({ title, progress, earnings, due }) => {
  return (
    <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] p-6 rounded-xl flex flex-col md:flex-row justify-between items-center mt-4">
      {/* Left side */}
      <div className="flex flex-col">
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-gray-400">{progress}</p>
      </div>

      <div className="text-center">
          <p className="text-sm text-gray-400">Earnings</p>
          <p className="text-yellow-400 font-bold">₦{earnings}</p>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end mt-3 md:mt-0 gap-2">
        <div className="flex items-center text-xs text-gray-400">
          <FaClock className="mr-1" /> {due}
        </div>

        {/* Button */}
        <button className="bg-[#8F0406] px-4 py-2 rounded-lg text-white font-medium">
          Continue Task
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
