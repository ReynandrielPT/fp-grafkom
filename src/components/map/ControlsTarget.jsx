import { useEffect } from 'react'
import { Vector3 } from 'three'

function ControlsTarget({ mapBounds, controlsRef }) {
  useEffect(() => {
    if (!mapBounds || !controlsRef.current) return
    const center = mapBounds.getCenter(new Vector3())
    controlsRef.current.target.copy(center)
    controlsRef.current.update()
  }, [mapBounds, controlsRef])
  return null
}

export default ControlsTarget
