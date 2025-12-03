import { useMemo, useState } from "react";

export default function LandmarkList({
  landmarks,
  onSelect,
  onHoverChange,
  activeLandmarkId,
}) {
  const [query, setQuery] = useState("");

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
    <aside className="pointer-events-auto fixed right-6 top-24 z-50 w-[360px] max-h-[78vh] bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl p-5 text-sm text-white shadow-2xl">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">
            Explore
          </p>
          <h2 className="text-2xl font-semibold">Landmark Library</h2>
        </div>
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white/80">
          {filtered.length}/{landmarks.length}
        </span>
      </div>

      <label className="block text-[11px] font-semibold tracking-wide text-white/60">
        Search by name or city
        <div className="mt-1 relative">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
          >
            <path
              d="M10.5 3.5a7 7 0 0 1 5.53 11.2l3 3a1 1 0 0 1-1.42 1.42l-3-3A7 7 0 1 1 10.5 3.5zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"
              fill="currentColor"
            />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/10 px-9 py-2 text-base text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder="Type a landmark or region"
            aria-label="Search landmarks by name or city"
          />
        </div>
      </label>

      <div className="mt-4 overflow-auto max-h-[56vh] pr-1">
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
                    className={`w-full rounded-xl border px-3 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-white/40 ${
                      isActive
                        ? "border-white/40 bg-white/15 shadow-lg"
                        : "border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-base font-semibold ${
                          isActive ? "bg-white text-slate-900" : "bg-white/15"
                        }`}
                      >
                        {l.displayIndex ?? i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold leading-tight">
                          {l.name}
                        </div>
                        {l.location && (
                          <div className="text-[12px] text-white/70">
                            {l.location}
                          </div>
                        )}
                        {l.island && (
                          <span className="mt-1 inline-flex items-center text-[11px] uppercase tracking-wide text-white/50">
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
    </aside>
  );
}
