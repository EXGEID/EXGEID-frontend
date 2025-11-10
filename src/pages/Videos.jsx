import { useContext, useEffect, useState } from 'react';
import { FaVideo, FaClock, FaWallet, FaCheck } from "react-icons/fa";
import angelVid from "../assets/angelVid.png";
import ModalContext from "../utils/ModalContext";
import Youtube from "../assets/youtube.png";
import { Toaster, toast } from "react-hot-toast";

const Videos = () => {
  const { openModal } = useContext(ModalContext);
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const VIDEO_TASK_API_URL = "https://exgeid-backend.onrender.com/api/v1/task/fetch/video-task";
  const REFRESH_TOKEN_URL = "https://exgeid-backend.onrender.com/api/v1/refresh/token";

  // Toast Functions
  const showSuccessToast = (message) => {
    toast.success(message, {
      position: "top-center",
      style: {
        background: "#09052C",
        color: "#CACACA",
        border: "1px solid #FEC84D",
        zIndex: 9999,
      },
      iconTheme: {
        primary: "#FEC84D",
        secondary: "#09052C",
      },
      duration: 3000,
    });
  };

  const showErrorToast = (message) => {
    toast.error(message, {
      position: "top-center",
      style: {
        background: "#09052C",
        color: "#CACACA",
        border: "1px solid #ef4444",
        zIndex: 9999,
      },
      iconTheme: {
        primary: "#ef4444",
        secondary: "#09052C",
      },
      duration: 5000,
    });
  };

  // Parse ISO duration (PT24M30S → "24:30")
  const formatDuration = (iso) => {
    if (!iso) return "00:00";
    const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(match?.[1] || 0);
    const minutes = parseInt(match?.[2] || 0);
    const seconds = parseInt(match?.[3] || 0);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Fetch video task data with retry logic
  const fetchVideoTask = async (accessToken) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(VIDEO_TASK_API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Video task request failed: ${res.status} - ${errorText}`);
      }

      const response = await res.json();
      const data = response.data || response;

      // Validate required fields
      if (!data.watchList || !Array.isArray(data.watchList)) {
        throw new Error("Invalid video data structure");
      }

      setVideoData(data);
      showSuccessToast("Videos loaded successfully!");

    } catch (err) {
      console.error("Video task fetch error:", err);

      // Attempt token refresh
      try {
        const refreshRes = await fetch(REFRESH_TOKEN_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!refreshRes.ok) {
          throw new Error(`Token refresh failed: ${refreshRes.status}`);
        }

        const refreshResponse = await refreshRes.json();
        const newAccessToken = refreshResponse.data?.accessToken || refreshResponse.accessToken;

        if (newAccessToken) {
          sessionStorage.setItem("accessToken", newAccessToken);

          // Retry with new token
          const retryRes = await fetch(VIDEO_TASK_API_URL, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              "Content-Type": "application/json",
            },
          });

          if (!retryRes.ok) {
            throw new Error(`Retry video task failed: ${retryRes.status}`);
          }

          const retryResponse = await retryRes.json();
          const retryData = retryResponse.data || retryResponse;

          if (retryData.watchList && Array.isArray(retryData.watchList)) {
            setVideoData(retryData);
            showSuccessToast("Videos reloaded after session refresh.");
          } else {
            throw new Error("Invalid data after retry");
          }
        } else {
          throw new Error("No new access token");
        }
      } catch (refreshErr) {
        setError("Failed to load videos. Please try again later.");
        showErrorToast("Could not load videos. Please try again.");
        setVideoData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      showErrorToast("Authentication required. Please log in.");
      setError("Please login to view videos.");
      setLoading(false);
      return;
    }

    fetchVideoTask(accessToken);
  }, []);

  // Calculate progress
  const watched = videoData?.watchedVideos || 0;
  const total = videoData?.totalVideos || 0;
  const progressPercentage = total > 0 ? Math.min((watched / total) * 100, 100) : 0;

  if (loading) {
    return (
      <>
        <Toaster position="top-center" />
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#06031E] to-[#0E083C] rounded-xl p-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-48 mb-4"></div>
            <div className="h-3 bg-gray-700 rounded w-full"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gradient-to-r from-[#06031E] to-[#0E083C] rounded-xl p-4 animate-pulse flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
                  <div className="h-4 bg-gray-700 rounded w-32"></div>
                </div>
                <div className="h-10 bg-gray-700 rounded w-28"></div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (error || !videoData) {
    return (
      <>
        <Toaster position="top-center" />
        <div className="bg-[#020109] min-h-screen flex items-center justify-center p-6">
          <div className="bg-gradient-to-r from-[#06031E] to-[#0E083C] rounded-xl p-6 text-center">
            <p className="text-red-500">{error || "No video data available."}</p>
          </div>
        </div>
      </>
    );
  }

  const hasVideos = videoData.watchList.length > 0;

  return (
    <>
      <Toaster position="top-center" />
      <div className="space-y-6">
        {/* Progress / Earnings Card */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-[#06031E] to-[#0E083C] rounded-xl p-6 flex flex-col justify-between">
            <p className="text-gray-300 font-medium">
              {watched} of {total} Videos Watched Today
            </p>

            {/* Progress Bar with percentage */}
            <div className="flex items-center justify-between mt-2">
              <div className="w-full bg-white h-2 rounded-full mr-3">
                <div
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-300">{Math.round(progressPercentage)}%</span>
            </div>

            <div className="w-full items-center mt-2">
              <div>
                <p className="mt-4 text-gray-300 font-medium flex items-center md:gap-2 md:w-auto">
                  Pending Daily Earnings <FaWallet className="text-white-400 ml-2" />
                </p>
                <div className="text-yellow-400 font-bold w-[100%] flex justify-between">
                  <div className='flex-grow'>{videoData.points?.pendingPoints?.toLocaleString()} Points </div>
                  <span className="text-[#CACACA]">(out of {videoData.points?.totalDayPoints?.toLocaleString()})</span>
                </div>
              </div>
              {/*<button className="bg-[#8F0406] md:px-6 md:py-2 px-3 py-1 rounded-lg text-sm font-semibold">
                View Total Earnings
              </button>*/}
            </div>
          </div>

          {/* Angel Placeholder */}
          <div className="flex items-center justify-center">
            <img src={angelVid} alt="angel" className="w-60 h-60" />
          </div>
        </div>

        {/* Videos Section */}
        <h2 className="text-xl font-bold">Videos</h2>

        {!hasVideos ? (
          <div className="bg-gradient-to-r from-[#06031E] to-[#0E083C] rounded-xl p-8 text-center">
            <p className="text-gray-400">No videos available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {videoData.watchList.map((video, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-r from-[#06031E] to-[#0E083C] rounded-xl p-4 grid grid-cols-1 md:grid-cols-[4fr_1fr_1fr] gap-4 md:gap-28"
              >
                {/* Left - Platform Logo */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center text-white">
                    {video.videoType === "youtube" ? (
                      <img src={Youtube} alt="YouTube" className="mx-auto w-full" />
                    ) : (
                      <FaVideo className="text-yellow-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{video.title}</p>
                    <p className="text-xs text-gray-400">Watch full video + Like</p>
                  </div>
                </div>

                {/* Middle - Task Info */}
                <div>
                  <div className="flex justify-between gap-5 items-center mt-2">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <FaClock /> {formatDuration(video.videoDuration)}
                    </div>
                    <p className="text-yellow-400 font-bold">{video.earning} points</p>
                  </div>
                </div>

                {/* Right - Button */}
                <button
                  onClick={() => openModal('watch-video', { video: video })}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 self-start md:self-auto transition-all ${
                    video.completed
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-[#8F0406] hover:bg-red-700 text-white"
                  }`}
                  disabled={video.completed}
                >
                  {video.completed ? (
                    <>
                      Completed <FaCheck className="ml-1" />
                    </>
                  ) : (
                    <>
                      Watch video <FaVideo className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Videos;