import { useEffect, useState } from "react";
import { resolveAssetPath } from "../../utils/assets";
import LandmarkViewer from "./LandmarkViewer";
import InfoPanel from "./InfoPanel";
import StreetViewModal from "./StreetViewModal";
import audioManager from "../../utils/audioManager";

function MonumentOverlay({
  open,
  onClose,
  landmark = null,
  modelUri = resolveAssetPath("model/monas.glb"),
  title = "Monumen Nasional",
  description = null,
}) {
  // Extract landmark data
  const activeUri = landmark?.modelUri ?? modelUri;
  const activeTitle = landmark?.name ?? title;
  const activeDesc = landmark?.description ?? description;
  const activeAnnotations = landmark?.annotations || [];
  const activeStreetView = landmark?.streetViewUrl;
  const activePreset = landmark?.environmentPreset || "park";
  const activeAudio = landmark?.audioUri;
  const activeScale = landmark?.popupScale || 2;
  const activeObjectPosition = landmark?.objectPosition || [0, 0, 0];

  const [isVisible, setIsVisible] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [showStreetView, setShowStreetView] = useState(false);

  // Play landmark audio when overlay opens, stop immediately when closing
  useEffect(() => {
    if (open && activeAudio) {
      audioManager.playLandmarkAudio(activeAudio);
    }

    // Stop audio immediately when modal starts closing
    if (!open) {
      audioManager.stopLandmarkAudio();
    }
  }, [open, activeAudio]);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
    } else {
      setTimeout(() => {
        setIsVisible(false);
        setShowStreetView(false);
      }, 500);
    }
  }, [open]);

  if (!open && !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] w-screen h-screen bg-black transition-opacity duration-500 ease-in-out ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0 w-full h-full">
        <LandmarkViewer
          modelUri={activeUri}
          modelScale={activeScale}
          annotations={activeAnnotations}
          environmentPreset={activePreset}
          objectPosition={activeObjectPosition}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />
      </div>

      {/* Street View Modal */}
      <StreetViewModal
        isOpen={showStreetView}
        streetViewUrl={activeStreetView}
        onClose={() => setShowStreetView(false)}
      />

      {/* Close Button */}
      {!showStreetView && (
        <button
          onClick={() => {
            // Ensure landmark audio fades out immediately on manual close
            try {
              audioManager.stopLandmarkAudio();
            } catch {}
            onClose();
          }}
          className="absolute top-6 right-6 z-50 p-3 bg-teal-primary/30 hover:bg-red-600/80 text-cyan-soft rounded-full backdrop-blur-md border border-teal-light/20 transition-all transform hover:scale-110 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 group-hover:rotate-90 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* Info Panel */}
      <InfoPanel
        title={activeTitle}
        description={activeDesc}
        island={landmark?.island}
        isVisible={showInfo && !showStreetView}
        hasStreetView={!!activeStreetView}
        onOpenStreetView={() => setShowStreetView(true)}
        onHide={() => setShowInfo(false)}
      />

      {/* Show Info Button */}
      {!showInfo && !showStreetView && (
        <button
          onClick={() => setShowInfo(true)}
          className="absolute bottom-6 left-6 z-50 p-3 bg-cyan-soft hover:bg-teal-light text-ocean-deep rounded-full shadow-lg transition-all animate-bounce"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export default MonumentOverlay;
