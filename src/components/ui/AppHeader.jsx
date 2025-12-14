import { Link } from "react-router-dom";
import React from "react";

function AppHeader({ onGuideClick }) {
  return (
    <>
      <header className="pointer-events-none fixed top-6 left-6 z-50">
        <div className="flex items-center gap-3 bg-gradient-to-br from-ocean-deep/95 via-ocean-dark/90 to-teal-primary/20 backdrop-blur-xl border border-teal-light/20 rounded-2xl px-5 py-3 shadow-2xl">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-light to-cyan-soft rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-3xl">🗺️</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-light via-cyan-soft to-teal-light">
                Petanesia
              </span>
            </h1>
            <p className="text-[10px] text-cyan-soft/70 tracking-wide">
              Jelajahi Landmark Indonesia
            </p>
          </div>
        </div>
      </header>

      {/* Container for top-right buttons */}
      <div className="pointer-events-auto fixed top-6 right-6 z-50 flex items-center gap-2">
        <button
          className="bg-teal-primary/30 hover:bg-teal-primary/50 text-cyan-soft border border-teal-light/30 px-4 py-2 rounded-xl backdrop-blur-xl transition-all hover:scale-105 shadow-lg flex items-center gap-2"
          onClick={onGuideClick}
          aria-label="Tampilkan Panduan"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Panduan
        </button>
        <Link
          to="/quiz"
          className="bg-teal-primary/30 hover:bg-teal-primary/50 text-cyan-soft border border-teal-light/30 px-4 py-2 rounded-xl backdrop-blur-xl transition-all hover:scale-105 shadow-lg flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9.247a8.5 8.5 0 0110.155 1.458L21 13l-2.617 2.37A8.5 8.5 0 018.228 16.753m11.544-4.506a8.5 8.5 0 00-10.155-1.458L3 11l2.617-2.37A8.5 8.5 0 0019.772 7.247m-3.544 4.506l-4.5-4.5a1 1 0 00-1.414 0l-4.5 4.5a1 1 0 000 1.414l4.5 4.5a1 1 0 001.414 0l4.5-4.5a1 1 0 000-1.414z"
            />
          </svg>
          Mulai Kuis
        </Link>
      </div>
    </>
  );
}

export default AppHeader;
