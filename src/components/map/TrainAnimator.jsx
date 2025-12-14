import { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { gsap } from "gsap";
import { TRANSPORT } from "../../config/mapConfig";
import { resolveAssetPath } from "../../utils/assets";

// Toggle rails visual display
const RAILS_ENABLED = false;

/**
 * TrainAnimator Component
 * Animates a train model traveling from start to end position along ground level
 */
function TrainAnimator({ start, end, play, onComplete }) {
  const ref = useRef();
  const { scene } = useGLTF(resolveAssetPath("model/train.glb"));
  const { scene: railScene } = useGLTF(resolveAssetPath("model/rail.glb"));
  const [rails, setRails] = useState([]);
  
  // Store callbacks and state
  const stateRef = useRef({
    timeline: null,
    isAnimating: false,
    lookTarget: new Vector3(),
  });
  
  // Memoize cloned model once
  const cloned = useMemo(() => {
    if (!scene) return null;
    const c = scene.clone(true);
    c.animations = [];
    c.traverse((node) => {
      if (node.animations) node.animations = [];
    });
    return c;
  }, [scene]);

  // Rotate train to face direction of travel
  useFrame(() => {
    if (!ref.current || !stateRef.current.isAnimating) return;
    
    const pos = ref.current.position;
    const target = stateRef.current.lookTarget;
    const dir = new Vector3().subVectors(target, pos);
    dir.y = 0; // Only horizontal rotation
    
    if (dir.lengthSq() > 1e-6) {
      const yaw = Math.atan2(dir.x, dir.z);
      ref.current.rotation.y = yaw;
    }
  });

  // Main animation effect
  useEffect(() => {
    if (!play || !cloned || !start || !end || !ref.current) {
      return;
    }

    // Kill existing animation
    if (stateRef.current.timeline) {
      stateRef.current.timeline.kill();
    }

    const startPos = new Vector3(start[0], TRANSPORT.TRAIN_Y_OFFSET, start[2]);
    const endPos = new Vector3(end[0], TRANSPORT.TRAIN_Y_OFFSET, end[2]);
    const distance = startPos.distanceTo(endPos);
    const duration = Math.max(distance / TRANSPORT.TRAIN_SPEED, 1.7);

    ref.current.position.copy(startPos);
    ref.current.scale.setScalar(TRANSPORT.TRAIN_SCALE);
    ref.current.visible = true;

    stateRef.current.isAnimating = true;

    // Spawn rails if enabled
    if (RAILS_ENABLED && railScene) {
      try {
        const spacing = 1.6;
        const count = Math.max(1, Math.floor(distance / spacing));
        const pieces = [];
        const dir = new Vector3().subVectors(endPos, startPos).normalize();
        const yaw = Math.atan2(dir.x, dir.z);

        for (let i = 0; i <= count; i++) {
          const t = i / Math.max(1, count);
          const pos = new Vector3().lerpVectors(startPos, endPos, t);
          const railClone = railScene.clone(true);
          railClone.position.set(pos.x, TRANSPORT.TRAIN_Y_OFFSET - 0.02, pos.z);
          railClone.rotation.y = yaw;
          pieces.push(railClone);
        }
        setRails(pieces);
      } catch (err) {
        console.warn("TrainAnimator: failed to spawn rails", err);
      }
    }

    const tl = gsap.timeline({
      onComplete: () => {
        stateRef.current.isAnimating = false;
        ref.current.visible = false;
        if (RAILS_ENABLED) setRails([]);
        onComplete?.({ targetPos: end });
      },
    });

    stateRef.current.timeline = tl;

    const animState = { t: 0 };
    const bezPos = new Vector3();

    tl.to(animState, {
      t: 1,
      duration,
      ease: "power1.inOut",
      onUpdate: () => {
        const t = animState.t;

        // Linear interpolation along ground (no arc for train)
        bezPos.lerpVectors(startPos, endPos, t);
        ref.current.position.copy(bezPos);

        // Update look target (ahead in direction of travel)
        const dir = new Vector3().subVectors(endPos, startPos);
        dir.normalize().multiplyScalar(1.5);
        stateRef.current.lookTarget.copy(bezPos).add(dir);
        stateRef.current.lookTarget.y = bezPos.y;
      },
    });
  }, [play, cloned, railScene, start, end, onComplete]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (stateRef.current.timeline) {
        stateRef.current.timeline.kill();
      }
    };
  }, []);

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

export default TrainAnimator;
