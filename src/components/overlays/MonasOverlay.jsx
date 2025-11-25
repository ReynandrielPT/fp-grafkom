import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { gsap } from 'gsap'

useGLTF.preload('/model/monas.glb')

function MonasPreviewModel() {
  const groupRef = useRef()
  const { scene } = useGLTF('/model/monas.glb')
  const clonedScene = useMemo(() => scene.clone(true), [scene])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += delta * 0.6
  })

  return <primitive ref={groupRef} object={clonedScene} scale={2.4} position={[0, -1.2, 0]} />
}

function PreviewCanvas() {
  return (
    <Canvas camera={{ position: [0, 2.4, 4], fov: 45 }}>
      <color attach="background" args={[0.05, 0.07, 0.12]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[0, 5, 4]} intensity={1.1} />
      <Suspense fallback={null}>
        <MonasPreviewModel />
      </Suspense>
    </Canvas>
  )
}

function MonasOverlay({ open, onClose }) {
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    if (open) setIsVisible(true)
  }, [open])

  useLayoutEffect(() => {
    if (!isVisible) return
    if (!containerRef.current || !panelRef.current) return

    if (open) {
      gsap.set(containerRef.current, { opacity: 0, pointerEvents: 'auto' })
      gsap.set(panelRef.current, { opacity: 0, y: 36, scale: 0.92 })

      const tl = gsap.timeline()
      tl.to(containerRef.current, {
        opacity: 1,
        duration: 0.25,
        ease: 'power2.out'
      })
        .to(panelRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.35,
          ease: 'power3.out'
        }, '<')
    } else {
      const tl = gsap.timeline({
        onComplete: () => {
          if (!containerRef.current) return
          gsap.set(containerRef.current, { opacity: 0, pointerEvents: 'none' })
          setIsVisible(false)
        }
      })

      tl.to(panelRef.current, {
        opacity: 0,
        y: 28,
        scale: 0.92,
        duration: 0.28,
        ease: 'power2.in'
      })
        .to(containerRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in'
        }, '<')
    }
  }, [open, isVisible])

  if (!isVisible) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 p-6 text-white shadow-2xl backdrop-blur"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-medium text-white/90 transition hover:bg-white/20"
        >
          Close
        </button>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-72 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60">
            <PreviewCanvas />
          </div>

          <div className="flex flex-col gap-3 text-white/90">
            <h2 className="text-2xl font-semibold text-white">Monumen Nasional (Monas)</h2>
            <p>
              Monas adalah monumen sejarah yang terletak di Jakarta pusat dan menjadi simbol perjuangan Indonesia
              meraih kemerdekaan. Puncaknya dilapisi emas dan menjulang setinggi 132 meter.
            </p>
            <p>
              Klik dan seret model utama untuk menjelajahi wilayah lain, lalu pilih penanda Monas kapan saja untuk
              kembali melihat detailnya di sini.
            </p>
            <div className="mt-auto flex flex-wrap items-center gap-2 text-sm text-white/70">
              <span className="rounded-full border border-white/10 px-3 py-1">Jakarta, Indonesia</span>
              <span className="rounded-full border border-white/10 px-3 py-1">Tinggi 132 m</span>
              <span className="rounded-full border border-white/10 px-3 py-1">Diresmikan 1975</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MonasOverlay
