import { useEffect, useState } from "react";
import audioManager from "../../utils/audioManager";

function VolumeControl() {
  const [volume, setVolume] = useState(70); // 0-100

  useEffect(() => {
    setVolume(Math.round((audioManager.backgroundVolume ?? 0.3) * 100));
  }, []);

  const onChange = (e) => {
    const v = Number(e.target.value);
    setVolume(v);
    const norm = Math.max(0, Math.min(1, v / 100));
    audioManager.setBackgroundVolume(norm);
    audioManager.setLandmarkVolume(norm);
  };

  return (
    <div className="fixed right-6 bottom-6 z-[10000] pointer-events-auto">
      <div className="flex items-center gap-4 px-6 py-4 rounded-2xl border border-teal-light/30 bg-gradient-to-br from-ocean-deep/90 via-ocean-dark/80 to-teal-primary/20 backdrop-blur-xl shadow-2xl">
        <span className="text-cyan-soft/90 text-base">Volume</span>
        <span className="text-cyan-soft/80 text-xl">🔊</span>
        <input
          aria-label="Volume"
          type="range"
          min={0}
          max={100}
          value={volume}
          onChange={onChange}
          className="w-56 h-3 accent-teal-light bg-ocean-dark/50 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-cyan-soft/80 text-sm w-10 text-right">
          {volume}%
        </span>
      </div>
    </div>
  );
}

export default VolumeControl;