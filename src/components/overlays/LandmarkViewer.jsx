import { Suspense, useRef, useState, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber"; 
import { OrbitControls, Stage, Environment, useGLTF } from "@react-three/drei";
import Annotation from "./Annotation";

// Component untuk render model 3D dengan anotasi
function LandmarkModel({
  modelUri,
  modelScale = 1, 
  modelPosition = [0, 0, 0],
  annotations = [], 
  activeId, 
  onSelectAnnotation, 
}) {
  const { scene } = useGLTF(modelUri);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  return (
    <group scale={modelScale} position={modelPosition}>
      <primitive object={clonedScene} />
      
      {annotations.map((anno, index) => {
        const currentId = anno.id || index;
        return (
          <Annotation
            key={currentId}
            id={currentId}
            number={index + 1}
            position={anno.position}
            title={anno.title}
            description={anno.description}
            isOpen={activeId === currentId} 
            onSelect={onSelectAnnotation}
            occlude={anno.occlude}
          />
        );
      })}
    </group>
  );
}

// Component utama untuk preview landmark
function LandmarkViewer({
  className = "w-full h-full",
  modelUri,
  modelScale = 2,
  annotations = [],
  environmentPreset = "park",
}) {
  const controlsRef = useRef();
  const [activeData, setActiveData] = useState({ id: null, position: null });

  // Deteksi apakah model Prambanan (untuk optimasi performa)
  const isPrambanan = modelUri && modelUri.toLowerCase().includes("prambanan");

  // State kontrol auto-center
  const [enableAdjust, setEnableAdjust] = useState(true);

  // Reset saat ganti model
  useEffect(() => {
    setActiveData({ id: null, position: null });
    
    // Auto-center nyala sebentar (0.8s) lalu mati khusus Prambanan
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
      dpr={1} 
      shadows={!isPrambanan} 
      camera={{ fov: 45, position: [10, 5, 10] }} 
      onPointerMissed={handleCanvasClick}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <Environment preset={environmentPreset} background blur={0.6} />

      <Suspense fallback={null}>
        <Stage 
          environment={null} 
          intensity={1} 
          contactShadow={false} 
          shadows={!isPrambanan}
          adjustCamera={enableAdjust ? 1.2 : false} 
        >
          <LandmarkModel
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
        enableDamping={true}
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={100}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minPolarAngle={0}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
        panSpeed={0.8}
        enablePan={true}
      />
    </Canvas>
  );
}

export default LandmarkViewer;
