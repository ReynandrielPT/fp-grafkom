import { Suspense, useRef, useState, useEffect, memo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import {
  OptimizedModel,
  CameraController,
  defaultCanvasProps,
  defaultControlsProps,
} from "./ModelViewer";
import Annotation from "./Annotation";

// Renders model with annotation markers
const LandmarkModel = memo(function LandmarkModel({
  modelUri,
  modelScale = 1,
  annotations = [],
  activeId,
  onSelectAnnotation,
  objectPosition = [0, 0, 0],
}) {
  return (
    <OptimizedModel
      modelUri={modelUri}
      modelScale={modelScale}
      objectPosition={objectPosition}
    >
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
            occlude={false}
          />
        );
      })}
    </OptimizedModel>
  );
});

function LandmarkViewer({
  className = "w-full h-full",
  modelUri,
  modelScale = 1.5,
  annotations = [],
  environmentPreset = "park",
  objectPosition = [0, 0, 0],
  onCenterPointChange = null,
}) {
  const controlsRef = useRef();
  const [activeData, setActiveData] = useState({ id: null, position: null });
  const [centerPoint, setCenterPoint] = useState(null);

  // Reset on model change
  useEffect(() => {
    setActiveData({ id: null, position: null });
    setCenterPoint(null);
    if (controlsRef.current) controlsRef.current.autoRotate = true;
  }, [modelUri]);

  useEffect(() => {
    if (onCenterPointChange && centerPoint) onCenterPointChange(centerPoint);
  }, [centerPoint, onCenterPointChange]);

  // Toggle annotation details and pause auto-rotate
  const handleAnnotationSelect = (id) => {
    if (activeData.id === id) {
      setActiveData({ id: null, position: null });
      if (controlsRef.current) controlsRef.current.autoRotate = true;
      return;
    }
    setActiveData({ id, position: null });
    if (controlsRef.current) controlsRef.current.autoRotate = false;
  };

  // Close annotation panel on canvas click
  const handleCanvasClick = () => {
    if (activeData.id) {
      setActiveData({ id: null, position: null });
      if (controlsRef.current) controlsRef.current.autoRotate = true;
    }
  };

  return (
    <Canvas
      className={className}
      {...defaultCanvasProps}
      onPointerMissed={handleCanvasClick}
    >
      <CameraController
        modelUri={modelUri}
        controlsRef={controlsRef}
        onCenterPointReady={setCenterPoint}
      />

      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} />

      <Environment preset={environmentPreset} background blur={0.8} />

      <Suspense fallback={null}>
        <LandmarkModel
          modelUri={modelUri}
          modelScale={modelScale}
          annotations={annotations}
          activeId={activeData.id}
          onSelectAnnotation={handleAnnotationSelect}
          objectPosition={objectPosition}
        />
      </Suspense>

      <OrbitControls ref={controlsRef} {...defaultControlsProps} />
    </Canvas>
  );
}

export default LandmarkViewer;
