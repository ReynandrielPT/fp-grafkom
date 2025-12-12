import { useMemo, useState } from "react";

export default function LandmarkList({
  landmarks,
  onSelect,
  onHoverChange,
  activeLandmarkId,
}) {
  const [query, setQuery] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);

  const filtered = useMemo(() => {
    if (!Array.isArray(landmarks)) return [];
    const q = String(query ?? "").trim().toLowerCase();
    if (!q) return landmarks;
    return landmarks.filter((l) => {
      return (
        String(l.name ?? "").toLowerCase().includes(q) ||
        String(l.location ?? "").toLowerCase().includes(q)
      );
    });
  }, [landmarks, query]);

  if (!Array.isArray(landmarks)) return null;

  const showEmpty = filtered.length === 0;

  return (
    <aside className={`pointer-events-auto fixed left-6 top-28 z-50 transition-all duration-500 ease-in-out ${
      isMinimized ? 'w-14' : 'w-[360px]'
    } ${isMinimized ? 'max-h-14' : 'max-h-[78vh]'} bg-gradient-to-br from-ocean-deep/95 via-ocean-dark/90 to-teal-primary/20 backdrop-blur-xl border border-teal-light/20 rounded-2xl shadow-2xl overflow-hidden`}>
      <div className={`transition-all duration-500 ${
        isMinimized ? 'p-3' : 'p-5'
      } text-sm text-silver-mist`}>
      
      {/* Minimize/Maximize Button */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-teal-primary/20 hover:bg-teal-primary/40 border border-teal-light/30 transition-all duration-300 hover:scale-110"
        title={isMinimized ? 'Perbesar' : 'Perkecil'}
      >
        <svg
          className={`w-4 h-4 text-cyan-soft transition-transform duration-500 ${
            isMinimized ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {isMinimized ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          )}
        </svg>
      </button>

      <div className={`flex items-center justify-between gap-3 mb-4 mt-5 transition-opacity duration-300 ${
        isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-soft/70">
            Jelajahi
          </p>
          <h2 className="text-2xl font-semibold text-silver-mist">Daftar Landmark</h2>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-teal-primary/30 text-cyan-soft border border-teal-light/20">
          {filtered.length}/{landmarks.length}
        </span>
      </div>

      <label className={`block text-[11px] font-semibold tracking-wide text-cyan-soft/80 transition-opacity duration-300 ${
        isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        Cari berdasarkan nama atau kota
        <div className="mt-1 relative">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-soft/50"
          >
            <path
              d="M10.5 3.5a7 7 0 0 1 5.53 11.2l3 3a1 1 0 0 1-1.42 1.42l-3-3A7 7 0 1 1 10.5 3.5zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"
              fill="currentColor"
            />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-teal-light/20 bg-ocean-dark/50 px-9 py-2 text-base text-silver-mist placeholder-cyan-soft/40 focus:outline-none focus:ring-2 focus:ring-teal-light/50 focus:border-teal-light/50 transition-all"
            placeholder="Ketik nama landmark atau daerah"
            aria-label="Cari landmark berdasarkan nama atau kota"
          />
        </div>
      </label>

      <div className={`mt-4 overflow-auto max-h-[56vh] pr-1 scrollbar-thin transition-opacity duration-300 ${
        isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        {showEmpty ? (
          <div className="rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-6 text-center text-white/70">
            No landmarks match “{query}”. Try another keyword or clear the
            search.
          </div>
        ) : (
          <ul className="space-y-2">
            {filtered.map((l, i) => {
              const isActive = activeLandmarkId && l.id === activeLandmarkId;
              return (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => onSelect?.(l, null)}
                    onMouseEnter={() => onHoverChange?.(l)}
                    onMouseLeave={() => onHoverChange?.(null)}
                    onFocus={() => onHoverChange?.(l)}
                    onBlur={() => onHoverChange?.(null)}
                    className={`w-full rounded-xl border px-3 py-3 text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-light/50 ${
                      isActive
                        ? "border-teal-light/60 bg-gradient-to-r from-teal-primary/40 to-cyan-soft/20 shadow-lg shadow-teal-primary/20"
                        : "border-teal-light/10 bg-ocean-dark/30 hover:border-teal-light/40 hover:bg-ocean-dark/50 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-base font-semibold transition-all duration-300 ${
                          isActive ? "bg-gradient-to-br from-cyan-soft to-teal-light text-ocean-deep shadow-lg" : "bg-teal-primary/30 text-cyan-soft"
                        }`}
                      >
                        {l.displayIndex ?? i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold leading-tight text-silver-mist">
                          {l.name}
                        </div>
                        {l.location && (
                          <div className="text-[12px] text-cyan-soft/80">
                            {l.location}
                          </div>
                        )}
                        {l.island && (
                          <span className="mt-1 inline-flex items-center text-[11px] uppercase tracking-wide text-teal-light/70">
                            {l.island}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      </div>
    </aside>
  );
}
