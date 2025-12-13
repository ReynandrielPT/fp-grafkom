import { useEffect, useState } from "react";
import InitialGuide from "./components/ui/InitialGuide";
import IndonesiaCanvas from "./components/map/IndonesiaCanvas";
import MonumentOverlay from "./components/overlays/MonumentOverlay";
import LoadingScreen from "./components/ui/LoadingScreen";
import LandmarkList from "./components/ui/LandmarkList";
import AppHeader from "./components/ui/AppHeader";
import VolumeControl from "./components/ui/VolumeControl";
import { landmarks } from "./data/landmarks";
import { isSamePosition } from "./utils/coordinateUtils";
import audioManager from "./utils/audioManager";
import { resolveAssetPath } from "./utils/assets";

/**
 * App Component
 * Main application container managing state and UI interactions
 */
function App() {
  const [showGuide, setShowGuide] = useState(undefined);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayLandmark, setOverlayLandmark] = useState(null);
  const [pendingFly, setPendingFly] = useState(null);
  const [lastClickedPos, setLastClickedPos] = useState(null);
  const [lastClickedLandmark, setLastClickedLandmark] = useState(null);
  const [hoveredLandmarkId, setHoveredLandmarkId] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [visitedLandmarkIds, setVisitedLandmarkIds] = useState(() => new Set());
  const [audioStarted, setAudioStarted] = useState(false);

  // Start background music after user interaction
  const startBackgroundMusic = () => {
    if (!audioStarted) {
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

  // Keep this for backwards compatibility but animation starts immediately now
  const handleLandmarkModelReady = (landmark) => {
    // No longer needed for animation trigger
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
      // mark as visited so future clicks open overlay immediately
      setVisitedLandmarkIds((prev) => {
        const next = new Set(prev);
        next.add(pendingFly.landmark.id);
        return next;
      });
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

  return (
    <>
      <LoadingScreen progress={loadingProgress} isComplete={!isLoading} />

      <InitialGuide
        show={showGuide}
        onClose={() => setShowGuide(false)}
        onInteraction={startBackgroundMusic}
      />

      <AppHeader />

      {/* Show global volume control after loading completes */}
      {!isLoading && <VolumeControl />}

      <button
        className="fixed right-4 top-4 z-50 bg-teal-primary/30 hover:bg-teal-primary/50 text-cyan-soft border border-teal-light/30 px-4 py-2 rounded-xl backdrop-blur-xl transition-all hover:scale-105 shadow-lg pointer-events-auto"
        onClick={openGuide}
        aria-label="Tampilkan Panduan"
      >
        <span className="flex items-center gap-2">
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

      <IndonesiaCanvas
        className="w-screen h-screen"
        landmarks={landmarks}
        onLandmarkSelect={handleLandmarkSelect}
        flyRequest={pendingFly}
        onPlaneAnimationComplete={handlePlaneAnimationComplete}
        hoveredLandmarkId={hoveredLandmarkId}
        onLoadingProgress={handleLoadingProgress}
        onLandmarkModelReady={handleLandmarkModelReady}
      />

      <LandmarkList
        landmarks={landmarks}
        onSelect={handleLandmarkSelect}
        onHoverChange={(landmark) => setHoveredLandmarkId(landmark?.id ?? null)}
        activeLandmarkId={hoveredLandmarkId}
      />

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
