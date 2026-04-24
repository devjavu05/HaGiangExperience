import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  LoaderCircle,
  Bus,
  Camera,
  Clock3,
  Coffee,
  ExternalLink,
  Footprints,
  Leaf,
  MapPinned,
  Mountain,
  MoonStar,
  Sprout,
  Star,
  Hammer,
  ShieldCheck,
  Sparkles,
  Sunrise,
  TentTree,
  TimerReset,
  Trees,
  UtensilsCrossed,
  UserRound,
  Users,
  Utensils,
  Wind,
} from "lucide-react";
import ImageGallery from "../components/experience/ImageGallery";
import ReviewForm from "../components/experience/ReviewForm";
import { submitReply } from "../services/experienceService";

const CATEGORY_STYLES = {
  culture: {
    icon: Leaf,
    className: "border-[#CFE3D7] bg-[#E8F3EE] text-[#1A3021]",
  },
  adventure: {
    icon: Mountain,
    className: "border-[#D6E9FB] bg-[#EBF5FF] text-[#1D4E89]",
  },
  healing: {
    icon: Wind,
    className: "border-[#E5D5FA] bg-[#F3E8FF] text-[#6B3FA0]",
  },
  foodie: {
    icon: Utensils,
    className: "border-[#F2DCCB] bg-[#FDF2E9] text-[#9C4F2B]",
  },
  craft: {
    icon: Hammer,
    className: "border-[#E7DCC8] bg-[#F6F0E7] text-[#7B5A2E]",
  },
  agriculture: {
    icon: Sprout,
    className: "border-[#D7E8B8] bg-[#F1F7E3] text-[#557A1F]",
  },
  nature: {
    icon: Trees,
    className: "border-[#CFE7E2] bg-[#EAF7F4] text-[#1E6B60]",
  },
  community: {
    icon: Users,
    className: "border-[#E5D6C8] bg-[#F7F0EA] text-[#7A5230]",
  },
};

