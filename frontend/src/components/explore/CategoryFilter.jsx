import { motion } from "framer-motion";
import { EXPERIENCE_CATEGORY_OPTIONS } from "../../constants/experienceCategories";

function CategoryFilter({ selectedSlugs, onToggleCategory }) {
  return (
    <div className="mb-6 w-full px-0 xl:px-10">
      <div className="flex flex-wrap items-center gap-3">
        {EXPERIENCE_CATEGORY_OPTIONS.map((category) => {
          const isActive = selectedSlugs.includes(category.slug);

          return (
            <motion.button
              key={category.slug}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => onToggleCategory(category.slug)}
              className={`rounded-full border px-5 py-3 text-sm font-semibold transition ${
                isActive
                  ? `${category.activeClass} shadow-sm`
                  : `${category.inactiveClass} hover:-translate-y-0.5 hover:shadow-sm`
              }`}
            >
              {category.shortLabel}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export { EXPERIENCE_CATEGORY_OPTIONS as CATEGORY_OPTIONS };
export default CategoryFilter;
