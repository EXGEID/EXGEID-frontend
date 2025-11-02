// src/pages/Withdrawals.jsx
import { useNavigate } from "react-router-dom";
import React from "react";
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
    <div className="space-y-6 bg-[#020109] text-white md:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
          <img src={angel} alt="angel_top" className="w-14 h-14 sm:w-20 sm:h-20" />
          Withdraw Earnings
        </h1>

        {/* outline yellow button */}
        <button onClick={() => navigate('?modal=withdrawal-requirements')} className="border border-yellow-500 text-yellow-500 px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-sm sm:text-base hover:bg-yellow-500/10">
          Withdrawal requirements
        </button>
      </div>

      {/* Balance & Card Info */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        {/* Balance card */}
        <div className="bg-gradient-to-r from-[#06031E] to-[#0E083C] rounded-xl p-4 sm:p-6">
          {/* Balance + Withdraw button side by side */}
          <div className="flex justify-between items-start flex-wrap gap-3">
            <div>
              <p className="text-sm sm:text-lg text-gray-300">Available Balance</p>
              <h2 className="text-2xl sm:text-3xl font-bold mt-1">₦12,350.00</h2>
            </div>
            <button className="bg-[#8F0406] px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base hover:bg-red-700">
              Withdraw
            </button>
          </div>

          {/* Total Breakdown */}
          <p className="mt-6 text-gray-300 font-semibold text-center text-sm sm:text-base">
            Total Breakdown
          </p>

          <div className="mt-4 sm:mt-6 flex flex-wrap items-center justify-between text-sm sm:text-base gap-4 sm:gap-0">
            <div className="text-left flex-1">
              <div className="text-gray-300">Approved</div>
              <div className="font-semibold text-white mt-1">₦4,499.00</div>
            </div>

            <div className="text-left flex-1">
              <div className="text-gray-300">Pending</div>
              <div className="font-semibold text-yellow-400 mt-1">₦4,499.00</div>
            </div>

            <div className="text-left flex-1">
              <div className="text-gray-300">Paid</div>
              <div className="font-semibold text-green-400 mt-1">₦4,499.00</div>
            </div>
          </div>
        </div>

        {/* Bank Card */}
        <div className="bg-gradient-to-r from-[#110B41] to-[#430417] rounded-xl p-4 sm:p-6 flex flex-col justify-between">
          {/* Bank name + logo */}
          <div className="flex justify-between items-center">
            <p className="text-base sm:text-lg font-semibold">Access Bank</p>
            <img
              src={access}
              alt="access_logo"
              className="w-16 sm:w-24 object-contain"
            />
          </div>

          {/* Card number */}
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl tracking-widest">
            5273 ***********
          </p>

          {/* Holder + Expiry + Mastercard */}
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Card Holder Name</p>
              <p className="font-semibold text-white text-sm sm:text-base">
                ASHLEY ANYARALU
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Expired Date</p>
              <p className="font-semibold text-white text-sm sm:text-base">06/28</p>
            </div>

            <img
              src={mastercard}
              alt="mastercard_logo"
              className="w-12 sm:w-16 object-contain self-end sm:self-center"
            />
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-[#09052C] rounded-xl p-4 sm:p-6 overflow-x-auto">
        {/* Title */}
        <div className="flex items-center gap-2 sm:gap-3 border-b border-gray-700 pb-2 sm:pb-3">
          <FaHistory className="text-white text-base sm:text-lg" />
          <h2 className="text-lg sm:text-xl font-bold">Recent Transactions</h2>
        </div>

        {/* Table header */}
        <div className="mt-3 sm:mt-4 grid grid-cols-4 text-gray-400 text-xs sm:text-sm px-1 sm:px-2">
          <div className="text-center">Date</div>
          <div className="text-center">Method</div>
          <div className="text-center">Amount</div>
          <div className="text-center">Status</div>
        </div>

        {/* Transactions list */}
        <div className="mt-3 sm:mt-4 space-y-3">
          {transactions.map((tx, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-r from-[#06031E] to-[#0E083C] p-3 sm:p-4 rounded-lg grid grid-cols-4 items-center text-xs sm:text-sm"
            >
              <div className="text-center">{tx.date}</div>
              <div className="text-center">{tx.method}</div>
              <div className="text-center">{tx.amount}</div>
              <div className="text-center">
                {tx.status === "Approved" ? (
                  <span className="inline-flex items-center justify-center gap-1 sm:gap-2 text-green-500 bg-green-500/20 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium">
                    <FaCheckCircle className="text-green-400 text-[10px] sm:text-sm" />{" "}
                    Approved
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center gap-1 sm:gap-2 text-yellow-500 bg-yellow-500/20 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium">
                    <FaClock className="text-yellow-400 text-[10px] sm:text-sm" />{" "}
                    Processing
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
