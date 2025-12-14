import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import QuizView from "./components/quiz/QuizView";

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
  const [awaitingAnimationForId, setAwaitingAnimationForId] = useState(null);
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

    // If re-selecting a previously visited landmark from the UI list,
    // open its overlay immediately without re-running animation.
    if (visitedLandmarkIds.has(landmark.id)) {
      setOverlayLandmark(landmark);
      setOverlayOpen(true);
      setLastClickedLandmark(landmark);
      return;
    }

    // trigger monument pop animation first via hover state
    setHoveredLandmarkId(landmark.id);
    setAwaitingAnimationForId(landmark.id);

    // if clicked the same spot as last time, open overlay immediately (no animation)
    if (isSamePosition(lastClickedPos, worldPos)) {
      setOverlayLandmark(landmark);
      setOverlayOpen(true);
      setLastClickedLandmark(landmark);
      if (worldPos) setLastClickedPos(worldPos);
      return;
    }
    // actual animation will start when model signals ready (via callback)
  };

  const handleLandmarkModelReady = (landmark) => {
    if (!landmark || landmark.id !== awaitingAnimationForId) return;
    setAwaitingAnimationForId(null);
    setPendingFly({
      landmark,
      targetPos: null,
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
    <BrowserRouter>
      <LoadingScreen progress={loadingProgress} isComplete={!isLoading} />

      <InitialGuide
        show={showGuide}
        onClose={() => setShowGuide(false)}
        onInteraction={startBackgroundMusic}
      />

      <AppHeader onGuideClick={openGuide} />
      {!isLoading && <VolumeControl />}

      <Routes>
        <Route
          path="/"
          element={
            <>
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
                onHoverChange={(landmark) =>
                  setHoveredLandmarkId(landmark?.id ?? null)
                }
                activeLandmarkId={hoveredLandmarkId}
              />

              {overlayOpen && overlayLandmark && (
                <MonumentOverlay
                  open={overlayOpen}
                  onClose={() => {
                    setOverlayOpen(false);
                    setHoveredLandmarkId(null);
                  }}
                  pageMode
                  landmark={overlayLandmark}
                  startInStreetView={
                    window?.location?.pathname?.replace(/^\//, "") ===
                    overlayLandmark.id
                  }
                />
              )}
            </>
          }
        />
        <Route path="/quiz" element={<QuizView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

