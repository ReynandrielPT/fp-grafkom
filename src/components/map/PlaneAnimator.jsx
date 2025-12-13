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
 */
function PlaneAnimator({ start, end, play, onComplete }) {
  const ref = useRef();
  const { scene } = useGLTF(resolveAssetPath("model/plane.glb"));
  
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

  // Rotate plane to face direction of travel
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

    const startPos = new Vector3(...start);
    const endPos = new Vector3(...end);
    const distance = startPos.distanceTo(endPos);
    const duration = Math.max(distance / TRANSPORT.PLANE_SPEED, 1.5);

    ref.current.position.copy(startPos);
    ref.current.scale.setScalar(TRANSPORT.PLANE_SCALE);
    ref.current.visible = true;

    stateRef.current.isAnimating = true;

    const tl = gsap.timeline({
      onComplete: () => {
        stateRef.current.isAnimating = false;
        ref.current.visible = false;
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
        const omt = 1 - t;

        // Horizontal interpolation
        bezPos.lerpVectors(startPos, endPos, t);

        // Parabolic arc
        const baseY = startPos.y * omt + endPos.y * t;
        const apexOffset = Math.max(startPos.y, endPos.y) + 0.6 - baseY;
        const arc = 4 * t * omt * apexOffset;
        bezPos.y = baseY + arc;

        ref.current.position.copy(bezPos);

        // Update look target (ahead in direction of travel)
        const dir = new Vector3().subVectors(endPos, startPos);
        dir.normalize().multiplyScalar(2);
        stateRef.current.lookTarget.copy(bezPos).add(dir);
        stateRef.current.lookTarget.y = bezPos.y;
      },
    });
  }, [play, cloned, start, end, onComplete]);

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
    </group>
  );
}

export default PlaneAnimator;
