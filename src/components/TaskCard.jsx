import { useContext, useState } from 'react';
import { FaClock, FaSpinner } from "react-icons/fa";
import ModalContext from "../utils/ModalContext";

const TaskCard = ({ title, progress, earnings, due, taskType, taskData, showSuccessToast, showErrorToast }) => {
  const { openModal } = useContext(ModalContext);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const SUBSCRIBE_API_URL = "https://exgeid-backend.onrender.com/api/v1/task/subscribe/account";
  const REFRESH_TOKEN_URL = "https://exgeid-backend.onrender.com/api/v1/refresh/token";

  // Handle subscription API call with retry logic
  const handleSubscribe = async () => {
    if (taskType !== 'subscribe') return;

    setIsSubscribing(true);

    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      showErrorToast("Authentication required. Please log in.");
      setIsSubscribing(false);
      return;
    }

    try {
      const res = await fetch(SUBSCRIBE_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channelId: taskData.channelId,
          accountType: taskData.accountType,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Subscription request failed: ${res.status} - ${errorText}`);
      }

      showSuccessToast("Successfully subscribed to channel!");

    } catch (err) {
      console.error("Subscription error:", err);

      // Attempt token refresh
      try {
        const refreshRes = await fetch(REFRESH_TOKEN_URL, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!refreshRes.ok) {
          throw new Error(`Token refresh failed: ${refreshRes.status}`);
        }

        const refreshResponse = await refreshRes.json();
        const newAccessToken = refreshResponse.data?.accessToken || refreshResponse.accessToken;

        if (newAccessToken) {
          sessionStorage.setItem("accessToken", newAccessToken);

          // Retry subscription
          const retryRes = await fetch(SUBSCRIBE_API_URL, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              channelId: taskData.channelId,
              accountType: taskData.accountType,
            }),
          });

          if (!retryRes.ok) {
            throw new Error(`Retry subscription failed: ${retryRes.status}`);
          }

          showSuccessToast("Successfully subscribed after session refresh!");
        } else {
          throw new Error("No new access token");
        }
      } catch (refreshErr) {
        showErrorToast("Failed to subscribe. Please try again.");
        console.error("Token refresh error:", refreshErr);
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  // Handle button click based on task type
  const handleButtonClick = () => {
    if (taskType === 'video') {
      openModal('watch-video', { video: taskData });
    } else if (taskType === 'subscribe') {
      handleSubscribe();
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#0E083C] to-[#06031E] p-6 rounded-xl flex flex-col md:flex-row justify-between items-center mt-4">
      {/* Left side */}
      <div className="flex flex-col md:w-[60%] text-center md:text-left">
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-gray-400">{progress}</p>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-400">Earnings</p>
        <p className="text-yellow-400 font-bold">{earnings} Points</p>
      </div>

      {/* Right side */}
      <div className="flex flex-col md:items-end mt-3 md:mt-0 gap-2 w-full md:w-auto">
        <div className="flex items-center text-xs text-gray-400 text-center">
          <FaClock className="mr-1" /> {due}
        </div>

        {/* Button */}
        <button
          onClick={handleButtonClick}
          className={`bg-[#8F0406] px-4 py-2 rounded-lg text-white font-medium flex items-center justify-center gap-2 ${
            isSubscribing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
          } transition-all`}
          disabled={isSubscribing}
        >
          {isSubscribing ? (
            <>
              <FaSpinner className="animate-spin text-yellow-400" />
              Subscribing...
            </>
          ) : (
            taskType === 'video' ? 'Watch Video' : 'Subscribe'
          )}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;