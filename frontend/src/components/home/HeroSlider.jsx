import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import heroHaGiang from "../../assets/pexels-qhung999-32149195.jpg";
import nguoiDan from "../../assets/pexels-vietnamhiddenlight-31265736.jpg"

const heroSlides = [
  {
    id: 1,
    image: heroHaGiang,
    title: "Hà Giang hiện ra như một bản trường ca của đá, mây và ánh sáng."
  },
  {
    id: 2,
    image: nguoiDan,
    title: "Nơi thiên nhiên, bản sắc hòa cùng con người"
  }
];

function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { isAuthenticated } = useAuth();
  const activeSlide = heroSlides[activeIndex];
  const canNavigate = heroSlides.length > 1;
  const ctaPath = isAuthenticated ? "/explore" : "/auth";

  useEffect(() => {
    if (!canNavigate) return undefined;

    const timerId = window.setInterval(() => {
      setActiveIndex((current) => (current === heroSlides.length - 1 ? 0 : current + 1));
    }, 6500);

    return () => window.clearInterval(timerId);
  }, [canNavigate]);

  function showPrevious() {
    setActiveIndex((current) => (current === 0 ? heroSlides.length - 1 : current - 1));
  }

  function showNext() {
    setActiveIndex((current) => (current === heroSlides.length - 1 ? 0 : current + 1));
  }

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeSlide.id}
            src={activeSlide.image}
            alt={activeSlide.title}
            loading={activeIndex === 0 ? "eager" : "lazy"}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full w-full object-cover"
          />
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/25" />

      {canNavigate ? (
        <>
          <button
            type="button"
            onClick={showPrevious}
            aria-label="Ảnh trước"
            className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:left-6 sm:h-14 sm:w-14"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            type="button"
            onClick={showNext}
            aria-label="Ảnh tiếp theo"
            className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:right-6 sm:h-14 sm:w-14"
          >
            <ChevronRight size={24} />
          </button>
        </>
      ) : null}

      <div className="absolute inset-0 z-10 flex items-center justify-center px-6 text-center sm:px-10 lg:px-14 xl:px-20">
        <motion.div
          key={activeSlide.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto max-w-6xl"
        >
          <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-7xl xl:text-[5.5rem]">
            {activeSlide.title}
          </h1>

          <div className="mt-10">
            <Link
              to={ctaPath}
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-semibold text-stone-900 shadow-[0_18px_40px_rgba(0,0,0,0.18)] transition hover:scale-[1.02]"
            >
              Bắt đầu hành trình
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSlider;
