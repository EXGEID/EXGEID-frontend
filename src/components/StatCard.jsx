const StatCard = ({ title, value, icon }) => {
  return (
    <div className="bg-gradient-to-br from-[#1c1c3c] to-[#0d0d1f] p-6 rounded-xl flex flex-col items-center justify-center text-center">
      <div className="text-2xl mb-2">{icon}</div>
      <h4 className="text-sm text-gray-300">{title}</h4>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
};

export default StatCard;