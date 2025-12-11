// FILE: Annotation.jsx
import { useRef } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";

function Annotation({ id, position, title, description, number, isOpen, onSelect }) {
  const groupRef = useRef();

  const handleClick = (e) => {
    e.stopPropagation();
    if (groupRef.current && onSelect) {
      const worldPos = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPos);
      onSelect(id, worldPos);
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    if (onSelect) onSelect(id, null); 
  };

  return (
    <group ref={groupRef} position={position}>
      <Html
        position={[0, 0, 0]}
        center
        // HAPUS: distanceFactor={10}  <-- INI PENYEBABNYA
        occlude
        zIndexRange={[100, 0]}
      >
        <div className="relative flex items-center justify-center font-sans pointer-events-auto group">
          
          {/* Titik Penanda */}
          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full shadow-[0_0_8px_rgba(255,165,0,0.8)] animate-pulse absolute" />

          {/* Tombol Nomor */}
          <button
            onClick={handleClick}
            className={`relative mb-4 flex h-5 w-5 items-center justify-center rounded-full border-[1.5px] font-bold transition-all duration-500 shadow-md text-[10px] ${
              isOpen
                ? "bg-white text-slate-900 border-white scale-110 z-50"
                : "bg-slate-900/80 text-white border-white/50 hover:bg-slate-800 hover:scale-110"
            }`}
          >
            {number}
          </button>

          {/* Garis Penunjuk */}
          <div
            className={`absolute top-2.5 h-3 w-[1px] bg-white/50 -translate-y-full pointer-events-none transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-50"
            }`}
          />

          {/* Kartu Pop-up */}
          <div
            className={`absolute left-8 bottom-full w-56 rounded-lg bg-black/80 p-3 text-left text-white shadow-xl border border-white/10 backdrop-blur-md z-50 origin-bottom-left transition-all duration-500 ease-out transform ${
              isOpen
                ? "opacity-100 scale-100 translate-x-0 translate-y-0"
                : "opacity-0 scale-90 -translate-x-4 translate-y-4 pointer-events-none"
            }`}
          >
            <h3 className="mb-1.5 font-bold text-sm text-yellow-400 border-b border-white/10 pb-1.5">
              {title}
            </h3>
            <p className="text-[10px] text-gray-300 leading-relaxed">
              {description}
            </p>
            <button
              className="mt-2 text-[9px] text-gray-400 hover:text-white underline"
              onClick={handleClose}
            >
              Tutup
            </button>
          </div>
        </div>
      </Html>
    </group>
  );
}

export default Annotation;