import { Suspense, useEffect, useRef, useState, useMemo } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { gsap } from "gsap";
import {
  ORBIT_MIN_DISTANCE,
  ORBIT_MAX_DISTANCE,
  ORBIT_DAMPING_FACTOR,
  LANDMARK_GLOBAL_Y_OFFSET,
  PLANE_ANIMATION_SPEED,
  TRAIN_ANIMATION_SPEED,
  PLANE_MODEL_SCALE,
  TRAIN_MODEL_SCALE,
} from "../const";
import IndonesiaMap from "./IndonesiaMap";
import LandmarkMarker from "./LandmarkMarker";
import ControlsTarget from "./ControlsTarget";
import { resolveAssetPath } from "../../utils/assets";

useGLTF.preload(resolveAssetPath("model/plane.glb"));
useGLTF.preload(resolveAssetPath("model/train.glb"));
useGLTF.preload(resolveAssetPath("model/rail.glb"));
// constant Y (world units) to place train animation near the ground.
// Adjust this value if you want the train higher/lower above the map.
const TRAIN_Y = 0.2;
// Toggle rails visuals on/off. Set to `true` to re-enable rails later.
const RAILS_ENABLED = false;
const KEYBOARD_MOVE_SPEED = 6; // world units per second for WASD panning
const MOVEMENT_KEYS = new Set(["w", "a", "s", "d"]);

const isTypingTarget = (target) => {
  if (!target) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target?.isContentEditable
  );
};

function PlaneAnimator({ start, end, play, onComplete }) {
  const ref = useRef();
  const { scene } = useGLTF(resolveAssetPath("model/plane.glb"));
  const cloned = useMemo(() => {
    if (!scene) return null;
    // deep clone the scene
    const c = scene.clone(true);
    // remove any animation data on the clone and its children to keep the model static
    try {
      c.animations = [];
      c.traverse((node) => {
        if (node.animations && node.animations.length) node.animations = [];
      });
    } catch {
      // ignore
    }
    return c;
  }, [scene]);
  const targetRef = useRef(new Vector3());

  useFrame(() => {
    if (!ref.current || !targetRef.current) return;
    const pos = ref.current.position;
    const target = targetRef.current;
    // compute horizontal direction only to avoid pitching the plane up/down
    const dir = new Vector3().subVectors(target, pos);
    dir.y = 0;
    if (dir.lengthSq() > 1e-6) {
      const yaw = Math.atan2(dir.x, dir.z);
      // keep the plane level (no pitch), only rotate around Y axis
      ref.current.rotation.set(0, yaw, 0);
    }
  });

  useEffect(() => {
    if (!play || !ref.current || !start || !end) return;
    if (!cloned) {
      console.warn("PlaneAnimator: plane model not loaded yet");
      return;
    }

    const p = ref.current.position;
    const startY = typeof start[1] === "number" ? start[1] : TRAIN_Y;
    p.set(start[0], startY, start[2]);
    ref.current.scale.set(
      PLANE_MODEL_SCALE,
      PLANE_MODEL_SCALE,
      PLANE_MODEL_SCALE
    );

    const s = p.clone();
    const safeEndY = typeof end[1] === "number" ? end[1] : startY;
    const e = new Vector3(end[0], safeEndY, end[2]);
    targetRef.current.copy(e);

    const distance = s.distanceTo(e);
    const flyDuration = Math.max(distance / PLANE_ANIMATION_SPEED, 1.5);
    const tl = gsap.timeline({
      onComplete: () => {
        if (ref.current) ref.current.visible = false;
        onComplete?.({ targetPos: end });
      },
    });

    // reveal at the start (tiny), then fly — scale will be driven by flight progress for smooth grow/shrink
    tl.set(ref.current, { visible: true });

    // animate a single progress value t from 0 -> 1 and update the plane position each frame
    const flight = { t: 0 };
    const bezPos = new Vector3();
    const bezDir = new Vector3();

    tl.to(flight, {
      t: 1,
      duration: flyDuration,
      ease: "power1.inOut",
      onUpdate: () => {
        if (!ref.current) return;
        const t = flight.t;
        const omt = 1 - t;
        // horizontal lerp to avoid any backward movement in x/z
        bezPos.lerpVectors(s, e, t);
        // create a gentle arc in Y using a simple quadratic bump (4*t*(1-t)) scaled by apex offset
        const baseY = s.y * omt + e.y * t;
        const apexOffset = Math.max(s.y, e.y) + 0.6 - baseY;
        const arc = 4 * t * omt * apexOffset;
        bezPos.y = baseY + arc;
        p.copy(bezPos);

        // forward direction: strictly horizontal from start->end to keep heading stable
        bezDir.copy(e).sub(s);
        bezDir.y = 0;
        if (bezDir.lengthSq() > 1e-6) {
          bezDir.normalize().multiplyScalar(2);
          targetRef.current.copy(p).add(bezDir);
          targetRef.current.setY(p.y);
        } else {
          targetRef.current.copy(e).setY(p.y);
        }
      },
      onComplete: () => {
        // ensure exact final position to avoid tiny overshoot/reverse motion
        p.copy(e);
        targetRef.current.copy(e);
      },
    });

    // scale is handled during flight; no separate landing scale tween

    return () => tl.kill();
  }, [play, start, end, onComplete, cloned]);

  if (!cloned) return null;

  return (
    <group ref={ref} visible={false} position={[0, -10, 0]}>
      <primitive object={cloned} />
    </group>
  );
}

