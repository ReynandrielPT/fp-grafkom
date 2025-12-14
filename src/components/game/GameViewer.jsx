import { Suspense, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import {
  OptimizedModel,
  CameraController,
  defaultCanvasProps,
  defaultControlsProps,
} from "../overlays/ModelViewer";

function GameViewer({
  className = "w-full h-full",
  modelUri,
  modelScale = 1.5,
  environmentPreset = "park",
  objectPosition = [0, 0, 0],
}) {
  const controlsRef = useRef();

  // Enable auto-rotate on model change
  useEffect(() => {
    if (controlsRef.current) controlsRef.current.autoRotate = true;
  }, [modelUri]);

  return (
    <Canvas key={modelUri} className={className} {...defaultCanvasProps}>
      <CameraController modelUri={modelUri} controlsRef={controlsRef} />

      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} />

      <Environment preset={environmentPreset} background blur={0.8} />

      <Suspense fallback={null}>
        <OptimizedModel
          modelUri={modelUri}
          modelScale={modelScale}
          objectPosition={objectPosition}
        />
      </Suspense>

      <OrbitControls ref={controlsRef} {...defaultControlsProps} />
    </Canvas>
  );
}

export default GameViewer;
