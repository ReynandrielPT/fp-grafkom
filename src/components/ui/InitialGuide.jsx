import { useState, useEffect, useCallback } from "react";

function InitialGuide({ show, onClose } = {}) {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    localStorage.setItem("hasSeenGuide", "true");
    if (typeof onClose === "function") onClose();
  }, [onClose]);

  useEffect(() => {
    if (show === true) {
      setIsVisible(true);
      return;
    }
    if (show === false) {
      setIsVisible(false);
      return;
    }

    const hasSeenGuide = localStorage.getItem("hasSeenGuide");
    if (!hasSeenGuide) {
      setIsVisible(true);
    }
  }, [show]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    if (isVisible) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isVisible, handleClose]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-w-md w-full bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-xl shadow-2xl backdrop-blur-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close guide"
          onClick={handleClose}
          className="absolute right-3 top-3 text-white/80 hover:text-white bg-white/6 rounded-full w-8 h-8 flex items-center justify-center focus:outline-none"
        >
          ✕
        </button>

        <h2 className="text-white text-2xl font-semibold text-center mb-4">
          Welcome to Indonesian Map
        </h2>

        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center gap-4 bg-white/10 p-3 rounded-md">
            <div className="text-2xl">🖱️</div>
            <div className="text-white">
              <div className="font-semibold">Left Click + Drag</div>
              <div className="text-sm opacity-90">Rotate the map</div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-3 rounded-md">
            <div className="text-2xl">🖱️</div>
            <div className="text-white">
              <div className="font-semibold">Right Click + Drag</div>
              <div className="text-sm opacity-90">Pan / Move the map</div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-3 rounded-md">
            <div className="text-2xl">🔍</div>
            <div className="text-white">
              <div className="font-semibold">Scroll Wheel</div>
              <div className="text-sm opacity-90">Zoom in / out</div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-3 rounded-md">
            <div className="text-2xl">⌨️</div>
            <div className="text-white">
              <div className="font-semibold">W / A / S / D</div>
              <div className="text-sm opacity-90">Move the camera view</div>
            </div>
          </div>
        </div>

        <p className="text-center text-white/90">
          Tap or click anywhere to start exploring
        </p>
      </div>
    </div>
  );
}

export default InitialGuide;
