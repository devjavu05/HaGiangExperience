import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, UploadCloud, X } from "lucide-react";

function MultiImageUpload({
  files,
  previews,
  error,
  isDragging,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onChange,
  onRemove
}) {
  return (
    <div className="space-y-4 sm:col-span-2">
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-800">Bộ ảnh trải nghiệm</label>
        <label
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          className={`relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[30px] border border-dashed px-4 py-8 text-center transition ${
            error
              ? "border-red-300 bg-red-50/70"
              : isDragging
                ? "border-[#6E9C83] bg-[#E8F3EE]"
                : "border-[#CFE3D7] bg-[linear-gradient(180deg,rgba(248,252,249,0.98),rgba(232,243,238,0.96))] hover:border-[#9BC4AE]"
          }`}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(111,160,127,0.18),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(155,196,174,0.18),transparent_28%)]" />
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onChange}
          />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-3xl bg-[#2F5D46] text-white shadow-lg shadow-[#2F5D46]/20">
            {isDragging ? <UploadCloud size={26} /> : <ImagePlus size={26} />}
          </div>
          <p className="relative mt-5 text-base font-semibold text-stone-900">
            Kéo thả ảnh vào đây hoặc bấm để chọn nhiều tệp
          </p>
          <p className="relative mt-2 max-w-lg text-sm leading-7 text-stone-600">
            Giao diện ưu tiên hình ảnh như một bài tạp chí du lịch: ảnh bìa lớn, ảnh nhỏ bên dưới,
            và cả bộ ảnh cùng kể câu chuyện cho trải nghiệm Hà Giang.
          </p>
          <p className="relative mt-3 text-xs uppercase tracking-[0.28em] text-stone-500">
            JPG PNG WEBP • tối đa 10MB / tệp
          </p>
        </label>
        {error ? (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-red-600">{error}</p>
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600">
              Thiếu ảnh
            </span>
          </div>
        ) : null}
      </div>

      <div className="rounded-[30px] bg-[#F1F7F3] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-stone-900">Bảng xem nhanh ảnh</p>
          <span className="text-xs uppercase tracking-[0.24em] text-stone-500">
            {files.length} ảnh
          </span>
        </div>

        {previews.length ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence>
              {previews.map((preview, index) => (
                <motion.div
                  key={preview.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.2 }}
                  className={`group relative overflow-hidden rounded-2xl border bg-white shadow-[0_10px_28px_rgba(70,56,40,0.12)] ${
                    index === 0
                      ? "col-span-2 row-span-2 aspect-[1.18/1] border-[#9BC4AE]"
                      : "aspect-square border-[#E3EEE7]"
                  }`}
                >
                  <img
                    src={preview.url}
                    alt={`Ảnh xem trước ${index + 1}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-xs font-medium text-white">
                    {index === 0 ? "Ảnh nổi bật" : `Khung hình ${index + 1}`}
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(preview.id)}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-black/75"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="mt-4 flex h-56 items-center justify-center rounded-[24px] border border-dashed border-[#CFE3D7] bg-white text-sm text-stone-500">
            Ảnh xem trước sẽ hiển thị tại đây
          </div>
        )}
      </div>
    </div>
  );
}

export default MultiImageUpload;
