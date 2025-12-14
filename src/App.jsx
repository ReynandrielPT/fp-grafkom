import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Add this import
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
import QuizView from "./components/quiz/QuizView"; // Will be created later

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
    if (audioStarted) {
      const backgroundMusicPath = resolveAssetPath("music/jazz.mp3");
      audioManager.playBackgroundMusic(backgroundMusicPath);
      setAudioStarted(true);
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
    if (lastClickedLandmark?.id === landmark.id && isSamePosition(lastClickedPos, worldPos)) {
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
    <BrowserRouter>
      <LoadingScreen progress={loadingProgress} isComplete={!isLoading} />

      <InitialGuide
        show={showGuide}
        onClose={() => setShowGuide(false)}
        onInteraction={startBackgroundMusic}
      />

      <button
        className="fixed right-4 top-4 z-50 w-[7.5rem] bg-teal-primary/30 hover:bg-teal-primary/50 text-cyan-soft border border-teal-light/30 px-4 py-2 rounded-xl backdrop-blur-xl transition-all hover:scale-105 shadow-lg pointer-events-auto"
        onClick={openGuide}
        aria-label="Tampilkan Panduan"
      >
        <span className="flex items-center justify-center gap-2">
          <svg
            className="w-4 h-4"
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

      {/* Play Game Button - Below Panduan */}
      {!isLoading && (
        <button
          className="fixed right-4 top-[4.5rem] z-50 w-[7.5rem] bg-gradient-to-r from-teal-primary/50 to-cyan-600/50 hover:from-teal-primary/70 hover:to-cyan-600/70 text-cyan-soft border border-teal-light/30 px-4 py-2 rounded-xl backdrop-blur-xl transition-all hover:scale-105 shadow-lg pointer-events-auto"
          onClick={() => {
            setCurrentPage("game");
            window.history.pushState({}, "", "/game");
          }}
          aria-label="Play Game"
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4"
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

      <LandmarkList
        landmarks={landmarks}
        onSelect={handleLandmarkSelect}
        onHoverChange={(landmark) => setHoveredLandmarkId(landmark?.id ?? null)}
        activeLandmarkId={hoveredLandmarkId}
      />

      <div className="fixed left-0 top-0 w-screen h-screen pointer-events-none">
        <IndonesiaCanvas
          className="w-full h-full"
          landmarks={landmarks}
          onLandmarkSelect={handleLandmarkSelect}
          flyRequest={pendingFly}
          onPlaneAnimationComplete={handlePlaneAnimationComplete}
          hoveredLandmarkId={hoveredLandmarkId}
          onLoadingProgress={handleLoadingProgress}
        />
      </div>

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
    </BrowserRouter>
  );
}

export default App;

