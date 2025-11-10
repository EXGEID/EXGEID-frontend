import { useState, useEffect, useRef } from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { BsCheckSquare, BsCheckSquareFill } from 'react-icons/bs';
import { FaClock } from "react-icons/fa";
import YouTube from 'react-youtube';
import { Toaster, toast } from "react-hot-toast";

const encrypt = (data) => {
  return btoa(
    String.fromCharCode(
      ...JSON.stringify(data)
        .split('')
        .map(c => c.charCodeAt(0) + 1)
    )
  );
};

const decrypt = (data) => {
  try {
    return JSON.parse(
      atob(data)
        .split('')
        .map(c => String.fromCharCode(c.charCodeAt(0) - 1))
        .join('')
    );
  } catch {
    return null;
  }
};

const VideoPlayerModal = ({ initialData, onClose }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  useEffect(() => setIsAnimated(true), []);

  const handleOverlayClick = (e) => e.stopPropagation();

  const [player, setPlayer] = useState(null);
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [maxWatchedTime, setMaxWatchedTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [title, setTitle] = useState(initialData?.video?.title || 'Loading title...');
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isMarkedComplete, setIsMarkedComplete] = useState(false);

  const intervalRef = useRef(null);
  const saveIntervalRef = useRef(null);
  const integrityIntervalRef = useRef(null);
  const rateIntervalRef = useRef(null);
  const rateChangeCount = useRef(0);
  const isResetting = useRef(false);
  const playStartRef = useRef(0);
  const totalPlayedTimeRef = useRef(0);
  const initialMaxRef = useRef(0);
  const skipAttempts = useRef(0);
  const absoluteMaxWatchedRef = useRef(0);
  const isNearEndRef = useRef(false);
  const lastRewindRef = useRef(0); // New ref for rewind timestamp
  const ytIframeRef = useRef(null);
  const protectTimer = useRef(null);
  const protectObs = useRef(null);

 Us
  const [showControls, setShowControls] = useState(false);
  const controlsTimeoutRef = useRef(null);
  const videoContainerRef = useRef(null);
  const isHoveringRef = useRef(false);
  const lastInteractionRef = useRef(Date.now());

  const [popup, setPopup] = useState({ show: false, type: 'rewind', count: 0, x: 0, y: 0, key: 0 });
  const popupTimeoutRef = useRef(null);

  const [isLiking, setIsLiking] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Debounced setCurrentTime
  const debouncedSetCurrentTime = useRef(
    (() => {
      let timeout;
      return (value) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setCurrentTime(value);
        }, 100);
      };
    })()
  );

  const LIKE_API_URL = `https://exgeid-backend.onrender.com/api/v1/task/like/${initialData?.video?.videoId}`;
  const REFRESH_TOKEN_URL = "https://exgeid-backend.onrender.com/api/v1/refresh/token";
  const VERIFY_VIDEO_URL = "https://exgeid-backend.onrender.com/api/v1/task/verify/video";

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

  const handleLikeVideo = async () => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      showErrorToast("Authentication required. Please log in.");
      return;
    }

    setIsLiking(true);
    try {
      const res = await fetch(LIKE_API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
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
            const newAccessToken = refreshResponse.data;

            if (newAccessToken) {
              sessionStorage.setItem("accessToken", newAccessToken);
              const retryRes = await fetch(LIKE_API_URL, {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                  "Content-Type": "application/json",
                },
              });

              if (!retryRes.ok) {
                throw new Error(`Retry like failed: ${retryRes.status}`);
              }

              setLiked(true);
              setLikes(prev => prev + 1);
              showSuccessToast("Video liked successfully!");
            } else {
              throw new Error("No new access token");
            }
          } catch (refreshErr) {
            showErrorToast("Session expired. Please log in again.");
          }
        } else {
          const errorText = await res.text();
          throw new Error(`Like request failed: ${res.status} - ${errorText}`);
        }
      } else {
        setLiked(true);
        setLikes(prev => prev + 1);
        showSuccessToast("Video liked successfully!");
      }
    } catch (err) {
      console.error("Like error:", err);
      showErrorToast("Failed to like video. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleMarkComplete = async () => {
    if (isMarkedComplete || isCompleting) return;

    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      showErrorToast("Authentication required. Please log in.");
      return;
    }

    setIsCompleting(true);

    const requestBody = {
      videoId: initialData?.video?.videoId,
      videoType: initialData?.video?.videoType || "youtube",
      videoDuration: duration,
      completed: true,
    };

    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const res = await fetch(VERIFY_VIDEO_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
          if (res.status === 401 && attempt < maxRetries - 1) {
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
              const newAccessToken = refreshResponse.data;

              if (newAccessToken) {
                sessionStorage.setItem("accessToken", newAccessToken);
                attempt++;
                continue;
              } else {
                throw new Error("No new access token");
              }
            } catch (refreshErr) {
              console.error("Token refresh error:", refreshErr);
              showErrorToast("Session expired. Please log in again.");
              break;
            }
          } else {
            const errorText = await res.text();
            throw new Error(`Verify video failed: ${res.status} - ${errorText}`);
          }
        }

        setIsMarkedComplete(true);
        showSuccessToast("Video marked as complete!");
        break;

      } catch (err) {
        console.error("Verify video error:", err);
        if (attempt === maxRetries - 1) {
          showErrorToast("Failed to mark video as complete. Please try again.");
        }
        attempt++;
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    setIsCompleting(false);
  };

  const STORAGE_KEY = `video-progress-${initialData?.video?.videoId}`;

  const hideProgress = (el) => {
    if (!el) return;
    el.style.cssText = `
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
      height: 0 !important;
      overflow: hidden !important;
    `;
  };

  const hidePopups = (doc) => {
    if (!doc) return;
    const elementsToHide = [
      '.ytp-popup',
      '.ytd-watch-later-button',
      '.ytd-share-button',
      '.ytp-share-button',
      '.ytp-watch-later-button',
      '.ytp-related-video-renderer',
      '.ytp-chrome-top .ytp-button[aria-label*="Share"]',
      '.ytp-chrome-top .ytp-button[aria-label*="Watch later"]',
    ];
    elementsToHide.forEach(selector => {
      const els = doc.querySelectorAll(selector);
      els.forEach(el => hideProgress(el));
    });
  };

  const showPopup = (type, clientX, clientY) => {
    if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);

    const step = type === 'rewind' ? -10 : 10;
    const newCount = popup.show && popup.type === type
      ? popup.count + step
      : step;

    setPopup({
      show: true,
      type,
      count: newCount,
      x: clientX,
      y: clientY,
      key: Date.now(),
    });

    popupTimeoutRef.current = setTimeout(() => {
      setPopup(p => ({ ...p, show: false }));
    }, 1000);
  };

  const rewind10 = (e) => {
    const newTime = Math.max(0, getCurrentTime() - 10);
    lastRewindRef.current = performance.now();
    seekTo(newTime);
    showPopup('rewind', e.clientX, e.clientY);
  };

  const forward10 = (e) => {
    const newTime = getCurrentTime() + 10;
    if (newTime <= absoluteMaxWatchedRef.current) {
      seekTo(newTime);
      showPopup('forward', e.clientX, e.clientY);
    }
  };

  const togglePauseFromOverlay = () => {
    if (isPaused) playVideo();
    else pauseVideo();
  };

  const resetHideTimer = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }

    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      if (!isPaused) {
        setShowControls(false);
      }
    }, 2000);
  };

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    const dec = decrypt(saved);
    let loadedMax = 0;
    if (dec && dec.maxWatchedTime <= dec.duration) {
      setCurrentTime(dec.currentTime);
      setMaxWatchedTime(dec.maxWatchedTime);
      setDuration(dec.duration);
      loadedMax = dec.maxWatchedTime;
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    initialMaxRef.current = loadedMax;
    absoluteMaxWatchedRef.current = loadedMax;
  }, [initialData?.video?.videoId]);

  useEffect(() => {
    if (isCompleted) {
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
      return;
    }
    saveIntervalRef.current = setInterval(() => {
      if (currentTime > 0 && !isCompleted) {
        sessionStorage.setItem(
          STORAGE_KEY,
          encrypt({ 
            currentTime, 
            maxWatchedTime: absoluteMaxWatchedRef.current, 
            duration 
          })
        );
      }
    }, 5000);
    return () => {
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
    };
  }, [currentTime, duration, isCompleted]);

  useEffect(() => {
    return () => {
      if (!isCompleted && currentTime > 0) {
        sessionStorage.setItem(
          STORAGE_KEY,
          encrypt({ 
            currentTime, 
            maxWatchedTime: absoluteMaxWatchedRef.current, 
            duration 
          })
        );
      }
    };
  }, []);

  const currentTimeRef = useRef(currentTime);
  const durationRef = useRef(duration);
  const isCompletedRef = useRef(isCompleted);

  useEffect(() => {
    currentTimeRef.current = currentTime;
    durationRef.current = duration;
    isCompletedRef.current = isCompleted;
  }, [currentTime, duration, isCompleted]);

  useEffect(() => {
    return () => {
      if (!isCompletedRef.current && currentTimeRef.current > 0) {
        sessionStorage.setItem(
          STORAGE_KEY,
          encrypt({ 
            currentTime: currentTimeRef.current, 
            maxWatchedTime: absoluteMaxWatchedRef.current, 
            duration: durationRef.current 
          })
        );
      }
    };
  }, []);

  useEffect(() => {
    if (isCompleted) {
      if (integrityIntervalRef.current) clearInterval(integrityIntervalRef.current);
      return;
    }
    integrityIntervalRef.current = setInterval(() => {
      if (!isCompleted && !isResetting.current) {
        const now = performance.now();
        if (lastRewindRef.current && (now - lastRewindRef.current) / 1000 < 5) return;
        const currentTotal = totalPlayedTimeRef.current + (playStartRef.current !== 0 ? (now - playStartRef.current) / 1000 : 0);
        const currentTime = getCurrentTime();
        if (currentTime > absoluteMaxWatchedRef.current + 10 && currentTime > initialMaxRef.current + currentTotal + 10) {
          console.log('Integrity check failed:', {
            absoluteMaxWatched: absoluteMaxWatchedRef.current,
            initialMax: initialMaxRef.current,
            currentTotal,
            currentTime,
          });
          isResetting.current = true;
          resetProgress(true);
        }
      }
    }, 2000);
    return () => {
      if (integrityIntervalRef.current) clearInterval(integrityIntervalRef.current);
    };
  }, [isCompleted]);

  useEffect(() => {
    if (isPaused) {
      setShowControls(false);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      return;
    }

    setShowControls(true);
    resetHideTimer();

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPaused]);

  const handleTouchStart = (e) => {
    e.stopPropagation();
    lastInteractionRef.current = Date.now();
    if (isPaused) {
      return;
    }
    setShowControls(true);
    resetHideTimer();
  };

  const handleVideoClick = (e) => {
    e.stopPropagation();
    lastInteractionRef.current = Date.now();
    if (isPaused) {
      return;
    }
    setShowControls(true);
    resetHideTimer();
  };

  const handleMouseEnter = () => {
    if (isPaused) return;
    isHoveringRef.current = true;
    setShowControls(true);
    resetHideTimer();
  };
  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    resetHideTimer();
  };

  const seekTo = async (seconds) => {
    const p = getPlayer();
    if (!p) return;
    try {
      if (seconds <= getCurrentTime()) {
        await new Promise(r => setTimeout(r, 50));
        p.seekTo(seconds);
        return;
      }
      if (seconds > absoluteMaxWatchedRef.current + 1) return;
      await new Promise(r => setTimeout(r, 50));
      p.seekTo(seconds);
    } catch (err) {
      console.error('Seek error:', err);
      showErrorToast('Error seeking video. Please try again.');
    }
  };

  const resetProgress = async (isSkip = false) => {
    pauseVideo();
    clearAllIntervals();
    setCurrentTime(0);
    setMaxWatchedTime(0);
    if (isSkip) {
      absoluteMaxWatchedRef.current = 0;
      sessionStorage.removeItem(STORAGE_KEY);
    }
    await new Promise(r => setTimeout(r, 100));
    const p = getPlayer();
    if (p) p.seekTo(0);
    showErrorToast('Invalid playback detected. Progress reset.');
    setTimeout(() => { isResetting.current = false; }, 3000);
    skipAttempts.current = 0;
    lastRewindRef.current = 0;
    isNearEndRef.current = false;
  };

  const handleInvalidSeek = () => {
    skipAttempts.current++;
    showErrorToast('Skipping not permitted');
    if (skipAttempts.current >= 5) {
      resetProgress(true);
    }
  };

  useEffect(() => {
    if (isPaused || isCompleted || isResetting.current || isNearEndRef.current) return;
    const id = setInterval(() => {
      const cur = getCurrentTime();
      if (lastRewindRef.current && (performance.now() - lastRewindRef.current) / 1000 < 5) return;
      if (cur > absoluteMaxWatchedRef.current + 2 && cur > getCurrentTime()) {
        seekTo(absoluteMaxWatchedRef.current);
        handleInvalidSeek();
      } else if (cur > absoluteMaxWatchedRef.current) {
        absoluteMaxWatchedRef.current = cur;
        setMaxWatchedTime(cur);
      }
    }, 200);
    return () => clearInterval(id);
  }, [isPaused, isCompleted, isResetting]);

  useEffect(() => {
    const detect = () => {
      if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
        pauseVideo();
        showErrorToast('Developer tools detected. Pausing for security.');
      }
    };
    window.addEventListener('resize', detect);
    return () => window.removeEventListener('resize', detect);
  }, []);

  useEffect(() => {
    if (isCompleted) {
      if (rateIntervalRef.current) clearInterval(rateIntervalRef.current);
      return;
    }
    rateIntervalRef.current = setInterval(() => {
      if (!isCompleted) {
        const rate = getPlaybackRate();
        if (rate !== 1) {
          setPlaybackRate(1);
          rateChangeCount.current += 1;
          if (rateChangeCount.current > 2) {
            resetProgress(true);
            showErrorToast('Repeated speed changes detected. Session invalidated.');
          } else {
            showErrorToast('Playback speed must remain at 1x.');
          }
        }
      }
    }, 1000);
    return () => {
      if (rateIntervalRef.current) clearInterval(rateIntervalRef.current);
    };
  }, [isCompleted]);

  useEffect(() => {
    const iframe = ytIframeRef.current;
    if (!iframe) return;

    const waitForPlayer = setInterval(() => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      const container = doc.querySelector('.ytp-progress-bar-container');
      if (container) {
        hideProgress(container);
        hidePopups(doc);
        clearInterval(waitForPlayer);
      }
    }, 200);

    return () => clearInterval(waitForPlayer);
  }, []);

  useEffect(() => {
    const enforce = () => {
      const ytDoc = ytIframeRef.current?.contentDocument;
      if (ytDoc) {
        const bar = ytDoc.querySelector('.ytp-progress-bar-container');
        hideProgress(bar);
      }
    };

    protectTimer.current = window.setInterval(enforce, 500);
    return () => {
      if (protectTimer.current) clearInterval(protectTimer.current);
    };
  }, []);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement && node.classList?.contains('ytp-progress-bar-container')) {
            hideProgress(node);
          }
        });
        if (m.type === 'attributes' && m.target instanceof HTMLElement) {
          if (m.target.classList?.contains('ytp-progress-bar-container')) {
            hideProgress(m.target);
          }
        }
      });
    });

    const start = () => {
      const doc = ytIframeRef.current?.contentDocument;
      if (doc?.body) {
        observer.observe(doc.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['style', 'class'],
        });
      }
    };

    const interval = setInterval(() => {
      if (ytIframeRef.current?.contentDocument?.body) {
        start();
        clearInterval(interval);
      }
    }, 300);

    protectObs.current = observer;
    return () => {
      observer.disconnect();
      if (interval) clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const video = initialData?.video;
    if (!video) return;

    setTitle(video.title || 'Untitled Video');
    setDuration(parseDuration(video.videoDuration));
    setLikes(video.likeCount || 0);
    setViews(0);
  }, [initialData?.video]);

  const onReady = (e) => {
    setPlayer(e.target);
    ytIframeRef.current = e.target.getIframe();
    setTimeout(() => seekTo(currentTime), 100);
  };

  const onTimeUpdate = () => {
    const t = getCurrentTime();
    debouncedSetCurrentTime.current(t);

    if (t > absoluteMaxWatchedRef.current) {
      absoluteMaxWatchedRef.current = t;
      setMaxWatchedTime(t);
    }

    if (t >= duration - 2) {
      isNearEndRef.current = true;
    }

    if (t >= duration - 0.5 && duration > 0) {
      setIsCompleted(true);
      clearAllIntervals();
      handleMarkComplete();
    }
  };

  const clearAllIntervals = () => {
    [intervalRef, saveIntervalRef, integrityIntervalRef, rateIntervalRef].forEach(
      r => r.current && clearInterval(r.current)
    );
  };

  const onPlay = () => {
    setIsPaused(false);
    playStartRef.current = performance.now();
    if (!intervalRef.current) {
      intervalRef.current = setInterval(onTimeUpdate, 1000);
    }
  };

  const onPause = () => {
    setIsPaused(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    if (playStartRef.current !== 0) {
      totalPlayedTimeRef.current += (performance.now() - playStartRef.current) / 1000;
      playStartRef.current = 0;
    }
    if (currentTime > 0 && !isCompleted) {
      sessionStorage.setItem(
        STORAGE_KEY,
        encrypt({ currentTime, maxWatchedTime: absoluteMaxWatchedRef.current, duration })
      );
    }
  };

  const onSeeking = () => {
    setTimeout(() => {
      const attempted = getCurrentTime();
      if (attempted > absoluteMaxWatchedRef.current + 2 && attempted > getCurrentTime()) {
        seekTo(absoluteMaxWatchedRef.current);
        handleInvalidSeek();
      }
    }, 150);
  };

  const onSeeked = () => {
    const cur = getCurrentTime();
    if (cur > absoluteMaxWatchedRef.current + 2 && cur > getCurrentTime()) {
      seekTo(absoluteMaxWatchedRef.current);
      handleInvalidSeek();
    } else if (cur > absoluteMaxWatchedRef.current) {
      absoluteMaxWatchedRef.current = cur;
      setMaxWatchedTime(cur);
    }
  };

  const getPlayer = () => player;
  const getCurrentTime = () => player?.getCurrentTime?.() || 0;
  const getPlaybackRate = () => player?.getPlaybackRate?.() || 1;
  const setPlaybackRate = (r) => {
    if (player) player.setPlaybackRate(r);
  };
  const pauseVideo = () => {
    if (player) player.pauseVideo();
    setIsPaused(true);
  };
  const playVideo = () => {
    if (player) player.playVideo();
    setIsPaused(false);
  };

  const shareVideo = async () => {
    const url = initialData?.video?.videoUrl || `https://www.youtube.com/watch?v=${initialData?.video?.videoId}`;
    try { await navigator.share({ title, text: 'Check out this video!', url }); }
    catch { navigator.clipboard.writeText(url); showErrorToast('URL copied to clipboard!'); }
  };

  const formatTime = (sec) => {
    if (duration === 0) return '00:00';
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const formatNumber = (n) => n >= 1000 ? (n / 1000).toFixed(1) + 'K' : n;

  const parseDuration = (iso) => {
    const m = iso.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    return (parseInt(m?.[1]) * 3600 || 0) + (parseInt(m?.[2]) * 60 || 0) + (parseInt(m?.[3]) || 0);
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ${
        isAnimated ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleOverlayClick}
    >
      <Toaster position="top-center" toastOptions={{ duration: 5000 }} />
      <div
        className={`relative bg-[linear-gradient(to_bottom_left,#0E083C_55%,#06031E_100%)] rounded-2xl w-full max-w-[90%] md:max-w-md lg:max-w-[55%] transform transition-all duration-300 ${
          isAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } overflow-hidden max-h-[95vh]`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-8 md:right-8 text-[#CACACA] text-2xl md:text-5xl font-bold rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center z-50"
        >
          ×
        </button>

        <div className="overflow-y-auto max-h-[95vh] px-6 md:px-12 lg:px-28 py-12">
          <main className="flex-1 p-0">
            <div className="max-w-full mx-auto relative">
              <div
                ref={videoContainerRef}
                className="bg-gray-700 relative"
                onClick={handleVideoClick}
                onTouchStart={handleTouchStart}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <YouTube
                  videoId={initialData?.video?.videoId}
                  opts={{
                    height: '315',
                    width: '100%',
                    playerVars: {
                      controls: 0,
                      modestbranding: 1,
                      rel: 0,
                      fs: 1,
                      iv_load_policy: 3,
                      loop: 0,
                      playlist: initialData?.video?.videoId,
                    },
                  }}
                  onReady={onReady}
                  onPlay={onPlay}
                  onPause={onPause}
                  onStateChange={(e) => {
                    if (e.data === 3) onSeeking();
                    if (e.data === 1 || e.data === 2) onSeeked();
                    if (e.data === 0) {
                      const currentTime = getCurrentTime();
                      if (currentTime >= duration - 0.5) {
                        setIsCompleted(true);
                        clearAllIntervals();
                        handleMarkComplete();
                      } else {
                        onPause();
                      }
                    }
                  }}
                  containerClassName="yt-progress-hider"
                  className="rounded pointer-events-none h-[50%] md:h-[315px]"
                />
                {isPaused && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      lastInteractionRef.current = Date.now();
                      playVideo();
                      resetHideTimer();
                    }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl opacity-50 hover:opacity-100"
                  >
                    ▶
                  </button>
                )}

                {showControls && !isPaused && (
                  <div className="absolute inset-0 flex items-center justify-center gap-12 pointer-events-none bg-black/20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        lastInteractionRef.current = Date.now();
                        rewind10(e);
                        resetHideTimer();
                      }}
                      className="pointer-events-auto bg-transparent backdrop-blur-lg bg-opacity-50 text-white rounded-full md:w-16 md:h-16 w-12 h-12 flex items-center justify-center text-3xl hover:bg-opacity-80 hover:scale-110 transition relative"
                    >
                      <span className="text-5xl">↺</span>
                      <span className="absolute text-xs font-bold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        10
                      </span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        lastInteractionRef.current = Date.now();
                        togglePauseFromOverlay();
                        resetHideTimer();
                      }}
                      className="pointer-events-auto bg-transparent backdrop-blur-lg bg-opacity-50 text-white rounded-full md:w-20 md:h-20 w-16 h-16 flex items-center justify-center text-4xl hover:bg-opacity-80 hover:scale-110 transition relative"
                    >
                      ⏸
                    </button>

                    {getCurrentTime() + 10 <= absoluteMaxWatchedRef.current ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          lastInteractionRef.current = Date.now();
                          forward10(e);
                          resetHideTimer();
                        }}
                        className="pointer-events-auto bg-transparent backdrop-blur-lg bg-opacity-50 text-white rounded-full md:w-16 md:h-16 w-12 h-12 flex items-center justify-center text-3xl hover:bg-opacity-80 hover:scale-110 transition relative"
                      >
                        <span className="text-5xl">↻</span>
                        <span className="absolute text-xs font-bold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          10
                        </span>
                      </button>
                    ) : (<div className='md:w-16 md:h-16 w-12 h-12'></div>)}

                    {popup.show && (
                      <div
                        key={popup.key}
                        className="fixed pointer-events-none transition-all duration-1000 ease-out z-[9999]"
                        style={{
                          left: `${popup.x}`,
                          top: `${popup.y}`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <div
                          className={`
                            px-3 py-1 mb-6 rounded-full text-white font-bold text-lg shadow-lg
                            ${popup.show ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
                            ${popup.type === 'rewind' ? 'text-red-600' : 'text-green-600'}
                          `}
                        >
                          {popup.count > 0 ? `+${popup.count}s` : `${popup.count}s`}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-4 relative h-8">
                <div className="absolute inset-x-0 top-3 h-2 mt-4 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full bg-green-500 opacity-30 transition-all duration-300 ${
                      isCompleted ? 'animate-pulse' : ''
                    }`}
                    style={{ width: duration ? `${(absoluteMaxWatchedRef.current / duration) * 100}%` : '0%' }}
                  />
                  <div
                    className={`absolute top-0 left-0 h-full bg-green-500 transition-all duration-300 ${
                      isCompleted ? 'animate-pulse' : ''
                    }`}
                    style={{ width: duration ? `${(isCompleted ? duration : currentTime) / duration * 100}%` : '0%' }}
                  />
                </div>

                <div
                  className="absolute top-6 left-0 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 pointer-events-none"
                  style={{
                    left: `calc(${duration ? (isCompleted ? 100 : (currentTime / duration) * 100) : 0}% - 10px)`,
                    display: duration ? 'block' : 'none',
                  }}
                />

                <div className="flex justify-between text-xs text-[#CACACA] mt-6">
                  <span>{formatTime(isCompleted ? duration : currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <style jsx>{`
                .animate-pulse {
                  animation: pulse 1.5s ease-in-out infinite;
                }
                @keyframes pulse {
                  0% { opacity: 0.3; }
                  50% { opacity: 0.6; }
                  100% { opacity: 0.3; }
                }
                .yt-progress-hider .ytp-progress-bar-container,
                .yt-progress-hider .ytp-progress-bar,
                .yt-progress-hider .ytp-load-progress,
                .yt-progress-hider .ytp-scrubber-container,
                .yt-progress-hider .ytp-scrubber-button {
                  display: none !important;
                }
              `}</style>

              <div className='grid grid-cols-2 gap-4'>
                {isPaused ? (
                  <button
                    onClick={playVideo}
                    className="w-full bg-[#8F0406] hover:bg-red-700 hover:scale-110 text-white lg:text-[16px] md:text-[13.58px] text-[10.18px] font-semibold py-2 md:py-4 rounded-lg mb-4 transition mt-6 md:mt-12"
                  >
                    <span aria-hidden="true" className="mr-2">▶</span> Play Video
                  </button>
                ) : (
                  <button
                    onClick={pauseVideo}
                    className="w-full bg-[#8F0406] hover:bg-red-700 hover:scale-110 text-white lg:text-[16px] md:text-[13.58px] text-[10.18px] font-semibold py-2 md:py-4 rounded-lg mb-4 transition mt-6 md:mt-12"
                  >
                    <span aria-hidden="true" className="mr-2">⏸</span> Pause Video
                  </button>
                )}
                <button
                  onClick={handleLikeVideo}
                  disabled={isLiking || liked}
                  className={`
                    border-2 font-bold 
                    transition-all duration-300 ease-in-out 
                    lg:px-4 md:px-3 px-2 
                    py-2
                    rounded-md mb-4 transition mt-6 md:mt-12 
                    lg:text-[16px] md:text-[13.58px] text-[10.18px]
                    flex items-center justify-center gap-2
                    relative
                    ${isLiking ? 'opacity-50 cursor-not-allowed' : ''}
                    ${
                      liked
                      ? 'bg-[#FEC84D] font-bold text-[#1A202C] cursor-not-allowed'
                      : 'border-[#FEC84D] text-[#FEC84D] hover:bg-yellow-900 hover:text-white hover:scale-105 '
                    }
                  `}
                >
                  {isLiking ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#FEC84D]"></div>
                  ) : liked ? (
                    <>
                      <AiFillHeart className="text-lg" />
                      Liked
                    </>
                  ) : (
                    <>
                      <AiOutlineHeart className="text-lg" />
                      Like
                    </>
                  )}
                </button>
              </div>

              {isCompleted && liked && (
                <button
                  onClick={handleMarkComplete}
                  disabled={isMarkedComplete || isCompleting}
                  className={`
                    w-full mt-2 mb-4 py-3 md:py-4 rounded-lg font-bold md:text-lg text-[12px]
                    flex items-center justify-center gap-2 transition-all duration-300
                    ${isMarkedComplete
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : isCompleting
                      ? 'bg-gray-600 text-white cursor-not-allowed'
                      : 'border-2 border-[#FEC84D] text-[#FEC84D] hover:bg-yellow-900 hover:text-white'
                    }
                  `}
                >
                  {isCompleting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#FEC84D]"></div>
                  ) : isMarkedComplete ? (
                    <>
                      <BsCheckSquareFill className="md:text-xl text-lg text-white" />
                      Completed
                    </>
                  ) : (
                    <>
                      <BsCheckSquare className="md:text-xl text-lg" />
                      Mark as Complete
                    </>
                  )}
                </button>
              )}
              <h2 className="lg:text-[24px] md:text-[20px] text-[14px] font-bold text-[#CACACA] mb-4 text-center">
                {title}
              </h2>

              <div className="flex justify-between items-center mt-2 text-xs md:text-sm">
                <span className="text-[#CACACA] flex items-center gap-2"><FaClock />{formatTime(currentTime)} sec</span>
                <span className="text-yellow-400">{initialData?.video?.earning} points</span>
                <span className="text-[#CACACA]">Likes: {formatNumber(likes)} 👍</span>
                <button onClick={shareVideo} className="text-blue-400">
                  ➤ SHARE
                </button>
              </div>

              {isCompleted && (
                <p className="text-green-500 mt-4 text-center font-bold text-xs md:text-lg">
                  Video Completed, be sure to like and mark as complete!
                </p>
              )}

              <div className="mt-6">
                <h3 className="text-md font-bold text-[#CACACA]">Watch Guide</h3>
                <ol className="list-decimal pl-5 space-y-1 text-[#CACACA] text-[12px] md:text-[14px] lg:text-[18px]">
                  <li>Ensure you have signed up with Gmail with the same email in your profile before; and allowed permissions - If you have not, click <a href="https://exgeid-backend.onrender.com/api/v1/auth/google" className="text-[#FEC84D] hover:text-yellow-200 underline">here</a>.</li>
                  <li>Watch Till the End - Do not skip or fast-forward.</li>
                  <li>Like the video - Engage with the video to qualify.</li>
                  <li>Complete Linked Actions - Follow any IG, TikTok, or group links provided.</li>
                  <li>Mark as Done - Tap "Mark as Complete" after watching the video.</li>
                  <li>Check Your Earnings - Bonus will appear in your pending earnings once approved.</li>
                  <li>Complete All Videos - Finish your daily quota to unlock your full daily bonus.</li>
                </ol>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;