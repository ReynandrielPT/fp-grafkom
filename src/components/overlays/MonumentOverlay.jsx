import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { gsap } from "gsap";
import {
  MONAS_PREVIEW_MODEL_SCALE,
  MONAS_PREVIEW_MODEL_POSITION,
  MONAS_PREVIEW_CAMERA_POSITION,
  MONAS_PREVIEW_CAMERA_FOV,
  MONAS_ORBIT_MIN_DISTANCE,
  MONAS_ORBIT_MAX_DISTANCE,
  ANIM_CONTAINER_FADE_IN_DURATION,
  ANIM_PANEL_OPEN_DURATION,
  ANIM_PANEL_CLOSE_DURATION,
  ANIM_CONTAINER_CLOSE_DURATION,
  ANIM_PANEL_CLOSED_Y_OPEN,
  ANIM_PANEL_CLOSED_Y_CLOSE,
  ANIM_PANEL_CLOSED_SCALE,
  ANIM_PANEL_OPEN_Y,
} from "../const";

function MonasPreviewModel({
  modelUri,
  modelScale = MONAS_PREVIEW_MODEL_SCALE,
  modelPosition = MONAS_PREVIEW_MODEL_POSITION,
}) {
  const groupRef = useRef();
  const { scene } = useGLTF(modelUri);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
  });

  return (
    <primitive
      ref={groupRef}
      object={clonedScene}
      scale={modelScale}
      position={modelPosition}
    />
  );
}

function PreviewCanvas({
  className = "w-full h-full",
  modelUri,
  modelScale,
  modelPosition,
}) {
  const camPos = MONAS_PREVIEW_CAMERA_POSITION;
  const controlsRef = useRef();

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(0, -0.8, 0);
      controlsRef.current.update();
    }
  }, []);

  return (
    <Canvas
      className={className}
      style={{ display: "block" }}
      camera={{ position: camPos, fov: MONAS_PREVIEW_CAMERA_FOV }}
    >
      <color attach="background" args={[0.05, 0.07, 0.12]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[0, 5, 4]} intensity={1.1} />
      <Suspense fallback={null}>
        <MonasPreviewModel
          modelUri={modelUri}
          modelScale={modelScale}
          modelPosition={modelPosition}
        />
      </Suspense>
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        autoRotate={false}
        minDistance={MONAS_ORBIT_MIN_DISTANCE}
        maxDistance={MONAS_ORBIT_MAX_DISTANCE}
      />
    </Canvas>
  );
}

