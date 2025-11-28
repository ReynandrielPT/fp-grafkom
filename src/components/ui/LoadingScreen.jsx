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
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-opacity duration-1000 ${
        isComplete ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="text-center space-y-8 px-4">
        {/* Logo/Title */}
        <div className="space-y-2">
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-2xl">
            Indonesia 3D Map
          </h1>
          <p className="text-lg text-white/70">
            Explore Indonesian landmarks in 3D
          </p>
        </div>

        {/* Loading Bar */}
        <div className="w-80 max-w-full mx-auto space-y-3">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
          <p className="text-white/60 text-sm">
            Loading 3D models... {displayProgress}%
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
