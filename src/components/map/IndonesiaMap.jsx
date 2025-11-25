import { useEffect, useMemo, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { Box3 } from 'three'

useGLTF.preload('/model/indonesia.glb')

function IndonesiaMap({ onBoundsReady }) {
  const groupRef = useRef()
  const { scene } = useGLTF('/model/indonesia.glb')
  const clonedScene = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    if (!groupRef.current) return
    const bounds = new Box3().setFromObject(groupRef.current)
    onBoundsReady?.(bounds.clone())
  }, [clonedScene, onBoundsReady])

  return <primitive ref={groupRef} object={clonedScene} />
}

export default IndonesiaMap
