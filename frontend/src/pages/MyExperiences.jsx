import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PencilLine, Trash2, UserRound } from "lucide-react";
import { toAbsoluteAssetUrl } from "../services/api";
import { deleteExperience, getMyExperiences } from "../services/experienceService";

function formatPrice(price) {
  if (price === null || price === undefined || Number.isNaN(Number(price))) {
    return "Liên hệ";
  }

  return new Intl.NumberFormat("vi-VN").format(Number(price)) + " VND";
}

function normalizeExperience(item) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    contentDetail: item.contentDetail,
    activities: item.activities ?? [],
    highlights: item.highlights ?? [],
    duration: item.duration || "Đang cập nhật",
    priceValue: item.price,
    price: formatPrice(item.price),
    authorName: item.authorName || "Người dân bản địa",
    imageUrls: (item.imageUrls ?? []).map(toAbsoluteAssetUrl),
    imageUrl: toAbsoluteAssetUrl(item.imageUrls?.[0]),
    createdAt: item.createdAt
  };
}

function formatDate(dateString) {
  if (!dateString) {
    return "Chưa có ngày đăng";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(dateString));
}

function MyExperiences({ onEditExperience, onDeleteExperienceRequest, refreshSignal = 0, showToast }) {
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyExperiences();
  }, [refreshSignal]);

  async function fetchMyExperiences() {
    try {
      setIsLoading(true);
      const data = await getMyExperiences();
      setExperiences((data ?? []).map(normalizeExperience));
      setError("");
    } catch (fetchError) {
      setError(
        fetchError.response?.data?.message ||
          "Không thể tải danh sách bài đăng của bạn lúc này."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(experience) {
    if (onDeleteExperienceRequest) {
      onDeleteExperienceRequest(experience);
      return;
    }

    try {
      await deleteExperience(experience.id);
      showToast?.({
        type: "success",
        title: "Xóa thành công",
        message: "Bài viết của bạn đã được xóa."
      });
      fetchMyExperiences();
    } catch (deleteError) {
      showToast?.({
        type: "error",
        title: "Xóa thất bại",
        message: deleteError.response?.data?.message || "Không thể xóa bài viết lúc này."
      });
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] px-6 pb-14 pt-32 sm:px-8 sm:pt-36 lg:px-12 xl:px-14 2xl:px-16">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.34em] text-forest-700">
            Quản lý bài đăng
          </p>
          <h2 className="text-4xl font-bold leading-tight text-stone-900 sm:text-5xl">
            Toàn bộ trải nghiệm bạn đã chia sẻ tại Hà Giang
          </h2>
          <p className="max-w-3xl text-base leading-8 text-stone-600">
            Theo dõi nhanh các bài đăng đã xuất bản, chỉnh sửa nội dung hoặc xóa bài không còn phù hợp.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-[28px] border border-clay-200 bg-white p-8 text-sm text-stone-500 shadow-sm">
          Đang tải bài đăng của bạn...
        </div>
      ) : error ? (
        <div className="rounded-[28px] border border-terracotta-200 bg-white p-8 text-sm text-terracotta-700 shadow-sm">
          {error}
        </div>
      ) : experiences.length === 0 ? (
        <div className="rounded-[28px] border border-clay-200 bg-white p-8 text-sm text-stone-500 shadow-sm">
          Bạn chưa có bài đăng nào. Hãy tạo bài đầu tiên để bắt đầu chia sẻ trải nghiệm.
        </div>
      ) : (
        <div className="overflow-hidden rounded-[30px] border border-clay-200 bg-white shadow-[0_18px_50px_rgba(72,59,44,0.08)]">
          <div className="hidden grid-cols-[1.8fr_0.9fr_0.8fr_0.9fr_0.9fr] gap-4 border-b border-clay-200 bg-clay-50 px-6 py-4 text-xs font-semibold uppercase tracking-[0.24em] text-stone-500 md:grid">
            <span>Bài viết</span>
            <span>Người đăng</span>
            <span>Giá</span>
            <span>Ngày đăng</span>
            <span>Thao tác</span>
          </div>

          <div className="divide-y divide-clay-200">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="grid gap-4 px-5 py-5 md:grid-cols-[1.8fr_0.9fr_0.8fr_0.9fr_0.9fr] md:px-6"
              >
                <div className="flex gap-4">
                  <div className="h-20 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-clay-100">
                    {experience.imageUrl ? (
                      <img
                        src={experience.imageUrl}
                        alt={experience.title}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-stone-900">{experience.title}</h3>
                    <p className="line-clamp-2 text-sm leading-6 text-stone-600">
                      {experience.description}
                    </p>
                    <p className="text-sm font-medium text-forest-800">{experience.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-stone-700">
                  <UserRound size={16} className="text-terracotta-700" />
                  <span>{experience.authorName}</span>
                </div>

                <div className="flex items-center text-sm font-semibold text-terracotta-700">
                  {experience.price}
                </div>

                <div className="flex items-center text-sm text-stone-600">
                  {formatDate(experience.createdAt)}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEditExperience?.(experience)}
                    className="inline-flex items-center gap-2 rounded-full border border-clay-300 px-3 py-2 text-xs font-semibold text-stone-700"
                  >
                    <PencilLine size={14} />
                    Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(experience)}
                    className="inline-flex items-center gap-2 rounded-full bg-terracotta-700 px-3 py-2 text-xs font-semibold text-clay-50"
                  >
                    <Trash2 size={14} />
                    Xóa
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyExperiences;
