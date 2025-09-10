// src/pages/Withdrawals.jsx
const Withdrawals = () => {
  const transactions = [
    { date: "03/08/2025", method: "Bank Transfer", amount: "₦12,350.00", status: "Processing" },
    { date: "02/07/2025", method: "Card", amount: "₦12,350.00", status: "Approved" },
    { date: "03/08/2025", method: "Bank Transfer", amount: "₦12,350.00", status: "Processing" },
    { date: "02/07/2025", method: "Card", amount: "₦12,350.00", status: "Approved" },
    { date: "02/07/2025", method: "Card", amount: "₦12,350.00", status: "Approved" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span role="img" aria-label="angel">👼</span> Withdraw Earnings
        </h1>
        <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold">
          Withdraw requirement
        </button>
      </div>

      {/* Balance & Card Info */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Balance */}
        <div className="bg-gradient-to-r from-[#1e1e40] to-[#2a2a5a] rounded-xl p-6">
          <p className="text-lg text-gray-300">Available Balance</p>
          <h2 className="text-3xl font-bold mt-2">₦12,350.00</h2>
          <button className="mt-4 bg-red-600 px-6 py-2 rounded-lg">Withdraw</button>

          <div className="mt-6 space-y-1">
            <p className="text-gray-300">Approved: <span className="text-green-400">₦4,499.00</span></p>
            <p className="text-gray-300">Pending: <span className="text-yellow-400">₦4,499.00</span></p>
            <p className="text-gray-300">Paid: <span className="text-green-400">₦4,499.00</span></p>
          </div>
        </div>

        {/* Bank Card */}
        <div className="bg-gradient-to-r from-[#2a2a5a] to-[#3b3b70] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <p className="text-lg font-semibold">Access Bank</p>
            <p className="mt-2 text-xl tracking-widest">5273 ***********</p>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <div>
              <p className="text-gray-400">Card Holder Name</p>
              <p className="font-semibold">ASHLEY ANYARALU</p>
            </div>
            <div>
              <p className="text-gray-400">Expired Date</p>
              <p className="font-semibold">06/28</p>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-[#1a1a3a] rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="p-3">Date</th>
                <th className="p-3">Method</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => (
                <tr key={idx} className="border-b border-gray-700">
                  <td className="p-3">{tx.date}</td>
                  <td className="p-3">{tx.method}</td>
                  <td className="p-3">{tx.amount}</td>
                  <td className="p-3">
                    {tx.status === "Approved" ? (
                      <span className="bg-green-600 px-3 py-1 rounded-lg text-sm">Approved</span>
                    ) : (
                      <span className="bg-yellow-600 px-3 py-1 rounded-lg text-sm">Processing</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Withdrawals;
