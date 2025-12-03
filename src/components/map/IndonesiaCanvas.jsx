import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";
import { CAMERA, LANDMARK } from "../../config/mapConfig";
import { resolveAssetPath } from "../../utils/assets";

const DEFAULT_LANDMARKS = [
  {
    id: "monas",
    name: "Monumen Nasional",
    modelUri: resolveAssetPath("model/monas.glb"),
    latitude: -6.2088,
    longitude: 106.8456,
    scale: LANDMARK.DEFAULT_SCALE,
    zIndex: 0,
  },
];

/**
 * IndonesiaCanvas Component
 * Wrapper for the 3D canvas containing the Indonesia scene
 * 
 * @param {string} className - CSS classes for the canvas container
 * @param {Array} landmarks - Array of landmark objects to display
 * @param {Function} onLandmarkSelect - Callback when a landmark is selected
 * @param {Object} flyRequest - Request for camera flight animation
 * @param {Function} onPlaneAnimationComplete - Callback when animation completes
 * @param {string} hoveredLandmarkId - ID of currently hovered landmark
 * @param {Function} onLoadingProgress - Callback for loading progress updates
 */
function IndonesiaCanvas({
  className = "w-full h-full",
  landmarks = DEFAULT_LANDMARKS,
  onLandmarkSelect,
  flyRequest,
  onPlaneAnimationComplete,
  hoveredLandmarkId,
  onLoadingProgress,
}) {
  const containerClassName = ["relative", className].filter(Boolean).join(" ");

  return (
    <div className={containerClassName}>
      <Canvas
        shadows={false}
        dpr={1}
        gl={{ antialias: false, powerPreference: "low-power" }}
        camera={{
          position: CAMERA.INDONESIA_POSITION,
          fov: CAMERA.INDONESIA_FOV,
        }}
      >
        <Scene
          landmarks={landmarks}
          onLandmarkSelect={onLandmarkSelect}
          flyRequest={flyRequest}
          onPlaneAnimationComplete={onPlaneAnimationComplete}
          hoveredLandmarkId={hoveredLandmarkId}
          onLoadingProgress={onLoadingProgress}
        />
      </Canvas>
    </div>
  );
}

export default IndonesiaCanvas;
