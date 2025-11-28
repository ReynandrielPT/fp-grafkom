import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { MONUMENT_PREVIEW } from "../../config/mapConfig";

/**
 * MonasPreviewModel Component
 * Renders a cloned 3D model for preview display
 * 
 * @param {string} modelUri - Path to the 3D model file
 * @param {number} modelScale - Scale multiplier for the model
 * @param {Array<number>} modelPosition - Position [x, y, z] for the model
 */
function MonasPreviewModel({
  modelUri,
  modelScale = MONUMENT_PREVIEW.MODEL_SCALE,
  modelPosition = MONUMENT_PREVIEW.MODEL_POSITION,
}) {
  const { scene } = useGLTF(modelUri);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  return (
    <primitive
      object={clonedScene}
      scale={modelScale}
      position={modelPosition}
    />
  );
}

export default MonasPreviewModel;
