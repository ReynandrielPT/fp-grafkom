import { Suspense, useRef, useState, useEffect, useMemo, memo } from "react";
import { Canvas, useThree } from "@react-three/fiber"; 
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import Annotation from "./Annotation";

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
  
  // Clone scene and calculate centering offset for annotations
  const { optimizedScene, centerOffset } = useMemo(() => {
    const clone = scene.clone(true);
    let offset = new Vector3(0, 0, 0);
    
    // Center the model at origin for proper rotation
    try {
      const box = new Box3().setFromObject(clone);
      const center = new Vector3();
      const size = new Vector3();
      box.getCenter(center);
      box.getSize(size);
      
      // Calculate the offset we're applying
      offset = center.clone();
      offset.y -= size.y / 2; // Adjust for the lift
      
      // Move model so its center is at origin
      clone.position.sub(center);
      // Lift it so base sits at Y=0
      clone.position.y += size.y / 2;
      clone.updateMatrixWorld(true);
    } catch (err) {
      console.warn("Failed to center model:", err);
    }
    
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
    
    return { optimizedScene: clone, centerOffset: offset };
  }, [scene]);

  return (
    <group 
      scale={modelScale}
      position={objectPosition}
    >
      <primitive object={optimizedScene} />
      
      {annotations.map((anno, index) => {
        const currentId = anno.id || index;
        const isActive = activeId === currentId;
        // Adjust annotation position by the centering offset
        const adjustedPos = [
          anno.position[0] - centerOffset.x,
          anno.position[1] - centerOffset.y,
          anno.position[2] - centerOffset.z
        ];
        return (
          <Annotation
            key={currentId}
            id={currentId}
            number={index + 1}
            position={adjustedPos}
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

// Efficient camera controller - calculates once, doesn't run every frame
function CameraController({ modelUri }) {
  const { camera, scene } = useThree();
  const fitted = useRef(false);
  const boundsRef = useRef(null);
  
  // Reset when model changes
  useEffect(() => {
    fitted.current = false;
    boundsRef.current = null;
  }, [modelUri]);
  
  // Calculate bounds once when model loads
  useEffect(() => {
    if (fitted.current) return;
    
    const timer = setTimeout(() => {
      try {
        const box = new Box3().setFromObject(scene);
        if (box.isEmpty()) return;
        
        const center = box.getCenter(new Vector3());
        const size = box.getSize(new Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        
        cameraZ *= 1.3; // Add padding
        
        camera.position.set(center.x + cameraZ * 0.5, center.y + cameraZ * 0.3, center.z + cameraZ);
        camera.lookAt(center);
        camera.updateProjectionMatrix();
        
        fitted.current = true;
      } catch (err) {
        console.warn("Failed to fit camera:", err);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [modelUri, camera, scene]);
  
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
}) {
  const controlsRef = useRef();
  const [activeData, setActiveData] = useState({ id: null, position: null });

  // Reset saat ganti model
  useEffect(() => {
    setActiveData({ id: null, position: null });
    if (controlsRef.current) {
      controlsRef.current.autoRotate = true;
    }
  }, [modelUri]);

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
      <CameraController modelUri={modelUri} />
      
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
        minDistance={3}
        maxDistance={100}
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
