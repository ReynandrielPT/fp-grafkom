import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";
import {
  DEFAULT_LANDMARKS_SCALE,
  INDONESIA_CAMERA_POSITION,
  INDONESIA_CAMERA_FOV,
} from "../const";
import { resolveAssetPath } from "../../utils/assets";

const DEFAULT_LANDMARKS = [
  {
    id: "monas",
    name: "Monumen Nasional",
    modelUri: resolveAssetPath("model/monas.glb"),
    latitude: -6.2088,
    longitude: 106.8456,
    scale: DEFAULT_LANDMARKS_SCALE,
    zIndex: 0,
  },
];

function IndonesiaCanvas({
  className = "w-full h-full",
  landmarks = DEFAULT_LANDMARKS,
  onLandmarkSelect,
  flyRequest,
  onPlaneAnimationComplete,
  hoveredLandmarkId,
}) {
  const containerClassName = ["relative", className].filter(Boolean).join(" ");

  return (
    <div className={containerClassName}>
      <Canvas
        shadows={false}
        dpr={1}
        gl={{ antialias: false, powerPreference: "low-power" }}
        camera={{
          position: INDONESIA_CAMERA_POSITION,
          fov: INDONESIA_CAMERA_FOV,
        }}
      >
        <Scene
          landmarks={landmarks}
          onLandmarkSelect={onLandmarkSelect}
          flyRequest={flyRequest}
          onPlaneAnimationComplete={onPlaneAnimationComplete}
          hoveredLandmarkId={hoveredLandmarkId}
        />
      </Canvas>
    </div>
  );
}

export default IndonesiaCanvas;
