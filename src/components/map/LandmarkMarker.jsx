import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useCursor, useGLTF } from "@react-three/drei";
import { Box3, MathUtils, Vector3 } from "three";
import {
  LANDMARK_DISTANCE_SCALE,
  LANDMARK_MIN_SCALE,
  LANDMARK_MAX_SCALE,
  LANDMARK_RING_INNER,
  LANDMARK_RING_OUTER,
} from "../const";

const COORDINATE_BOUNDS = {
  latMin: -11,
  latMax: 6,
  lonMin: 95,
  lonMax: 141,
};

const tmpVec = new Vector3();

function LandmarkMarker({ mapBounds, landmark, onSelect }) {
  const markerRef = useRef();
  const modelRef = useRef();
  const { camera } = useThree();
  const { scene } = useGLTF(landmark.modelUri);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    if (!modelRef.current) return;
    const box = new Box3().setFromObject(modelRef.current);
    const size = new Vector3();
    box.getSize(size);
    const center = box.getCenter(new Vector3());
    modelRef.current.position.sub(center);
    modelRef.current.position.y += size.y / 2;
    modelRef.current.updateMatrixWorld();
  }, [clonedScene]);

  const position = useMemo(() => {
    if (!mapBounds) return null;
    if (landmark.latitude == null || landmark.longitude == null) return null;

    const width = mapBounds.max.x - mapBounds.min.x;
    const depth = mapBounds.max.z - mapBounds.min.z;
    const longitudeRatio =
      (landmark.longitude - COORDINATE_BOUNDS.lonMin) /
      (COORDINATE_BOUNDS.lonMax - COORDINATE_BOUNDS.lonMin);
    const latitudeRatio =
      (landmark.latitude - COORDINATE_BOUNDS.latMin) /
      (COORDINATE_BOUNDS.latMax - COORDINATE_BOUNDS.latMin);

    const clampedLonRatio = MathUtils.clamp(longitudeRatio, 0, 1);
    const clampedLatRatio = MathUtils.clamp(latitudeRatio, 0, 1);

    const x = mapBounds.min.x + clampedLonRatio * width;
    const z =
      mapBounds.max.z - clampedLatRatio * depth + (landmark.zIndex ?? 0);
    const y =
      mapBounds.min.y +
      (mapBounds.max.y - mapBounds.min.y) * 0.01 +
      (landmark.yOffset ?? 0);

    return [x, y, z];
  }, [
    landmark.latitude,
    landmark.longitude,
    landmark.zIndex,
    landmark.yOffset,
    mapBounds,
  ]);

  const baseScale = landmark.scale ?? 1;
  const _uri = String(landmark.modelUri ?? "").toLowerCase();
  // hide the yellow ring for Prambanan and Borobudur
  const showRing =
    !_uri.includes("candi_prambanan") && !_uri.includes("borobudur");

  useFrame(() => {
    if (!markerRef.current) return;
    markerRef.current.getWorldPosition(tmpVec);
    const distance = camera.position.distanceTo(tmpVec);
    const scaleValue =
      MathUtils.clamp(
        distance * LANDMARK_DISTANCE_SCALE,
        LANDMARK_MIN_SCALE,
        LANDMARK_MAX_SCALE
      ) * baseScale;
    markerRef.current.scale.setScalar(scaleValue);
  });

  if (!position) return null;

  return (
    <group ref={markerRef} position={position}>
      <primitive
        ref={modelRef}
        object={clonedScene}
        onClick={(event) => {
          event.stopPropagation();
          // provide the world position of the marker so parent can trigger animations
          const worldPos = markerRef.current
            ? markerRef.current.getWorldPosition(new Vector3()).toArray()
            : null;
          onSelect?.(landmark, worldPos);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      />
      {showRing && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[LANDMARK_RING_INNER, LANDMARK_RING_OUTER, 48]} />
          <meshBasicMaterial
            color="#fbbf24"
            transparent
            opacity={hovered ? 0.9 : 0.6}
          />
        </mesh>
      )}
    </group>
  );
}

export default LandmarkMarker;
