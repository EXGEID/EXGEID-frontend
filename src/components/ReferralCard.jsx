import { FaFacebook, FaWhatsapp, FaInstagram, FaXTwitter, FaSnapchat } from "react-icons/fa6";

const ReferralCard = ({ code = "EXG-A3421" }) => {
  return (
    <div className="bg-[#1a1a3a] p-6 rounded-xl mt-6">
      <h3 className="font-semibold mb-2">Your Referral Code:</h3>
      <div className="bg-[#0a0a1a] rounded-lg p-2 flex justify-between items-center text-yellow-300">
        <span>{code}</span>
        <button className="text-gray-400 hover:text-white">📋</button>
      </div>
      <div className="flex gap-4 mt-4 text-2xl text-gray-300">
        <FaFacebook className="hover:text-blue-500" />
        <FaWhatsapp className="hover:text-green-500" />
        <FaInstagram className="hover:text-pink-500" />
        <FaXTwitter className="hover:text-slate-200" />
        <FaSnapchat className="hover:text-yellow-400" />
      </div>
      <ul className="mt-4 text-sm space-y-1 text-gray-400">
        <li>1. Share your referral link with friends & family</li>
        <li>2. Receive ₦500 each time someone clicks</li>
        <li>3. Earn ₦1500 bonus when someone signs up</li>
        <li>4. New Users get ₦10,000 Sign-Up Bonus</li>
      </ul>
    </div>
  );
};

export default ReferralCard;
