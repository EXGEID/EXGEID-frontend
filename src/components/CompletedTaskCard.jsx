const CompletedTaskCard = ({ title, earnings }) => {
  return (
    <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] p-4 rounded-xl flex justify-between items-center mt-4">
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-gray-400">Earnings: "{earnings}"</p>
      <span className="text-green-400 font-medium">Completed ✅</span>
    </div>
  );
};

export default CompletedTaskCard;
