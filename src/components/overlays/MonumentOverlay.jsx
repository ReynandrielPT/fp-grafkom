import { useEffect, useState } from "react";
import { resolveAssetPath } from "../../utils/assets";
import PreviewCanvas from "./PreviewCanvas";

function MonumentOverlay({
  open,
  onClose,
  landmark = null,
  modelUri = resolveAssetPath("model/monas.glb"),
  title = "Monumen Nasional",
  description = null,
}) {
  // 1. Ambil data dari props landmark
  const activeUri = landmark?.modelUri ?? modelUri;
  const activeTitle = landmark?.name ?? title;
  const activeDesc = landmark?.description ?? description;
  const activeAnnotations = landmark?.annotations || [];
  const activeStreetView = landmark?.streetViewUrl;
  const activePreset = landmark?.environmentPreset || "park";

  // 2. LOGIC PENTING: Ambil scale dari landmark. 
  // Jika tidak ada (null), pakai default 2 (biar tidak kekecilan).
  const activeScale = landmark?.popupScale || 2; 

  const [isVisible, setIsVisible] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
    } else {
      setTimeout(() => {
        setIsVisible(false);
      }, 500);
    }
  }, [open]);

  if (!open && !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] w-screen h-screen bg-black transition-opacity duration-500 ease-in-out ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      
      {/* 3D CANVAS */}
      <div className="absolute inset-0 w-full h-full">
         <PreviewCanvas 
            modelUri={activeUri} 
            // 3. KIRIM SCALE KE SINI AGAR BISA DIPERBESAR
            modelScale={activeScale} 
            annotations={activeAnnotations}
            environmentPreset={activePreset} 
         />
         {/* Gradient */}
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />
      </div>

      {/* TOMBOL CLOSE */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-3 bg-black/30 hover:bg-red-600/80 text-white rounded-full backdrop-blur-md border border-white/10 transition-all transform hover:scale-110 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* INFO PANEL */}
      <div 
          className={`absolute bottom-6 left-6 z-40 max-w-sm w-full transition-all duration-500 transform ${
              showInfo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
          }`}
      >
          <div className="bg-black/60 backdrop-blur-md border-l-4 border-yellow-500 p-4 rounded-r-xl shadow-2xl text-white">
              <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-white tracking-tight drop-shadow-md">
                      {activeTitle}
                  </h2>
                  {landmark?.island && (
                    <span className="text-[10px] font-bold text-black bg-yellow-400 px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                      {landmark.island}
                    </span>
                  )}
              </div>
              
              <div className="max-h-[80px] overflow-y-auto pr-2 custom-scrollbar mb-3">
                  <p className="text-gray-200 text-xs leading-relaxed font-light">
                      {activeDesc || "Deskripsi tidak tersedia."}
                  </p>
              </div>

              <div className="flex gap-2">
                  {activeStreetView && (
                  <a 
                      href={activeStreetView}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded shadow-md transition-all hover:-translate-y-0.5"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Street View
                  </a>
                  )}
                  <button 
                      onClick={() => setShowInfo(false)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold rounded backdrop-blur transition-all border border-white/10"
                  >
                      Sembunyikan
                  </button>
              </div>
          </div>
      </div>

      {/* TOMBOL BUKA KEMBALI */}
      {!showInfo && (
          <button 
              onClick={() => setShowInfo(true)}
              className="absolute bottom-6 left-6 z-50 p-3 bg-yellow-500 hover:bg-yellow-400 text-black rounded-full shadow-lg transition-all animate-bounce"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
          </button>
      )}
    </div>
  );
}

export default MonumentOverlay;