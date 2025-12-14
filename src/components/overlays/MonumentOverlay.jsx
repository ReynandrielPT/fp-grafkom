import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
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
  // Resolve audio path via assets helper to ensure it loads under base path
  const activeAudio = landmark?.audioUri
    ? resolveAssetPath(landmark.audioUri)
    : null;
  const activeScale = landmark?.popupScale || 2;
  const activeObjectPosition = landmark?.objectPosition || [0, 0, 0];

  const [isVisible, setIsVisible] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [showStreetView, setShowStreetView] = useState(false);

  const overlayRef = useRef(null);
  const canvasRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Lock body scroll and ensure fullscreen when overlay is open
  useEffect(() => {
    if (open) {
      // Store original styles
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalWidth = document.body.style.width;
      const originalHeight = document.body.style.height;

      // Apply fullscreen styles
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
      document.documentElement.style.overflow = "hidden";

      return () => {
        // Restore original styles
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.width = originalWidth;
        document.body.style.height = originalHeight;
        document.documentElement.style.overflow = "";
      };
    }
  }, [open]);

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

  // GSAP animations when overlay appears
  useEffect(() => {
    if (open && overlayRef.current && canvasRef.current) {
      // Animate overlay fade in
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power2.out" }
      );

      // Animate 3D canvas zoom in
      gsap.fromTo(
        canvasRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.5)" }
      );

      // Animate close button
      if (closeButtonRef.current) {
        gsap.fromTo(
          closeButtonRef.current,
          { scale: 0, rotation: -180, opacity: 0 },
          {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 0.5,
            delay: 0.3,
            ease: "back.out(2)",
          }
        );
      }
    }
  }, [open]);

  if (!open && !isVisible) return null;

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[9999] w-full h-full overflow-hidden bg-gradient-to-br from-ocean-deep via-ocean-dark to-teal-primary/20 backdrop-blur-sm ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}
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
          ref={closeButtonRef}
          onClick={() => {
            // Ensure landmark audio fades out immediately on manual close
            try {
              audioManager.stopLandmarkAudio();
            } catch {}
            onClose();
          }}
          className="absolute top-6 right-6 z-50 p-3 bg-teal-primary hover:bg-red-600/80 text-cyan-soft rounded-full backdrop-blur-md border border-teal-light/20 transition-all transform hover:scale-110 group"
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