function ExperienceDetail({
  experience,
  currentUser,
  onReviewSubmitted,
  onReplySubmitted,
  onContact,
}) {
  const galleryImages = experience.imageUrls?.length
    ? experience.imageUrls
    : experience.imageUrl
      ? [experience.imageUrl]
      : [];
  const itinerary = experience.itinerary ?? [];
  const categories = experience.categories ?? [];
  const reviews = experience.reviews ?? [];

  const hasLocation = Boolean(experience.address || experience.location);
  const locationText = experience.address || experience.location;
  const hasCoordinates =
    experience.latitude !== null &&
    experience.latitude !== undefined &&
    experience.latitude !== "" &&
    experience.longitude !== null &&
    experience.longitude !== undefined &&
    experience.longitude !== "";

  const embedMapUrl = hasLocation
    ? hasCoordinates
      ? `https://www.google.com/maps?q=${experience.latitude},${experience.longitude}&z=16&output=embed`
      : `https://www.google.com/maps?q=${encodeURIComponent(locationText)}&output=embed`
    : "";

  const openInGoogleMapsUrl = hasLocation
    ? experience.mapsPlaceId
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationText)}&query_place_id=${encodeURIComponent(experience.mapsPlaceId)}`
      : hasCoordinates
        ? `https://www.google.com/maps/search/?api=1&query=${experience.latitude},${experience.longitude}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationText)}`
    : "#";

  return (
    <div className="mx-auto w-full max-w-[1600px] bg-slate-50 px-6 pb-20 pt-32 sm:px-8 sm:pb-24 sm:pt-36 lg:px-12 xl:px-14 2xl:px-16">
      <motion.section
        id="experience-detail"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="rounded-[36px] border border-slate-100 bg-white p-5 shadow-md sm:p-6 lg:p-8"
      >
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12 xl:gap-10">
          <div className="xl:col-span-8">
            <div className="space-y-8">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="rounded-full bg-yellow-50 px-4 py-2 text-sm font-semibold text-amber-700">
                    Trải nghiệm nổi bật
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
                    <MapPinned size={16} className="text-emerald-700" />
                    {experience.location}
                  </span>
                </div>

                <div className="space-y-4">
                  <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.05] text-[#1A3021] sm:text-5xl lg:text-6xl">
                    {experience.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1 text-yellow-400">
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          key={index}
                          size={18}
                          fill={
                            index <
                            Math.round(Number(experience.averageRating ?? 0))
                              ? "currentColor"
                              : "transparent"
                          }
                          strokeWidth={1.8}
                        />
                      ))}
                    </div>
                    <p className="text-sm font-semibold text-slate-700">
                      {Number(experience.averageRating ?? 0).toFixed(1)} (
                      {experience.totalReviews ?? 0} đánh giá)
                    </p>
                  </div>
                  {categories.length ? (
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => {
                        const categoryConfig = CATEGORY_STYLES[category.slug];
                        if (!categoryConfig) {
                          return null;
                        }

                        const CategoryIcon = categoryConfig.icon;

                        return (
                          <span
                            key={category.id ?? category.slug}
                            className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 font-['Be_Vietnam_Pro'] text-xs font-semibold ${categoryConfig.className}`}
                          >
                            <CategoryIcon size={14} />
                            {category.name}
                          </span>
                        );
                      })}
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                      <Clock3 size={16} className="text-slate-600" />
                      {experience.duration}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                      <UserRound size={16} className="text-[#486152]" />
                      Đăng bởi: {experience.authorName}
                    </span>
                  </div>
                </div>
              </div>

              <ImageGallery title={experience.title} images={galleryImages} />

              <div className="flex flex-col gap-y-12">
                <section className="rounded-[30px] border border-slate-100 bg-white px-6 py-10 shadow-sm sm:px-8 sm:py-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-500">
                    Mô tả hành trình
                  </p>
                  <div className="relative mt-5 overflow-hidden rounded-[24px] bg-slate-50 px-5 py-6 sm:px-6">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-3 top-0 text-[6.5rem] font-bold leading-none text-[#FDF2E9] opacity-90 sm:left-4 sm:text-[8rem]"
                    >
                      "
                    </span>
                    <p className="relative pl-6 text-lg leading-relaxed text-slate-600 first-letter:mr-2 first-letter:float-left first-letter:text-5xl first-letter:font-bold first-letter:leading-[0.9] first-letter:text-[#1A3021] sm:pl-8 sm:text-xl sm:first-letter:text-6xl">
                      {experience.contentDetail || experience.description}
                    </p>
                  </div>
                </section>

                <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
                  <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.45 }}
                    whileHover={{ y: -4 }}
                    className="flex h-full flex-col rounded-3xl bg-[#E8F3EE] px-6 py-10 shadow-sm shadow-emerald-900/5 transition-shadow hover:shadow-md hover:shadow-emerald-900/10"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#CFE3D7] text-[#1A3021]">
                      <Leaf size={22} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Hoạt động
                    </h2>
                    <ul className="mt-6 space-y-3.5">
                      {experience.activities.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm leading-7 text-slate-600"
                        >
                          <BadgeCheck
                            className="mt-1 shrink-0 text-[#2F5D46]"
                            size={18}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.section>

                  <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.45, delay: 0.08 }}
                    whileHover={{ y: -4 }}
                    className="flex h-full flex-col rounded-3xl bg-[#FDF2E9] px-6 py-10 shadow-sm shadow-orange-900/5 transition-shadow hover:shadow-md hover:shadow-orange-900/10"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F2DCCB] text-[#9C4F2B]">
                      <Sparkles size={22} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Điểm nhấn
                    </h2>
                    <ul className="mt-6 space-y-3.5">
                      {experience.highlights.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm leading-7 text-slate-600"
                        >
                          <Sparkles
                            className="mt-1 shrink-0 text-[#9C4F2B]"
                            size={16}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.section>
                </div>

                {itinerary.length ? (
                  <EnhancedItineraryTimeline itinerary={itinerary} />
                ) : null}

                {hasLocation ? (
                  <section className="mb-12 space-y-5 rounded-[30px] border border-slate-100 bg-white px-6 py-10 shadow-sm sm:px-8 sm:py-10">
                    <div className="space-y-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
                        Vị trí trải nghiệm
                      </p>
                      <div className="inline-flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-600">
                        <MapPinned
                          size={18}
                          className="mt-1 shrink-0 text-[#486152]"
                        />
                        <span>{locationText}</span>
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-3xl border border-slate-100 shadow-sm">
                      <a
                        href={openInGoogleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/92 px-4 py-2 text-sm font-semibold text-stone-900 shadow-lg backdrop-blur-md transition hover:bg-white"
                      >
                        Mở trong Google Maps
                        <ExternalLink size={16} />
                      </a>

                      <iframe
                        title={`Bản đồ trải nghiệm ${experience.title}`}
                        src={embedMapUrl}
                        className="h-[320px] w-full rounded-3xl border-0 sm:h-[380px]"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </section>
                ) : null}

                <ReviewsSection
                  averageRating={experience.averageRating ?? 0}
                  totalReviews={experience.totalReviews ?? 0}
                  reviews={reviews}
                  currentUser={currentUser}
                  experienceId={experience.id}
                  authorId={experience.ownerId}
                  onReviewSubmitted={onReviewSubmitted}
                  onReplySubmitted={onReplySubmitted}
                />
              </div>
            </div>
          </div>

          <aside className="xl:col-span-4">
            <div className="xl:sticky xl:top-28">
              <div className="overflow-hidden rounded-[30px] border border-slate-100 bg-white shadow-xl">
                <div className="relative overflow-hidden bg-white px-6 py-6">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(26,48,33,0.05),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.08),transparent_26%)]" />
                  <div className="relative">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                        LIÊN HỆ HOST
                      </p>
                      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1A3021] shadow-sm">
                        <ShieldCheck size={14} />
                        Kết nối nhanh chóng
                      </span>
                    </div>

                    <div className="mt-4 rounded-[24px] bg-[#E8F3EE] px-4 py-4">
                      <p className="text-sm font-medium text-slate-500">
                        Giá trải nghiệm
                      </p>
                      <p className="mt-2 text-3xl font-bold tracking-tight text-[#1A3021]">
                        {experience.price}
                      </p>
                    </div>

                    <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-100 bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700">
                      <TimerReset size={14} className="text-[#486152]" />
                      Cuối tuần thường kín chỗ sớm
                    </div>
                  </div>
                </div>

                <div className="space-y-5 p-8">
                  <div className="grid gap-4 rounded-[24px] border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-500">Thời lượng</span>
                      <span className="font-semibold text-slate-900">
                        {experience.duration}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-slate-500">Địa điểm</span>
                      <span className="text-right font-semibold text-slate-900">
                        {experience.location}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-[24px] bg-[#FDF2E9] p-4 shadow-sm">
                    <p className="text-sm font-semibold text-[#1A3021]">
                      Lý do bạn nên liên hệ ngay
                    </p>
                    <ul className="mt-3 space-y-2.5 text-sm leading-6 text-slate-700">
                      <li className="flex items-start gap-2.5">
                        <BadgeCheck
                          size={16}
                          className="mt-1 shrink-0 text-forest-700"
                        />
                        <span>
                          Dễ chọn ngày đẹp và khung giờ phù hợp hơn cho hành
                          trình.
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <BadgeCheck
                          size={16}
                          className="mt-1 shrink-0 text-forest-700"
                        />
                        <span>
                          Host phản hồi nhanh, thuận tiện cho cả khách lẻ lẫn
                          nhóm nhỏ.
                        </span>
                      </li>
                    </ul>
                  </div>

                  <p className="text-sm leading-7 text-slate-600">
                    Nếu cảm thấy hào hứng với trải nghiệm này, hãy liên hệ với
                    chúng tôi ngay để biết thêm thông tin chi tiết, khuyến mại
                    và đặt dịch vụ.
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onContact}
                    className="flex w-full items-center justify-center gap-3 rounded-full bg-[#1A3021] px-5 py-4 text-base font-semibold text-white shadow-md transition-all hover:bg-[#1A3021]/90 hover:shadow-lg hover:shadow-emerald-900/10"
                  >
                    Liên hệ ngay
                    <ArrowRight size={18} />
                  </motion.button>

                  <p className="text-center text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
                    Tư vấn nhanh • Nhắn tin Zalo • Trao đổi trực tiếp
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </motion.section>
    </div>
  );
}

function ItineraryTimeline({ itinerary }) {
  return (
    <section className="mb-12 rounded-[30px] border border-slate-100 bg-white px-6 py-10 shadow-sm sm:px-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-500">
          Lịch trình chi tiết
        </p>
        <h2 className="text-3xl font-bold text-[#1A3021]">
          Theo nhịp hành trình trong ngày
        </h2>
      </div>

      <div className="relative mt-8">
        <div className="absolute left-[18px] top-2 bottom-2 w-px bg-[#D7E9DF]" />

        <div className="space-y-6">
          {itinerary.map((item, index) => (
            <motion.div
              key={item.id ?? `${item.timeTag}-${item.title}-${index}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="relative grid gap-4 pl-12 md:grid-cols-[180px_1fr] md:gap-6 md:pl-16"
            >
              <div className="absolute left-[5px] top-2.5 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-[#E8F3EE] shadow-sm shadow-emerald-900/10">
                <div className="h-2.5 w-2.5 rounded-full bg-[#6E9C83]" />
              </div>

              <div className="pt-1">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2F5D46]">
                  {item.timeTag}
                </p>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EnhancedItineraryTimeline({ itinerary }) {
  const sections = useMemo(() => groupItineraryByDay(itinerary), [itinerary]);
  const [activeDay, setActiveDay] = useState(() => sections[0]?.dayNumber ?? 1);
  const activeSection =
    sections.find((section) => section.dayNumber === activeDay) ?? sections[0];

  useEffect(() => {
    if (!sections.length) {
      return;
    }

    const hasActiveDay = sections.some(
      (section) => section.dayNumber === activeDay,
    );
    if (!hasActiveDay) {
      setActiveDay(sections[0].dayNumber);
    }
  }, [activeDay, sections]);

  return (
    <section className="mb-12 rounded-[30px] border border-slate-100 bg-white px-6 py-10 shadow-sm sm:px-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-500">
          Lịch trình chi tiết
        </p>
        <h2 className="text-3xl font-bold text-[#1A3021]">
          Theo nhịp hành trình trong ngày
        </h2>
      </div>

      {sections.length > 1 ? (
        <div className="sticky top-24 z-10 mt-8 overflow-x-auto rounded-full border border-slate-100 bg-white/90 p-2 shadow-sm backdrop-blur-md">
          <div className="flex min-w-max items-center gap-2">
            {sections.map((section) => (
              <button
                key={section.dayNumber}
                type="button"
                onClick={() => setActiveDay(section.dayNumber)}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition ${
                  section.dayNumber === activeDay
                    ? "bg-[#1A3021] text-white shadow-md"
                    : "bg-[#FDF2E9] text-[#1A3021] hover:bg-[#F2DCCB]"
                }`}
              >
                {section.label}
                {section.dayNumber === activeDay ? (
                  <motion.span
                    layoutId="active-day-indicator"
                    className="absolute inset-x-4 -bottom-1 h-0.5 rounded-full bg-[#F2DCCB]"
                  />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-8 space-y-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection?.dayNumber ?? "empty"}
            layout
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <motion.div
              key={`section-${activeSection?.dayNumber ?? "empty"}`}
              className="scroll-mt-32"
            >
              <div className="sticky top-36 z-[5] mb-5">
                <div className="flex items-center gap-3 rounded-[24px] border border-[#F2DCCB] bg-[#FDF2E9]/95 px-4 py-3 shadow-sm backdrop-blur-md">
                  <div className="h-px flex-1 bg-[#E7C8B3]" />
                  <p className="rounded-full bg-[#F2DCCB] px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#9C4F2B]">
                    {activeSection?.label ?? "Lịch trình"}
                  </p>
                  <div className="h-px flex-1 bg-[#E7C8B3]" />
                </div>
              </div>

              <div className="relative rounded-[28px] bg-[#F9F6F2]/65 px-4 py-5 sm:px-5">
                <div
                  className="absolute left-1/2 top-5 hidden w-[160px] -translate-x-1/2 md:block"
                  style={{
                    height: `${getZigzagHeight(activeSection?.items.length ?? 0)}px`,
                  }}
                >
                  <svg
                    viewBox={`0 0 160 ${getZigzagHeight(activeSection?.items.length ?? 0)}`}
                    className="h-full w-full overflow-visible"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d={buildZigzagPath(activeSection?.items.length ?? 0)}
                      fill="none"
                      stroke="#D7E9DF"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <motion.path
                      key={`path-${activeSection?.dayNumber ?? 0}`}
                      d={buildZigzagPath(activeSection?.items.length ?? 0)}
                      fill="none"
                      stroke="#9BC4AE"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0.4 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                    />
                    <circle
                      cx="80"
                      cy={getZigzagEndY(activeSection?.items.length ?? 0)}
                      r="8"
                      fill="url(#timeline-end-node)"
                    />
                    <defs>
                      <radialGradient
                        id="timeline-end-node"
                        cx="50%"
                        cy="50%"
                        r="65%"
                      >
                        <stop
                          offset="0%"
                          stopColor="#9BC4AE"
                          stopOpacity="0.95"
                        />
                        <stop
                          offset="100%"
                          stopColor="#9BC4AE"
                          stopOpacity="0.18"
                        />
                      </radialGradient>
                    </defs>
                  </svg>
                </div>

                {activeSection?.items?.length ? (
                  <div className="space-y-6">
                    <AnimatePresence initial={false}>
                      {activeSection.items.map((item, index) => (
                        <motion.div
                          layout
                          key={
                            item.id ??
                            `${item.timeTag}-${item.title}-${activeSection.dayNumber}-${index}`
                          }
                          initial={{
                            opacity: 0,
                            x: index % 2 === 0 ? -24 : 24,
                            y: 20,
                          }}
                          animate={{ opacity: 1, x: 0, y: 0 }}
                          exit={{
                            opacity: 0,
                            x: index % 2 === 0 ? 24 : -24,
                            y: -10,
                          }}
                          transition={{ duration: 0.35, delay: index * 0.05 }}
                          className="relative grid gap-4 pl-12 md:grid-cols-[1fr_96px_1fr] md:items-start md:gap-6 md:pl-0"
                        >
                          {index !== activeSection.items.length - 1 ? (
                            <div className="absolute left-[28px] top-[42px] h-[calc(100%+1.5rem)] w-px bg-gradient-to-b from-[#CFE3D7] to-transparent md:hidden" />
                          ) : null}
                          <div className="absolute left-[9px] top-2.5 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[#E8F3EE] shadow-sm shadow-emerald-900/10 md:left-1/2 md:z-10 md:h-12 md:w-12 md:-translate-x-1/2">
                            {renderItineraryIcon(item)}
                          </div>

                          <div
                            className={`pt-1 md:pt-3 ${
                              index % 2 === 0
                                ? "md:col-start-1 md:text-right"
                                : "md:col-start-3 md:text-left"
                            }`}
                          >
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#2F5D46]">
                              {item.timeTag}
                            </p>
                          </div>

                          <div
                            className={`rounded-3xl border border-slate-100 bg-white p-5 shadow-sm ${
                              index % 2 === 0
                                ? "md:col-start-1 md:mr-8"
                                : "md:col-start-3 md:ml-8"
                            }`}
                          >
                            <h3 className="text-xl font-bold text-slate-900">
                              {item.title}
                            </h3>
                            <ExpandableDescription text={item.description} />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-[#D7E9DF] bg-white/80 px-6 py-10 text-center text-sm text-slate-500">
                    Lịch trình cho ngày này đang được Host cập nhật...
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function ExpandableDescription({ text }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldCollapse = text && text.length > 140;

  return (
    <div className="mt-2">
      <p
        className={`text-sm leading-7 text-slate-600 ${
          !isExpanded && shouldCollapse ? "line-clamp-3" : ""
        }`}
      >
        {text}
      </p>
      {shouldCollapse ? (
        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          className="mt-2 text-sm font-semibold text-[#2F5D46] transition hover:text-[#1A3021]"
        >
          {isExpanded ? "Thu gọn" : "Xem thêm"}
        </button>
      ) : null}
    </div>
  );
}

function groupItineraryByDay(itinerary) {
  const sections = [];
  let currentSection = null;

  itinerary.forEach((item) => {
    const resolvedDayNumber =
      item.dayNumber && Number(item.dayNumber) > 0
        ? Number(item.dayNumber)
        : sections.length + 1;
    const dayLabel = extractDayLabel(item);

    if (!currentSection || currentSection.dayNumber !== resolvedDayNumber) {
      currentSection = {
        dayNumber: resolvedDayNumber,
        label: dayLabel,
        items: [],
      };
      sections.push(currentSection);
    }

    currentSection.items.push(item);
  });
  return sections.length
    ? sections
    : [{ dayNumber: 1, label: "Lịch trình", items: itinerary }];
}

function ReviewsSection({
  averageRating,
  totalReviews,
  reviews,
  currentUser,
  experienceId,
  authorId,
  onReviewSubmitted,
  onReplySubmitted,
}) {
  const [visibleCount, setVisibleCount] = useState(5);
  const isExperienceOwner = Boolean(
    currentUser?.id && authorId && currentUser.id === authorId,
  );
  const prioritizedReviews = useMemo(() => {
    if (!currentUser?.id) {
      return reviews;
    }

    const myReviews = reviews.filter(
      (review) => review.userId === currentUser.id,
    );
    const otherReviews = reviews.filter(
      (review) => review.userId !== currentUser.id,
    );

    return [...myReviews, ...otherReviews];
  }, [reviews, currentUser?.id]);
  const myReview = currentUser?.id
    ? (prioritizedReviews.find((review) => review.userId === currentUser.id) ??
      null)
    : null;
  const visibleReviews = prioritizedReviews.slice(0, visibleCount);
  const distribution = useMemo(() => {
    const total = Math.max(totalReviews || reviews.length, 0);

    return [5, 4, 3, 2, 1].map((star) => {
      const count = reviews.filter(
        (review) => Number(review.rating) === star,
      ).length;
      return {
        star,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      };
    });
  }, [reviews, totalReviews]);

  return (
    <section className="mb-12 rounded-[30px] border border-slate-100 bg-white px-6 py-10 shadow-sm sm:px-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-500">
          Đánh giá trải nghiệm
        </p>
        <h2 className="text-3xl font-bold text-[#1A3021]">
          Cảm nhận từ người đã trải nghiệm
        </h2>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[28px] bg-[#F8FAF8] p-6">
          <div className="flex items-end gap-3">
            <p className="text-5xl font-extrabold tracking-tight text-[#1A3021]">
              {Number(averageRating ?? 0).toFixed(1)}
            </p>
            <p className="pb-1 text-lg font-semibold text-slate-500">/5</p>
          </div>
          <div className="mt-3 flex items-center gap-1 text-yellow-400">
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                size={18}
                fill="currentColor"
                strokeWidth={1.6}
              />
            ))}
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {totalReviews > 0
              ? `${totalReviews} lượt đánh giá đã được gửi cho trải nghiệm này.`
              : "Chưa có đánh giá nào cho trải nghiệm này."}
          </p>

          <div className="mt-6 space-y-3">
            {distribution.map((item) => (
              <div
                key={item.star}
                className="grid grid-cols-[44px_1fr_48px] items-center gap-3 text-sm"
              >
                <span className="font-semibold text-slate-700">
                  {item.star} sao
                </span>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-yellow-400 transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-right text-slate-500">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {currentUser && !isExperienceOwner ? (
            <ReviewForm
              experienceId={experienceId}
              review={myReview}
              onSubmitted={onReviewSubmitted}
            />
          ) : !currentUser ? (
            <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 py-5 text-sm leading-7 text-slate-500">
              Đăng nhập để gửi đánh giá và chia sẻ cảm nhận của bạn về trải
              nghiệm này.
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 py-5 text-sm leading-7 text-slate-500">
              Chủ bài đăng không thể tự gửi đánh giá cho trải nghiệm của chính
              mình.
            </div>
          )}

          {visibleReviews.length ? (
            visibleReviews.map((review) => (
              <div
                key={review.id ?? `${review.userId}-${review.createdAt}`}
                className="space-y-3"
              >
                <article className="rounded-[24px] border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E8F3EE] text-sm font-bold text-[#1A3021]">
                      {review.avatarUrl ? (
                        <img
                          src={review.avatarUrl}
                          alt={review.username}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>{getInitials(review.username)}</span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-slate-900">
                              {review.username}
                            </p>
                            {currentUser?.id === review.userId ? (
                              <span className="rounded-full bg-[#EAF5EE] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2F5D46]">
                                Đánh giá của bạn
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-1 flex items-center gap-1 text-yellow-400">
                            {Array.from({ length: 5 }, (_, index) => (
                              <Star
                                key={index}
                                size={15}
                                fill={
                                  index < Number(review.rating ?? 0)
                                    ? "currentColor"
                                    : "transparent"
                                }
                                strokeWidth={1.8}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                          {formatReviewDate(review.createdAt)}
                        </p>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-600">
                        {review.comment}
                      </p>

                      {isExperienceOwner && !review.reply ? (
                        <div className="mt-4">
                          <HostReplyComposer
                            experienceId={experienceId}
                            reviewId={review.id}
                            onSubmitted={onReplySubmitted}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>

                {review.reply ? (
                  <div className="ml-8 rounded-[22px] border border-[#CFE3D7] bg-[#E8F3EE] px-5 py-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-[#1A3021]">
                        Phản hồi từ Host
                      </p>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#5f7a64]">
                        {formatReviewDate(review.reply.createdAt)}
                      </p>
                    </div>
                    <p className="mt-2 text-sm font-medium text-[#2F5D46]">
                      {review.reply.hostName || "Host"}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-700">
                      {review.reply.comment}
                    </p>
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-500">
              Chưa có bình luận nào. Hãy là người đầu tiên để lại cảm nhận cho
              trải nghiệm này.
            </div>
          )}

          {prioritizedReviews.length > visibleCount ? (
            <button
              type="button"
              onClick={() => setVisibleCount((current) => current + 5)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#1A3021] shadow-sm transition hover:bg-slate-50"
            >
              Xem thêm
              <ChevronDown size={16} />
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function HostReplyComposer({ experienceId, reviewId, onSubmitted }) {
  const [isOpen, setIsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!comment.trim()) {
      setError("Vui lòng nhập phản hồi cho khách.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      const updatedReview = await submitReply(experienceId, reviewId, {
        comment: comment.trim(),
      });
      setComment("");
      setIsOpen(false);
      onSubmitted?.(updatedReview);
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          "Không thể gửi phản hồi lúc này.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-full border border-[#CFE3D7] bg-white px-4 py-2 text-sm font-semibold text-[#2F5D46] transition hover:bg-[#F8FCF9]"
      >
        Phản hồi
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[20px] border border-[#CFE3D7] bg-[#F8FCF9] p-4"
    >
      <p className="text-sm font-semibold text-[#1A3021]">Phản hồi tới khách</p>
      <textarea
        value={comment}
        onChange={(event) => {
          setComment(event.target.value);
          setError("");
        }}
        rows={3}
        placeholder="Viết phản hồi từ Host..."
        className="mt-3 w-full rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#6E9C83]"
      />
      {error ? (
        <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setComment("");
            setError("");
          }}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-full bg-[#1A3021] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? (
            <LoaderCircle size={15} className="animate-spin" />
          ) : null}
          {isSubmitting ? "Đang gửi..." : "Gửi phản hồi"}
        </button>
      </div>
    </form>
  );
}

function getInitials(name) {
  const parts = String(name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (!parts.length) {
    return "U";
  }

  return parts.map((part) => part.charAt(0).toUpperCase()).join("");
}

function formatReviewDate(dateString) {
  if (!dateString) {
    return "Mới đây";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
}

function extractDayLabel(item) {
  if (item.dayNumber && Number(item.dayNumber) > 0) {
    return `Ngày ${Number(item.dayNumber)}`;
  }

  const candidates = [item.timeTag, item.title, item.description].filter(
    Boolean,
  );

  for (const candidate of candidates) {
    const match = candidate.match(/ngày\s*\d+/i);
    if (match) {
      const normalized = match[0].replace(/\s+/g, " ").trim();
      return normalized.charAt(0).toUpperCase() + normalized.slice(1);
    }
  }

  return "Lịch trình";
}

function buildZigzagPath(itemCount) {
  const step = 180;
  const centerX = 80;
  const amplitude = 34;
  const startY = 24;
  const tailLength = 42;
  const anchorY = getZigzagAnchorY(itemCount);
  const endY = getZigzagEndY(itemCount);
  let path = `M ${centerX} ${startY}`;

  for (let index = 0; index < Math.max(itemCount - 1, 0); index += 1) {
    const currentY = startY + index * step;
    const nextY = startY + (index + 1) * step;
    const targetX = index % 2 === 0 ? centerX - amplitude : centerX + amplitude;
    const midY = currentY + step / 2;

    path += ` C ${centerX} ${currentY + 40}, ${targetX} ${midY - 30}, ${targetX} ${midY}`;
    path += ` S ${centerX} ${nextY - 40}, ${centerX} ${nextY}`;
  }

  if (itemCount > 0) {
    path += ` L ${centerX} ${anchorY + tailLength}`;
    path += ` L ${centerX} ${endY}`;
  }

  return path;
}

function getZigzagAnchorY(itemCount) {
  const step = 180;
  const startY = 24;
  return startY + Math.max(itemCount - 1, 0) * step;
}

function getZigzagEndY(itemCount) {
  const tailLength = 42;
  return getZigzagAnchorY(itemCount) + (itemCount > 0 ? tailLength : 0);
}

function getZigzagHeight(itemCount) {
  return Math.max(getZigzagEndY(itemCount) + 24, 48);
}

function renderItineraryIcon(item) {
  const content =
    `${item.timeTag ?? ""} ${item.title ?? ""} ${item.description ?? ""}`.toLowerCase();
  const iconClass = "h-4 w-4 text-[#2F5D46] md:h-5 md:w-5";

  if (/ăn|bữa|sáng|trưa|tối|ẩm thực|phở|cháo|cơm/.test(content)) {
    return <UtensilsCrossed className={iconClass} />;
  }
  if (/cà phê|coffee|ngắm bình minh/.test(content)) {
    return <Coffee className={iconClass} />;
  }
  if (/trek|leo|đi bộ|hiking|khám phá/.test(content)) {
    return <Footprints className={iconClass} />;
  }
  if (/núi|đèo|cao nguyên|view|đỉnh/.test(content)) {
    return <Mountain className={iconClass} />;
  }
  if (/trại|ngủ|homestay|cắm trại/.test(content)) {
    return <TentTree className={iconClass} />;
  }
  if (/xe|di chuyển|khởi hành|bus|ô tô/.test(content)) {
    return <Bus className={iconClass} />;
  }
  if (/chụp|ảnh|photo|check-in/.test(content)) {
    return <Camera className={iconClass} />;
  }
  if (/bình minh|sáng sớm/.test(content)) {
    return <Sunrise className={iconClass} />;
  }
  if (/đêm|tối muộn|nghỉ ngơi/.test(content)) {
    return <MoonStar className={iconClass} />;
  }

  return <Sparkles className={iconClass} />;
}

export default ExperienceDetail;