function MonumentOverlay({
  open,
  onClose,
  pageMode = false,
  modelUri = "/model/monas.glb",
  title = "Monumen Nasional (Monas)",
  description = null,
}) {
  const isPrambanan =
    String(modelUri ?? "").includes("candi_prambanan") ||
    String(title ?? "")
      .toLowerCase()
      .includes("prambanan");
  const previewScale = isPrambanan
    ? MONAS_PREVIEW_MODEL_SCALE * 50
    : MONAS_PREVIEW_MODEL_SCALE;
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (open) setIsVisible(true);
  }, [open]);

  useLayoutEffect(() => {
    if (!isVisible) return;
    if (!containerRef.current || !panelRef.current) return;

    if (open) {
      gsap.set(containerRef.current, { opacity: 0, pointerEvents: "auto" });
      gsap.set(panelRef.current, {
        opacity: 0,
        y: ANIM_PANEL_CLOSED_Y_OPEN,
        scale: ANIM_PANEL_CLOSED_SCALE,
      });

      const tl = gsap.timeline();
      tl.to(containerRef.current, {
        opacity: 1,
        duration: ANIM_CONTAINER_FADE_IN_DURATION,
        ease: "power2.out",
      }).to(
        panelRef.current,
        {
          opacity: 1,
          y: ANIM_PANEL_OPEN_Y,
          scale: 1,
          duration: ANIM_PANEL_OPEN_DURATION,
          ease: "power3.out",
        },
        "<"
      );
    } else {
      const tl = gsap.timeline({
        onComplete: () => {
          if (!containerRef.current) return;
          gsap.set(containerRef.current, { opacity: 0, pointerEvents: "none" });
          setIsVisible(false);
        },
      });

      tl.to(panelRef.current, {
        opacity: 0,
        y: ANIM_PANEL_CLOSED_Y_CLOSE,
        scale: ANIM_PANEL_CLOSED_SCALE,
        duration: ANIM_PANEL_CLOSE_DURATION,
        ease: "power2.in",
      }).to(
        containerRef.current,
        {
          opacity: 0,
          duration: ANIM_CONTAINER_CLOSE_DURATION,
          ease: "power2.in",
        },
        "<"
      );
    }
  }, [open, isVisible]);

  if (!isVisible) return null;

  if (pageMode) {
    return (
      <div
        ref={containerRef}
        className="fixed inset-0 z-50 flex items-stretch bg-slate-900/95 p-6"
        role="dialog"
        aria-modal="true"
      >
        <div
          ref={panelRef}
          className="mx-auto flex h-full max-w-7xl w-full flex-col gap-4"
        >
          <header className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 hover:bg-white/10"
            >
              Back to map
            </button>
          </header>

          <div className="flex grow gap-6">
            <main className="flex-1 overflow-hidden bg-slate-900">
              <PreviewCanvas
                className="w-full h-full"
                modelUri={modelUri}
                modelScale={previewScale}
                modelPosition={MONAS_PREVIEW_MODEL_POSITION}
              />
            </main>

            <aside
              className={
                "shrink-0 space-y-4 overflow-auto bg-slate-800 p-4 text-white/90 " +
                (isPrambanan ? "w-72" : "w-96")
              }
            >
              <p>
                {description ??
                  "Explore the selected landmark using the 3D viewer."}
              </p>
              <p>
                Gunakan klik dan seret untuk memutar model. Zoom dengan roda
                mouse atau pinch pada trackpad untuk mendekatkan tampilan.
              </p>
              {isPrambanan && (
                <section className="pt-2 border-t border-white/5 text-sm text-white/80">
                  <h3 className="font-semibold mb-2">Sejarah Singkat</h3>
                  <p>
                    Candi Prambanan adalah kompleks candi Hindu dari abad ke-9
                    yang terletak di Jawa Tengah. Dibangun sebagai penghormatan
                    kepada Trimurti (Siwa, Wisnu, dan Brahma), Prambanan
                    terkenal karena arsitekturnya yang tinggi dan relief yang
                    kaya.
                  </p>
                  <p className="mt-2">
                    Kompleks ini sempat mengalami kerusakan dan pemugaran,
                    tetapi tetap menjadi situs warisan penting dan tujuan wisata
                    budaya.
                  </p>
                </section>
              )}
              <div className="mt-4 flex flex-col gap-2 text-sm text-white/70">
                <div className="rounded-full border border-white/10 px-3 py-1">
                  {title}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

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
          <div
            className={
              isPrambanan
                ? "h-96 overflow-hidden bg-slate-900"
                : "h-72 overflow-hidden bg-slate-900"
            }
          >
            <PreviewCanvas
              modelUri={modelUri}
              modelScale={previewScale}
              modelPosition={MONAS_PREVIEW_MODEL_POSITION}
            />
          </div>

          <div className="flex flex-col gap-3 text-white/90">
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            <p>
              {description ??
                "Explore the selected landmark using the 3D viewer."}
            </p>
            <p>
              Klik dan seret model utama untuk menjelajahi wilayah lain, lalu
              pilih penanda untuk kembali melihat detailnya di sini.
            </p>
            {isPrambanan && (
              <section className="mt-4 border-t border-white/5 pt-4 text-sm text-white/80">
                <h3 className="font-semibold">Sejarah Candi Prambanan</h3>
                <p className="mt-2">
                  Dibangun pada abad ke-9, Candi Prambanan merupakan salah satu
                  kompleks candi Hindu terbesar di Indonesia. Kompleks ini
                  menjadi pusat budaya dan keagamaan pada masanya.
                </p>
              </section>
            )}
            <div className="mt-auto flex flex-wrap items-center gap-2 text-sm text-white/70">
              <span className="rounded-full border border-white/10 px-3 py-1">
                {title}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonumentOverlay;
