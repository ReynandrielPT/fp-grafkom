import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  memo,
} from "react";
import { Billboard, Text, useCursor } from "@react-three/drei";
import gsap from "gsap";
import { Box3, MathUtils, Vector3, Shape } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { LANDMARK, COORDINATE_BOUNDS } from "../../config/mapConfig";
import { useFrame } from "@react-three/fiber";

// const DISABLE_TEXT_RAYCAST = () => null;

const IDLE_ANIMATION = {
  FLOAT_SPEED: 2,
  FLOAT_AMPLITUDE: 0.05,
  HIDE_DISTANCE: 15,
  FADE_START_DISTANCE: 100,
  BASE_SCALE: 1.5,
  BASE_HEIGHT: 0.1,
};

// Shared loader instance for better memory management
const sharedLoader = new GLTFLoader();

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
  const groundTargetRef = useRef();

  const [hovered, setHovered] = useState(false);
  const hoverActive = hovered || externallyHovered;
  useCursor(hoverActive);
  
  // Store callbacks in refs to prevent effect re-triggers
  const onSelectRef = useRef(onSelect);
  const onModelReadyRef = useRef(onModelReady);
  
  // Update refs in effect to avoid React strict mode warnings
  useEffect(() => {
    onSelectRef.current = onSelect;
    onModelReadyRef.current = onModelReady;
  });

  // ini bentuk arrow dari pin point di dasar
  const arrowShape = useMemo(() => {
    const s = new Shape();
    const w = 0.012; 
    const h = 0.03;  
    const indent = 0.01; 

    s.moveTo(0, h);           
    s.lineTo(w, 0);           
    s.lineTo(0, indent);      
    s.lineTo(-w, 0);          
    s.lineTo(0, h);           
    
    return s;
  }, []);

  // State for the loaded/cloned scene (loaded on hover)
  const [clonedScene, setClonedScene] = useState(null);
  const loadingRef = useRef(false);
  // track whether the current load should be applied (cancel on pointer out)
  const activeRef = useRef(false);
  // store active animations so we can kill them when needed
  const hoverTweenRef = useRef(null);
  const rotationTweenRef = useRef(null);

  const objectScale = useMemo(() => {
    // Prefer explicit mapScale for in-map display; fall back to legacy scale; else default
    const manualMapScale = Number(landmark?.mapScale);
    if (Number.isFinite(manualMapScale) && manualMapScale > 0)
      return manualMapScale;
    const legacyScale = Number(landmark?.scale);
    if (Number.isFinite(legacyScale) && legacyScale > 0) return legacyScale;
    return LANDMARK.DEFAULT_SCALE;
  }, [landmark?.mapScale, landmark?.scale]);

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
    const z = mapBounds.max.z - clampedLatRatio * depth + (landmark.zIndex ?? 0);
    const y = mapBounds.min.y + LANDMARK.GLOBAL_Y_OFFSET;

    return [x, y, z];
  }, [landmark.latitude, landmark.longitude, landmark.zIndex, mapBounds]);

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
    
    sharedLoader.load(
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
          const center = box.getCenter(new Vector3());
          
          // Center horizontally (X and Z)
          clone.position.x -= center.x;
          clone.position.z -= center.z;
          
          // Normalize height - translate so lowest point sits at Y=0 (ground level)
          // This ensures all models sit at the same baseline regardless of their internal structure
          clone.position.y -= box.min.y;
          
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
      onModelReadyRef.current?.(landmark);
    } catch {}
  }, [clonedScene, hoverActive, runHoverAnimations, landmark]);

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
    onSelectRef.current?.(landmark, getWorldPositionArray());
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
    if (!pinRef.current || !groundTargetRef.current) return;

    if (hoverActive) {
      pinRef.current.visible = false;
      groundTargetRef.current.visible = false;
      return;
    }

    const currentPos = new Vector3(position[0], position[1], position[2]);
    const distance = state.camera.position.distanceTo(currentPos);

    if (distance > IDLE_ANIMATION.HIDE_DISTANCE) {
      pinRef.current.visible = false;
      groundTargetRef.current.visible = false;
      return;
    }

    pinRef.current.visible = true;
    groundTargetRef.current.visible = true;

    const time = state.clock.elapsedTime;
    const offset = index * 0.5; 
    const waveValue = Math.sin((time + offset) * IDLE_ANIMATION.FLOAT_SPEED);

    const pinAmplitude = 0.001;
    const floatY = waveValue * pinAmplitude;
    const floatYPin = waveValue * IDLE_ANIMATION.FLOAT_AMPLITUDE;
    pinRef.current.position.y = floatYPin + IDLE_ANIMATION.BASE_HEIGHT;
    groundTargetRef.current.position.y = floatY + IDLE_ANIMATION.BASE_HEIGHT - 0.155;

    const targetRadius = MathUtils.mapLinear(waveValue, 1, -1, 0.05, 0.045);

    const targetOpacity = MathUtils.mapLinear(
      waveValue, 
      -1, 1,    
      1, 0.3  
    );


    let distFactor = 1;
    if (distance > IDLE_ANIMATION.FADE_START_DISTANCE) {
      distFactor = MathUtils.mapLinear(
        distance,
        IDLE_ANIMATION.FADE_START_DISTANCE,
        IDLE_ANIMATION.HIDE_DISTANCE,
        1,
        0
      );
    }
    const finalOpacity = targetOpacity * Math.max(0, distFactor);


    groundTargetRef.current.children.forEach((rotGroup) => {
      const mesh = rotGroup.children[0];
      if (mesh) {
        mesh.position.y = targetRadius;
        if (mesh.material) mesh.material.opacity = finalOpacity;
      }
    });

    groundTargetRef.current.rotation.z -= 0.002;
  });

  if (!position) return null;

  return (
    <group ref={markerRef} position={position} onClick={handleClick}>
      <mesh
        ref={registerLabelHitbox}
        position={[0, 0.1, 0]}
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

      <group 
        ref={groundTargetRef} 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.06, 0]} // Sedikit di atas tanah
      >
        {/* {[0, 1, 2].map((i) => (
          <group key={i} rotation={[0, 0, (i * 2 * Math.PI) / 3]}>
            
            <mesh position={[0, 0.1, 0]} rotation={[0, 0, Math.PI]}>
              <shapeGeometry args={[arrowShape]} />
              <meshBasicMaterial 
                color="#ffffff" 
                transparent 
                opacity={0.5} 
                side={2} // DoubleSide
                depthWrite={false}
              />
            </mesh>
            
          </group>
        ))} */}
        <mesh ref={groundTargetRef} position={[0, 0, 0]}>
          <circleGeometry args={[0.01, 32]} />
          <meshBasicMaterial
            color="#FF0000"
            transparent
            opacity={1}
            depthTest={false}
            depthWrite={false}
          />
        </mesh>

      </group>

      {!clonedScene && (
        <group ref={pinRef}>
          <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
            <mesh position={[0, 0, 0]}>
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
              <ringGeometry args={[0.05, 0.055, 32]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.8}
                depthTest={false}
                depthWrite={false}
                side={2} // DoubleSide
              />
            </mesh>

            <Text
              position={[0, 0, 0]} 
              fontSize={0.05}
              fontWeight="bold"
              color="white"
              anchorX="center"
              anchorY="middle"
              renderOrder={2}
              depthTest={false}
              depthWrite={false}
            >
              {labelContent}
            </Text>
          </Billboard>
        </group>
      )}
      {clonedScene && (
        <group 
          ref={modelRef} 
          position={[
            (landmark.objectPosition?.[0] || 0),
            0.15 + (landmark.objectPosition?.[1] || 0),
            (landmark.objectPosition?.[2] || 0)
          ]} 
          scale={[0.0001, 0.0001, 0.0001]}
        >
          <primitive object={clonedScene} />
        </group>
      )}
    </group>
  );
}

export default LandmarkMarker;