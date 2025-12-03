import { useMemo } from "react";
import { Vector3 } from "three";


function WaterPlane({ mapBounds }) {
  const { width, depth, position } = useMemo(() => {
    if (!mapBounds) {
      return { width: 1000, depth: 1000, position: [0, -0.5, 0] };
    }

    const size = new Vector3();
    const center = new Vector3();
    mapBounds.getSize(size);
    mapBounds.getCenter(center);

    const padding = 0.4; 
    const width = size.x * (1 + padding);
    const depth = size.z * (1 + padding);
    const yOffset = Math.max(size.y * 0.02, 0.3);

    return {
      width,
      depth,
      position: [center.x, mapBounds.min.y - yOffset, center.z],
    };
  }, [mapBounds]);

  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[width, depth, 64, 64]} />
      <meshStandardMaterial
        color="#0a2748"
        roughness={0.5}
        metalness={0.15}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
}

export default WaterPlane;
