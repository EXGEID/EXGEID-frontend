// src/pages/Withdrawals.jsx
import { useNavigate } from "react-router-dom";
import { FaClock, FaCheckCircle, FaHistory } from "react-icons/fa";
import access from "../assets/access.png";
import mastercard from "../assets/mastercard.png";
import angel from "../assets/angel.png";

const Withdrawals = () => {
  const transactions = [
    { date: "03/08/2025", method: "Bank Transfer", amount: "₦12,350.00", status: "Processing" },
    { date: "02/07/2025", method: "Card", amount: "₦12,350.00", status: "Approved" },
    { date: "03/08/2025", method: "Bank Transfer", amount: "₦12,350.00", status: "Processing" },
    { date: "02/07/2025", method: "Card", amount: "₦12,350.00", status: "Approved" },
    { date: "02/07/2025", method: "Card", amount: "₦12,350.00", status: "Approved" },
  ];

  const navigate = useNavigate();

  return (
    <div className="space-y-6 bg-[#020109]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <img src={angel} alt="angel_top" className="w-20 h-20"/>Withdraw Earnings
        </h1>
        {/* outline yellow button */}
        <button onClick={() => navigate('?modal=withdrawal-requirements')} className="border border-yellow-500 text-yellow-500 px-4 py-2 rounded-lg font-semibold">
          Withdraw requirement
        </button>
      </div>

      {/* Balance & Card Info */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Balance card */}
        <div className="bg-gradient-to-r from-[#06031E] to-[#0E083C] rounded-xl p-6">
          {/* Balance + Withdraw button side by side */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-lg text-gray-300">Available Balance</p>
              <h2 className="text-3xl font-bold mt-1">₦12,350.00</h2>
            </div>
            <div className="flex flex-col items-end">
              <button className="bg-[#8F0406] px-6 py-2 rounded-lg">Withdraw</button>
            </div>
          </div>

          {/* Total Breakdown - centered title */}
          <p className="mt-6 text-gray-300 font-semibold text-center">Total Breakdown</p>

          {/* evenly spaced breakdown columns; text starts from left in each column */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-left">
              <div className="text-sm text-gray-300">Approved</div>
              <div className="font-semibold text-white mt-1">₦4,499.00</div>
            </div>

            <div className="text-left">
              <div className="text-sm text-gray-300">Pending</div>
              <div className="font-semibold text-yellow-400 mt-1">₦4,499.00</div>
            </div>

            <div className="text-left">
              <div className="text-sm text-gray-300">Paid</div>
              <div className="font-semibold text-green-400 mt-1">₦4,499.00</div>
            </div>
          </div>
        </div>

        {/* Bank Card */}
        <div className="bg-gradient-to-r from-[#110B41] to-[#430417] rounded-xl p-6 flex flex-col justify-between">
          {/* Bank name + logo placeholder */}
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Access Bank</p>
            <img
              src={access}
              alt="access_logo"
              className="max-w-[60%] object-contain"
            />
          </div>

          {/* Card number */}
          <p className="mt-6 text-xl tracking-widest">5273 ***********</p>

          {/* Holder + Expiry + Mastercard placeholder */}
          <div className="mt-6 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Card Holder Name</p>
              <p className="font-semibold text-white">ASHLEY ANYARALU</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm">Expired Date</p>
              <p className="font-semibold text-white">06/28</p>
            </div>

            <img
              src={mastercard}
              alt="mastercard_logo"
              className="max-w-[60%] object-contain"
            />
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-[#09052C] rounded-xl p-6">
        {/* Title + icon + thin divider */}
        <div className="flex items-center gap-3 border-b border-gray-700 pb-3">
          <FaHistory className="text-white" />
          <h2 className="text-xl font-bold">Recent Transactions</h2>
        </div>

        {/* header labels for the columns */}
        <div className="mt-4 grid grid-cols-4 text-gray-400 text-sm px-2">
          <div className="text-center">Date</div>
          <div className="text-center">Method</div>
          <div className="text-center">Amount</div>
          <div className="text-center">Status</div>
        </div>

        {/* Transactions list */}
        <div className="mt-4 space-y-3">
          {transactions.map((tx, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-r from-[#06031E] to-[#0E083C] p-4 rounded-lg grid grid-cols-4 items-center"
            >
              {/* center each field */}
              <div className="text-center">{tx.date}</div>
              <div className="text-center">{tx.method}</div>
              <div className="text-center">{tx.amount}</div>
              <div className="text-center">
                {tx.status === "Approved" ? (
                  <span className="inline-flex items-center justify-center gap-2 text-green-500 bg-green-500/20 px-3 py-1 rounded-full text-xs font-medium">
                    <FaCheckCircle className="text-green-400" /> Approved
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2 text-yellow-500 bg-yellow-500/20 px-3 py-1 rounded-full text-xs font-medium">
                    <FaClock className="text-yellow-400" /> Processing
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Withdrawals;
