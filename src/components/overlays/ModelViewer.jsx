import { useEffect, useMemo, memo } from "react";
import { useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";

// eslint-disable-next-line react-refresh/only-export-components
export { defaultCanvasProps, defaultControlsProps };

// Loads and optimizes 3D models
export const OptimizedModel = memo(function OptimizedModel({
  modelUri,
  modelScale = 1,
  objectPosition = [0, 0, 0],
  children,
}) {
  const { scene } = useGLTF(modelUri);

  const { optimizedScene, xzOffset } = useMemo(() => {
    const clone = scene.clone(true);
    let xzOff = new Vector3(0, 0, 0);

    try {
      // Center model in XZ plane
      const box = new Box3().setFromObject(clone);
      const center = box.getCenter(new Vector3());
      xzOff = new Vector3(-center.x, 0, -center.z);

      // Optimize mesh performance
      clone.traverse((child) => {
        if (child.isMesh) {
          child.frustumCulled = true;
          child.castShadow = false;
          child.receiveShadow = false;
          if (child.material) {
            if (child.material.envMapIntensity !== undefined) {
              child.material.envMapIntensity = 0.3;
            }
            child.material.flatShading = false;
            if (child.material.map) child.material.map.anisotropy = 0;
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
        objectPosition[2] + xzOffset.z,
      ]}
    >
      <primitive object={optimizedScene} />
      {children}
    </group>
  );
});

// Calculates and positions camera based on model bounds
export function CameraController({ modelUri, controlsRef, onCenterPointReady }) {
  const { camera, scene } = useThree();

  useEffect(() => {
    let frameId = null;

    const setupCamera = () => {
      try {
        const box = new Box3().setFromObject(scene);
        if (box.isEmpty()) {
          frameId = requestAnimationFrame(setupCamera);
          return;
        }

        // Calculate bounds and view requirements
        const center = box.getCenter(new Vector3());
        const size = box.getSize(new Vector3());
        const lowestY = box.min.y;
        const height = size.y;
        const width = size.x;
        const depth = size.z;
        const horizontalExtent = Math.max(width, depth);
        const verticalExtent = height;

        // Compute required distance to fit entire model in view
        const fov = camera.fov * (Math.PI / 180);
        const aspectRatio = window.innerWidth / window.innerHeight;
        const horizontalDistance = horizontalExtent / 2 / Math.tan(fov / 2);
        const verticalFOV = 2 * Math.atan(Math.tan(fov / 2) / aspectRatio);
        const verticalDistance = (verticalExtent / 2) / Math.tan(verticalFOV / 2);
        const maxDistance = Math.max(horizontalDistance, verticalDistance);
        const cameraDistance = maxDistance * 1.4;

        // Position camera and target controls
        const lookAtPoint = new Vector3(
          center.x,
          lowestY + height * 0.5,
          center.z
        );
        camera.position.set(
          center.x + cameraDistance * 0.4,
          lookAtPoint.y + height * 0.15,
          center.z + cameraDistance
        );
        camera.lookAt(lookAtPoint);
        camera.updateProjectionMatrix();
        if (controlsRef.current) {
          controlsRef.current.target.copy(lookAtPoint);
          controlsRef.current.update();
        }
        if (onCenterPointReady) onCenterPointReady(lookAtPoint);
      } catch (err) {
        console.warn("Failed to fit camera:", err);
      }
    };

    frameId = requestAnimationFrame(setupCamera);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [modelUri, camera, scene, controlsRef, onCenterPointReady]);

  return null;
}

// Shared Canvas configuration
const defaultCanvasProps = {
  dpr: [0.5, 0.75],
  shadows: false,
  camera: { position: [10, 5, 10], fov: 50 },
  gl: {
    antialias: false,
    powerPreference: "high-performance",
    stencil: false,
    depth: true,
    alpha: false,
    preserveDrawingBuffer: false,
    logarithmicDepthBuffer: false,
    precision: "lowp",
  },
  performance: { min: 0.3, max: 1, debounce: 200 },
};

// Shared OrbitControls configuration
const defaultControlsProps = {
  autoRotate: true,
  autoRotateSpeed: 1.5,
  makeDefault: true,
  enableDamping: true,
  dampingFactor: 0.15,
  minDistance: 2,
  maxDistance: 150,
  rotateSpeed: 0.5,
  zoomSpeed: 0.7,
  panSpeed: 0.5,
  maxPolarAngle: Math.PI / 2 + 0.1,
  minPolarAngle: 0.1,
  enablePan: false,
};
