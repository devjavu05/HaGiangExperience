import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

function ImageGallery({ title, images = [] }) {
  const safeImages = images.length ? images : ["https://placehold.co/1600x1200?text=Ha+Giang"];
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
    setLightboxOpen(false);
  }, [title]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (!lightboxOpen) return;

      if (event.key === "Escape") {
        setLightboxOpen(false);
      }
      if (event.key === "ArrowLeft") {
        showPrevious();
      }
      if (event.key === "ArrowRight") {
        showNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, safeImages.length]);

  const activeImage = safeImages[Math.min(activeIndex, safeImages.length - 1)];
  const canNavigate = safeImages.length > 1;

  function showPrevious() {
    setActiveIndex((current) => (current === 0 ? safeImages.length - 1 : current - 1));
  }

  function showNext() {
    setActiveIndex((current) => (current === safeImages.length - 1 ? 0 : current + 1));
  }

  return (
    <>
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-[28px] bg-stone-950 shadow-[0_22px_55px_rgba(44,30,20,0.18)]">
          <div className="relative aspect-[16/9] w-full">
            <img
              src={activeImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover blur-3xl opacity-55"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.32))]" />

            {canNavigate ? (
              <>
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="Ảnh trước"
                  className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/72 text-stone-900 backdrop-blur-md transition hover:bg-white/90"
                >
                  <ChevronLeft size={18} strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Ảnh tiếp theo"
                  className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/72 text-stone-900 backdrop-blur-md transition hover:bg-white/90"
                >
                  <ChevronRight size={18} strokeWidth={1.75} />
                </button>
              </>
            ) : null}

            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="absolute right-4 top-4 z-20 inline-flex items-center gap-2 rounded-full bg-black/35 px-3 py-2 text-xs font-medium text-white backdrop-blur-md transition hover:bg-black/50"
            >
              <ZoomIn size={15} strokeWidth={1.75} />
              Phóng to
            </button>

            <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-5">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={activeImage}
                  alt={title}
                  initial={{ opacity: 0, x: 20, scale: 0.985 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.985 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative z-10 h-full w-full rounded-[22px] object-contain"
                />
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-1">
          {safeImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Chọn ảnh ${index + 1}`}
              className={`relative aspect-square h-16 flex-none overflow-hidden rounded-xl transition sm:h-20 ${
                activeIndex === index
                  ? "ring-2 ring-terracotta-600 ring-offset-2 ring-offset-[#fcf8f1] opacity-100 shadow-[0_12px_28px_rgba(180,96,60,0.22)]"
                  : "opacity-60 hover:opacity-90"
              }`}
            >
              <img
                src={image}
                alt={`${title} - ảnh nhỏ ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[80] bg-black/92 backdrop-blur-md"
          >
            <button
              type="button"
              aria-label="Đóng lightbox"
              onClick={() => setLightboxOpen(false)}
              className="absolute right-5 top-5 z-[90] flex h-11 w-11 items-center justify-center rounded-full bg-white/12 text-white transition hover:bg-white/20"
            >
              <X size={20} strokeWidth={1.8} />
            </button>

            {canNavigate ? (
              <>
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="Ảnh trước"
                  className="absolute left-5 top-1/2 z-[90] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 text-white transition hover:bg-white/20"
                >
                  <ChevronLeft size={20} strokeWidth={1.8} />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Ảnh tiếp theo"
                  className="absolute right-5 top-1/2 z-[90] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 text-white transition hover:bg-white/20"
                >
                  <ChevronRight size={20} strokeWidth={1.8} />
                </button>
              </>
            ) : null}

            <div className="absolute inset-0 flex items-center justify-center px-4 py-16 sm:px-8">
              <img
                src={activeImage}
                alt={title}
                className="max-h-full max-w-full rounded-[24px] object-contain shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
              />
            </div>

            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3 overflow-x-auto rounded-full bg-white/10 px-4 py-3 backdrop-blur-md">
              {safeImages.map((image, index) => (
                <button
                  key={`lightbox-${image}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Chọn ảnh ${index + 1} trong lightbox`}
                  className={`relative aspect-square h-12 flex-none overflow-hidden rounded-lg transition ${
                    activeIndex === index
                      ? "ring-2 ring-terracotta-500 opacity-100"
                      : "opacity-55 hover:opacity-90"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${title} - lightbox ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default ImageGallery;
