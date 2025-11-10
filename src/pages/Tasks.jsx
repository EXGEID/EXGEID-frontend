import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import StatCard from "../components/StatCard";
import TaskCard from "../components/TaskCard";
import CompletedTaskCard from "../components/CompletedTaskCard";
import ModalContext from "../utils/ModalContext";
import angel from "../assets/angel.png";
import { FaVideo, FaClock, FaList, FaEyeSlash } from "react-icons/fa";
import Youtube from "../assets/youtube.png";

const Tasks = () => {
  const navigate = useNavigate();
  const { openModal } = useContext(ModalContext);
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const DAILY_TASK_API_URL = "https://exgeid-backend.onrender.com/api/v1/task/fetch/daily-task";
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

  // Format due time (ISO to readable)
  const formatDueTime = (iso) => {
    if (!iso) return "Unknown";
    const date = new Date(iso);
    return `Due: ${date.toLocaleDateString()} – ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Fetch daily task data with retry logic
  const fetchDailyTask = async (accessToken) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(DAILY_TASK_API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Daily task request failed: ${res.status} - ${errorText}`);
      }

      const response = await res.json();
      const data = response.data || response;

      // Validate required fields
      if (!data.dailyTask || !data.watchList || !data.subscribeList || !data.points) {
        throw new Error("Invalid task data structure");
      }

      setTaskData(data);
      showSuccessToast("Tasks loaded successfully!");

    } catch (err) {
      console.error("Daily task fetch error:", err);

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
          const retryRes = await fetch(DAILY_TASK_API_URL, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              "Content-Type": "application/json",
            },
          });

          if (!retryRes.ok) {
            throw new Error(`Retry daily task failed: ${retryRes.status}`);
          }

          const retryResponse = await retryRes.json();
          const retryData = retryResponse.data || retryResponse;

          if (retryData.dailyTask && retryData.watchList && retryData.subscribeList && retryData.points) {
            setTaskData(retryData);
            showSuccessToast("Tasks reloaded after session refresh.");
          } else {
            throw new Error("Invalid data after retry");
          }
        } else {
          throw new Error("No new access token");
        }
      } catch (refreshErr) {
        setError("Failed to load tasks. Please try again later.");
        showErrorToast("Could not load tasks. Please try again.");
        setTaskData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      showErrorToast("Authentication required. Please log in.");
      setError("Please login to view tasks.");
      setLoading(false);
      return;
    }

    fetchDailyTask(accessToken);
  }, []);

  if (loading) {
    return (
      <>
        <Toaster position="top-center" />
        <div className="space-y-6">
          <div className="flex items-center gap-3 mt-6 animate-pulse">
            <div className="w-20 h-20 bg-gray-700 rounded-full"></div>
            <div className="h-6 bg-gray-700 rounded w-48"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gradient-to-r from-[#06031E] to-[#0E083C] rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-24 mb-2"></div>
                <div className="h-6 bg-gray-700 rounded w-16"></div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-700 rounded w-48 mb-4"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gradient-to-r from-[#06031E] to-[#0E083C] rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-64 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  if (error || !taskData) {
    return (
      <>
        <Toaster position="top-center" />
        <div className="bg-[#020109] min-h-screen flex items-center justify-center p-6">
          <div className="bg-gradient-to-r from-[#06031E] to-[#0E083C] rounded-xl p-6 text-center">
            <p className="text-red-500">{error || "No task data available."}</p>
          </div>
        </div>
      </>
    );
  }

  // Filter incomplete and completed tasks
  const incompleteVideos = taskData.watchList.filter(video => !video.completed);
  const incompleteSubscriptions = taskData.subscribeList.filter(sub => !sub.completed);
  const completedVideos = taskData.watchList.filter(video => video.completed);
  const completedSubscriptions = taskData.subscribeList.filter(sub => sub.completed);

  const hasIncompleteTasks = incompleteVideos.length > 0 || incompleteSubscriptions.length > 0;
  const hasCompletedTasks = completedVideos.length > 0 || completedSubscriptions.length > 0;

  return (
    <>
      <Toaster position="top-center" />
      <div>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 mt-6">
            <img src={angel} alt="angel_top" className="w-20 h-20" />
            <h2 className="text-2xl font-bold">Let’s earn today!</h2>
          </div>
          {/* outline yellow button */}
          <button onClick={() => navigate('?modal=task-prerequisites')} className="border border-yellow-500 text-yellow-500 px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-sm sm:text-base hover:bg-yellow-500/10">
            Task Prerequisites
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          <StatCard
            title="Videos Watched"
            value={taskData.dailyTask.watchedVideos}
            icon={<FaVideo />}
          />
          <StatCard
            title="Pending Earnings"
            value={`${taskData.points.pendingPoints.toLocaleString()} Points`}
            icon={<FaClock />}
          />
          <StatCard
            title="Tasks"
            value={taskData.dailyTask.totalTask}
            icon={<FaList />}
          />
          <StatCard
            title="Unwatched Videos"
            value={taskData.dailyTask.totalVideos - taskData.dailyTask.watchedVideos}
            icon={<FaEyeSlash />}
          />
        </div>

        {/* Today's Earnings Opportunities */}
        <h3 className="text-lg font-semibold mt-10">Today's Earnings Opportunities</h3>
        {!hasIncompleteTasks ? (
          <div className="bg-gradient-to-r from-[#06031E] to-[#0E083C] rounded-xl p-8 text-center">
            <p className="text-gray-400">No tasks available at the moment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {incompleteVideos.map((video, idx) => (
              <TaskCard
                key={`video-${idx}`}
                title={video.title}
                progress={`${formatDuration(video.videoDuration)} to watch`}
                earnings={video.earning.toLocaleString()}
                due={formatDueTime(taskData.dailyTask.taskDueTime)}
                icon={video.videoType === "youtube" ? <img src={Youtube} alt="YouTube" className="w-6 h-6" /> : <FaVideo />}
                taskType="video"
                taskData={video}
                showSuccessToast={showSuccessToast}
                showErrorToast={showErrorToast}
              />
            ))}
            {incompleteSubscriptions.map((sub, idx) => (
              <TaskCard
                key={`sub-${idx}`}
                title={`Subscribe to ${sub.name}`}
                progress="Subscribe to channel"
                earnings={sub.earning.toLocaleString()}
                due={formatDueTime(taskData.dailyTask.taskDueTime)}
                icon={sub.accountType === "youtube" ? <img src={Youtube} alt="YouTube" className="w-6 h-6" /> : <FaVideo />}
                taskType="subscribe"
                taskData={sub}
                showSuccessToast={showSuccessToast}
                showErrorToast={showErrorToast}
              />
            ))}
          </div>
        )}

        {/* Completed Tasks */}
        <h3 className="text-lg font-semibold mt-10">Completed Tasks</h3>
        {!hasCompletedTasks ? (
          <div className="bg-gradient-to-r from-[#06031E] to-[#0E083C] rounded-xl p-8 text-center">
            <p className="text-gray-400">No completed tasks yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedVideos.map((video, idx) => (
              <CompletedTaskCard
                key={`completed-video-${idx}`}
                title={`Watched – ${video.title}`}
                earnings={`${video.earning.toLocaleString()} points credited`}
              />
            ))}
            {completedSubscriptions.map((sub, idx) => (
              <CompletedTaskCard
                key={`completed-sub-${idx}`}
                title={`Subscribed – ${sub.name}`}
                earnings={`${sub.earning.toLocaleString()} points credited`}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Tasks;