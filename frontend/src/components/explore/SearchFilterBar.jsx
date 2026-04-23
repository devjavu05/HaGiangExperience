import { ArrowUpDown, Search, SlidersHorizontal, Star } from "lucide-react";

function SearchFilterBar({
  searchValue,
  minPrice,
  maxPrice,
  selectedRating,
  sortValue,
  onSearchChange,
  onMinPriceChange,
  onMaxPriceChange,
  onRatingChange,
  onSortChange,
  onReset
}) {
  return (
    <div className="mb-10 w-full px-0 xl:px-10">
      <div className="rounded-[32px] border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
        <label className="flex h-16 w-full items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-5 shadow-inner shadow-slate-200/40 transition focus-within:border-[#1A3021]/25 focus-within:bg-white">
          <Search size={20} className="shrink-0 text-slate-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm theo tên trải nghiệm, địa chỉ hoặc hoạt động..."
            className="h-full w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label>

        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-[24px] border border-slate-200 bg-slate-50/70 px-4 py-3">
          <span className="text-sm font-semibold text-slate-600">Lọc theo sao:</span>
          {[1, 2, 3, 4, 5].map((rating) => {
            const isActive = selectedRating === rating;

            return (
              <button
                key={rating}
                type="button"
                onClick={() => onRatingChange(isActive ? null : rating)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#1A3021] text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Star
                  size={14}
                  className={isActive ? "fill-current" : "text-yellow-400 fill-yellow-400"}
                />
                {rating} sao
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)_220px_auto]">
          <label className="flex h-16 min-w-0 items-center gap-3 rounded-[24px] border border-[#D7E9DF] bg-[#E8F3EE] px-5">
            <span className="shrink-0 text-base font-semibold text-[#1A3021]">Từ</span>
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(event) => onMinPriceChange(event.target.value)}
              placeholder="0"
              className="min-w-0 flex-1 bg-transparent text-right text-base font-semibold text-[#1A3021] outline-none placeholder:text-[#486152]/70"
            />
          </label>

          <label className="flex h-16 min-w-0 items-center gap-3 rounded-[24px] border border-[#D7E9DF] bg-[#E8F3EE] px-5">
            <span className="shrink-0 text-base font-semibold text-[#1A3021]">Đến</span>
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) => onMaxPriceChange(event.target.value)}
              placeholder="500000"
              className="min-w-0 flex-1 bg-transparent text-right text-base font-semibold text-[#1A3021] outline-none placeholder:text-[#486152]/70"
            />
          </label>

          <label className="flex h-14 items-center gap-3 rounded-full border border-slate-200 bg-white px-4">
            <ArrowUpDown size={16} className="shrink-0 text-slate-500" />
            <select
              value={sortValue}
              onChange={(event) => onSortChange(event.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none"
            >
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá thấp đến cao</option>
              <option value="price-desc">Giá cao đến thấp</option>
            </select>
          </label>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          >
            <SlidersHorizontal size={16} />
            Xóa lọc
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchFilterBar;
