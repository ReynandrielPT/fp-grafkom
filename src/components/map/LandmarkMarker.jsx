import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Billboard, Text, useCursor, useGLTF } from "@react-three/drei";
import gsap from "gsap";
import { Box3, MathUtils, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { LANDMARK, COORDINATE_BOUNDS } from "../../config/mapConfig";
// import { Billboard, Text, useCursor, useGLTF } from "@react-three/drei"; // Tambah useGLTF
import { useFrame } from "@react-three/fiber";

const DISABLE_TEXT_RAYCAST = () => null;

const IDLE_ANIMATION = {
  FLOAT_SPEED: 2,
  FLOAT_AMPLITUDE: 0.05,
  HIDE_DISTANCE: 15,
  FADE_START_DISTANCE: 100,
  BASE_SCALE: 1,
  BASE_HEIGHT: 0.3,
};

/**
 * LandmarkMarker Component
 * Renders a 3D marker with label for a landmark on the map
 * Shows model on hover with smooth animations
 *
 * @param {Object} mapBounds - Map boundaries for positioning
 * @param {Object} landmark - Landmark data object
 * @param {Function} onSelect - Callback when landmark is clicked
 * @param {number} index - Display index for the marker
 * @param {boolean} externallyHovered - Whether marker is hovered from external source
 */
function LandmarkMarker({
  mapBounds,
  landmark,
  onSelect,
  index,
  externallyHovered = false,
  onModelReady,
}) {
  const markerRef = useRef();
  const modelRef = useRef();

  const pinRef = useRef();
  // const { scene: pinScene } = useGLTF("model/3d_location.glb");
  // const pinClone = useMemo(() => pinScene.clone(), [pinScene]);

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
    return LANDMARK.DEFAULT_SCALE;
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
              Object.values(mat).forEach((value) => {
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
      (landmark.longitude - COORDINATE_BOUNDS.LON_MIN) /
      (COORDINATE_BOUNDS.LON_MAX - COORDINATE_BOUNDS.LON_MIN);
    const latitudeRatio =
      (landmark.latitude - COORDINATE_BOUNDS.LAT_MIN) /
      (COORDINATE_BOUNDS.LAT_MAX - COORDINATE_BOUNDS.LAT_MIN);

    const clampedLonRatio = MathUtils.clamp(longitudeRatio, 0, 1);
    const clampedLatRatio = MathUtils.clamp(latitudeRatio, 0, 1);

    const x = mapBounds.min.x + clampedLonRatio * width;
    const z =
      mapBounds.max.z - clampedLatRatio * depth + (landmark.zIndex ?? 0);
    const y =
      mapBounds.min.y +
      (mapBounds.max.y - mapBounds.min.y) * 0.01 +
      LANDMARK.GLOBAL_Y_OFFSET;

    return [x, y, z];
  }, [landmark.latitude, landmark.longitude, landmark.zIndex, mapBounds]);

  const labelY = LANDMARK.LABEL_HEIGHT;

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

  const runHoverAnimations = useCallback(
    (resetScale = false) => {
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
    },
    [objectScale]
  );

  // When a cloned scene appears, run its intro animation (scale up + start rotation)
  useLayoutEffect(() => {
    if (!clonedScene || !hoverActive) return;

    runHoverAnimations(true);
    // notify parent that this landmark's model is ready/visible
    try {
      onModelReady?.(landmark);
    } catch {}
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

  useFrame((state) => {
    if (!pinRef.current) return;

    if (hoverActive) {
      pinRef.current.visible = false;
      return;
    }

    const currentPos = new Vector3(position[0], position[1], position[2]);
    const distance = state.camera.position.distanceTo(currentPos);

    if (distance > IDLE_ANIMATION.HIDE_DISTANCE) {
      pinRef.current.visible = false;
      return;
    }

    pinRef.current.visible = true;

    const time = state.clock.elapsedTime;
    const offset = index * 0.5; // Agar tidak barengan semua

    const floatY =
      Math.sin((time + offset) * IDLE_ANIMATION.FLOAT_SPEED) *
      IDLE_ANIMATION.FLOAT_AMPLITUDE;

    pinRef.current.position.y = floatY + IDLE_ANIMATION.BASE_HEIGHT;

    let scale = 1;
    if (distance > IDLE_ANIMATION.FADE_START_DISTANCE) {
      scale = MathUtils.mapLinear(
        distance,
        IDLE_ANIMATION.FADE_START_DISTANCE,
        IDLE_ANIMATION.HIDE_DISTANCE,
        1,
        0
      );
      // scale = MathUtils.mapLinear(
      //       distance, IDLE_ANIMATION.FADE_START_DISTANCE, IDLE_ANIMATION.HIDE_DISTANCE, 1, 0
      // );
    }
    // scale = Math.max(0, scale);
    pinRef.current.scale.setScalar(
      Math.max(0, scale) * IDLE_ANIMATION.BASE_SCALE
    );
    // pinRef.current.scale.setScalar(IDLE_ANIMATION.BASE_SCALE);
    // pinRef.current.scale.setScalar(Math.max(0, scale));
  });

  if (!position) return null;

  return (
    <group ref={markerRef} position={position} onClick={handleClick}>
      <mesh
        ref={registerLabelHitbox}
        position={[0, 0.3, 0]}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          wireframe={false}
          depthWrite={false}
        />
      </mesh>

      {!clonedScene && (
        <group ref={pinRef}>
          {/* Billboard: Agar lingkaran selalu menghadap user */}
          <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
            {/* 1. Lingkaran Hitam Transparan */}
            <mesh position={[0, 0, 0]}>
              {/* Radius 0.5 (cukup besar), Segments 32 (halus) */}
              <circleGeometry args={[0.05, 32]} />
              <meshBasicMaterial
                color="#000000"
                transparent
                opacity={0.6}
                depthTest={false}
                depthWrite={false}
              />
            </mesh>

            <mesh position={[0, 0, 0]} renderOrder={1}>
              {/* args: [innerRadius, outerRadius, segments]
                  inner: 0.05 (sama kayak lingkaran hitam)
                  outer: 0.055 (lebih besar sedikit untuk ketebalan garis)
               */}
              <ringGeometry args={[0.05, 0.055, 32]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.8}
                depthTest={false}
                depthWrite={false}
                side={2} // DoubleSide agar aman
              />
            </mesh>

            {/* 2. Teks Angka Putih */}
            <Text
              position={[0, 0, 0]} // Sedikit di depan lingkaran
              fontSize={0.05}
              fontWeight="bold"
              color="white"
              anchorX="center"
              anchorY="middle"
              renderOrder={2}
              depthTest={false}
              depthWrite={false}
            >
              {index + 1}
            </Text>
          </Billboard>
        </group>
      )}
      {clonedScene && (
        <group ref={modelRef} scale={[0.0001, 0.0001, 0.0001]}>
          <primitive object={clonedScene} />
        </group>
      )}
    </group>
  );
}

export default LandmarkMarker;