function TrainAnimator({ start, end, play, onComplete }) {
  const ref = useRef();
  const { scene } = useGLTF(resolveAssetPath("model/train.glb"));
  const { scene: railScene } = useGLTF(resolveAssetPath("model/rail.glb"));
  const [rails, setRails] = useState([]);
  const cloned = useMemo(() => {
    if (!scene) return null;
    const c = scene.clone(true);
    try {
      c.animations = [];
      c.traverse((node) => {
        if (node.animations && node.animations.length) node.animations = [];
      });
    } catch {
      // ignore
    }
    return c;
  }, [scene]);

  const targetRef = useRef(new Vector3());

  useFrame(() => {
    if (!ref.current || !targetRef.current) return;
    const pos = ref.current.position;
    const target = targetRef.current;
    const dir = new Vector3().subVectors(target, pos);
    dir.y = 0;
    if (dir.lengthSq() > 1e-6) {
      const yaw = Math.atan2(dir.x, dir.z);
      ref.current.rotation.set(0, yaw, 0);
    }
  });

  useEffect(() => {
    if (!play || !ref.current || !start || !end) return;
    if (!cloned) {
      console.warn("TrainAnimator: train model not loaded yet");
      return;
    }

    const p = ref.current.position;
    // place train at constant ground Y
    p.set(start[0], TRAIN_Y, start[2]);
    ref.current.scale.set(
      TRAIN_MODEL_SCALE,
      TRAIN_MODEL_SCALE,
      TRAIN_MODEL_SCALE
    );

    const s = p.clone();
    const e = new Vector3(end[0], TRAIN_Y, end[2]);
    targetRef.current.copy(e);

    const pathLen = s.distanceTo(e);
    const duration = Math.max(pathLen / TRAIN_ANIMATION_SPEED, 2.5);
    const tl = gsap.timeline({
      onComplete: () => {
        if (ref.current) ref.current.visible = false;
        onComplete?.({ targetPos: end });
      },
    });

    // spawn rail segments along the path before revealing the train
    try {
      if (RAILS_ENABLED && railScene) {
        const spacing = 1.6; // world units between rail pieces
        const count = Math.max(1, Math.floor(pathLen / spacing));
        const pieces = [];
        const dir = new Vector3().subVectors(e, s).normalize();
        const yaw = Math.atan2(dir.x, dir.z);
        for (let i = 0; i <= count; i++) {
          const t = i / Math.max(1, count);
          const pos = new Vector3().lerpVectors(s, e, t);
          const railClone = railScene.clone(true);
          railClone.position.set(pos.x, TRAIN_Y - 0.02, pos.z);
          railClone.rotation.set(0, yaw, 0);
          pieces.push(railClone);
        }
        setRails(pieces);
      }
    } catch (err) {
      console.warn("TrainAnimator: failed to spawn rails", err);
    }

    tl.set(ref.current, { visible: true });

    const flight = { t: 0 };
    const bezPos = new Vector3();
    const bezDir = new Vector3();

    tl.to(flight, {
      t: 1,
      duration,
      ease: "power1.inOut",
      onUpdate: () => {
        if (!ref.current) return;
        const t = flight.t;
        // linear interpolation along ground (no parabola)
        bezPos.lerpVectors(s, e, t);
        bezPos.y = TRAIN_Y;
        p.copy(bezPos);

        // update heading target to look ahead along the path
        bezDir.copy(e).sub(s);
        bezDir.y = 0;
        if (bezDir.lengthSq() > 1e-6) {
          bezDir.normalize().multiplyScalar(1.5);
          targetRef.current.copy(p).add(bezDir);
          targetRef.current.setY(p.y);
        } else {
          targetRef.current.copy(e).setY(p.y);
        }
      },
      onComplete: () => {
        p.copy(e);
        targetRef.current.copy(e);
        // remove rails after train passes (only if rails were enabled)
        if (RAILS_ENABLED) setRails([]);
      },
    });

    return () => {
      tl.kill();
      if (RAILS_ENABLED) setRails([]);
    };
  }, [play, start, end, onComplete, cloned, railScene]);

  if (!cloned) return null;

  return (
    <group ref={ref} visible={false} position={[0, -10, 0]}>
      <primitive object={cloned} />
      {rails.map((r, i) => (
        <primitive key={i} object={r} />
      ))}
    </group>
  );
}

