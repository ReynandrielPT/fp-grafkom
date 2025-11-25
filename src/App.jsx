import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import './App.css'

function IndonesiaMap() {
  const { scene } = useGLTF('/model/indonesia.glb')
  return <primitive object={scene} />
}

function App() {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <IndonesiaMap />
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default App
