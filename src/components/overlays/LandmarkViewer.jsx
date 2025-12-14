import { Suspense, useRef, useState, useEffect, useMemo, memo, createContext } from "react";
import { Canvas, useThree } from "@react-three/fiber"; 
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import Annotation from "./Annotation";

// Context for sharing center point across components
const CenterPointContext = createContext(null);

// Optimized model loader - clones once and applies performance optimizations
const LandmarkModel = memo(function LandmarkModel({
  modelUri,
  modelScale = 1, 
  annotations = [], 
  activeId, 
  onSelectAnnotation,
  objectPosition = [0, 0, 0],
}) {
  const { scene } = useGLTF(modelUri);
  
  // Clone scene and calculate centering offset for annotations - DOES NOT modify position
  const { optimizedScene, xzOffset } = useMemo(() => {
    const clone = scene.clone(true);
    
    let xzOff = new Vector3(0, 0, 0);
    
    try {
      const box = new Box3().setFromObject(clone);
      const center = box.getCenter(new Vector3());
      
      // Store the XZ offset for annotations but DON'T move the model itself
      xzOff = new Vector3(-center.x, 0, -center.z);
      
      // Apply performance optimizations to all meshes
      clone.traverse((child) => {
        if (child.isMesh) {
          // Enable frustum culling
          child.frustumCulled = true;
          
          // Disable shadows for performance
          child.castShadow = false;
          child.receiveShadow = false;
          
          // Optimize materials
          if (child.material) {
            // Reduce environment map intensity for cheaper rendering
            if (child.material.envMapIntensity !== undefined) {
              child.material.envMapIntensity = 0.3;
            }
            // Disable expensive material features
            child.material.flatShading = false;
            if (child.material.map) {
              child.material.map.anisotropy = 0;
            }
          }
        }
      });
      
      clone.updateMatrixWorld(true);
    } catch (err) {
      console.warn("Failed to process model:", err);
    }
    
    return { optimizedScene: clone, xzOffset: xzOff };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, modelUri]);

  return (
    <group 
      scale={modelScale}
      position={[
        objectPosition[0] + xzOffset.x,
        objectPosition[1],
        objectPosition[2] + xzOffset.z
      ]}
    >
      <primitive object={optimizedScene} />
      
      {annotations.map((anno, index) => {
        const currentId = anno.id || index;
        const isActive = activeId === currentId;
        // Annotations don't need offset since the group is already centered
        return (
          <Annotation
            key={currentId}
            id={currentId}
            number={index + 1}
            position={anno.position}
            title={anno.title}
            description={anno.description}
            isOpen={isActive} 
            onSelect={onSelectAnnotation}
            occlude={false}
          />
        );
      })}
    </group>
  );
});

// Efficient camera controller with OrbitControls center based on lowest Y
function CameraAndControlsController({ modelUri, controlsRef, onCenterPointReady }) {
  const { camera, scene } = useThree();
  
  // Calculate bounds and position camera - runs on every frame until successful
  useEffect(() => {
    let frameId = null;
    
    const setupCamera = () => {
      try {
        const box = new Box3().setFromObject(scene);
        if (box.isEmpty()) {
          // Scene not ready, try next frame
          frameId = requestAnimationFrame(setupCamera);
          return;
        }
        
        const center = box.getCenter(new Vector3());
        const size = box.getSize(new Vector3());
        
        // Get the lowest point of the object (minimum Y)
        const lowestY = box.min.y;
        
        // Normalize based on height (Y-axis)
        const height = size.y;
        const width = size.x;
        const depth = size.z;
        
        // Calculate camera distance based on object dimensions
        const horizontalExtent = Math.max(width, depth);
        const verticalExtent = height;
        
        const fov = camera.fov * (Math.PI / 180);
        const aspectRatio = window.innerWidth / window.innerHeight;
        
        // Calculate distance needed to view horizontal extent
        const horizontalDistance = horizontalExtent / 2 / Math.tan(fov / 2);
        
        // Calculate distance needed to view vertical extent
        const verticalFOV = 2 * Math.atan(Math.tan(fov / 2) / aspectRatio);
        const verticalDistance = (verticalExtent / 2) / Math.tan(verticalFOV / 2);
        
        // Use the maximum distance needed
        const maxDistance = Math.max(horizontalDistance, verticalDistance);
        const paddingFactor = 1.4;
        const cameraDistance = maxDistance * paddingFactor;
        
        // Calculate look-at point at vertical center (from lowest Y)
        const lookAtPoint = new Vector3(
          center.x,
          lowestY + height * 0.5,
          center.z
        );
        
        // Position camera
        camera.position.set(
          center.x + cameraDistance * 0.4,
          lookAtPoint.y + height * 0.15,
          center.z + cameraDistance
        );
        camera.lookAt(lookAtPoint);
        camera.updateProjectionMatrix();
        
        // Set OrbitControls target
        if (controlsRef.current) {
          controlsRef.current.target.copy(lookAtPoint);
          controlsRef.current.update();
        }
        
        // Share center point
        if (onCenterPointReady) {
          onCenterPointReady(lookAtPoint);
        }
      } catch (err) {
        console.warn("Failed to fit camera:", err);
      }
    };
    
    // Start setup on next frame
    frameId = requestAnimationFrame(setupCamera);
    
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [modelUri, camera, scene, controlsRef, onCenterPointReady]);
  
  return null;
}

// Component utama untuk preview landmark
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

  // Reset saat ganti model
  useEffect(() => {
    setActiveData({ id: null, position: null });
    setCenterPoint(null);
    if (controlsRef.current) {
      controlsRef.current.autoRotate = true;
    }
  }, [modelUri]);

  // Share center point with parent component
  useEffect(() => {
    if (onCenterPointChange && centerPoint) {
      onCenterPointChange(centerPoint);
    }
  }, [centerPoint, onCenterPointChange]);

  const handleAnnotationSelect = (id, worldPosition) => {
    if (activeData.id === id) {
      setActiveData({ id: null, position: null });
      if (controlsRef.current) {
        controlsRef.current.autoRotate = true;
      }
      return;
    }
    setActiveData({ id, position: worldPosition });
    if (controlsRef.current) {
      controlsRef.current.autoRotate = false;
    }
  };

  const handleCanvasClick = () => {
    if (activeData.id) {
      setActiveData({ id: null, position: null });
      if (controlsRef.current) {
        controlsRef.current.autoRotate = true;
      }
    }
  };

  return (
    <Canvas
      className={className}
      dpr={[0.5, 0.75]}
      shadows={false}
      camera={{ position: [10, 5, 10], fov: 50 }}
      onPointerMissed={handleCanvasClick}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
        alpha: false,
        preserveDrawingBuffer: false,
        logarithmicDepthBuffer: false,
        precision: 'lowp',
      }}
      performance={{ min: 0.3, max: 1, debounce: 200 }}
    >
      <CameraAndControlsController 
        modelUri={modelUri} 
        controlsRef={controlsRef}
        onCenterPointReady={setCenterPoint}
      />
      
      {/* Minimal lighting setup */}
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

      <OrbitControls
        ref={controlsRef}
        autoRotate={true}
        autoRotateSpeed={1.5}
        makeDefault
        enableDamping={true}
        dampingFactor={0.15}
        minDistance={2}
        maxDistance={150}
        rotateSpeed={0.5}
        zoomSpeed={0.7}
        panSpeed={0.5}
        maxPolarAngle={Math.PI / 2 + 0.1}
        minPolarAngle={0.1}
        enablePan={false}
      />
    </Canvas>
  );
}

export default LandmarkViewer;