function Scene({
  landmarks,
  onLandmarkSelect,
  flyRequest,
  onPlaneAnimationComplete,
  hoveredLandmarkId,
}) {
  const [mapBounds, setMapBounds] = useState(null);
  const controlsRef = useRef();
  const activeLandmarks = useMemo(
    () => (Array.isArray(landmarks) ? landmarks : []),
    [landmarks]
  );
  const pressedKeysRef = useRef(new Set());
  const moveVectorsRef = useRef({
    forward: new Vector3(),
    right: new Vector3(),
    move: new Vector3(),
    up: new Vector3(0, 1, 0),
  });
  const lastPosRef = useRef(null);
  const persistedInitRef = useRef(false);
  const [planePlay, setPlanePlay] = useState(false);
  const [planeStart, setPlaneStart] = useState(null);
  const [planeEnd, setPlaneEnd] = useState(null);
  const [trainPlay, setTrainPlay] = useState(false);
  const [trainStart, setTrainStart] = useState(null);
  const [trainEnd, setTrainEnd] = useState(null);

  useEffect(() => {
    activeLandmarks.forEach((landmark) => {
      if (landmark?.modelUri) {
        useGLTF.preload(landmark.modelUri);
      }
    });
  }, [activeLandmarks]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key?.toLowerCase();
      if (!MOVEMENT_KEYS.has(key)) return;
      if (isTypingTarget(event.target)) return;
      event.preventDefault();
      pressedKeysRef.current.add(key);
    };

    const handleKeyUp = (event) => {
      const key = event.key?.toLowerCase();
      if (!MOVEMENT_KEYS.has(key)) return;
      pressedKeysRef.current.delete(key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // when map bounds are ready, set the initial plane position to Monas
  useEffect(() => {
    if (!mapBounds || persistedInitRef.current) return;
    // find Monas landmark
    const monas = activeLandmarks.find(
      (l) =>
        l?.id?.toLowerCase().startsWith("monas") ||
        String(l?.modelUri ?? "")
          .toLowerCase()
          .includes("monas")
    );
    if (!monas) return;

    // coordinate bounds (same as LandmarkMarker)
    const COORDINATE_BOUNDS = {
      latMin: -11,
      latMax: 6,
      lonMin: 95,
      lonMax: 141,
    };

    const width = mapBounds.max.x - mapBounds.min.x;
    const depth = mapBounds.max.z - mapBounds.min.z;
    const longitudeRatio =
      (monas.longitude - COORDINATE_BOUNDS.lonMin) /
      (COORDINATE_BOUNDS.lonMax - COORDINATE_BOUNDS.lonMin);
    const latitudeRatio =
      (monas.latitude - COORDINATE_BOUNDS.latMin) /
      (COORDINATE_BOUNDS.latMax - COORDINATE_BOUNDS.latMin);

    const clampedLonRatio = Math.max(0, Math.min(1, longitudeRatio));
    const clampedLatRatio = Math.max(0, Math.min(1, latitudeRatio));

    const x = mapBounds.min.x + clampedLonRatio * width;
    const z = mapBounds.max.z - clampedLatRatio * depth + (monas.zIndex ?? 0);
    const y =
      mapBounds.min.y +
      (mapBounds.max.y - mapBounds.min.y) * 0.01 +
      LANDMARK_GLOBAL_Y_OFFSET;

    lastPosRef.current = [x, y, z];
    persistedInitRef.current = true;
  }, [mapBounds, activeLandmarks]);

  useEffect(() => {
    if (!flyRequest) return;
    const { landmark, targetPos, originLandmark } = flyRequest;

    const start = lastPosRef.current;

    // If this is the very first flight (no last position), prefer a start
    // point to the left of the clicked landmark (targetPos). Do NOT set
    // lastPosRef here — let the onComplete handler set it to the landed
    // position so subsequent flights use the previous click.
    let landmarkLeftStart = null;
    if (!start && targetPos) {
      const LEFT_OFFSET = 3; // world units to the left
      const HEIGHT_OFFSET = 2.5; // height above the landmark for smoother arc
      landmarkLeftStart = [
        targetPos[0] - LEFT_OFFSET,
        targetPos[1] + HEIGHT_OFFSET,
        targetPos[2],
      ];
    }
    if (
      lastPosRef.current &&
      targetPos &&
      Math.abs(lastPosRef.current[0] - targetPos[0]) < 0.001 &&
      Math.abs(lastPosRef.current[1] - targetPos[1]) < 0.001 &&
      Math.abs(lastPosRef.current[2] - targetPos[2]) < 0.001
    ) {
      // immediate callback
      onPlaneAnimationComplete?.({ targetPos });
      return;
    }

    const fallbackStart = targetPos
      ? [targetPos[0] - 3, targetPos[1] + 2.5, targetPos[2] - 3]
      : [0, 2.5, 0];
    const s = start || landmarkLeftStart || fallbackStart;
    const e = targetPos || [0, 0, 0];

    // decide whether to use train animator (same island) or plane (different islands)
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
  }, [flyRequest, mapBounds, activeLandmarks, onPlaneAnimationComplete]);

  useFrame((state, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;
    const pressed = pressedKeysRef.current;
    if (!pressed.size) return;

    const { forward, right, move, up } = moveVectorsRef.current;
    state.camera.getWorldDirection(forward);
    forward.y = 0;
    if (forward.lengthSq() < 1e-6) {
      forward.set(0, 0, -1);
    } else {
      forward.normalize();
    }

    up.set(0, 1, 0);
    right.copy(forward).cross(up);
    right.y = 0;
    if (right.lengthSq() < 1e-6) {
      right.set(1, 0, 0);
    } else {
      right.normalize();
    }

    move.set(0, 0, 0);
    if (pressed.has("w")) move.add(forward);
    if (pressed.has("s")) move.sub(forward);
    if (pressed.has("d")) move.add(right);
    if (pressed.has("a")) move.sub(right);

    if (!move.lengthSq()) return;

    move.normalize().multiplyScalar(KEYBOARD_MOVE_SPEED * delta);
    state.camera.position.add(move);
    controls.target.add(move);
    controls.update();
  });

  return (
    <>
      <color attach="background" args={[0.04, 0.07, 0.12]} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[8, 12, 6]}
        intensity={0.8}
        // shadows disabled for better performance
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
          onComplete={(res) => {
            if (res?.targetPos) lastPosRef.current = res.targetPos;
            setPlanePlay(false);
            onPlaneAnimationComplete?.(res);
          }}
        />
        <TrainAnimator
          start={trainStart}
          end={trainEnd}
          play={trainPlay}
          onComplete={(res) => {
            if (res?.targetPos) lastPosRef.current = res.targetPos;
            setTrainPlay(false);
            onPlaneAnimationComplete?.(res);
          }}
        />
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
