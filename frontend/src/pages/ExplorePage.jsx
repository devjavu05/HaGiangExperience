import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CategoryFilter from "../components/explore/CategoryFilter";
import SearchFilterBar from "../components/explore/SearchFilterBar";
import ExperienceCard from "../components/experience/ExperienceCard";
import { toAbsoluteAssetUrl } from "../services/api";
import { searchExperiences as searchExperiencesApi } from "../services/experienceService";

function formatPrice(price) {
  if (price === null || price === undefined || Number.isNaN(Number(price))) {
    return "Liên hệ";
  }

  return new Intl.NumberFormat("vi-VN").format(Number(price)) + " VND";
}

function normalizeExperience(item) {
  const imageUrls = (item.imageUrls ?? []).map(toAbsoluteAssetUrl).filter(Boolean);
  const totalReviews = item.totalReviews ?? 0;
  const averageRating = totalReviews > 0 ? Number(item.averageRating ?? 0) : 5;

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    contentDetail: item.contentDetail,
    activities: item.activities ?? [],
    highlights: item.highlights ?? [],
    itinerary: item.itinerary ?? [],
    duration: item.duration || "Đang cập nhật",
    price: formatPrice(item.price),
    priceValue: item.price,
    imageUrls,
    location: item.address || "Hà Giang, Việt Nam",
    address: item.address || "",
    mapsPlaceId: item.mapsPlaceId || "",
    latitude: item.latitude ?? null,
    longitude: item.longitude ?? null,
    averageRating,
    totalReviews,
    ownerId: item.ownerId,
    authorName: item.authorName || "Người dân bản địa",
    categories: item.categories ?? [],
    createdAt: item.createdAt
  };
}

function ExplorePage({ currentUser, onEditExperience, onDeleteExperience }) {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRating, setSelectedRating] = useState(null);
  const [sortValue, setSortValue] = useState("newest");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [isSearching, setIsSearching] = useState(true);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        const response = await searchExperiencesApi({
          q: searchValue.trim(),
          minPrice,
          maxPrice,
          categorySlugs: selectedCategories,
          sort: sortValue,
          page: 0,
          size: 24
        });

        setExperiences((response.content ?? []).map(normalizeExperience));
        setSearchError("");
      } catch (fetchError) {
        setSearchError(
          fetchError.response?.data?.message || "Không thể tải danh sách trải nghiệm lúc này."
        );
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchValue, minPrice, maxPrice, selectedCategories, sortValue]);

  const displayedExperiences = useMemo(() => {
    const filteredByRating = selectedRating
      ? experiences.filter((experience) => {
          const averageRating = Number(experience.averageRating ?? 0);
          const minRating = selectedRating === 1 ? 0 : selectedRating;
          const maxRating = selectedRating === 5 ? 5 : selectedRating + 0.9;

          return averageRating >= minRating && averageRating <= maxRating;
        })
      : experiences;

    return [...filteredByRating].sort((first, second) => {
      const firstPrice = Number(first.priceValue ?? 0);
      const secondPrice = Number(second.priceValue ?? 0);

      if (sortValue === "price-asc") {
        return firstPrice - secondPrice;
      }

      if (sortValue === "price-desc") {
        return secondPrice - firstPrice;
      }

      return new Date(second.createdAt || 0) - new Date(first.createdAt || 0);
    });
  }, [experiences, selectedRating, sortValue]);

  function handleToggleCategory(slug) {
    setSelectedCategories((current) =>
      current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]
    );
  }

  function handleResetFilters() {
    setSearchValue("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedRating(null);
    setSortValue("newest");
    setSelectedCategories([]);
    setSearchError("");
  }

  return (
    <section
      id="featured-experiences"
      className="mx-auto flex min-h-screen w-full max-w-[1600px] items-start px-6 pb-24 pt-32 sm:px-8 sm:pt-36 lg:px-12 xl:px-14 2xl:px-16"
    >
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Explore</p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-900 sm:text-4xl">
            Tất cả trải nghiệm Hà Giang
          </h1>
        </motion.div>

        <CategoryFilter selectedSlugs={selectedCategories} onToggleCategory={handleToggleCategory} />

        <SearchFilterBar
          searchValue={searchValue}
          minPrice={minPrice}
          maxPrice={maxPrice}
          selectedRating={selectedRating}
          sortValue={sortValue}
          onSearchChange={setSearchValue}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
          onRatingChange={setSelectedRating}
          onSortChange={setSortValue}
          onReset={handleResetFilters}
        />

        {isSearching ? (
          <div className="rounded-[28px] border border-clay-200 bg-white p-8 text-sm text-stone-500 shadow-sm">
            Đang tải danh sách bài đăng từ hệ thống...
          </div>
        ) : searchError ? (
          <div className="rounded-[28px] border border-terracotta-200 bg-white p-8 text-sm text-terracotta-700 shadow-sm">
            {searchError}
          </div>
        ) : displayedExperiences.length === 0 ? (
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
            Chưa có trải nghiệm phù hợp với bộ lọc hiện tại. Hãy thử đổi từ khóa, khoảng giá hoặc danh mục.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {displayedExperiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
              >
                <ExperienceCard
                  experience={experience}
                  isActive={false}
                  canManage={Boolean(currentUser?.id && currentUser.id === experience.ownerId)}
                  onEdit={onEditExperience}
                  onDelete={onDeleteExperience}
                  onSelect={(id) => navigate(`/experience/${id}`)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ExplorePage;
