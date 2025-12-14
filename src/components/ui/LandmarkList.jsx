import { useMemo, useState } from "react";

export default function LandmarkList({
  landmarks,
  onSelect,
  onHoverChange,
  activeLandmarkId,
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(true);

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
    <aside className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300 ease-in-out ${
      isOpen ? 'w-80' : 'w-0'
    } ${
      isOpen 
        ? 'pointer-events-auto bg-gradient-to-br from-[#1a3a52] via-[#1e4a5f] to-[#2a5a6f] border-r border-teal-light/30 shadow-2xl' 
        : 'pointer-events-none bg-transparent'
    }`}>
      
      {/* Tab button - always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed ${isOpen ? 'left-[17rem]' : 'left-4'} top-4 z-[60] p-2 rounded-lg bg-teal-primary/30 hover:bg-teal-primary/50 border border-teal-light/30 transition-all duration-300 hover:scale-110 pointer-events-auto`}
        title={isOpen ? 'Tutup Menu' : 'Buka Menu'}
      >
        <svg
          className={`w-4 h-4 text-cyan-soft transition-transform duration-300 ${
            isOpen ? 'rotate-0' : 'rotate-180'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {!isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          )}
        </svg>
      </button>

      {/* Content - only visible when open */}
      <div className={`h-full flex flex-col transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        
        {/* Header with Petanesia Title */}
        <div className="p-6 pb-4 border-b border-teal-light/10 space-y-4 pt-10">
          {/* Petanesia Title - Larger and more prominent */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-light to-cyan-soft rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-2xl">🗺️</span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-light via-cyan-soft to-teal-light">
                  Petanesia
                </span>
              </h1>
              <p className="text-xs text-cyan-soft/70 tracking-wider font-medium">Indonesia 3D</p>
            </div>
          </div>
          
          {/* Landmark List Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.15em] text-cyan-soft">
                Jelajahi
              </p>
              <h2 className="text-sm font-semibold text-cyan-soft truncate">Daftar Landmark</h2>
            </div>
            <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-teal-primary/30 text-cyan-soft border border-teal-light/20 whitespace-nowrap">
              {filtered.length}/{landmarks.length}
            </span>
          </div>
        </div>

        {/* Search box */}
        <div className="px-4 py-3">
          <label className="block text-[10px] font-semibold tracking-wide text-cyan-soft">
            Cari
            <div className="mt-1 relative">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-cyan-soft/50"
              >
                <path
                  d="M10.5 3.5a7 7 0 0 1 5.53 11.2l3 3a1 1 0 0 1-1.42 1.42l-3-3A7 7 0 1 1 10.5 3.5zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"
                  fill="currentColor"
                />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-teal-light/20 bg-ocean-dark/50 px-8 py-1.5 text-sm text-silver-mist placeholder-cyan-soft/40 focus:outline-none focus:ring-2 focus:ring-teal-light/50 focus:border-teal-light/50 transition-all"
                placeholder="Cari landmark..."
                aria-label="Cari landmark berdasarkan nama atau kota"
              />
            </div>
          </label>
        </div>

        {/* Landmark list */}
        <div className="flex-1 overflow-auto px-4 pb-4 scrollbar-thin scrollbar-thumb-teal-primary/30 scrollbar-track-transparent">
          {showEmpty ? (
            <p className="py-8 text-center text-cyan-soft/60">
              Tidak ditemukan landmark
            </p>
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
                    className={`w-full rounded-xl border px-2.5 py-2 text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-light/50 ${
                      isActive
                        ? "border-teal-light/60 bg-gradient-to-r from-teal-primary/40 to-cyan-soft/20 shadow-lg shadow-teal-primary/20"
                        : "border-teal-light/10 bg-ocean-dark/30 hover:border-teal-light/40 hover:bg-ocean-dark/50 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                          isActive ? "bg-gradient-to-br from-cyan-soft to-teal-light text-ocean-deep shadow-lg" : "bg-teal-primary/30 text-cyan-soft"
                        }`}
                      >
                        {l.displayIndex ?? i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold leading-tight text-silver-mist text-sm truncate">
                          {l.name}
                        </div>
                        {l.location && (
                          <div className="text-[11px] text-cyan-soft truncate">
                            {l.location}
                          </div>
                        )}
                        {l.island && (
                          <span className="mt-0.5 inline-flex items-center text-[10px] uppercase tracking-wide text-teal-light/70">
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
