import { FaPlayCircle, FaClock } from "react-icons/fa";

const TaskCard = ({ title, progress, earnings, due }) => {
  return (
    <div className="bg-gradient-to-br from-[#1c1c3c] to-[#0d0d1f] p-4 rounded-xl flex flex-col md:flex-row justify-between items-center mt-4">
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-gray-400">{progress}</p>
      </div>
      <div className="flex items-center gap-6 mt-3 md:mt-0">
        <div className="text-right">
          <p className="text-sm text-gray-400">Earnings</p>
          <p className="text-orange-400 font-bold">₦{earnings}</p>
        </div>
        <div className="flex items-center text-xs text-gray-400">
          <FaClock className="mr-1" /> {due}
        </div>
        <button className="bg-red-600 px-4 py-2 rounded-lg text-white font-medium">
          Continue Task
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
