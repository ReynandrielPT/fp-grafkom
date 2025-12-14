import { useState, useEffect, useCallback, useRef } from "react";
import gsap from 'gsap';

function InitialGuide({ show, onClose, onInteraction } = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  const handleClose = useCallback(() => {
    if (overlayRef.current && modalRef.current) {
      // Animate out before closing
      gsap.to(modalRef.current, {
        scale: 0.7,
        opacity: 0,
        y: 50,
        duration: 0.3,
        ease: 'power2.in'
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setIsVisible(false);
          localStorage.setItem("hasSeenGuide", "true");
          if (typeof onInteraction === "function") onInteraction();
          if (typeof onClose === "function") onClose();
        }
      });
    } else {
      setIsVisible(false);
      localStorage.setItem("hasSeenGuide", "true");
      if (typeof onInteraction === "function") onInteraction();
      if (typeof onClose === "function") onClose();
    }
  }, [onClose, onInteraction]);

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
    if (isVisible && overlayRef.current && modalRef.current) {
      // Animate overlay fade in
      gsap.fromTo(overlayRef.current, 
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      
      // Animate modal scale and fade in
      gsap.fromTo(modalRef.current,
        { scale: 0.7, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
      );
    }
  }, [isVisible]);

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
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ocean-deep/80 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="max-w-md w-full bg-gradient-to-br from-ocean-deep/95 via-ocean-dark/90 to-teal-primary/20 border border-teal-light/20 p-8 rounded-2xl shadow-2xl backdrop-blur-md relative mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          aria-label="Close guide"
          onClick={handleClose}
          className="absolute right-4 top-4 text-cyan-soft/70 hover:text-cyan-soft bg-teal-primary/20 hover:bg-teal-primary/40 rounded-full w-8 h-8 flex items-center justify-center transition-all focus:outline-none"
        >
          ✕
        </button>

        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg">
              <img src="/petanesia.png" alt="Petanesia" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-silver-mist text-3xl font-bold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-light via-cyan-soft to-teal-light">Petanesia</span>
            </h2>
          </div>
          <p className="text-cyan-soft/70 text-center text-sm">
            Jelajahi landmark Indonesia dalam 3D
          </p>
        </div>

        <div className="flex flex-col gap-3 mb-8">
          <div className="flex items-center gap-4 bg-ocean-dark/40 border border-teal-light/20 p-4 rounded-xl hover:bg-ocean-dark/60 transition-colors group">
            <div className="text-2xl bg-teal-primary/20 p-2 rounded-lg group-hover:scale-110 transition-transform">🖱️</div>
            <div className="text-silver-mist">
              <div className="font-semibold text-cyan-soft">Klik Kiri + Geser</div>
              <div className="text-xs text-teal-light/70 uppercase tracking-wider font-medium mt-0.5">Putar Kamera</div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-ocean-dark/40 border border-teal-light/20 p-4 rounded-xl hover:bg-ocean-dark/60 transition-colors group">
            <div className="text-2xl bg-teal-primary/20 p-2 rounded-lg group-hover:scale-110 transition-transform">🖱️</div>
            <div className="text-silver-mist">
              <div className="font-semibold text-cyan-soft">Klik Kanan + Geser</div>
              <div className="text-xs text-teal-light/70 uppercase tracking-wider font-medium mt-0.5">Geser Peta</div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-ocean-dark/40 border border-teal-light/20 p-4 rounded-xl hover:bg-ocean-dark/60 transition-colors group">
            <div className="text-2xl bg-teal-primary/20 p-2 rounded-lg group-hover:scale-110 transition-transform">🔍</div>
            <div className="text-silver-mist">
              <div className="font-semibold text-cyan-soft">Scroll Mouse</div>
              <div className="text-xs text-teal-light/70 uppercase tracking-wider font-medium mt-0.5">Perbesar / Perkecil</div>
            </div>
          </div>

           <div className="flex items-center gap-4 bg-ocean-dark/40 border border-teal-light/20 p-4 rounded-xl hover:bg-ocean-dark/60 transition-colors group">
            <div className="text-2xl bg-teal-primary/20 p-2 rounded-lg group-hover:scale-110 transition-transform">⌨️</div>
            <div className="text-silver-mist">
              <div className="font-semibold text-cyan-soft">W / A / S / D</div>
              <div className="text-xs text-teal-light/70 uppercase tracking-wider font-medium mt-0.5">Gerakkan Kamera</div>
            </div>
          </div>
        </div>

        <div className="text-center">
            <p className="text-cyan-soft/60 text-sm animate-pulse">
            Ketuk atau klik di mana saja untuk menjelajah
            </p>
        </div>
      </div>
    </div>
  );
}

export default InitialGuide;