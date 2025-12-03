import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { TRANSPORT } from "../config/mapConfig";
import { isTypingTarget } from "../utils/coordinateUtils";

const MOVEMENT_KEYS = new Set(["w", "a", "s", "d"]);

/**
 * Custom hook for WASD keyboard camera movement
 * @param {Object} controlsRef - Reference to OrbitControls
 * @returns {void}
 */
export function useKeyboardControls(controlsRef) {
  const pressedKeysRef = useRef(new Set());
  const moveVectorsRef = useRef({
    forward: new Vector3(),
    right: new Vector3(),
    move: new Vector3(),
    up: new Vector3(0, 1, 0),
  });

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

  useFrame((state, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;
    const pressed = pressedKeysRef.current;
    if (!pressed.size) return;

    const { forward, right, move, up } = moveVectorsRef.current;
    
    // Get camera forward direction
    state.camera.getWorldDirection(forward);
    forward.y = 0;
    if (forward.lengthSq() < 1e-6) {
      forward.set(0, 0, -1);
    } else {
      forward.normalize();
    }

    // Calculate right direction
    up.set(0, 1, 0);
    right.copy(forward).cross(up);
    right.y = 0;
    if (right.lengthSq() < 1e-6) {
      right.set(1, 0, 0);
    } else {
      right.normalize();
    }

    // Apply movement
    move.set(0, 0, 0);
    if (pressed.has("w")) move.add(forward);
    if (pressed.has("s")) move.sub(forward);
    if (pressed.has("d")) move.add(right);
    if (pressed.has("a")) move.sub(right);

    if (!move.lengthSq()) return;

    move.normalize().multiplyScalar(TRANSPORT.KEYBOARD_MOVE_SPEED * delta);
    state.camera.position.add(move);
    controls.target.add(move);
    controls.update();
  });
}

/**
 * Custom hook for managing transport animation state
 * @returns {Object} Animation state refs and helper functions
 */
export function useTransportAnimation() {
  const lastPosRef = useRef(null);
  const persistedInitRef = useRef(false);

  return {
    lastPosRef,
    persistedInitRef,
  };
}
