import { useState } from 'react'
import InitialGuide from './components/ui/InitialGuide'
import IndonesiaCanvas from './components/map/IndonesiaCanvas'
import MonasOverlay from './components/overlays/MonasOverlay'
import { landmarks } from './data/landmarks'

function App() {
  const [showGuide, setShowGuide] = useState(undefined)
  const [isMonasOpen, setIsMonasOpen] = useState(false)

  const openGuide = () => {
    localStorage.removeItem('hasSeenGuide')
    setShowGuide(true)
  }

  const handleLandmarkSelect = (landmark) => {
    if (!landmark) return
    if (landmark.id.startsWith('monas')) {
      setIsMonasOpen(true)
    }
  }

  return (
    <>
      <InitialGuide show={showGuide} onClose={() => setShowGuide(false)} />
      <MonasOverlay open={isMonasOpen} onClose={() => setIsMonasOpen(false)} />

      <div className="fixed left-4 top-4 z-50 pointer-events-none">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-1">
          Indonesia 3D Map
        </h1>
        <p className="text-sm text-white/80 drop-shadow">
          Explore Indonesian landmarks in 3D
        </p>
      </div>

      <button
        className="fixed right-4 top-4 z-50 bg-white/10 text-white border border-white/20 px-3 py-2 rounded-md backdrop-blur hover:bg-white/20 transition"
        onClick={openGuide}
        aria-label="Show guide"
      >
        Show Guide
      </button>

      <IndonesiaCanvas
        className="w-screen h-screen"
        landmarks={landmarks}
        onLandmarkSelect={handleLandmarkSelect}
      />
    </>
  )
}

export default App
