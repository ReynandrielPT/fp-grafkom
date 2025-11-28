import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Billboard, Text, useCursor } from "@react-three/drei";
import gsap from "gsap";
import { Box3, MathUtils, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  DEFAULT_LANDMARKS_SCALE,
  LANDMARK_GLOBAL_Y_OFFSET,
  LANDMARK_LABEL_FONT_SIZE,
  LANDMARK_LABEL_HEIGHT,
  LANDMARK_LABEL_HITBOX_WIDTH,
  LANDMARK_LABEL_HITBOX_HEIGHT,
} from "../const";

const COORDINATE_BOUNDS = {
  latMin: -12,
  latMax: 6,
  lonMin: 95,
  lonMax: 141,
};

const DISABLE_TEXT_RAYCAST = () => null;

function LandmarkMarker({
  mapBounds,
  landmark,
  onSelect,
  index,
  externallyHovered = false,
}) {
  const markerRef = useRef();
  const modelRef = useRef();
  const [hovered, setHovered] = useState(false);
  const hoverActive = hovered || externallyHovered;
  useCursor(hoverActive);

  // State for the loaded/cloned scene (loaded on hover)
  const [clonedScene, setClonedScene] = useState(null);
  const loadingRef = useRef(false);
  // track whether the current load should be applied (cancel on pointer out)
  const activeRef = useRef(false);
  // store active animations so we can kill them when needed
  const hoverTweenRef = useRef(null);
  const rotationTweenRef = useRef(null);

  const objectScale = useMemo(() => {
    const manualScale = Number(landmark?.scale);
    if (Number.isFinite(manualScale) && manualScale > 0) return manualScale;
    return DEFAULT_LANDMARKS_SCALE;
  }, [landmark?.scale]);

  const disposeScene = useCallback((obj) => {
    if (!obj) return;
    try {
      // kill any running tweens first
      hoverTweenRef.current?.kill();
      rotationTweenRef.current?.kill();
      
      obj.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose();
          if (child.material) {
            const disposeMaterial = (mat) => {
              if (!mat) return;
              // dispose textures
              Object.values(mat).forEach(value => {
                if (value?.isTexture) value.dispose();
              });
              mat.dispose?.();
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
      console.warn("Error disposing scene", e);
    }
  }, []);

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
      LANDMARK_GLOBAL_Y_OFFSET;

    return [x, y, z];
  }, [
    landmark.latitude,
    landmark.longitude,
    landmark.zIndex,
    mapBounds,
  ]);

  const labelY = LANDMARK_LABEL_HEIGHT;

  const getMarkerWorldPosition = useCallback(() => {
    if (!markerRef.current) return null;
    const v = new Vector3();
    markerRef.current.getWorldPosition(v);
    return v;
  }, []);

  const startLoad = useCallback(() => {
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
        const clone = data.scene.clone(true);
        try {
          const box = new Box3().setFromObject(clone);
          const size = new Vector3();
          // compute size before using it
          box.getSize(size);
          const center = box.getCenter(new Vector3());
          // center the model at origin and lift it so its base sits on Y=0
          clone.position.sub(center);
          clone.position.y += size.y / 2;
          clone.updateMatrixWorld();
        } catch (err) {
          console.warn("LandmarkMarker: failed to recenter scene", err);
        }
        setClonedScene(clone);
      },
      undefined,
      (err) => {
        loadingRef.current = false;
        console.error("Error loading glTF:", err);
      }
    );
  }, [clonedScene, landmark?.modelUri, disposeScene]);

  const stopAndUnload = useCallback(() => {
    activeRef.current = false;
    setHovered(false);
    // If model is mounted, play shrink + stop rotation then dispose on complete
    const obj = modelRef.current;
    if (clonedScene && obj) {
      // stop continuous rotation
      rotationTweenRef.current?.kill();
      hoverTweenRef.current?.kill();

      hoverTweenRef.current = gsap.to(obj.scale, {
        x: 0.001,
        y: 0.001,
        z: 0.001,
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => {
          disposeScene(clonedScene);
          setClonedScene(null);
        },
      });
      return;
    }

    if (clonedScene) {
      disposeScene(clonedScene);
      setClonedScene(null);
    }
  }, [clonedScene, disposeScene]);

  const runHoverAnimations = useCallback((resetScale = false) => {
    const obj = modelRef.current;
    if (!obj) return;

    hoverTweenRef.current?.kill();
    rotationTweenRef.current?.kill();

    if (resetScale) {
      obj.scale.setScalar(0.001);
    }

    hoverTweenRef.current = gsap.to(obj.scale, {
      x: objectScale,
      y: objectScale,
      z: objectScale,
      duration: 0.6,
      ease: "power3.out",
    });

    rotationTweenRef.current = gsap.to(obj.rotation, {
      y: Math.PI * 2,
      duration: 6,
      ease: "linear",
      repeat: -1,
    });
  }, [objectScale]);

  // When a cloned scene appears, run its intro animation (scale up + start rotation)
  useLayoutEffect(() => {
    if (!clonedScene || !hoverActive) return;

    runHoverAnimations(true);
  }, [clonedScene, hoverActive, runHoverAnimations]);

  const labelContent = hoverActive && clonedScene ? "" : index;

  const getWorldPositionArray = () => {
    const pos = getMarkerWorldPosition();
    if (!pos) return null;
    return pos.toArray();
  };

  const registerLabelHitbox = useCallback(
    (obj) => {
      if (!obj) return;
      obj.userData.getMarkerCenter = getMarkerWorldPosition;
      obj.userData.isLabelHitbox = true;
    },
    [getMarkerWorldPosition]
  );

  const computeCenterScore = useCallback((object, point) => {
    if (!object || !point) return null;
    const getter = object.userData?.getMarkerCenter;
    if (typeof getter !== "function") return null;
    const center = getter();
    if (!center) return null;
    return center.distanceTo(point);
  }, []);

  const shouldHandlePointer = useCallback(
    (event) => {
      const hits = event?.intersections;
      if (!Array.isArray(hits) || hits.length === 0) return true;
      let bestObject = null;
      let bestScore = Infinity;
      for (const hit of hits) {
        const score = computeCenterScore(hit.object, hit.point);
        if (score == null) continue;
        if (score < bestScore) {
          bestScore = score;
          bestObject = hit.object;
        }
      }
      if (!bestObject) return true;
      return bestObject === event.eventObject;
    },
    [computeCenterScore]
  );

  const ensureHoverActive = useCallback(() => {
    activeRef.current = true;
    startLoad();
    if (clonedScene) {
      runHoverAnimations(false);
    }
  }, [clonedScene, runHoverAnimations, startLoad]);

  const handlePointerEnter = (event) => {
    if (!shouldHandlePointer(event)) return;
    event.stopPropagation();
    setHovered(true);
    ensureHoverActive();
  };

  const handlePointerLeave = (event) => {
    event.stopPropagation();
    setHovered(false);
    if (!externallyHovered) {
      stopAndUnload();
    }
  };

  const handleClick = (event) => {
    event.stopPropagation();
    onSelect?.(landmark, getWorldPositionArray());
  };

  useEffect(() => {
    if (externallyHovered) {
      ensureHoverActive();
      return;
    }

    if (!hovered) {
      stopAndUnload();
    }
  }, [externallyHovered, hovered, ensureHoverActive, stopAndUnload]);

  if (!position) return null;

  return (
    <group ref={markerRef} position={position} onClick={handleClick}>
      <Billboard position={[0, labelY, 0]}>
        <mesh
          ref={registerLabelHitbox}
          onClick={handleClick}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <planeGeometry
            args={[LANDMARK_LABEL_HITBOX_WIDTH, LANDMARK_LABEL_HITBOX_HEIGHT]}
          />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        <Text
          color="#ffffff"
          fontSize={LANDMARK_LABEL_FONT_SIZE}
          maxWidth={2}
          anchorX="center"
          anchorY="middle"
          position={[0, 0, 0.01]}
          raycast={DISABLE_TEXT_RAYCAST}
        >
          {labelContent}
        </Text>
      </Billboard>

      {clonedScene && (
        <group ref={modelRef} scale={[0.0001, 0.0001, 0.0001]}>
          <primitive object={clonedScene} />
        </group>
      )}
    </group>
  );
}

export default LandmarkMarker;
