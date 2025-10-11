import StatCard from "../components/StatCard";
import TaskCard from "../components/TaskCard";
import OpportunityCard from "../components/OpportunityCard";
import CompletedTaskCard from "../components/CompletedTaskCard";
import angel from "../assets/angel.png";

import { FaVideo, FaClock, FaList, FaEyeSlash } from "react-icons/fa";

const Tasks = () => {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mt-6">
        <img src={angel} alt="angel_top" className="w-20 h-20"/>
        <h2 className="text-2xl font-bold">Let’s earn today!</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        <StatCard title="Videos Watched" value="5" icon={<FaVideo />} />
        <StatCard title="Pending Earnings" value="₦3,500" icon={<FaClock />} />
        <StatCard title="Tasks" value="3" icon={<FaList />} />
        <StatCard title="Unwatched Videos" value="2" icon={<FaEyeSlash />} />
      </div>

      {/* Today's Earnings Opportunities */}
      <h3 className="text-lg font-semibold mt-10">Today's Earnings Opportunities</h3>
      <TaskCard
        title="Watch Sponsored Video – Brand X"
        progress="2 of 5 minutes watched"
        earnings="1800"
        due="Due: Today – 11:00 AM"
      />
      <TaskCard
        title="Watch Sponsored Video – Brand X"
        progress="2 of 5 minutes watched"
        earnings="1800"
        due="Due: Today – 11:00 AM"
      />
      <TaskCard
        title="Watch Sponsored Video – Brand X"
        progress="2 of 5 minutes watched"
        earnings="1800"
        due="Due: Today – 11:00 AM"
      />

      {/* Upcoming Opportunities */}
      <h3 className="text-lg font-semibold mt-10">Upcoming Opportunities</h3>
      <OpportunityCard
        title="Special Campaign – Watch & Earn Double"
        bonus="Bonus: 2× Earnings"
        earnings="3800"
        status="Pending"
      />

      {/* Completed Tasks */}
      <h3 className="text-lg font-semibold mt-10">Completed Tasks</h3>
      <CompletedTaskCard title="Watched – Brand Y Video" earnings="₦300 credited" />
      <CompletedTaskCard title="Watched – Brand Y Video" earnings="₦300 credited" />
    </div>
  );
};

export default Tasks;
