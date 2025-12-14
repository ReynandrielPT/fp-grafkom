function InfoPanel({ 
  title, 
  description, 
  island, 
  isVisible, 
  hasStreetView, 
  onOpenStreetView, 
  onHide 
}) {
  return (
    <div 
      className={`absolute bottom-6 left-6 z-40 max-w-md w-full transition-all duration-500 transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      }`}
    >
      <div className="bg-gradient-to-br from-ocean-deep/90 to-ocean-dark/80 backdrop-blur-md border-l-4 border-cyan-soft p-6 rounded-r-xl shadow-2xl text-silver-mist">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-cyan-soft tracking-tight drop-shadow-md">
            {title}
          </h2>
          {island && (
            <span className="text-[10px] font-bold text-ocean-deep bg-cyan-soft px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              {island}
            </span>
          )}
        </div>
        
        <div className="max-h-[120px] overflow-y-auto pr-2 custom-scrollbar mb-3">
          <p className="text-silver-mist/90 text-xs leading-relaxed font-light">
            {description || "Deskripsi tidak tersedia."}
          </p>
        </div>

        <div className="flex gap-2">
          {hasStreetView && (
            <button 
              onClick={onOpenStreetView}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-primary hover:bg-teal-light text-ocean-deep text-[10px] font-bold rounded shadow-md transition-all hover:-translate-y-0.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Tampilan Jalan
            </button>
          )}
          <button 
            onClick={onHide}
            className="px-3 py-1.5 bg-teal-primary/20 hover:bg-teal-primary/40 text-cyan-soft text-[10px] font-bold rounded backdrop-blur transition-all border border-teal-light/30"
          >
            Sembunyikan
          </button>
        </div>
      </div>
    </div>
  );
}

export default InfoPanel;
