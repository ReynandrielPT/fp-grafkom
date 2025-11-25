import { Canvas } from '@react-three/fiber'
import Scene from './Scene'

const DEFAULT_LANDMARKS = [
  {
    id: 'monas',
    name: 'Monumen Nasional',
    modelUri: '/model/monas.glb',
    latitude: -6.2088,
    longitude: 106.8456,
    scale: 0.05,
    zIndex: 0
  }
]

function IndonesiaCanvas({ className = 'w-full h-full', landmarks = DEFAULT_LANDMARKS, onLandmarkSelect }) {
  const containerClassName = ['relative', className].filter(Boolean).join(' ')

  return (
    <div className={containerClassName}>
      <Canvas camera={{ position: [0, 10, 12], fov: 20 }}>
        <Scene landmarks={landmarks} onLandmarkSelect={onLandmarkSelect} />
      </Canvas>
    </div>
  )
}

export default IndonesiaCanvas
