import {
  Clock3,
  Hammer,
  Leaf,
  MapPinned,
  Mountain,
  Sprout,
  Trees,
  UserRound,
  Users,
  Utensils,
  Wind
} from "lucide-react";
import { motion } from "framer-motion";

const CATEGORY_STYLES = {
  culture: {
    icon: Leaf,
    className: "border-[#CFE3D7] bg-[#E8F3EE] text-[#1A3021]"
  },
  adventure: {
    icon: Mountain,
    className: "border-[#D6E9FB] bg-[#EBF5FF] text-[#1D4E89]"
  },
  healing: {
    icon: Wind,
    className: "border-[#E5D5FA] bg-[#F3E8FF] text-[#6B3FA0]"
  },
  foodie: {
    icon: Utensils,
    className: "border-[#F2DCCB] bg-[#FDF2E9] text-[#9C4F2B]"
  },
  craft: {
    icon: Hammer,
    className: "border-[#E7DCC8] bg-[#F6F0E7] text-[#7B5A2E]"
  },
  agriculture: {
    icon: Sprout,
    className: "border-[#D7E8B8] bg-[#F1F7E3] text-[#557A1F]"
  },
  nature: {
    icon: Trees,
    className: "border-[#CFE7E2] bg-[#EAF7F4] text-[#1E6B60]"
  },
  community: {
    icon: Users,
    className: "border-[#E5D6C8] bg-[#F7F0EA] text-[#7A5230]"
  }
};

function ExperienceCard({ experience, isActive, onSelect, canManage, onEdit, onDelete }) {
  const coverImage = experience.imageUrls?.[0] ?? experience.imageUrl;
  const categories = experience.categories ?? [];
  const averageRating = Number(experience.averageRating ?? 0).toFixed(1);

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(experience.id)}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`group w-full overflow-hidden rounded-[28px] border text-left shadow-[0_18px_50px_rgba(72,59,44,0.12)] transition-colors ${
        isActive
          ? "border-terracotta-400 bg-white"
          : "border-clay-200 bg-white/95 hover:border-forest-300"
      }`}
    >
      <div className="relative overflow-hidden">
        <img
          src={coverImage}
          alt={experience.title}
          className="h-72 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.24em] text-white backdrop-blur-md">
              Nổi bật
            </span>
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-md">
              {experience.price}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-md">
              <Clock3 size={15} />
              {experience.duration}
            </span>
          </div>

          <p className="flex items-center gap-2 text-sm text-clay-100">
            <MapPinned size={16} />
            {experience.location}
          </p>
          <h3 className="mt-2 line-clamp-2 text-2xl font-bold leading-tight text-white sm:text-[1.7rem]">
            {experience.title}
          </h3>
          <div className="mt-2 min-h-[1.5rem]">
            <p className="text-sm font-medium text-yellow-400">
              {`★ ${averageRating} (${experience.totalReviews ?? 0})`}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        {categories.length ? (
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => {
              const categoryConfig = CATEGORY_STYLES[category.slug];
              if (!categoryConfig) {
                return null;
              }

              const CategoryIcon = categoryConfig.icon;

              return (
                <span
                  key={category.id ?? category.slug}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 font-['Be_Vietnam_Pro'] text-xs font-semibold ${categoryConfig.className}`}
                >
                  <CategoryIcon size={14} />
                  {category.name}
                </span>
              );
            })}
          </div>
        ) : null}

        <p className="line-clamp-3 text-sm leading-7 text-stone-600">{experience.description}</p>
        <div className="flex items-center gap-2 text-sm text-stone-600">
          <UserRound size={16} className="text-terracotta-700" />
          <span>
            Đăng bởi: <span className="font-medium text-stone-800">{experience.authorName}</span>
          </span>
        </div>
        {canManage ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onEdit?.(experience);
              }}
              className="rounded-full border border-clay-300 px-3 py-2 text-xs font-semibold text-stone-700"
            >
              Chỉnh sửa
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete?.(experience);
              }}
              className="rounded-full bg-terracotta-700 px-3 py-2 text-xs font-semibold text-clay-50"
            >
              Xóa
            </button>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {experience.highlights.slice(0, 3).map((item) => (
            <span
              key={item}
              className="rounded-full bg-forest-50 px-3 py-1 text-xs font-medium text-forest-700"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}

export default ExperienceCard;
