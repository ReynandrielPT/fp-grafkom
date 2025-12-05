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
      return;
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-w-md w-full bg-slate-900/90 border border-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-md relative mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close guide"
          onClick={handleClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full w-8 h-8 flex items-center justify-center transition-all focus:outline-none"
        >
          ✕
        </button>

        <h2 className="text-white text-2xl font-bold text-center mb-2 tracking-tight">
          Welcome to Indonesian Map
        </h2>
        
        <p className="text-slate-400 text-center text-sm mb-8">
            Navigasi peta 3D dengan mudah
        </p>

        <div className="flex flex-col gap-3 mb-8">
          <div className="flex items-center gap-4 bg-black/20 border border-white/5 p-4 rounded-xl hover:bg-black/40 transition-colors group">
            <div className="text-2xl bg-white/5 p-2 rounded-lg group-hover:scale-110 transition-transform">🖱️</div>
            <div className="text-slate-200">
              <div className="font-semibold text-white">Left Click + Drag</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-0.5">Rotate Camera</div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-black/20 border border-white/5 p-4 rounded-xl hover:bg-black/40 transition-colors group">
            <div className="text-2xl bg-white/5 p-2 rounded-lg group-hover:scale-110 transition-transform">🖱️</div>
            <div className="text-slate-200">
              <div className="font-semibold text-white">Right Click + Drag</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-0.5">Pan / Move Map</div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-black/20 border border-white/5 p-4 rounded-xl hover:bg-black/40 transition-colors group">
            <div className="text-2xl bg-white/5 p-2 rounded-lg group-hover:scale-110 transition-transform">🔍</div>
            <div className="text-slate-200">
              <div className="font-semibold text-white">Scroll Wheel</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-0.5">Zoom In / Out</div>
            </div>
          </div>

           <div className="flex items-center gap-4 bg-black/20 border border-white/5 p-4 rounded-xl hover:bg-black/40 transition-colors group">
            <div className="text-2xl bg-white/5 p-2 rounded-lg group-hover:scale-110 transition-transform">⌨️</div>
            <div className="text-slate-200">
              <div className="font-semibold text-white">W / A / S / D</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-medium mt-0.5">Move Camera</div>
            </div>
          </div>
        </div>

        <div className="text-center">
            <p className="text-slate-500 text-sm animate-pulse">
            Tap or click anywhere to explore
            </p>
        </div>
      </div>
    </div>
  );
}

export default InitialGuide;