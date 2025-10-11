const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] p-6 rounded-xl flex flex-col justify-center">
      <div className="text-2xl mb-2 text-yellow-400">{icon}</div>
      <h4 className="text-sm text-gray-300">{title}</h4>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
};

export default StatCard;