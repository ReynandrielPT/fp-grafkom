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
    const q = String(query ?? "")
      .trim()
      .toLowerCase();
    if (!q) return landmarks;
    return landmarks.filter((l) => {
      return (
        String(l.name ?? "")
          .toLowerCase()
          .includes(q) ||
        String(l.location ?? "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [landmarks, query]);

  if (!Array.isArray(landmarks)) return null;

  const showEmpty = filtered.length === 0;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-50 transition-all duration-300 ease-in-out ${
        isOpen ? "w-[28rem]" : "w-16"
      } ${
        isOpen
          ? "pointer-events-auto bg-gradient-to-br from-ocean-deep/98 via-ocean-dark/95 to-teal-primary/30 backdrop-blur-xl ui-contrast-surface ui-readable"
          : "pointer-events-none bg-transparent"
      }`}
    >
      {/* Tab button - always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`absolute ${
          isOpen ? "right-3" : "right-1"
        } top-6 z-10 p-3 rounded-2xl bg-teal-primary/45 hover:bg-teal-primary/65 transition-all duration-300 hover:scale-110 pointer-events-auto ui-contrast-surface ui-readable`}
        title={isOpen ? "Tutup Menu" : "Buka Menu"}
      >
        <svg
          className={`w-6 h-6 text-cyan-soft transition-transform duration-300 ${
            isOpen ? "rotate-0" : "rotate-180"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {!isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4"
            />
          )}
        </svg>
      </button>

      {/* Content - only visible when open */}
      <div
        className={`h-full flex flex-col transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Sticky Header with Petanesia Title */}
        <div className="sticky top-0 z-10 p-8 pb-6 space-y-5 pt-28 ui-readable bg-gradient-to-b from-ocean-deep/80 to-transparent">
          {/* Petanesia Title - Larger and more prominent */}
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-light to-cyan-soft rounded-2xl flex items-center justify-center flex-shrink-0 ui-contrast-surface">
              <span className="text-4xl">🗺️</span>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold leading-tight ui-readable">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-light via-cyan-soft to-teal-light">
                  Petanesia
                </span>
              </h1>
              <p className="text-base text-cyan-soft/90 tracking-wider font-semibold ui-readable">
                Indonesia 3D
              </p>
            </div>
          </div>

          {/* Landmark List Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0 ui-readable">
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-soft">
                Jelajahi
              </p>
              <h2 className="text-lg font-bold text-cyan-soft truncate ui-readable">
                Daftar Landmark
              </h2>
            </div>
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-teal-primary/45 text-cyan-soft whitespace-nowrap ui-contrast-surface ui-readable">
              {filtered.length}/{landmarks.length}
            </span>
          </div>
        </div>

        {/* Search box */}
        <div className="px-6 py-5 ui-readable">
          <label className="block text-xs font-semibold tracking-wide text-cyan-soft ui-readable">
            Cari
            <div className="mt-1 relative">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-cyan-soft/50"
              >
                <path
                  d="M10.5 3.5a7 7 0 0 1 5.53 11.2l3 3a1 1 0 0 1-1.42 1.42l-3-3A7 7 0 1 1 10.5 3.5zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"
                  fill="currentColor"
                />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-2xl bg-ocean-dark/50 px-11 py-3 text-lg text-silver-mist placeholder-cyan-soft/80 focus:outline-none focus:ring-2 focus:ring-teal-light/50 transition-all ui-contrast-surface"
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
            <ul className="space-y-4 ui-readable">
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
                      className={`w-full rounded-2xl px-4 py-4 text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-light/50 ui-contrast-surface ${
                        isActive
                          ? "bg-gradient-to-r from-teal-primary/40 to-cyan-soft/20"
                          : "bg-ocean-dark/30 hover:bg-ocean-dark/50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg font-semibold transition-all duration-300 ${
                            isActive
                              ? "bg-gradient-to-br from-cyan-soft to-teal-light text-ocean-deep ui-contrast-surface"
                              : "bg-teal-primary/40 text-cyan-soft ui-contrast-surface"
                          }`}
                        >
                          {l.displayIndex ?? i + 1}
                        </div>
                        <div className="flex-1 min-w-0 ui-readable">
                          <div className="font-semibold leading-tight text-silver-mist text-lg truncate ui-readable">
                            {l.name}
                          </div>
                          {l.location && (
                            <div className="text-base text-cyan-soft truncate ui-readable">
                              {l.location}
                            </div>
                          )}
                          {l.island && (
                            <span className="mt-1 inline-flex items-center text-xs uppercase tracking-wide text-teal-light/90 ui-readable">
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
