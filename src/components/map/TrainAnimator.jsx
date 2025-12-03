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
 * 
 * @param {Array<number>} start - Starting position [x, y, z]
 * @param {Array<number>} end - Ending position [x, y, z]
 * @param {boolean} play - Trigger to start animation
 * @param {Function} onComplete - Callback when animation completes
 */
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
    // Place train at constant ground Y
    p.set(start[0], TRANSPORT.TRAIN_Y_OFFSET, start[2]);
    ref.current.scale.setScalar(TRANSPORT.TRAIN_SCALE);

    const s = p.clone();
    const e = new Vector3(end[0], TRANSPORT.TRAIN_Y_OFFSET, end[2]);
    targetRef.current.copy(e);

    const pathLen = s.distanceTo(e);
    const duration = Math.max(pathLen / TRANSPORT.TRAIN_SPEED, 2.5);
    
    const tl = gsap.timeline({
      onComplete: () => {
        if (ref.current) ref.current.visible = false;
        onComplete?.({ targetPos: end });
      },
    });

    // Spawn rail segments along the path
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
          railClone.position.set(pos.x, TRANSPORT.TRAIN_Y_OFFSET - 0.02, pos.z);
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
        
        // Linear interpolation along ground (no parabola)
        bezPos.lerpVectors(s, e, t);
        bezPos.y = TRANSPORT.TRAIN_Y_OFFSET;
        p.copy(bezPos);

        // Update heading target to look ahead
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
        // Remove rails after train passes
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

export default TrainAnimator;
