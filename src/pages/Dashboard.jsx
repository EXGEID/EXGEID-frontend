import UserLevelCard from "../components/UserLevelCard";
import ProgressCard from "../components/ProgressCard";
import ReferralCard from "../components/ReferralCard";
import EarningsCard from "../components/EarningsCard";
import ActivityCard from "../components/ActivityCard";
import CheckinCard from "../components/CheckinCard";
import SubscribersCard from "../components/SubscribersCard";

const Dashboard = () => {
  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <UserLevelCard />
            <ProgressCard />
            <ReferralCard />
          </div>
          {/* Middle Column */}
          <div className="space-y-6">
            <EarningsCard />
            <ActivityCard />
            <CheckinCard />
          </div>
          {/* Right Column */}
          <SubscribersCard />
        </div>
    </div>
  );
};

export default Dashboard;