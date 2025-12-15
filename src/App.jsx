import { useEffect, useState } from "react";
import InitialGuide from "./components/ui/InitialGuide";
import IndonesiaCanvas from "./components/map/IndonesiaCanvas";
import MonumentOverlay from "./components/overlays/MonumentOverlay";
import LoadingScreen from "./components/ui/LoadingScreen";
import LandmarkList from "./components/ui/LandmarkList";
import Game from "./components/game/Game";
import { landmarks } from "./data/landmarks";
import { isSamePosition } from "./utils/coordinateUtils";
import audioManager from "./utils/audioManager";
import { resolveAssetPath } from "./utils/assets";

/**
 * App Component
 * Main application container managing state and UI interactions
 */
function App() {
  const [currentPage, setCurrentPage] = useState("map"); // "map" or "game"
  const [showGuide, setShowGuide] = useState(undefined);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayLandmark, setOverlayLandmark] = useState(null);
  const [pendingFly, setPendingFly] = useState(null);
  const [lastClickedPos, setLastClickedPos] = useState(null);
  const [lastClickedLandmark, setLastClickedLandmark] = useState(null);
  const [hoveredLandmarkId, setHoveredLandmarkId] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [audioStarted, setAudioStarted] = useState(false);

  // Start background music after user interaction
  const startBackgroundMusic = () => {
    if (!audioStarted) {
      const backgroundMusicPath = resolveAssetPath("music/indo.mp3");
      const playPromise = audioManager.playBackgroundMusic(backgroundMusicPath);
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => setAudioStarted(true))
          .catch(() => {
            // Keep audioStarted false; will retry on user interaction fallback
          });
      } else {
        // If no promise is returned (older browsers), assume started
        setAudioStarted(true);
      }
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioManager.cleanup();
    };
  }, []);

  // Start music when loading completes (user has interacted with page)
  useEffect(() => {
    if (!isLoading) {
      startBackgroundMusic();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // As a fallback for autoplay policies, start music on first user interaction
  useEffect(() => {
    if (audioStarted) return;
    const handler = () => {
      startBackgroundMusic();
      window.removeEventListener("pointerdown", handler, { capture: true });
    };
    window.addEventListener("pointerdown", handler, { capture: true });
    const keyHandler = () => {
      startBackgroundMusic();
      window.removeEventListener("keydown", keyHandler, { capture: true });
    };
    window.addEventListener("keydown", keyHandler, { capture: true });
    return () => {
      window.removeEventListener("pointerdown", handler, { capture: true });
      window.removeEventListener("keydown", keyHandler, { capture: true });
    };
  }, [audioStarted]);

  const openGuide = () => {
    localStorage.removeItem("hasSeenGuide");
    setShowGuide(true);
  };

  const handleLandmarkSelect = (landmark, worldPos) => {
    if (!landmark) return;
    // ignore plane or unspecified models
    const uri = String(landmark.modelUri ?? "").toLowerCase();
    if (
      uri.includes("plane") ||
      uri.includes("/2.glb") ||
      uri.endsWith("/2.glb")
    )
      return;

    // if an animation is pending, ignore additional clicks
    if (pendingFly) return;

    // If clicking the currently selected landmark (same position), open overlay directly
    if (
      lastClickedLandmark?.id === landmark.id &&
      isSamePosition(lastClickedPos, worldPos)
    ) {
      setOverlayLandmark(landmark);
      setOverlayOpen(true);
      return;
    }

    // Set hover state for visual feedback
    setHoveredLandmarkId(landmark.id);

    // Start animation immediately - don't wait for model to load
    // The animation uses world coordinates, not the 3D model
    setPendingFly({
      landmark,
      targetPos: worldPos, // may be null from menu click, Scene will compute it
      originLandmark: lastClickedLandmark,
    });
  };

  const handlePlaneAnimationComplete = (result) => {
    // result may contain targetPos
    const { targetPos } = result || {};
    if (targetPos) setLastClickedPos(targetPos);
    setPendingFly(null);
    // open the overlay for the landmark that requested the fly
    if (pendingFly?.landmark) {
      setOverlayLandmark(pendingFly.landmark);
      // remember which landmark was landed on
      setLastClickedLandmark(pendingFly.landmark);
    }
    setOverlayOpen(true);
  };

  const handleLoadingProgress = (progress) => {
    setLoadingProgress(progress);
    if (progress >= 100) {
      // Add a small delay before hiding loading screen for smooth transition
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  // initialize lastClickedLandmark to Monas if available so first-click
  // flights use Monas as origin for island comparisons
  useEffect(() => {
    if (lastClickedLandmark) return;
    const monas = landmarks.find((l) =>
      String(l?.modelUri ?? "")
        .toLowerCase()
        .includes("monas")
    );
    if (monas) setLastClickedLandmark(monas);
  }, [lastClickedLandmark]);

  // Debug route: if path matches a landmark id (e.g. /borobudur), open overlay
  useEffect(() => {
    try {
      const path = (window?.location?.pathname || "").replace(/^\//, "");
      if (!path) return;
      const target = landmarks.find((l) => l.id === path);
      if (target) {
        setOverlayLandmark(target);
        setOverlayOpen(true);
        // Optionally open street view immediately if available
        // We'll pass a prop to MonumentOverlay (startInStreetView) below
      }
    } catch {
      // ignore on environments without window
    }
  }, []);

  // Check URL for game route
  useEffect(() => {
    const path = window?.location?.pathname || "";
    if (path === "/game" || path === "/geoguesser") {
      setCurrentPage("game");
    }
  }, []);

  // If on game page, render the game
  if (currentPage === "game") {
    return (
      <Game
        onBack={() => {
          setCurrentPage("map");
          window.history.pushState({}, "", "/");
        }}
      />
    );
  }

  return (
    <>
      <LoadingScreen progress={loadingProgress} isComplete={!isLoading} />

      <InitialGuide
        show={showGuide}
        onClose={() => setShowGuide(false)}
        onInteraction={startBackgroundMusic}
      />

      {!overlayOpen && (
        <button
          className="fixed right-5 top-5 z-50 w-40 bg-gradient-to-br from-[#1a3a52] via-[#1e4a5f] to-[#2a5a6f] hover:from-[#1e4a5f] hover:via-[#2a5a6f] hover:to-[#1a3a52] text-cyan-soft px-5 py-2.5 rounded-2xl border border-teal-light/30 transition-all hover:scale-105 shadow-xl pointer-events-auto text-base font-semibold"
          onClick={openGuide}
          aria-label="Tampilkan Panduan"
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Panduan
          </span>
        </button>
      )}

      {/* Play Game Button - Below Panduan */}
      {!isLoading && !overlayOpen && (
        <button
          className="fixed right-5 top-[5.5rem] z-50 w-40 bg-gradient-to-br from-[#1a3a52] via-[#1e4a5f] to-[#2a5a6f] hover:from-[#1e4a5f] hover:via-[#2a5a6f] hover:to-[#1a3a52] text-cyan-soft px-5 py-2.5 rounded-2xl border border-teal-light/30 transition-all hover:scale-105 shadow-xl pointer-events-auto text-base font-semibold"
          onClick={() => {
            setCurrentPage("game");
            window.history.pushState({}, "", "/game");
          }}
          aria-label="Play Game"
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Game
          </span>
        </button>
      )}

      {!overlayOpen && (
        <LandmarkList
          landmarks={landmarks}
          onSelect={handleLandmarkSelect}
          onHoverChange={(landmark) =>
            setHoveredLandmarkId(landmark?.id ?? null)
          }
          activeLandmarkId={hoveredLandmarkId}
        />
      )}

      {!overlayOpen && (
        <div className="fixed left-0 top-0 w-screen h-screen pointer-events-none">
          <IndonesiaCanvas
            className="w-full h-full"
            landmarks={landmarks}
            onLandmarkSelect={handleLandmarkSelect}
            flyRequest={pendingFly}
            onPlaneAnimationComplete={handlePlaneAnimationComplete}
            hoveredLandmarkId={hoveredLandmarkId}
            onLoadingProgress={handleLoadingProgress}
            lastClickedPos={lastClickedPos}
          />
        </div>
      )}

      {overlayOpen && overlayLandmark && (
        <MonumentOverlay
          open={overlayOpen}
          onClose={() => {
            setOverlayOpen(false);
            // Clear hover state so marker returns to normal
            setHoveredLandmarkId(null);
          }}
          pageMode
          landmark={overlayLandmark}
          // if the current path matches the landmark id, start the overlay showing Street View
          startInStreetView={
            window?.location?.pathname?.replace(/^\//, "") ===
            overlayLandmark.id
          }
        />
      )}
    </>
  );
}

export default App;
