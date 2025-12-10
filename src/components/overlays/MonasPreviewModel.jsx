import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import Annotation from "./Annotation";

function MonasPreviewModel({
  modelUri,
  modelScale = 1, 
  modelPosition = [0, 0, 0],
  annotations = [], 
  activeId, 
  onSelectAnnotation, 
}) {
  const { scene } = useGLTF(modelUri);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  return (
    // PENTING: Scale di group agar Anotasi ikut membesar/mengecil bareng model
    <group scale={modelScale} position={modelPosition}>
      <primitive object={clonedScene} />
      
      {annotations.map((anno, index) => {
        const currentId = anno.id || index;
        return (
          <Annotation
            key={currentId}
            id={currentId}
            number={index + 1}
            position={anno.position}
            title={anno.title}
            description={anno.description}
            isOpen={activeId === currentId} 
            onSelect={onSelectAnnotation}
          />
        );
      })}
    </group>
  );
}

export default MonasPreviewModel;