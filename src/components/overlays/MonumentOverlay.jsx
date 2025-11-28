import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { gsap } from "gsap";
import {
  MONUMENT_PREVIEW_MODEL_SCALE,
  MONUMENT_PREVIEW_MODEL_POSITION,
  MONUMENT_PREVIEW_CAMERA_POSITION,
  MONUMENT_PREVIEW_CAMERA_FOV,
  MONUMENT_ORBIT_MIN_DISTANCE,
  MONUMENT_ORBIT_MAX_DISTANCE,
  ANIM_CONTAINER_FADE_IN_DURATION,
  ANIM_PANEL_OPEN_DURATION,
  ANIM_PANEL_CLOSE_DURATION,
  ANIM_CONTAINER_CLOSE_DURATION,
  ANIM_PANEL_CLOSED_Y_OPEN,
  ANIM_PANEL_CLOSED_Y_CLOSE,
  ANIM_PANEL_CLOSED_SCALE,
  ANIM_PANEL_OPEN_Y,
} from "../const";
import { resolveAssetPath } from "../../utils/assets";

function MonasPreviewModel({
  modelUri,
  modelScale = MONUMENT_PREVIEW_MODEL_SCALE,
  modelPosition = MONUMENT_PREVIEW_MODEL_POSITION,
}) {
  const { scene } = useGLTF(modelUri);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  return (
    <primitive
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
  const camPos = MONUMENT_PREVIEW_CAMERA_POSITION;
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
      dpr={1}
      gl={{ antialias: false, powerPreference: "low-power" }}
      camera={{ position: camPos, fov: MONUMENT_PREVIEW_CAMERA_FOV }}
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
        minDistance={MONUMENT_ORBIT_MIN_DISTANCE}
        maxDistance={MONUMENT_ORBIT_MAX_DISTANCE}
      />
    </Canvas>
  );
}

function MonumentOverlay({
  open,
  onClose,
  pageMode = false,
  landmark = null,
  modelUri = resolveAssetPath("model/monas.glb"),
  title = "Monumen Nasional (Monas)",
  description = null,
}) {
  const effectiveModelUri = landmark?.modelUri ?? modelUri;
  const effectiveTitle = landmark?.name ?? title;
  const effectiveDescription = landmark?.description ?? description;
  const streetViewUrl = landmark?.streetViewUrl;
  const additionalContent = landmark?.additionalContent;

  const isPrambanan =
    String(effectiveModelUri ?? "").includes("candi_prambanan") ||
    String(effectiveTitle ?? "").toLowerCase().includes("prambanan");
  const isMonas =
    String(effectiveModelUri ?? "").toLowerCase().includes("monas") ||
    String(effectiveTitle ?? "").toLowerCase().includes("monas");
  const previewScale = isPrambanan
    ? MONUMENT_PREVIEW_MODEL_SCALE * 50
    : isMonas
      ? MONUMENT_PREVIEW_MODEL_SCALE * 20
      : MONUMENT_PREVIEW_MODEL_SCALE;
  
  const [isVisible, setIsVisible] = useState(false);
  const [viewMode, setViewMode] = useState("3d"); // "3d" or "streetview"
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
            <h2 className="text-2xl font-semibold text-white">{effectiveTitle}</h2>
            <div className="flex items-center gap-2">
              {streetViewUrl && (
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === "3d" ? "streetview" : "3d")}
                  className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 hover:bg-white/10 transition"
                >
                  {viewMode === "3d" ? "Street View" : "3D Model"}
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 hover:bg-white/10"
              >
                Back to map
              </button>
            </div>
          </header>

          <div className="flex grow gap-6">
            <main className="flex-1 overflow-hidden bg-slate-900">
              {viewMode === "3d" ? (
                <PreviewCanvas
                  className="w-full h-full"
                  modelUri={effectiveModelUri}
                  modelScale={previewScale}
                  modelPosition={MONUMENT_PREVIEW_MODEL_POSITION}
                />
              ) : (
                <iframe
                  src={streetViewUrl}
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Street View"
                />
              )}
            </main>

            <aside className="shrink-0 space-y-4 overflow-auto bg-slate-800 p-4 text-white/90 w-96">
              <p>
                {effectiveDescription ??
                  "Explore the selected landmark using the 3D viewer."}
              </p>
              <p>
                {viewMode === "3d"
                  ? "Gunakan klik dan seret untuk memutar model. Zoom dengan roda mouse atau pinch pada trackpad untuk mendekatkan tampilan."
                  : "Explore the landmark location in Google Street View. Drag to look around and use controls to navigate."}
              </p>
              {additionalContent && (
                <section className="pt-2 border-t border-white/5 text-sm text-white/80">
                  <h3 className="font-semibold mb-2">{additionalContent.title}</h3>
                  {additionalContent.paragraphs.map((paragraph, index) => (
                    <p key={index} className={index > 0 ? "mt-2" : ""}>
                      {paragraph}
                    </p>
                  ))}
                </section>
              )}
              <div className="mt-4 flex flex-col gap-2 text-sm text-white/70">
                <div className="rounded-full border border-white/10 px-3 py-1">
                  {effectiveTitle}
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
        <div className="absolute right-4 top-4 flex items-center gap-2">
          {streetViewUrl && (
            <button
              type="button"
              onClick={() => setViewMode(viewMode === "3d" ? "streetview" : "3d")}
              className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-medium text-white/90 transition hover:bg-white/20"
            >
              {viewMode === "3d" ? "Street View" : "3D Model"}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-medium text-white/90 transition hover:bg-white/20"
          >
            Close
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className={`${isPrambanan ? "h-96" : "h-72"} overflow-hidden bg-slate-900`}>
            {viewMode === "3d" ? (
              <PreviewCanvas
                modelUri={effectiveModelUri}
                modelScale={previewScale}
                modelPosition={MONUMENT_PREVIEW_MODEL_POSITION}
              />
            ) : (
              <iframe
                src={streetViewUrl}
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Street View"
              />
            )}
          </div>

          <div className="flex flex-col gap-3 text-white/90">
            <h2 className="text-2xl font-semibold text-white">{effectiveTitle}</h2>
            <p>
              {effectiveDescription ??
                "Explore the selected landmark using the 3D viewer."}
            </p>
            <p>
              {viewMode === "3d"
                ? "Klik dan seret model utama untuk menjelajahi wilayah lain, lalu pilih penanda untuk kembali melihat detailnya di sini."
                : "Explore the landmark location in Google Street View. Drag to look around and use controls to navigate."}
            </p>
            {additionalContent && (
              <section className="mt-4 border-t border-white/5 pt-4 text-sm text-white/80">
                <h3 className="font-semibold">{additionalContent.title}</h3>
                {additionalContent.paragraphs.map((paragraph, index) => (
                  <p key={index} className={index === 0 ? "mt-2" : "mt-2"}>
                    {paragraph}
                  </p>
                ))}
              </section>
            )}
            <div className="mt-auto flex flex-wrap items-center gap-2 text-sm text-white/70">
              <span className="rounded-full border border-white/10 px-3 py-1">
                {effectiveTitle}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MonumentOverlay;
