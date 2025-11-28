import React, { useMemo, useState } from "react";

export default function LandmarkList({ landmarks, onSelect }) {
  const [query, setQuery] = useState("");
  if (!Array.isArray(landmarks)) return null;

  const filtered = useMemo(() => {
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

  return (
    <aside className="fixed left-4 top-24 z-50 w-72 max-h-[72vh] overflow-hidden bg-white/6 backdrop-blur border border-white/10 rounded-md p-3 text-sm text-white shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-lg">Landmarks</h2>
        <div className="text-[12px] text-white/80">
          {filtered.length}/{landmarks.length}
        </div>
      </div>

      <div className="mb-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-white/8 placeholder-white/60 text-white px-3 py-2 rounded-md border border-white/6 focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="Search landmarks..."
          aria-label="Search landmarks"
        />
      </div>

      <div className="overflow-auto max-h-[56vh] pr-2">
        <ul className="space-y-2">
          {filtered.map((l, i) => (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => onSelect?.(l, null)}
                className="w-full text-left flex items-start gap-3 px-2 py-2 rounded-md hover:bg-white/8 focus:bg-white/10 focus:outline-none transition"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center font-medium flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium leading-tight">{l.name}</div>
                  {l.location && (
                    <div className="text-[11px] text-white/70">
                      {l.location}
                    </div>
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
