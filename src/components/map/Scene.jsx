import { Suspense, useEffect, useRef, useState, useMemo } from "react";
import { OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import { ORBIT_CONTROLS, LANDMARK } from "../../config/mapConfig";
import { latLonToWorldPosition, isSamePosition } from "../../utils/coordinateUtils";
import { useKeyboardControls, useTransportAnimation } from "../../hooks/useSceneControls";
import IndonesiaMap from "./IndonesiaMap";
import LandmarkMarker from "./LandmarkMarker";
import ControlsTarget from "./ControlsTarget";
import PlaneAnimator from "./PlaneAnimator";
import TrainAnimator from "./TrainAnimator";
import { resolveAssetPath } from "../../utils/assets";

// Preload transport models
useGLTF.preload(resolveAssetPath("model/plane.glb"));
useGLTF.preload(resolveAssetPath("model/train.glb"));
useGLTF.preload(resolveAssetPath("model/rail.glb"));

/**
 * Scene Component
 * Main 3D scene containing the Indonesia map, landmarks, and transport animations
 * 
 * @param {Array} landmarks - Array of landmark objects
 * @param {Function} onLandmarkSelect - Callback when landmark is selected
 * @param {Object} flyRequest - Request object for flight/train animation
 * @param {Function} onPlaneAnimationComplete - Callback when transport animation completes
 * @param {string} hoveredLandmarkId - ID of currently hovered landmark
 * @param {Function} onLoadingProgress - Callback for loading progress updates
 */
function Scene({
  landmarks,
  onLandmarkSelect,
  flyRequest,
  onPlaneAnimationComplete,
  hoveredLandmarkId,
  onLoadingProgress,
}) {
  const { progress } = useProgress();
  const [mapBounds, setMapBounds] = useState(null);
  const controlsRef = useRef();
  const { lastPosRef, persistedInitRef } = useTransportAnimation();
  
  const [planePlay, setPlanePlay] = useState(false);
  const [planeStart, setPlaneStart] = useState(null);
  const [planeEnd, setPlaneEnd] = useState(null);
  const [trainPlay, setTrainPlay] = useState(false);
  const [trainStart, setTrainStart] = useState(null);
  const [trainEnd, setTrainEnd] = useState(null);

  const activeLandmarks = useMemo(
    () => (Array.isArray(landmarks) ? landmarks : []),
    [landmarks]
  );

  // Enable keyboard controls
  useKeyboardControls(controlsRef);

  // Preload landmark models
  useEffect(() => {
    activeLandmarks.forEach((landmark) => {
      if (landmark?.modelUri) {
        useGLTF.preload(landmark.modelUri);
      }
    });
  }, [activeLandmarks]);

  // Report loading progress
  useEffect(() => {
    if (onLoadingProgress) {
      onLoadingProgress(progress);
    }
  }, [progress, onLoadingProgress]);

  // Initialize camera position at Monas when map loads
  useEffect(() => {
    if (!mapBounds || persistedInitRef.current) return;
    
    const monas = activeLandmarks.find(
      (l) =>
        l?.id?.toLowerCase().startsWith("monas") ||
        String(l?.modelUri ?? "").toLowerCase().includes("monas")
    );
    
    if (!monas) return;

    const position = latLonToWorldPosition(
      monas.latitude,
      monas.longitude,
      mapBounds,
      monas.zIndex ?? 0
    );

    if (position) {
      lastPosRef.current = position;
      persistedInitRef.current = true;
    }
  }, [mapBounds, activeLandmarks, lastPosRef, persistedInitRef]);

  // Handle flight/train animation requests
  useEffect(() => {
    if (!flyRequest) return;
    
    const { landmark, targetPos, originLandmark } = flyRequest;
    const start = lastPosRef.current;

    // Check if already at target position
    if (isSamePosition(start, targetPos)) {
      onPlaneAnimationComplete?.({ targetPos });
      return;
    }

    // Calculate start position for first flight
    let landmarkLeftStart = null;
    if (!start && targetPos) {
      const LEFT_OFFSET = 3;
      const HEIGHT_OFFSET = 2.5;
      landmarkLeftStart = [
        targetPos[0] - LEFT_OFFSET,
        targetPos[1] + HEIGHT_OFFSET,
        targetPos[2],
      ];
    }

    const fallbackStart = targetPos
      ? [targetPos[0] - 3, targetPos[1] + 2.5, targetPos[2] - 3]
      : [0, 2.5, 0];
    const s = start || landmarkLeftStart || fallbackStart;
    const e = targetPos || [0, 0, 0];

    // Decide transport type: train for same island, plane for different islands
    const originIsland = originLandmark?.island;
    const destIsland = landmark?.island;
    const useTrain =
      originIsland &&
      destIsland &&
      originIsland === destIsland &&
      originIsland !== "Archipelago";

    if (useTrain) {
      setTrainStart(s);
      setTrainEnd(e);
      setTrainPlay(true);
    } else {
      setPlaneStart(s);
      setPlaneEnd(e);
      setPlanePlay(true);
    }
  }, [flyRequest, lastPosRef, onPlaneAnimationComplete]);

  const handleAnimationComplete = (res, setPlay) => {
    if (res?.targetPos) lastPosRef.current = res.targetPos;
    setPlay(false);
    onPlaneAnimationComplete?.(res);
  };

  return (
    <>
      <color attach="background" args={[0.04, 0.07, 0.12]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[8, 12, 6]}
        intensity={0.8}
        castShadow={false}
      />
      <directionalLight position={[-10, 5, -8]} intensity={0.3} />

      <Suspense fallback={null}>
        <IndonesiaMap onBoundsReady={setMapBounds} />
        {activeLandmarks.map((landmark, i) => (
          <LandmarkMarker
            key={landmark.id}
            index={landmark.displayIndex ?? i + 1}
            mapBounds={mapBounds}
            landmark={landmark}
            onSelect={onLandmarkSelect}
            externallyHovered={Boolean(
              hoveredLandmarkId && landmark.id === hoveredLandmarkId
            )}
          />
        ))}
        <PlaneAnimator
          start={planeStart}
          end={planeEnd}
          play={planePlay}
          onComplete={(res) => handleAnimationComplete(res, setPlanePlay)}
        />
        <TrainAnimator
          start={trainStart}
          end={trainEnd}
          play={trainPlay}
          onComplete={(res) => handleAnimationComplete(res, setTrainPlay)}
        />
      </Suspense>

      <OrbitControls
        ref={controlsRef}
        enableDamping
        enablePan
        dampingFactor={ORBIT_CONTROLS.DAMPING_FACTOR}
        minDistance={ORBIT_CONTROLS.MIN_DISTANCE}
        maxDistance={ORBIT_CONTROLS.MAX_DISTANCE}
      />
      <ControlsTarget mapBounds={mapBounds} controlsRef={controlsRef} />
    </>
  );
}

export default Scene;
