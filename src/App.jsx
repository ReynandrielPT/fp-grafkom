import { useState } from "react";
import InitialGuide from "./components/ui/InitialGuide";
import IndonesiaCanvas from "./components/map/IndonesiaCanvas";
import MonumentOverlay from "./components/overlays/MonumentOverlay";
import { landmarks } from "./data/landmarks";

function App() {
  const [showGuide, setShowGuide] = useState(undefined);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayLandmark, setOverlayLandmark] = useState(null);
  const [pendingFly, setPendingFly] = useState(null);
  const [lastClickedPos, setLastClickedPos] = useState(null);

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

    // if clicked the same spot as last time, open overlay immediately (no animation)
    if (
      lastClickedPos &&
      worldPos &&
      lastClickedPos.length === 3 &&
      Math.abs(lastClickedPos[0] - worldPos[0]) < 0.001 &&
      Math.abs(lastClickedPos[1] - worldPos[1]) < 0.001 &&
      Math.abs(lastClickedPos[2] - worldPos[2]) < 0.001
    ) {
      setOverlayLandmark(landmark);
      setOverlayOpen(true);
      return;
    }

    // request fly animation from scene; include origin landmark so Scene
    // can decide whether to use a train (same island) or plane (different islands)
    setPendingFly({
      landmark,
      targetPos: worldPos,
      originLandmark: overlayLandmark,
    });
  };

  const handlePlaneAnimationComplete = (result) => {
    // result may contain targetPos
    const { targetPos } = result || {};
    if (targetPos) setLastClickedPos(targetPos);
    setPendingFly(null);
    // open the overlay for the landmark that requested the fly
    if (pendingFly?.landmark) setOverlayLandmark(pendingFly.landmark);
    setOverlayOpen(true);
  };

  return (
    <>
      <InitialGuide show={showGuide} onClose={() => setShowGuide(false)} />

      <div className="fixed left-4 top-4 z-50 pointer-events-none">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-1">
          Indonesia 3D Map
        </h1>
        <p className="text-sm text-white/80 drop-shadow">
          Explore Indonesian landmarks in 3D
        </p>
      </div>

      <button
        className="fixed right-4 top-4 z-50 bg-white/10 text-white border border-white/20 px-3 py-2 rounded-md backdrop-blur hover:bg-white/20 transition"
        onClick={openGuide}
        aria-label="Show guide"
      >
        Show Guide
      </button>

      <IndonesiaCanvas
        className="w-screen h-screen"
        landmarks={landmarks}
        onLandmarkSelect={handleLandmarkSelect}
        flyRequest={pendingFly}
        onPlaneAnimationComplete={handlePlaneAnimationComplete}
      />

      {overlayOpen && overlayLandmark && (
        <MonumentOverlay
          open={overlayOpen}
          onClose={() => setOverlayOpen(false)}
          pageMode
          modelUri={overlayLandmark.modelUri}
          title={overlayLandmark.name}
          description={overlayLandmark.description}
        />
      )}
    </>
  );
}

export default App;
