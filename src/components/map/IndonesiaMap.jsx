import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3 } from "three";
import { INDONESIA_MAP_ROTATION, INDONESIA_MAP_SCALE } from "../const";
import { resolveAssetPath } from "../../utils/assets";

useGLTF.preload(resolveAssetPath("model/indonesia.glb"));

function IndonesiaMap({ onBoundsReady }) {
  const groupRef = useRef();
  const { scene } = useGLTF(resolveAssetPath("model/indonesia.glb"));
  const clonedScene = useMemo(() => {
    const cloned = scene.clone(true);
    cloned.rotation.set(...INDONESIA_MAP_ROTATION);
    cloned.scale.set(
      INDONESIA_MAP_SCALE,
      INDONESIA_MAP_SCALE,
      INDONESIA_MAP_SCALE
    );
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
