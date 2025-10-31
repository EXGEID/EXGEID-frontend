import { useState, useEffect, useRef } from 'react';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { BsCheckSquare, BsCheckSquareFill } from 'react-icons/bs';
import { FaClock } from "react-icons/fa";
//import YouTube from 'react-youtube';

// Simple encryption (base64 + char shift)
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

const VideoPlayerModal = ({ initialData, apiKey = 'YOUR_API_KEY', onClose }) => {
  const [isAnimated, setIsAnimated] = useState(false);
  useEffect(() => setIsAnimated(true), []);

  const handleOverlayClick = (e) => e.stopPropagation();

  const [player, setPlayer] = useState(null);
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [maxWatchedTime, setMaxWatchedTime] = useState(0); // UI only
  const [duration, setDuration] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [title, setTitle] = useState(
    initialData?.title ||
      (initialData?.localVideoSrc ? 'Local Video Title' : 'Loading title...')
  );
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

  // === [1] NEW REF: TRUE MAX WATCHED (HIGH-WATER MARK) ===
  const absoluteMaxWatchedRef = useRef(0);

  // === [2] NEW REFS FOR PROGRESS BAR PROTECTION ===
  const ytIframeRef = useRef(null);
  const protectTimer = useRef(null);
  const protectObs = useRef(null);

  // Control Overlay Refs
  const [showControls, setShowControls] = useState(false);
  const [controlsTimeout, setControlsTimeout] = useState(null);
  const videoContainerRef = useRef(null);
  const isHoveringRef = useRef(false);
  const lastInteractionRef = useRef(Date.now());

  // Duration fastforward or rewind Popups
  const [popup, setPopup] = useState({ show: false, type: 'rewind', count: 0, x: 0, y: 0, key: 0 });
  const popupTimeoutRef = useRef(null);

  const STORAGE_KEY = `video-progress-${initialData?.videoId || 'local'}`;

  // === [3] HELPER: AGGRESSIVELY HIDE PROGRESS BAR ===
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

  // Pop up Helpers
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

  // Control Helpers
  const rewind10 = (e) => {
    const newTime = Math.max(0, getCurrentTime() - 10);
    seekTo(newTime);
    showPopup('rewind', e.clientX, e.clientY);
  };

  const forward10 = (e) => {
    const newTime = getCurrentTime() + 10;
    if (newTime <= absoluteMaxWatchedRef.current) { // ← Use absolute max
        seekTo(newTime);
        showPopup('forward', e.clientX, e.clientY);
    }
  };

  const togglePauseFromOverlay = () => {
    if (isPaused) playVideo();
    else pauseVideo();
  };

  //reset timer helper
  const resetHideTimer = () => {
    if (controlsTimeout) clearTimeout(controlsTimeout);

    const id = setTimeout(() => {
        // Only hide if no recent interaction and not hovering after 2s
        if (Date.now() - lastInteractionRef.current >= 3000 && !isHoveringRef.current) {
        setShowControls(false);
        }
    }, 2000);

    setControlsTimeout(id);
  };

  // 1. LOAD SAVED PROGRESS
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
    absoluteMaxWatchedRef.current = loadedMax; // ← Initialize absolute max
  }, [initialData?.videoId, initialData?.localVideoSrc]);

  // 2. SAVE PROGRESS (every 5s)
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
            maxWatchedTime: absoluteMaxWatchedRef.current, // ← Save absolute max
            duration 
          })
        );
      }
    }, 5000);
    return () => {
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
    };
  }, [currentTime, duration, isCompleted]); // ← Removed maxWatchedTime from deps

  // Save on unmount
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

  // 3. INTEGRITY CHECK
  useEffect(() => {
    if (isCompleted) {
      if (integrityIntervalRef.current) clearInterval(integrityIntervalRef.current);
      return;
    }
    integrityIntervalRef.current = setInterval(() => {
      if (!isCompleted && !isResetting.current) {
        const currentTotal = totalPlayedTimeRef.current + (playStartRef.current !== 0 ? (performance.now() - playStartRef.current) / 1000 : 0);
        if (absoluteMaxWatchedRef.current > initialMaxRef.current + currentTotal + 5) {
          isResetting.current = true;
          resetProgress();
        }
      }
    }, 2000);
    return () => {
      if (integrityIntervalRef.current) clearInterval(integrityIntervalRef.current);
    };
  }, [isCompleted]);

  // ---- SHOW CONTROLS ON PLAY, HIDE AFTER 2 SECONDS OF INACTIVITY ----
  useEffect(() => {
    if (isPaused) {
        setShowControls(false);
        if (controlsTimeout) clearTimeout(controlsTimeout);
        return;
    }

    // Show immediately on play
    setShowControls(true);
    resetHideTimer();

    // eslint-disable-next-line
  }, [isPaused]);

  // ---- click on video → show controls for 2 s ----
  const handleVideoClick = () => {
    lastInteractionRef.current = Date.now();

    if (isPaused) {
        playVideo();
        return;
    }

    setShowControls(true);
    resetHideTimer();
  };

  //  // ---- mouse enter/leave (desktop) ----
  const handleMouseEnter = () => {
    if (isPaused) return;
    isHoveringRef.current = true;
    setShowControls(true);
  };
  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    if (controlsTimeout) clearTimeout(controlsTimeout);
    const id = setTimeout(() => setShowControls(false), 2000);
    setControlsTimeout(id);
  };

  // 4. SEEK — BLOCK SKIP
  const seekTo = (seconds) => {
    if (seconds > absoluteMaxWatchedRef.current + 1) return; // ← Use absolute max
    const p = getPlayer();
    if (!p) return;
    if (initialData?.localVideoSrc) p.currentTime = seconds;
    else p.seekTo(seconds);
  };

  // 5. RESET PROGRESS
  const resetProgress = async () => {
    setCurrentTime(0);
    setMaxWatchedTime(0);
    absoluteMaxWatchedRef.current = 0; // ← Reset absolute max
    sessionStorage.removeItem(STORAGE_KEY);
    await new Promise(r => setTimeout(r, 100));
    const p = getPlayer();
    if (p) seekTo(0);
    alert('Invalid playback detected. Progress reset.');
    setTimeout(() => { isResetting.current = false; }, 3000);
    skipAttempts.current = 0;
  };

  const handleInvalidSeek = () => {
    skipAttempts.current++;
    alert('Skipping not permitted');
    if (skipAttempts.current >= 10) {
      resetProgress();
    }
  };

  // 6. POLLING — CATCH SKIPS
  useEffect(() => {
    if (isPaused || isCompleted || isResetting.current) return;
    const id = setInterval(() => {
      const cur = getCurrentTime();
      if (cur > absoluteMaxWatchedRef.current + 2) {
        seekTo(absoluteMaxWatchedRef.current);
        handleInvalidSeek();
      } else if (cur > absoluteMaxWatchedRef.current) {
        absoluteMaxWatchedRef.current = cur;
        setMaxWatchedTime(cur); // Update UI
      }
    }, 200);
    return () => clearInterval(id);
  }, [isPaused, isCompleted, isResetting]);

  // 7. ANTI-DEBUG
  useEffect(() => {
    const detect = () => {
      if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
        pauseVideo();
        alert('Developer tools detected. Pausing for security.');
      }
    };
    window.addEventListener('resize', detect);
    return () => window.removeEventListener('resize', detect);
  }, []);

  // 8. PLAYBACK RATE LOCK
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
            resetProgress();
            alert('Repeated speed changes detected. Session invalidated.');
          } else {
            alert('Playback speed must remain at 1x.');
          }
        }
      }
    }, 1000);
    return () => {
      if (rateIntervalRef.current) clearInterval(rateIntervalRef.current);
    };
  }, [isCompleted]);

  // === [9] YOUTUBE: HIDE PROGRESS BAR ON LOAD ===
  useEffect(() => {
    if (initialData?.localVideoSrc) return;

    const iframe = ytIframeRef.current;
    if (!iframe) return;

    const waitForPlayer = setInterval(() => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      const container = doc.querySelector('.ytp-progress-bar-container');
      if (container) {
        hideProgress(container);
        clearInterval(waitForPlayer);
      }
    }, 200);

    return () => clearInterval(waitForPlayer);
  }, [initialData?.localVideoSrc]);

  // === [10] NATIVE VIDEO: HIDE TIMELINE ===
  useEffect(() => {
    if (!initialData?.localVideoSrc) return;

    const style = document.createElement('style');
    style.textContent = `
      video::-webkit-media-controls-timeline,
      video::-webkit-media-controls-timeline-container,
      video::-webkit-media-controls-current-time-display,
      video::-webkit-media-controls-time-remaining-display {
        display: none !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => document.head.removeChild(style);
  }, [initialData?.localVideoSrc]);

  // === [11] RE-APPLY PROTECTION EVERY 500ms ===
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
  }, [initialData?.localVideoSrc]);

  // === [12] MUTATIONOBSERVER: RE-HIDE IF ADDED BACK ===
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
  }, [initialData?.localVideoSrc]);

  // 13. FETCH METADATA — ONLY FOR YOUTUBE
  useEffect(() => {
    if (initialData?.localVideoSrc) return;
    if (!initialData?.videoId) return;

    const fetchMeta = async () => {
      try {
        const ytRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${initialData.videoId}&key=${apiKey}`
        );
        const yt = await ytRes.json();
        const item = yt.items?.[0];
        if (item) {
          setTitle(item.snippet.title);
          setDuration(parseDuration(item.contentDetails.duration));
          setViews(item.statistics.viewCount || 0);
          setLikes(item.statistics.likeCount || 0);

          const rydRes = await fetch(
            `https://returnyoutubedislikeapi.com/votes?videoId=${initialData.videoId}`
          );
          const ryd = await rydRes.json();
          setDislikes(ryd.dislikes || 0);
        }
      } catch (e) {
        console.error('Metadata fetch error', e);
      }
    };
    fetchMeta();
  }, [initialData?.videoId, apiKey, initialData?.localVideoSrc]);

  // 14. PLAYER HANDLERS
  const onReady = (e) => {
    setPlayer(e.target);
    ytIframeRef.current = e.target.getIframe();
    seekTo(currentTime);
  };

  const onLoadedMetadata = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = currentTime;
      setDuration(videoRef.current.duration);
    }
  };

  const onTimeUpdate = () => {
    const t = getCurrentTime();
    setCurrentTime(t);

    if (t > absoluteMaxWatchedRef.current) {
      absoluteMaxWatchedRef.current = t;
      setMaxWatchedTime(t);
    }

    if (t >= duration - 1 && absoluteMaxWatchedRef.current >= duration - 1 && duration > 0) {
      setIsCompleted(true);
      clearAllIntervals();
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
      if (attempted > absoluteMaxWatchedRef.current + 2) {
        seekTo(absoluteMaxWatchedRef.current);
        handleInvalidSeek();
      }
    }, 150);
  };

  const onSeeked = () => {
    const cur = getCurrentTime();
    if (cur > absoluteMaxWatchedRef.current + 2) {
      seekTo(absoluteMaxWatchedRef.current);
      handleInvalidSeek();
    } else if (cur > absoluteMaxWatchedRef.current) {
      absoluteMaxWatchedRef.current = cur;
      setMaxWatchedTime(cur);
    }
  };

  // 15. HELPERS
  const getPlayer = () => initialData?.localVideoSrc ? videoRef.current : player;
  const getCurrentTime = () => initialData?.localVideoSrc ? (videoRef.current?.currentTime || 0) : (player?.getCurrentTime?.() || 0);
  const getPlaybackRate = () => initialData?.localVideoSrc ? (videoRef.current?.playbackRate || 1) : (player?.getPlaybackRate?.() || 1);
  const setPlaybackRate = (r) => {
    if (initialData?.localVideoSrc && videoRef.current) videoRef.current.playbackRate = r;
    else if (player) player.setPlaybackRate(r);
  };
  const pauseVideo = () => {
    if (initialData?.localVideoSrc && videoRef.current) videoRef.current.pause();
    else if (player) player.pauseVideo();
    setIsPaused(true);
  };
  const playVideo = () => {
    if (initialData?.localVideoSrc && videoRef.current) videoRef.current.play();
    else if (player) player.playVideo();
    setIsPaused(false);
  };

  const shareVideo = async () => {
    const url = `https://www.youtube.com/watch?v=${initialData?.videoId}`;
    try { await navigator.share({ title, text: 'Check out this video!', url }); }
    catch { navigator.clipboard.writeText(url); alert('URL copied to clipboard!'); }
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

  // RENDER
  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ${
        isAnimated ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleOverlayClick}
    >
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

              {/* VIDEO PLAYER */}
              <div
                ref={videoContainerRef}
                className="bg-gray-700 relative"
                onClick={handleVideoClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {initialData?.localVideoSrc ? (
                  <video
                    ref={videoRef}
                    src={initialData.localVideoSrc}
                    onLoadedMetadata={onLoadedMetadata}
                    onTimeUpdate={onTimeUpdate}
                    onPlay={onPlay}
                    onPause={onPause}
                    onSeeking={onSeeking}
                    onSeeked={onSeeked}
                    onEnded={onPause}
                    className="w-full h-auto rounded pointer-events-none"
                    controls
                    controlsList="noduration noplaybackrate"
                  />
                ) : (
                  <YouTube
                    videoId={initialData?.videoId}
                    opts={{
                      height: '315',
                      width: '100%',
                      playerVars: {
                        controls: 1,
                        modestbranding: 1,
                        rel: 0,
                        fs: 1,
                        iv_load_policy: 3,
                      },
                    }}
                    onReady={onReady}
                    onPlay={onPlay}
                    onPause={onPause}
                    onStateChange={(e) => {
                      if (e.data === 3) onSeeking();
                      if (e.data === 1 || e.data === 2) onSeeked();
                      if (e.data === 0) onPause();
                    }}
                    containerClassName="yt-progress-hider"
                    className="rounded pointer-events-none"
                  />
                )}
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

                {/* NEW CONTROL OVERLAY */}
                {showControls && !isPaused && (
                    <div className="absolute inset-0 flex items-center justify-center gap-12 pointer-events-none bg-black/20">
                        {/* -10 s */}
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

                        {/* PAUSE */}
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

                        {/* +10 s */}
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

              {/* CUSTOM PROGRESS BAR */}
              <div className="mt-4 relative h-8">
                <div className="absolute inset-x-0 top-3 h-2 mt-4 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-green-500 opacity-30 transition-all duration-300"
                    style={{ width: duration ? `${(absoluteMaxWatchedRef.current / duration) * 100}%` : '0%' }}
                  />
                  <div
                    className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300"
                    style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                  />
                </div>

                <div
                  className="absolute top-6 left-0 w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 pointer-events-none"
                  style={{
                    left: `calc(${duration ? (currentTime / duration) * 100 : 0}% - 10px)`,
                    display: duration ? 'block' : 'none',
                  }}
                />

                <div className="flex justify-between text-xs text-[#CACACA] mt-6">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* HIDE PROGRESS BARS (fallback) */}
              <style jsx>{`
                .yt-progress-hider .ytp-progress-bar-container,
                .yt-progress-hider .ytp-progress-bar,
                .yt-progress-hider .ytp-load-progress,
                .yt-progress-hider .ytp-scrubber-container,
                .yt-progress-hider .ytp-scrubber-button {
                  display: none !important;
                }
                video::-webkit-media-controls-timeline,
                video::-webkit-media-controls-current-time-display,
                video::-webkit-media-controls-time-remaining-display {
                  display: none !important;
                }
              `}</style>

              <div className='grid grid-cols-2 gap-4'>
                {/* TOGGLE PAUSE AND PLAY */}
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
                    onClick={() => setLiked(!liked)}
                    className={`
                        border-2 font-bold 
                        transition-all duration-300 ease-in-out 
                        hover:scale-105 
                        lg:px-4 md:px-3 px-2 
                        py-2
                        rounded-md mb-4 transition mt-6 md:mt-12 
                        lg:text-[16px] md:text-[13.58px] text-[10.18px]
                        flex items-center justify-center gap-2
                        ${
                        liked
                            ? 'bg-[#FEC84D] font-bold text-[#1A202C]'
                            : 'border-[#FEC84D] text-[#FEC84D] hover:bg-yellow-900 hover:text-white'
                        }
                    `}
                    >
                    {liked ? (
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

              {/* MARK AS COMPLETE BUTTON - FULL WIDTH */}
              {isCompleted && liked && (
                <button
                    onClick={() => !isMarkedComplete && setIsMarkedComplete(true)}
                    disabled={isMarkedComplete}
                    className={`
                    w-full mt-2 mb-4 py-3 md:py-4 rounded-lg font-bold md:text-lg text-[12px]
                    flex items-center justify-center gap-2 transition-all duration-300
                    ${isMarkedComplete
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'border-2 border-[#FEC84D] text-[#FEC84D] hover:bg-yellow-900 hover:text-white'
                    }
                    `}
                >
                    {isMarkedComplete ? (
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

              <h2 className="lg:text-[28px] md:text-[24px] text-[20px] font-bold text-[#CACACA] lg:mb-2 mb-1 text-center">
                {title}
              </h2>

              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-[#CACACA] flex items-center gap-2"><FaClock />{formatTime(currentTime)} sec</span>
                <span className="text-yellow-400">{views.toLocaleString()} points</span>
                <span className="text-[#CACACA]">👍 {formatNumber(likes)}</span>
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
                  <li>Ensure you have signed up with Gmail before - If you have not, click <a href="https://exgeid-backend.onrender.com/api/v1/auth/google" className="text-[#FEC84D] hover:text-yellow-200 underline">here</a>.</li>
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