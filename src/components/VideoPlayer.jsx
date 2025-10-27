import { useState, useEffect, useRef } from 'react';
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
  const [maxWatchedTime, setMaxWatchedTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [title, setTitle] = useState(
    initialData?.title ||
      (initialData?.localVideoSrc ? 'Local Video Title' : 'Loading title...')
  );
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

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

  // === [1] NEW REFS FOR PROGRESS BAR PROTECTION ===
  const ytIframeRef = useRef(null);
  const protectTimer = useRef(null);
  const protectObs = useRef(null);

  const STORAGE_KEY = `video-progress-${initialData?.videoId || 'local'}`;

  // === [2] HELPER: AGGRESSIVELY HIDE PROGRESS BAR ===
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
          encrypt({ currentTime, maxWatchedTime, duration })
        );
      }
    }, 5000);
    return () => {
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
    };
  }, [currentTime, maxWatchedTime, duration, isCompleted]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (!isCompleted && currentTime > 0) {
        sessionStorage.setItem(
          STORAGE_KEY,
          encrypt({ currentTime, maxWatchedTime, duration })
        );
      }
    };
  }, []);

  const currentTimeRef = useRef(currentTime);
  const maxWatchedTimeRef = useRef(maxWatchedTime);
  const durationRef = useRef(duration);
  const isCompletedRef = useRef(isCompleted);

  useEffect(() => {
    currentTimeRef.current = currentTime;
    maxWatchedTimeRef.current = maxWatchedTime;
    durationRef.current = duration;
    isCompletedRef.current = isCompleted;
  }, [currentTime, maxWatchedTime, duration, isCompleted]);

  useEffect(() => {
    return () => {
      if (!isCompletedRef.current && currentTimeRef.current > 0) {
        sessionStorage.setItem(
          STORAGE_KEY,
          encrypt({ currentTime: currentTimeRef.current, maxWatchedTime: maxWatchedTimeRef.current, duration: durationRef.current })
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
        if (maxWatchedTime > initialMaxRef.current + currentTotal + 5) {
          isResetting.current = true;
          resetProgress();
        }
      }
    }, 2000);
    return () => {
      if (integrityIntervalRef.current) clearInterval(integrityIntervalRef.current);
    };
  }, [isCompleted]);

  // 4. SEEK — BLOCK SKIP
  const seekTo = (seconds) => {
    if (seconds > maxWatchedTime + 1) return;
    const p = getPlayer();
    if (!p) return;
    if (initialData?.localVideoSrc) p.currentTime = seconds;
    else p.seekTo(seconds);
  };

  // 5. RESET PROGRESS
  const resetProgress = async () => {
    setCurrentTime(0);
    setMaxWatchedTime(0);
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
      if (cur > maxWatchedTime + 2) {
        seekTo(maxWatchedTime);
        handleInvalidSeek();
      } else if (cur > maxWatchedTime) {
        setMaxWatchedTime(cur);
      }
    }, 200);
    return () => clearInterval(id);
  }, [isPaused, isCompleted, maxWatchedTime, currentTime, isResetting]);

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

  // === [3] YOUTUBE: HIDE PROGRESS BAR ON LOAD ===
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

  // === [4] NATIVE VIDEO: HIDE TIMELINE ===
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

  // === [5] RE-APPLY PROTECTION EVERY 500ms ===
  useEffect(() => {
    const enforce = () => {
      // YouTube
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

  // === [6] MUTATIONOBSERVER: RE-HIDE IF ADDED BACK ===
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

  // 9. FETCH METADATA — ONLY FOR YOUTUBE
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

  // 10. PLAYER HANDLERS
  const onReady = (e) => {
    setPlayer(e.target);
    ytIframeRef.current = e.target.getIframe(); // [7] CAPTURE IFRAME
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
    if (t > maxWatchedTime) setMaxWatchedTime(t);

    if (t >= duration - 1 && maxWatchedTime >= duration - 1 && duration > 0) {
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
        encrypt({ currentTime, maxWatchedTime, duration })
      );
    }
  };

  const onSeeking = () => {
    setTimeout(() => {
      const attempted = getCurrentTime();
      if (attempted > maxWatchedTime + 2) {
        seekTo(maxWatchedTime);
        handleInvalidSeek();
      }
    }, 150);
  };

  const onSeeked = () => {
    const cur = getCurrentTime();
    if (cur > maxWatchedTime + 2) {
      seekTo(maxWatchedTime);
      handleInvalidSeek();
    } else if (cur > maxWatchedTime) {
      setMaxWatchedTime(cur);
    }
  };

  // 11. HELPERS
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
              <div className="bg-gray-700 relative">
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
                    className="w-full h-auto rounded"
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
                    className="rounded"
                  />
                )}
                {isPaused && (
                  <button
                    onClick={playVideo}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl opacity-50 hover:opacity-100"
                  >
                     ▶
                  </button>
                )}
              </div>

              {/* [8] CUSTOM PROGRESS BAR — UNCHANGED */}
              <div className="mt-4 relative h-8">
                <div className="absolute inset-x-0 top-3 h-2 mt-4 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-green-500 opacity-30 transition-all duration-300"
                    style={{ width: duration ? `${(maxWatchedTime / duration) * 100}%` : '0%' }}
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

              {/* HIDE PROGRESS BARS (kept for fallback) */}
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

              {/* PAUSE BUTTON */}
              <button
                onClick={pauseVideo}
                className="w-full bg-[#8F0406] hover:bg-red-700 hover:scale-110 text-white lg:text-[18px] md:text-[14px] text-[16px] font-semibold py-2 md:py-4 rounded-lg mb-4 transition mt-6 md:mt-12"
              >
                Pause Video
              </button>

              <h2 className="lg:text-[40px] md:text-[32px] text-[24px] font-bold text-[#CACACA] lg:mb-2 mb-1 text-center">
                {title}
              </h2>

              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-[#CACACA]">{formatTime(currentTime)}</span>
                <span className="text-yellow-400">₦{views.toLocaleString()}.00</span>
                <span className="text-[#CACACA]">👍 {formatNumber(likes)}</span>
                <span className="text-[#CACACA]">👎 {formatNumber(dislikes)}</span>
                <button onClick={shareVideo} className="text-blue-400">
                  ➤ SHARE
                </button>
              </div>

              <div className="mt-4">
                <h3 className="text-md font-bold text-[#CACACA]">Watch Guide</h3>
                <ol className="list-decimal pl-5 space-y-1 text-[#CACACA] text-[12px] md:text-[14px] lg:text-[18px]">
                  <li>Watch Till the End - Do not skip or fast-forward.</li>
                  <li>Like & Subscribe - Engage with the video to qualify.</li>
                  <li>Complete Linked Actions - Follow any IG, TikTok, or group links provided.</li>
                  <li>Mark as Done - Tap "Mark as Done" after watching or wait for auto-verification.</li>
                  <li>Check Your Earnings - Bonus will appear in your balance once approved.</li>
                  <li>Complete All Videos - Finish your daily quota to unlock your full daily bonus.</li>
                </ol>
              </div>

              {isCompleted && (
                <p className="text-green-500 mt-4 text-center font-bold">
                  Video Completed!
                </p>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;