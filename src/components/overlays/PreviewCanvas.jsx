import { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CAMERA, ORBIT_CONTROLS, MONUMENT_PREVIEW } from "../../config/mapConfig";
import MonasPreviewModel from "./MonasPreviewModel";

/**
 * PreviewCanvas Component
 * 3D canvas for rendering monument model previews
 * 
 * @param {string} className - CSS classes for canvas
 * @param {string} modelUri - Path to 3D model file
 * @param {number} modelScale - Scale multiplier for model
 * @param {Array<number>} modelPosition - Position [x, y, z] for model
 */
function PreviewCanvas({
  className = "w-full h-full",
  modelUri,
  modelScale,
  modelPosition,
}) {
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, -0.8, 0);
      controlsRef.current.update();
    }
  }, []);

  return (
    <Canvas
      className={className}
      dpr={1}
      gl={{ antialias: false, powerPreference: "low-power" }}
      camera={{ 
        position: CAMERA.MONUMENT_PREVIEW_POSITION, 
        fov: CAMERA.MONUMENT_PREVIEW_FOV 
      }}
    >
      <color attach="background" args={[0.05, 0.07, 0.12]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[0, 5, 4]} intensity={1.1} />
      <Suspense fallback={null}>
        <MonasPreviewModel
          modelUri={modelUri}
          modelScale={modelScale}
          modelPosition={modelPosition}
        />
      </Suspense>
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom
        enableRotate
        autoRotate={false}
        minDistance={ORBIT_CONTROLS.MONUMENT_MIN_DISTANCE}
        maxDistance={ORBIT_CONTROLS.MONUMENT_MAX_DISTANCE}
      />
    </Canvas>
  );
}

export default PreviewCanvas;
