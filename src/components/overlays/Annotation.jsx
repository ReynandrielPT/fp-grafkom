// FILE: Annotation.jsx
import { useRef } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";

function Annotation({ id, position, title, description, number, isOpen, onSelect, occlude = true }) {
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
        occlude={occlude}
        zIndexRange={[100, 0]}
      >
        <div className="relative flex items-center justify-center font-sans pointer-events-auto group">
          
          {/* Titik Penanda */}
          <div className="w-1.5 h-1.5 bg-cyan-soft rounded-full shadow-[0_0_8px_rgba(125,211,221,0.8)] animate-pulse absolute" />

          {/* Tombol Nomor */}
          <button
            onClick={handleClick}
            className={`relative mb-4 flex h-5 w-5 items-center justify-center rounded-full border-[1.5px] font-bold transition-all duration-500 shadow-md text-[10px] ${
              isOpen
                ? "bg-cyan-soft text-ocean-deep border-cyan-soft scale-110 z-50"
                : "bg-ocean-dark/80 text-cyan-soft border-teal-light/50 hover:bg-teal-primary hover:scale-110"
            }`}
          >
            {number}
          </button>

          {/* Garis Penunjuk */}
          <div
            className={`absolute top-2.5 h-3 w-[1px] bg-teal-light/50 -translate-y-full pointer-events-none transition-opacity duration-300 ${
              isOpen ? "opacity-100" : "opacity-50"
            }`}
          />

          {/* Kartu Pop-up */}
          <div
            className={`absolute left-8 bottom-full w-56 rounded-lg bg-gradient-to-br from-ocean-deep/95 to-ocean-dark/90 p-3 text-left text-silver-mist shadow-xl border border-teal-light/30 backdrop-blur-md z-50 origin-bottom-left transition-all duration-500 ease-out transform ${
              isOpen
                ? "opacity-100 scale-100 translate-x-0 translate-y-0"
                : "opacity-0 scale-90 -translate-x-4 translate-y-4 pointer-events-none"
            }`}
          >
            <h3 className="mb-1.5 font-bold text-sm text-cyan-soft border-b border-teal-light/20 pb-1.5">
              {title}
            </h3>
            <p className="text-[10px] text-silver-mist/90 leading-relaxed">
              {description}
            </p>
            <button
              className="mt-2 text-[9px] text-teal-light/70 hover:text-cyan-soft underline"
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