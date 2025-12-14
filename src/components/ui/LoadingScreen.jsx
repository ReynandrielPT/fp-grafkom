import { useEffect, useState } from "react";

function LoadingScreen({ progress, isComplete }) {
  const [displayProgress, setDisplayProgress] = useState(0);

  useEffect(() => {
    // Smooth progress animation
    const timer = setTimeout(() => {
      if (displayProgress < progress) {
        setDisplayProgress(Math.min(displayProgress + 1, progress));
      }
    }, 20);
    return () => clearTimeout(timer);
  }, [progress, displayProgress]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-ocean-deep via-ocean-dark to-teal-primary/20 transition-opacity duration-1000 ${
        isComplete ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="text-center space-y-8 px-4">
        {/* Logo/Title */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
              <img src="/petanesia.png" alt="Petanesia" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-light via-cyan-soft to-teal-light animate-pulse">
                Petanesia
              </span>
            </h1>
          </div>
          <p className="text-lg text-cyan-soft/80">
            Jelajahi Landmark Indonesia dalam 3D
          </p>
        </div>

        {/* Loading Bar */}
        <div className="w-80 max-w-full mx-auto space-y-3">
          <div className="h-2 bg-ocean-dark/50 rounded-full overflow-hidden backdrop-blur border border-teal-light/20">
            <div
              className="h-full bg-gradient-to-r from-teal-primary via-cyan-soft to-teal-light transition-all duration-300 ease-out"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
          <p className="text-cyan-soft/70 text-sm">
            Memuat model 3D... {Math.round(displayProgress)}%
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-teal-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-cyan-soft rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-teal-light rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
