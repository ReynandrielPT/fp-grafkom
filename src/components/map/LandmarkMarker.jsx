import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useCursor, Text } from "@react-three/drei";
import gsap from "gsap";
import { Box3, MathUtils, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
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

function LandmarkMarker({ mapBounds, landmark, onSelect, index }) {
  const markerRef = useRef();
  const modelRef = useRef();
  const textRef = useRef();
  const { camera } = useThree();
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  // State for the loaded/cloned scene (loaded on hover)
  const [clonedScene, setClonedScene] = useState(null);
  const loadingRef = useRef(false);
  // track whether the current load should be applied (cancel on pointer out)
  const activeRef = useRef(false);
  // store active animations so we can kill them when needed
  const hoverTweenRef = useRef(null);
  const rotationTweenRef = useRef(null);

  const centerScene = (sceneObj) => {
    const box = new Box3().setFromObject(sceneObj);
    const size = new Vector3();
    box.getSize(size);
    const center = box.getCenter(new Vector3());
    sceneObj.position.sub(center);
    sceneObj.position.y += size.y / 2;
    sceneObj.updateMatrixWorld();
  };

  const disposeScene = (obj) => {
    if (!obj) return;
    try {
      // kill any running tweens first
      try {
        if (hoverTweenRef.current) hoverTweenRef.current.kill();
        if (rotationTweenRef.current) rotationTweenRef.current.kill();
      } catch (e) {}
      obj.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            const disposeMaterial = (mat) => {
              if (!mat) return;
              // dispose textures
              for (const key in mat) {
                const value = mat[key];
                if (value && value.isTexture) {
                  value.dispose();
                }
              }
              if (mat.dispose) mat.dispose();
            };

            if (Array.isArray(child.material)) {
              child.material.forEach(disposeMaterial);
            } else {
              disposeMaterial(child.material);
            }
          }
        }
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("Error disposing scene", e);
    }
  };

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
  // hide the yellow ring for Prambanan, Borobudur, and Monas
  const showRing =
    !_uri.includes("candi_prambanan") &&
    !_uri.includes("borobudur") &&
    !_uri.includes("monas");

  useFrame(() => {
    if (!markerRef.current) return;
    markerRef.current.getWorldPosition(tmpVec);
    const distance = camera.position.distanceTo(tmpVec);

    // Compute scale from distance and landmark base scale (no hover animation).
    const distanceScale = MathUtils.clamp(
      distance * LANDMARK_DISTANCE_SCALE,
      LANDMARK_MIN_SCALE,
      LANDMARK_MAX_SCALE
    );

    // Make loaded models 2x bigger by default.
    const BASE_MULTIPLIER = 2;
    const scaleValue = distanceScale * baseScale * BASE_MULTIPLIER;
    markerRef.current.scale.setScalar(scaleValue);

    // Keep label text approximately the same size in world space by
    // counter-scaling it relative to the group's scale.
    if (textRef.current) {
      const safe = Math.max(scaleValue, 1e-6);
      const inv = 1 / safe;
      textRef.current.scale.set(inv, inv, inv);
    }
  });

  if (!position) return null;

  const startLoad = () => {
    if (clonedScene || loadingRef.current) return;
    loadingRef.current = true;
    activeRef.current = true;
    const loader = new GLTFLoader();
    loader.load(
      String(landmark.modelUri ?? ""),
      (data) => {
        loadingRef.current = false;
        if (!activeRef.current) {
          // user moved out while loading; dispose immediately
          disposeScene(data.scene);
          return;
        }
        const sceneClone = data.scene.clone(true);
        centerScene(sceneClone);
        setClonedScene(sceneClone);
      },
      undefined,
      (err) => {
        loadingRef.current = false;
        // eslint-disable-next-line no-console
        console.error("Error loading glTF:", err);
      }
    );
  };

  const stopAndUnload = () => {
    activeRef.current = false;
    setHovered(false);
    // If model is mounted, play shrink + stop rotation then dispose on complete
    const obj = modelRef.current;
    if (clonedScene && obj) {
      // stop continuous rotation
      try {
        if (rotationTweenRef.current) rotationTweenRef.current.kill();
      } catch (e) {}

      // animate scale down, then dispose
      try {
        if (hoverTweenRef.current) hoverTweenRef.current.kill();
      } catch (e) {}

      hoverTweenRef.current = gsap.to(obj.scale, {
        x: 0.001,
        y: 0.001,
        z: 0.001,
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => {
          try {
            disposeScene(clonedScene);
          } catch (e) {}
          setClonedScene(null);
        },
      });
      return;
    }

    if (clonedScene) {
      disposeScene(clonedScene);
      setClonedScene(null);
    }
  };

  // When a cloned scene appears, run its intro animation (scale up + start rotation)
  useEffect(() => {
    if (!clonedScene) return;

    // small timeout to ensure primitive is mounted and ref assigned
    const t = setTimeout(() => {
      const obj = modelRef.current;
      if (!obj) return;

      try {
        if (hoverTweenRef.current) hoverTweenRef.current.kill();
        if (rotationTweenRef.current) rotationTweenRef.current.kill();
      } catch (e) {}

      // start from tiny scale
      obj.scale.setScalar(0.001);

      hoverTweenRef.current = gsap.to(obj.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.6,
        ease: "power3.out",
      });

      // continuous slow rotation while hovered/active
      rotationTweenRef.current = gsap.to(obj.rotation, {
        y: Math.PI * 2,
        duration: 6,
        ease: "linear",
        repeat: -1,
      });
    }, 0);

    return () => clearTimeout(t);
  }, [clonedScene]);

  return (
    <group ref={markerRef} position={position}>
      {/* Show a visible label/placeholder when model is not loaded. Hovering
          the label triggers load; the label hides once the model is loaded. */}
      <Text
        color="#ffffff"
        fontSize={0.28}
        maxWidth={2}
        anchorX="center"
        anchorY="middle"
        ref={textRef}
        onClick={(event) => {
          event.stopPropagation();
          const worldPos = markerRef.current
            ? markerRef.current.getWorldPosition(new Vector3()).toArray()
            : null;
          onSelect?.(landmark, worldPos);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          startLoad();
        }}
        onPointerOut={() => stopAndUnload()}
        position={[0, 0.6, 0]}
        // keep text facing camera
        rotation={[0, 0, 0]}
      >
        {index}
      </Text>

      {/* Render model when loaded; pointer handlers on the primitive */}
      {clonedScene && (
        <primitive
          ref={modelRef}
          object={clonedScene}
          onClick={(event) => {
            event.stopPropagation();
            const worldPos = markerRef.current
              ? markerRef.current.getWorldPosition(new Vector3()).toArray()
              : null;
            onSelect?.(landmark, worldPos);
          }}
          onPointerOver={(event) => {
            event.stopPropagation();
            setHovered(true);
            activeRef.current = true;
          }}
          onPointerOut={() => stopAndUnload()}
        />
      )}

      {/* Invisible larger hitbox so hover/click is easier on small models */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
        onClick={(event) => {
          event.stopPropagation();
          const worldPos = markerRef.current
            ? markerRef.current.getWorldPosition(new Vector3()).toArray()
            : null;
          onSelect?.(landmark, worldPos);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          startLoad();
          activeRef.current = true;
        }}
        onPointerOut={() => stopAndUnload()}
      >
        <circleGeometry args={[LANDMARK_RING_OUTER * 2.2, 32]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

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
