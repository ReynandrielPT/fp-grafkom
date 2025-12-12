function AppHeader() {
  return (
    <header className="pointer-events-auto fixed top-6 left-6 z-50">
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
  );
}

export default AppHeader;
