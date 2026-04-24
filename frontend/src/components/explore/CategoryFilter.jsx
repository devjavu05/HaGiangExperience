import { motion } from "framer-motion";

const CATEGORY_OPTIONS = [
  {
    label: "Văn hóa",
    slug: "culture",
    inactiveClass: "bg-[#E8F3EE] text-[#1A3021] border-[#CFE3D7]",
    activeClass: "bg-[#D7E9DF] text-[#1A3021] border-[#1A3021]"
  },
  {
    label: "Chinh phục",
    slug: "adventure",
    inactiveClass: "bg-[#EBF5FF] text-[#1D4E89] border-[#D6E9FB]",
    activeClass: "bg-[#D6E9FB] text-[#1D4E89] border-[#1D4E89]"
  },
  {
    label: "Chữa lành",
    slug: "healing",
    inactiveClass: "bg-[#F3E8FF] text-[#6B3FA0] border-[#E5D5FA]",
    activeClass: "bg-[#E5D5FA] text-[#6B3FA0] border-[#6B3FA0]"
  },
  {
    label: "Ẩm thực",
    slug: "foodie",
    inactiveClass: "bg-[#FDF2E9] text-[#9C4F2B] border-[#F2DCCB]",
    activeClass: "bg-[#F2DCCB] text-[#9C4F2B] border-[#9C4F2B]"
  },
  {
    label: "Thủ công",
    slug: "craft",
    inactiveClass: "bg-[#F6F0E7] text-[#7B5A2E] border-[#E7DCC8]",
    activeClass: "bg-[#EBDDCC] text-[#7B5A2E] border-[#7B5A2E]"
  },
  {
    label: "Nông nghiệp",
    slug: "agriculture",
    inactiveClass: "bg-[#F1F7E3] text-[#557A1F] border-[#D7E8B8]",
    activeClass: "bg-[#E3EECC] text-[#557A1F] border-[#557A1F]"
  },
  {
    label: "Thiên nhiên",
    slug: "nature",
    inactiveClass: "bg-[#EAF7F4] text-[#1E6B60] border-[#CFE7E2]",
    activeClass: "bg-[#D7EEE8] text-[#1E6B60] border-[#1E6B60]"
  },
  {
    label: "Cộng đồng",
    slug: "community",
    inactiveClass: "bg-[#F7F0EA] text-[#7A5230] border-[#E5D6C8]",
    activeClass: "bg-[#EADBCB] text-[#7A5230] border-[#7A5230]"
  }
];

function CategoryFilter({ selectedSlugs, onToggleCategory }) {
  return (
    <div className="mb-6 w-full px-0 xl:px-10">
      <div className="flex flex-wrap items-center gap-3">
        {CATEGORY_OPTIONS.map((category) => {
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
              {category.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export { CATEGORY_OPTIONS };
export default CategoryFilter;
