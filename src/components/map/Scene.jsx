import {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  memo,
} from "react";
import { OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import { ORBIT_CONTROLS, LANDMARK } from "../../config/mapConfig";
import {
  latLonToWorldPosition,
  isSamePosition,
} from "../../utils/coordinateUtils";
import {
  useKeyboardControls,
  useTransportAnimation,
} from "../../hooks/useSceneControls";
import IndonesiaMap from "./IndonesiaMap";
import LandmarkMarker from "./LandmarkMarker";
import ControlsTarget from "./ControlsTarget";
import PlaneAnimator from "./PlaneAnimator";
import TrainAnimator from "./TrainAnimator";
import WaterSurface from "./WaterSurface";
import { resolveAssetPath } from "../../utils/assets";

// Preload transport models
useGLTF.preload(resolveAssetPath("model/plane.glb"));
useGLTF.preload(resolveAssetPath("model/train.glb"));
useGLTF.preload(resolveAssetPath("model/rail.glb"));

// Memoized LandmarkMarker wrapper to prevent unnecessary re-renders
const MemoizedLandmarkMarker = memo(LandmarkMarker, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  return (
    prevProps.landmark.id === nextProps.landmark.id &&
    prevProps.index === nextProps.index &&
    prevProps.externallyHovered === nextProps.externallyHovered &&
    prevProps.mapBounds === nextProps.mapBounds
  );
});

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
  onLandmarkModelReady,
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
  
  // Store callbacks in refs to prevent child re-renders
  const onPlaneAnimationCompleteRef = useRef(onPlaneAnimationComplete);
  const onLandmarkSelectRef = useRef(onLandmarkSelect);
  const onLandmarkModelReadyRef = useRef(onLandmarkModelReady);
  
  // Update refs in effect to avoid React strict mode warnings
  useEffect(() => {
    onPlaneAnimationCompleteRef.current = onPlaneAnimationComplete;
    onLandmarkSelectRef.current = onLandmarkSelect;
    onLandmarkModelReadyRef.current = onLandmarkModelReady;
  });

  const activeLandmarks = useMemo(
    () => (Array.isArray(landmarks) ? landmarks : []),
    [landmarks]
  );

  // Enable keyboard controls
  useKeyboardControls(controlsRef);

  // Report loading progress
  useEffect(() => {
    if (onLoadingProgress) {
      onLoadingProgress(progress);
    }
  }, [progress, onLoadingProgress]);

  // Constrain camera and target to stay above water and move horizontally
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const clamp = () => {
      if (!mapBounds) return;
      const minY = mapBounds.min.y;
      // Clamp camera and target Y so they don't go below the water plane
      if (controls.object.position.y < minY) controls.object.position.y = minY;
      if (controls.target.y < minY) controls.target.y = minY;
    };

    controls.addEventListener("change", clamp);
    return () => controls.removeEventListener("change", clamp);
  }, [mapBounds]);

  // Initialize camera position at Monas when map loads
  useEffect(() => {
    if (!mapBounds || persistedInitRef.current) return;

    const monas = activeLandmarks.find(
      (l) =>
        l?.id?.toLowerCase().startsWith("monas") ||
        String(l?.modelUri ?? "")
          .toLowerCase()
          .includes("monas")
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

    // Determine effective target position: use provided or compute from landmark
    let effectiveTarget = targetPos;
    if (!effectiveTarget && landmark && mapBounds) {
      effectiveTarget = latLonToWorldPosition(
        landmark.latitude,
        landmark.longitude,
        mapBounds,
        landmark.zIndex ?? 0
      );
    }

    // If we still don't have bounds or target, wait until ready
    if (!effectiveTarget) return;

    // Check if already at target position
    if (isSamePosition(start, effectiveTarget)) {
      onPlaneAnimationCompleteRef.current?.({ targetPos: effectiveTarget });
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

    const fallbackStart = effectiveTarget
      ? [
          effectiveTarget[0] - 3,
          effectiveTarget[1] + 2.5,
          effectiveTarget[2] - 3,
        ]
      : [0, 2.5, 0];
    const s = start || landmarkLeftStart || fallbackStart;
    const e = effectiveTarget;

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
  }, [flyRequest, lastPosRef, mapBounds]);

  // Stable callbacks that don't cause child re-renders
  const handleLandmarkSelect = useCallback((landmark, worldPos) => {
    onLandmarkSelectRef.current?.(landmark, worldPos);
  }, []);
  
  const handleLandmarkModelReady = useCallback((landmark) => {
    onLandmarkModelReadyRef.current?.(landmark);
  }, []);

  const handleAnimationComplete = useCallback(
    (res, setPlay) => {
      if (res?.targetPos) {
        lastPosRef.current = res.targetPos;
      }
      setPlay(false);
      onPlaneAnimationCompleteRef.current?.(res);
    },
    [lastPosRef]
  );

  const handlePlaneComplete = useCallback(
    (res) => handleAnimationComplete(res, setPlanePlay),
    [handleAnimationComplete]
  );

  const handleTrainComplete = useCallback(
    (res) => handleAnimationComplete(res, setTrainPlay),
    [handleAnimationComplete]
  );

  return (
    <>
      <color attach="background" args={[0.02, 0.04, 0.07]} />
      {/* Global soft ambient */}
      <ambientLight args={[0xffffff, 0.4]} />
      {/* Cooler hemisphere lighting to avoid yellow tint */}
      <hemisphereLight args={[0xcfe8ff, 0x1f3a4d, 0.7]} />
      {/* Neutral directional light (sun) to keep water blue */}
      <directionalLight
        position={[100, 200, 100]}
        intensity={0.9}
        color={0xf0f6ff}
        castShadow={false}
      />

      <Suspense fallback={null}>
        <WaterSurface mapBounds={mapBounds} />
        <IndonesiaMap onBoundsReady={setMapBounds} />
        {activeLandmarks.map((landmark, i) => (
          <MemoizedLandmarkMarker
            key={landmark.id}
            index={landmark.displayIndex ?? i + 1}
            mapBounds={mapBounds}
            landmark={landmark}
            onSelect={handleLandmarkSelect}
            externallyHovered={Boolean(
              hoveredLandmarkId && landmark.id === hoveredLandmarkId
            )}
            onModelReady={handleLandmarkModelReady}
          />
        ))}
        <PlaneAnimator
          start={planeStart}
          end={planeEnd}
          play={planePlay}
          onComplete={handlePlaneComplete}
        />
        <TrainAnimator
          start={trainStart}
          end={trainEnd}
          play={trainPlay}
          onComplete={handleTrainComplete}
        />
      </Suspense>

      <OrbitControls
        ref={controlsRef}
        enableDamping
        enablePan
        screenSpacePanning={false}
        dampingFactor={ORBIT_CONTROLS.DAMPING_FACTOR}
        minDistance={ORBIT_CONTROLS.MIN_DISTANCE}
        maxDistance={ORBIT_CONTROLS.MAX_DISTANCE}
        minPolarAngle={ORBIT_CONTROLS.MIN_POLAR_ANGLE}
        maxPolarAngle={ORBIT_CONTROLS.MAX_POLAR_ANGLE}
      />
      <ControlsTarget mapBounds={mapBounds} controlsRef={controlsRef} />
    </>
  );
}

export default Scene;
