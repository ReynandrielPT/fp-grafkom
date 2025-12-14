import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const ModelViewer = ({ path }) => {
  const { scene } = useGLTF(path);
  return <primitive object={scene} scale={1} />;
};
// ini buat nampilin model 3D di kuis
const QuizCanvas = ({ modelUri }) => {
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 75 }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Suspense fallback={null}>
        <ModelViewer path={modelUri} />
      </Suspense>
      <OrbitControls makeDefault enableZoom enablePan />
    </Canvas>
  );
};

export default QuizCanvas;
