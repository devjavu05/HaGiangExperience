import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import ExperienceCard from "../components/experience/ExperienceCard";

const heroSlides = [
  {
    id: 1,
    image:
      "frontend/src/assets/pexels-qhung999-32149195.jpg",
    eyebrow: "Ha Giang Local Experience",
    title: "Chạm vào miền đá Hà Giang qua những khung hình tràn đầy sức sống.",
    description:
      "Hành trình được dẫn dắt bởi người bản địa, nơi mỗi cung đường, phiên chợ và đồi núi đều kể một câu chuyện rất riêng."
  },
  {
    id: 2,
    image:
      "d:\Web DLDT\frontend\src\assets\pexels-qhung999-32149195.jpg",
    eyebrow: "Travel With Locals",
    title: "Bắt đầu từ một bức ảnh, đi sâu hơn bằng một trải nghiệm chân thực.",
    description:
      "Từ bình minh trên đèo đến nhịp sống nơi bản làng, du khách khám phá Hà Giang bằng góc nhìn gần gũi và nguyên bản."
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2400&q=80",
    eyebrow: "Highland Storytelling",
    title: "Mỗi hành trình là một lát cắt văn hóa giữa thiên nhiên hùng vĩ.",
    description:
      "Khám phá trà Shan Tuyết, bản làng vùng cao và những khung cảnh làm nên linh hồn của Hà Giang."
  }
];

function HomeHeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = heroSlides[activeIndex];

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setActiveIndex((current) => (current === heroSlides.length - 1 ? 0 : current + 1));
    }, 6500);

    return () => window.clearInterval(timerId);
  }, []);

  function showPrevious() {
    setActiveIndex((current) => (current === 0 ? heroSlides.length - 1 : current - 1));
  }

  function showNext() {
    setActiveIndex((current) => (current === heroSlides.length - 1 ? 0 : current + 1));
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen overflow-hidden"
    >
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

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/20" />

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

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center sm:px-6">
        <motion.div
          key={activeSlide.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto max-w-5xl"
        >
          <p className="text-sm font-medium uppercase tracking-[0.4em] text-white/85">
            {activeSlide.eyebrow}
          </p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-7xl">
            {activeSlide.title}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-white/85 sm:text-lg">
            {activeSlide.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#featured-experiences"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-900"
            >
              Khám phá hành trình
            </a>
            <a
              href="#featured-experiences"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm"
            >
              Cuộn xuống
              <ArrowDown size={16} />
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Chuyển tới slide ${index + 1}`}
            className={`h-2.5 rounded-full transition ${
              activeIndex === index ? "w-10 bg-white" : "w-2.5 bg-white/45"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

function HomePage({
  experiences,
  isLoading,
  error,
  currentUser,
  selectedExperienceId,
  onSelectExperience,
  onEditExperience,
  onDeleteExperience
}) {
  return (
    <div className="overflow-hidden">
      <HomeHeroSlider />

      <section
        id="featured-experiences"
        className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-14 sm:px-6"
      >
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-8"
          >
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
                Featured Experiences
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-stone-900 sm:text-3xl">
                Hành trình nổi bật tại Hà Giang
              </h2>
            </div>
          </motion.div>

          {isLoading ? (
            <div className="rounded-[28px] border border-clay-200 bg-white p-8 text-sm text-stone-500 shadow-sm">
              Đang tải danh sách bài đăng từ hệ thống...
            </div>
          ) : error ? (
            <div className="rounded-[28px] border border-terracotta-200 bg-white p-8 text-sm text-terracotta-700 shadow-sm">
              {error}
            </div>
          ) : experiences.length === 0 ? (
            <div className="rounded-[28px] border border-clay-200 bg-white p-8 text-sm text-stone-500 shadow-sm">
              Chưa có bài đăng nào. Hãy tạo bài đăng đầu tiên từ trang Đăng bài.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {experiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
                >
                  <ExperienceCard
                    experience={experience}
                    isActive={selectedExperienceId === experience.id}
                    canManage={Boolean(currentUser?.id && currentUser.id === experience.ownerId)}
                    onEdit={onEditExperience}
                    onDelete={onDeleteExperience}
                    onSelect={onSelectExperience}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
