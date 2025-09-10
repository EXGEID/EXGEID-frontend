import ReferralCard from "../components/ReferralCard";
import ReferralSteps from "../components/ReferralSteps";
import StatCard from "../components/StatCard";
import { FaVideo, FaUsers, FaLink } from "react-icons/fa";

const Referrals = () => {
  return (
    <div className="bg-[#0a0a1a]">
        {/* Header */}
        <div className="text-center mt-6">
          <div className="text-5xl">🎁</div>
          <h2 className="text-2xl font-bold mt-2">Invite & Earn with Exgeid</h2>
          <p className="text-gray-400 text-sm max-w-2xl mx-auto mt-2">
            The more friends you invite, the faster you level up and the bigger your monthly earnings. 
            Share your link every day to level up faster!
          </p>
        </div>

        {/* Referral Steps */}
        <ReferralSteps />

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <StatCard title="Total Videos Watched" value="19 videos" icon={<FaVideo />} />
          <StatCard title="Total Referrals" value="3 Referrals" icon={<FaUsers />} />
          <StatCard title="Accounts Followed" value="5" icon={<FaLink />} />
        </div>

        {/* Referral Card */}
        <ReferralCard code="EXG-A3421" />
    </div>
  );
};

export default Referrals;
