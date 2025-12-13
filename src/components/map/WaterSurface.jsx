import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import {
  PlaneGeometry,
  RepeatWrapping,
  Vector3,
  NormalBlending,
  Color,
} from "three";
import { Water } from "three/examples/jsm/objects/Water.js";

const WATER_NORMALS_URL =
  "https://threejs.org/examples/textures/waternormals.jpg";
const SUN_DIRECTION = new Vector3(0.6, 1, 0.4);

/**
 * WaterSurface Component
 * Wraps the three.js Water implementation sized to Indonesia's bounds
 */
function WaterSurface({ mapBounds }) {
  const waterNormals = useTexture(WATER_NORMALS_URL);
  waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping;

  const { width, depth, center, positionY } = useMemo(() => {
    if (!mapBounds) {
      return {
        width: 1000,
        depth: 1000,
        center: new Vector3(0, 0, 0),
        positionY: -0.5,
      };
    }

    const size = new Vector3();
    const center = new Vector3();
    mapBounds.getSize(size);
    mapBounds.getCenter(center);

    const expansion = 2.5;
    const width = Math.max(size.x * expansion, 1200);
    const depth = Math.max(size.z * expansion, 1200);
    // Align the water base with the map's base
    const positionY = mapBounds.min.y;

    return { width, depth, center, positionY };
  }, [mapBounds]);

  const waterGeometry = useMemo(
    () => new PlaneGeometry(width, depth, 256, 256),
    [width, depth]
  );

  const water = useMemo(() => {
    const instance = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: SUN_DIRECTION.clone().normalize(),
      // Use a neutral/cool sun color to avoid brown tint
      sunColor: 0xd6ecff,
      // Warm, blueish water color
      waterColor: "#0bdee6",
      distortionScale: 0.08,
      fog: true,
    });
    instance.rotation.x = -Math.PI / 2;
    instance.position.set(center.x, positionY, center.z);
    instance.receiveShadow = false;
    instance.castShadow = false;

    const { material } = instance;
    if (material) {
      if (material.uniforms) {
        const uniforms = material.uniforms;
        if (uniforms.alpha) uniforms.alpha.value = 1;
        if (uniforms.sunColor) {
          const sunUniform = uniforms.sunColor.value;
          if (sunUniform instanceof Color) {
            sunUniform.set(0xd6ecff);
          } else {
            uniforms.sunColor.value = 0xd6ecff;
          }
        }
        if (uniforms.distortionScale) uniforms.distortionScale.value = 0.08;
        if (uniforms.reflectivity) uniforms.reflectivity.value = 0.2;
      }
      material.transparent = false;
      material.opacity = 1;
      material.blending = NormalBlending;
      material.depthWrite = true;
    }

    return instance;
  }, [waterGeometry, waterNormals, center, positionY]);

  useFrame((_, delta) => {
    if (water && water.material?.uniforms?.time) {
      water.material.uniforms.time.value += delta * 0.08;
    }
  });

  return water ? <primitive object={water} /> : null;
}

export default WaterSurface;
