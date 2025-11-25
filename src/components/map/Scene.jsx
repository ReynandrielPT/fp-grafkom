import { Suspense, useEffect, useRef, useState, useMemo } from "react";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Vector3, Box3 } from "three";
import { gsap } from "gsap";
import {
  ORBIT_MIN_DISTANCE,
  ORBIT_MAX_DISTANCE,
  ORBIT_DAMPING_FACTOR,
} from "../const";
import IndonesiaMap from "./IndonesiaMap";
import LandmarkMarker from "./LandmarkMarker";
import ControlsTarget from "./ControlsTarget";

useGLTF.preload("/model/plane.glb");

function PlaneAnimator({ start, end, play, onComplete }) {
  const ref = useRef();
  const { scene, animations } = useGLTF("/model/plane.glb");
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
    } catch (err) {
      // ignore
    }
    return c;
  }, [scene, animations]);
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
    p.set(start[0], start[1], start[2]);
    // slightly larger initial base so the plane start is more visible
    const initialBase = 0.008;
    ref.current.scale.set(initialBase, initialBase, initialBase);

    console.log("PlaneAnimator: play", { start, end, initialBase });

    const s = p.clone();
    const e = new Vector3(end[0], end[1], end[2]);
    const mid = new Vector3().addVectors(s, e).multiplyScalar(0.5);
    // lower the apex so the plane doesn't climb too high — keep a gentle arc
    mid.y = Math.max(s.y, e.y) + 0.6;
    targetRef.current.copy(e);

    // lengthen flight so the whole animation plays slower and appears smoother
    const flyDuration = 4.5;
    const tl = gsap.timeline({
      onComplete: () => {
        if (ref.current) ref.current.visible = false;
        onComplete?.({ targetPos: end });
      },
    });

    // slightly bigger in-flight size, but still small
    const takeoffBase = 0.018;
    // landed size slightly larger so it's visible but still small
    const landedBase = 0.008;

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

        // compute scale based on flight progress so it grows in air and shrinks in air
        // piecewise: rise from initialBase -> takeoffBase, then fall to landedBase
        let curScale = initialBase;
        if (t <= 0.5) {
          const u = t / 0.5; // 0..1
          const eased = 0.5 - 0.5 * Math.cos(Math.PI * u); // cosine easeInOut
          curScale = initialBase * (1 - eased) + takeoffBase * eased;
        } else {
          const u = (t - 0.5) / 0.5; // 0..1
          const eased = 0.5 - 0.5 * Math.cos(Math.PI * u);
          curScale = takeoffBase * (1 - eased) + landedBase * eased;
        }
        ref.current.scale.set(curScale, curScale, curScale);

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

function Scene({
  landmarks,
  onLandmarkSelect,
  flyRequest,
  onPlaneAnimationComplete,
}) {
  const [mapBounds, setMapBounds] = useState(null);
  const controlsRef = useRef();
  const activeLandmarks = Array.isArray(landmarks) ? landmarks : [];
  const lastPosRef = useRef(null);
  const [planePlay, setPlanePlay] = useState(false);
  const [planeStart, setPlaneStart] = useState(null);
  const [planeEnd, setPlaneEnd] = useState(null);

  useEffect(() => {
    activeLandmarks.forEach((landmark) => {
      if (landmark?.modelUri) {
        useGLTF.preload(landmark.modelUri);
      }
    });
  }, [activeLandmarks]);

  useEffect(() => {
    if (!flyRequest) return;
    const { landmark, targetPos } = flyRequest;

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

    setPlaneStart(s);
    setPlaneEnd(e);
    setPlanePlay(true);
  }, [flyRequest, mapBounds, activeLandmarks, onPlaneAnimationComplete]);

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
