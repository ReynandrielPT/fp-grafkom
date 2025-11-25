import { Suspense, useEffect, useRef, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import {
  ORBIT_MIN_DISTANCE,
  ORBIT_MAX_DISTANCE,
  ORBIT_DAMPING_FACTOR,
} from "../const";
import IndonesiaMap from "./IndonesiaMap";
import LandmarkMarker from "./LandmarkMarker";
import ControlsTarget from "./ControlsTarget";

function Scene({ landmarks, onLandmarkSelect }) {
  const [mapBounds, setMapBounds] = useState(null);
  const controlsRef = useRef();
  const activeLandmarks = Array.isArray(landmarks) ? landmarks : [];

  useEffect(() => {
    activeLandmarks.forEach((landmark) => {
      if (landmark?.modelUri) {
        useGLTF.preload(landmark.modelUri);
      }
    });
  }, [activeLandmarks]);

  return (
    <>
      <color attach="background" args={[0.04, 0.07, 0.12]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[8, 12, 6]} intensity={1.2} castShadow />
      <directionalLight position={[-10, 5, -8]} intensity={0.5} />

      <Suspense fallback={null}>
        <IndonesiaMap onBoundsReady={setMapBounds} />
        {activeLandmarks.map((landmark) => (
          <LandmarkMarker
            key={landmark.id}
            mapBounds={mapBounds}
            landmark={landmark}
            onSelect={onLandmarkSelect}
          />
        ))}
      </Suspense>

      <OrbitControls
        ref={controlsRef}
        enableDamping
        enablePan
        dampingFactor={ORBIT_DAMPING_FACTOR}
        minDistance={ORBIT_MIN_DISTANCE}
        maxDistance={ORBIT_MAX_DISTANCE}
      />
      <ControlsTarget mapBounds={mapBounds} controlsRef={controlsRef} />
    </>
  );
}

export default Scene;
