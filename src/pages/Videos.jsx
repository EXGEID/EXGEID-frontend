import { FaClock, FaWallet } from "react-icons/fa";
import angelVid from "../assets/angelVid.png";

const Videos = () => {
  const videoList = [
    { platform: "YouTube", duration: "02:30sec", price: "₦1800.00" },
    { platform: "TikTok", duration: "00:30sec", price: "₦1800.00" },
    { platform: "YouTube", duration: "00:30sec", price: "₦1300.00" },
    { platform: "TikTok", duration: "00:30sec", price: "₦1800.00" },
    { platform: "YouTube", duration: "02:30sec", price: "₦1800.00" },
  ];

  return (
    <div className="space-y-6">
      {/* Progress / Earnings Card */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-[#06031E] to-[#0E083C] rounded-xl p-6 flex flex-col justify-between">
          <p className="text-gray-300 font-medium">7 of 10 Videos Watched Today</p>

          {/* Progress Bar with percentage */}
          <div className="flex items-center justify-between mt-2">
            <div className="w-full bg-gray-700 h-2 rounded-full mr-3">
              <div className="bg-red-600 h-2 rounded-full" style={{ width: "70%" }}></div>
            </div>
            <span className="text-sm text-gray-300">70%</span>
          </div>

          <div className="flex justify-between items-center mt-2">
			<div>
				<p className="mt-4 text-gray-300 font-medium flex items-center gap-2">
					Todays Earnings <FaWallet className="text-white-400" />
				</p>
				<span className="text-yellow-400 font-bold">₦ 4,499.00</span>
			</div>
            <button className="bg-[#8F0406] px-6 py-2 rounded-lg font-semibold">
              View Total Earnings
            </button>
          </div>
        </div>

        {/* Angel Placeholder */}
        <div className="flex items-center justify-center">
            <img src={angelVid} alt="angel" className="w-60 h-60"/>
        </div>
      </div>

      {/* Videos Section */}
      <h2 className="text-xl font-bold">Videos</h2>
      <div className="space-y-4">
        {videoList.map((video, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-r from-[#06031E] to-[#0E083C] rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            {/* Left - Platform Logo */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center text-white">
                {video.platform === "YouTube" ? "▶️" : "🎵"}
              </div>
              <p className="text-sm text-gray-300 max-w-xs">
                Lorem ipsum dolor sit amet consectetur facilisis vel.
              </p>
            </div>

            {/* Middle - Task Info */}
            <div>
				<div>
					<p className="text-sm text-gray-300">Watch full video + Like + Subscribe</p>
					<div className="flex justify-between items-center mt-2">
						<div className="flex items-center gap-5 text-gray-400 text-sm">
							<FaClock /> {video.duration}
						</div>
						<p className="text-yellow-400 font-bold">{video.price}</p>
					</div>	
				</div>
            </div>

            {/* Right - Button */}
            <button className="bg-[#8F0406] px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 self-start md:self-auto">
              Watch video ▶️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Videos;
