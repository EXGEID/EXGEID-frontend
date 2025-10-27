import { FaVideo, FaUsers, FaLink } from "react-icons/fa";
import { IoLogoFacebook, IoLogoWhatsapp, IoLogoInstagram, IoLogoTwitter, IoLogoSnapchat, IoCopyOutline } from "react-icons/io5";

const Referrals = () => {
  return (
    <div className="bg-[#020109] min-h-screen md:px-6 py-8 text-white">
      {/* Header */}
      <div className="text-center">
        <div className="text-5xl">🎁</div>
        <h2 className="text-2xl font-bold mt-2">Invite & Earn with Exgeid</h2>
        <p className="text-gray-400 text-sm max-w-2xl mx-auto mt-2">
          The more friends you invite, the faster you level up and the bigger
          your monthly earnings. Share your link every day to level up faster!
        </p>
      </div>

      {/* Referral Steps */}
      <div className="mt-8 relative flex justify-center items-center gap-6 flex-wrap">
        {[
          { label: "₦500", level: "Level 1", color: "text-white", bg: "bg-transparent", border: "border-gray-500" },
          { label: "₦1000", level: "Level 2", color: "text-gray-400", bg: "bg-white" },
          { label: "₦1500", level: "Level 3", color: "text-gray-400", bg: "bg-white" },
          { label: "₦2000", level: "Level 4", color: "text-gray-400", bg: "bg-white" },
        ].map((step, index, array) => (
          <div key={index} className="flex flex-col items-center relative">
            <div
              className={`w-12 h-12 rounded-full border-2 ${step.border} ${step.bg} flex items-center justify-center font-semibold ${step.color}`}
            >
              {index + 1}
            </div>
            <p className="text-gray-400 text-xs mt-2">{step.level}</p>
            <p className="text-xs">{step.label}</p>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] p-6 rounded-xl flex flex-col justify-between">
          <p className="font-medium">Total Videos Watched</p>
          <span className="text-yellow-400">19 videos</span>
        </div>
        <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] p-6 rounded-xl flex flex-col justify-between">
          <p className="font-medium">Total Referrals</p>
          <span className="text-yellow-400">3 Referrals</span>
        </div>
        <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] p-6 rounded-xl flex flex-col justify-between">
          <p className="font-medium">Amounts of</p>
          <p className="font-medium">Accounts Followed</p>
          <span className="text-yellow-400">5</span>
        </div>
      </div>

      {/* Referral Code */}
      <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] p-6 rounded-xl mt-8">
        <div>
          <p className="mb-2 font-medium">Your Referral Code:</p>
        <div className="flex items-center justify-between bg-yellow-500/15 rounded-md p-2">
          <span className="text-yellow-400 font-semibold">EXG-A3421</span>
          <IoCopyOutline className="text-yellow-400 cursor-pointer" />
        </div>

        </div>

        {/* Social Icons */}
        <div className="flex justify-around mt-6 text-2xl">
          <IoLogoFacebook className="text-blue-500" />
          <IoLogoWhatsapp className="text-green-500" />
          <IoLogoInstagram className="text-pink-500" />
          <IoLogoTwitter className="text-sky-400" />
          <IoLogoSnapchat className="text-yellow-400" />
        </div>

        {/* Referral Rules */}
        <div className="mt-6 space-y-2 text-sm">
          <p>1. Share your referral link with friends and family on any of these platforms</p>
          <p>2. Receive 500 each time someone clicks your link</p>
          <p>3. Earn 1500 bonus when someone creates an account through your link</p>
          <p>4. New Users get 10,000 Naira Sign-Up Bonus</p>
        </div>
      </div>
    </div>
  );
};

export default Referrals;
