import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber"; 
import { OrbitControls, Stage, Environment } from "@react-three/drei";
import MonasPreviewModel from "./MonasPreviewModel";

function PreviewCanvas({
  className = "w-full h-full",
  modelUri,
  modelScale = 2,
  annotations = [],
  environmentPreset = "park",
}) {
  const controlsRef = useRef();
  const [activeData, setActiveData] = useState({ id: null, position: null });

  // DETEKSI: Apakah ini Prambanan?
  const isPrambanan = modelUri && modelUri.toLowerCase().includes("prambanan");

  // STATE: Kontrol Auto-Center
  const [enableAdjust, setEnableAdjust] = useState(true);

  // Reset saat ganti model
  useEffect(() => {
    setActiveData({ id: null, position: null });
    
    // LOGIC: Auto-center nyala sebentar (0.8s) lalu mati khusus Prambanan
    // Agar posisi awal pas, tapi tidak nge-loop saat diklik.
    if (isPrambanan) {
      setEnableAdjust(true);
      const timer = setTimeout(() => {
        setEnableAdjust(false);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setEnableAdjust(true);
    }
  }, [modelUri, isPrambanan]);

  const handleAnnotationSelect = (id, worldPosition) => {
    if (activeData.id === id) {
      setActiveData({ id: null, position: null });
      return;
    }
    setActiveData({ id, position: worldPosition });
  };

  const handleCanvasClick = () => {
    if (activeData.id) {
      setActiveData({ id: null, position: null });
    }
  };

  return (
    <Canvas
      className={className}
      // OPTIMASI LAG:
      // 1. dpr (pixel ratio) set ke 1 agar enteng di HP/Laptop biasa
      dpr={1} 
      // 2. Shadows MATI jika Prambanan (karena ini penyebab utama lag)
      shadows={!isPrambanan} 
      
      // Posisi kamera awal (Override nanti oleh Stage)
      camera={{ fov: 45, position: [10, 5, 10] }} 
      onPointerMissed={handleCanvasClick}
      
      // Optimasi performa WebGL
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <Environment preset={environmentPreset} background blur={0.6} />

      <Suspense fallback={null}>
        <Stage 
          environment={null} 
          intensity={1} 
          contactShadow={false} 
          // Matikan shadow di stage juga untuk Prambanan
          shadows={!isPrambanan}
          
          // Logic Adjust Camera (Auto vs Manual)
          adjustCamera={enableAdjust ? 1.2 : false} 
        >
          <MonasPreviewModel
            modelUri={modelUri}
            modelScale={modelScale}
            modelPosition={[0, -2.5, 0]}
            annotations={annotations}
            activeId={activeData.id}
            onSelectAnnotation={handleAnnotationSelect}
          />
        </Stage>
      </Suspense>

      <OrbitControls
        ref={controlsRef}
        autoRotate={!activeData.id}
        autoRotateSpeed={0.5}
        makeDefault
        
        // FITUR SMOOTH ROTATION:
        enableDamping={true}
        dampingFactor={0.05} // Semakin kecil semakin "licin"
        
        // JARAK ZOOM:
        minDistance={3}
        maxDistance={100}
        
        // LIMIT ROTASI (Agar tidak bisa lihat bawah tanah):
        // Math.PI / 2 artinya 90 derajat (Mentok Lantai)
        maxPolarAngle={Math.PI / 2 - 0.05} // Dikurang dikit biar gak clipping lantai
        minPolarAngle={0} // Bisa lihat sampai tepat di atas kepala
        
        // Kecepatan kontrol
        rotateSpeed={0.6}
        zoomSpeed={0.8}
        panSpeed={0.8}
        enablePan={true}
      />
    </Canvas>
  );
}

export default PreviewCanvas;