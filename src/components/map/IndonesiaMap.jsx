import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3 } from "three";
import { INDONESIA_MAP } from "../../config/mapConfig";
import { resolveAssetPath } from "../../utils/assets";

useGLTF.preload(resolveAssetPath("model/indonesia.glb"));

/**
 * IndonesiaMap Component
 * Renders the 3D model of Indonesia and reports its boundaries
 * 
 * @param {Function} onBoundsReady - Callback with map boundaries once loaded
 */
function IndonesiaMap({ onBoundsReady }) {
  const groupRef = useRef();
  const { scene } = useGLTF(resolveAssetPath("model/indonesia.glb"));
  const clonedScene = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.rotation.set(...INDONESIA_MAP.ROTATION);
    cloned.scale.setScalar(INDONESIA_MAP.SCALE);
    return cloned;
  }, [scene]);

  useEffect(() => {
    if (!groupRef.current) return;
    const bounds = new Box3().setFromObject(groupRef.current);
    onBoundsReady?.(bounds.clone());
  }, [clonedScene, onBoundsReady]);

  return <primitive ref={groupRef} object={clonedScene} />;
}

export default IndonesiaMap;
