const SubscribersCard = () => {
  const subs = ["Lorem Amaka", "Lorem Amaka", "Lorem Amaka", "Lorem Amaka"];
  return (
    <div className="bg-[#1a1a3a] p-4 rounded-xl">
      <h3 className="font-semibold mb-3">New Subscribers</h3>
      <ul className="space-y-2 text-sm">
        {subs.map((name, i) => (
          <li key={i} className="flex justify-between">
            <span>{name}</span>
            <span className="text-yellow-400">₦12,000.00</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubscribersCard;
