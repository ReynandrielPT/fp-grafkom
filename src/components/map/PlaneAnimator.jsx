import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { gsap } from "gsap";
import { TRANSPORT } from "../../config/mapConfig";
import { resolveAssetPath } from "../../utils/assets";

/**
 * PlaneAnimator Component
 * Animates a plane model flying from start to end position with a parabolic arc
 * 
 * @param {Array<number>} start - Starting position [x, y, z]
 * @param {Array<number>} end - Ending position [x, y, z]
 * @param {boolean} play - Trigger to start animation
 * @param {Function} onComplete - Callback when animation completes
 */
function PlaneAnimator({ start, end, play, onComplete }) {
  const ref = useRef();
  const { scene } = useGLTF(resolveAssetPath("model/plane.glb"));
  
  const cloned = useMemo(() => {
    if (!scene) return null;
    const c = scene.clone(true);
    // Remove animations to keep model static
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
    
    // Compute horizontal direction only to avoid pitching
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
      console.warn("PlaneAnimator: plane model not loaded yet");
      return;
    }

    const p = ref.current.position;
    const startY = typeof start[1] === "number" ? start[1] : TRANSPORT.TRAIN_Y_OFFSET;
    p.set(start[0], startY, start[2]);
    ref.current.scale.setScalar(TRANSPORT.PLANE_SCALE);

    const s = p.clone();
    const safeEndY = typeof end[1] === "number" ? end[1] : startY;
    const e = new Vector3(end[0], safeEndY, end[2]);
    targetRef.current.copy(e);

    const distance = s.distanceTo(e);
    const flyDuration = Math.max(distance / TRANSPORT.PLANE_SPEED, 1.5);
    
    const tl = gsap.timeline({
      onComplete: () => {
        if (ref.current) ref.current.visible = false;
        onComplete?.({ targetPos: end });
      },
    });

    tl.set(ref.current, { visible: true });

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
        
        // Horizontal lerp to avoid backward movement
        bezPos.lerpVectors(s, e, t);
        
        // Create gentle arc with quadratic bump
        const baseY = s.y * omt + e.y * t;
        const apexOffset = Math.max(s.y, e.y) + 0.6 - baseY;
        const arc = 4 * t * omt * apexOffset;
        bezPos.y = baseY + arc;
        p.copy(bezPos);

        // Forward direction: strictly horizontal
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
        // Ensure exact final position
        p.copy(e);
        targetRef.current.copy(e);
      },
    });

    return () => tl.kill();
  }, [play, start, end, onComplete, cloned]);

  if (!cloned) return null;

  return (
    <group ref={ref} visible={false} position={[0, -10, 0]}>
      <primitive object={cloned} />
    </group>
  );
}

export default PlaneAnimator;
