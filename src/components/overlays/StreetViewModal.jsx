import { useEffect, useRef } from 'react';
import gsap from 'gsap';

function StreetViewModal({ isOpen, streetViewUrl, onClose }) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && overlayRef.current && modalRef.current) {
      // Animate overlay fade in
      gsap.fromTo(overlayRef.current, 
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      
      // Animate modal scale and fade in
      gsap.fromTo(modalRef.current,
        { scale: 0.8, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    if (overlayRef.current && modalRef.current) {
      // Animate out before closing
      gsap.to(modalRef.current, {
        scale: 0.8,
        opacity: 0,
        y: 50,
        duration: 0.3,
        ease: 'power2.in'
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: onClose
      });
    } else {
      onClose();
    }
  };

  if (!isOpen || !streetViewUrl) return null;

  return (
    <div ref={overlayRef} className="absolute inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div ref={modalRef} className="relative w-full max-w-5xl h-[80vh] bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
        
        {/* Tombol Close */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/60 hover:bg-red-600 text-white rounded-full backdrop-blur-md transition-all border border-white/10 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:rotate-90 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* IFRAME Google Maps */}
        <iframe 
          src={streetViewUrl}
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="Street View"
        />
      </div>
    </div>
  );
}

export default StreetViewModal;
