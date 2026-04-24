import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Clock3,
  LoaderCircle,
  MapPinned,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  X
} from "lucide-react";
import MultiImageUpload from "../components/experience/MultiImageUpload";
import { createExperience, updateExperience } from "../services/experienceService";

const CATEGORY_OPTIONS = [
  {
    id: 1,
    slug: "culture",
    label: "Văn hóa & Đời sống",
    className: "border-[#CFE3D7] bg-[#E8F3EE] text-[#1A3021]",
    activeClass: "border-[#1A3021] bg-[#D7E9DF] text-[#1A3021]"
  },
  {
    id: 2,
    slug: "adventure",
    label: "Chinh phục & Khám phá",
    className: "border-[#D6E9FB] bg-[#EBF5FF] text-[#1D4E89]",
    activeClass: "border-[#1D4E89] bg-[#D6E9FB] text-[#1D4E89]"
  },
  {
    id: 3,
    slug: "healing",
    label: "Nghỉ dưỡng & Chữa lành",
    className: "border-[#E5D5FA] bg-[#F3E8FF] text-[#6B3FA0]",
    activeClass: "border-[#6B3FA0] bg-[#E5D5FA] text-[#6B3FA0]"
  },
  {
    id: 4,
    slug: "foodie",
    label: "Ẩm thực bản địa",
    className: "border-[#F1DEB6] bg-[#FFF5DC] text-[#9A6A18]",
    activeClass: "border-[#C6922D] bg-[#F7E8BF] text-[#7A5312]"
  },
  {
    id: 5,
    slug: "craft",
    label: "Thủ Công & Truyền Thống",
    className: "border-[#E7DCC8] bg-[#F6F0E7] text-[#7B5A2E]",
    activeClass: "border-[#7B5A2E] bg-[#EBDDCC] text-[#6A4A21]"
  },
  {
    id: 6,
    slug: "agriculture",
    label: "Nông nghiệp",
    className: "border-[#D7E8B8] bg-[#F1F7E3] text-[#557A1F]",
    activeClass: "border-[#557A1F] bg-[#E3EECC] text-[#476619]"
  },
  {
    id: 7,
    slug: "nature",
    label: "Thiên nhiên",
    className: "border-[#CFE7E2] bg-[#EAF7F4] text-[#1E6B60]",
    activeClass: "border-[#1E6B60] bg-[#D7EEE8] text-[#15564C]"
  },
  {
    id: 8,
    slug: "community",
    label: "Du lịch cộng đồng",
    className: "border-[#E5D6C8] bg-[#F7F0EA] text-[#7A5230]",
    activeClass: "border-[#7A5230] bg-[#EADBCB] text-[#654226]"
  }
];

const initialForm = {
  title: "",
  description: "",
  contentDetail: "",
  activities: [""],
  highlights: [""],
  scheduleType: "hourly",
  hourCount: 1,
  dayCount: 1,
  itinerary: [{ dayNumber: 1, timeTag: "", title: "", description: "" }],
  price: "",
  address: "",
  categoryIds: [],
  categorySlugs: [],
  mapsPlaceId: "",
  latitude: "",
  longitude: "",
  files: [],
  existingImageUrls: [],
  existingImages: []
};

function CreateExperienceForm({
  mode = "create",
  initialData = null,
  onSuccess,
  onCancel,
  showToast
}) {
  const normalizedInitialItinerary = useMemo(() => {
    const items = initialData?.itinerary?.length
      ? initialData.itinerary.map((item) => ({
          id: item.id,
          dayNumber: item.dayNumber ?? 1,
          timeTag: item.timeTag ?? "",
          title: item.title ?? "",
          description: item.description ?? ""
        }))
      : [{ dayNumber: 1, timeTag: "", title: "", description: "" }];

    return items;
  }, [initialData]);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [previews, setPreviews] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!initialData) {
      setForm(initialForm);
      return;
    }

    setForm({
      title: initialData.title ?? "",
      description: initialData.description ?? "",
      contentDetail: initialData.contentDetail ?? "",
      activities: initialData.activities?.length ? initialData.activities : [""],
      highlights: initialData.highlights?.length ? initialData.highlights : [""],
      scheduleType:
        Math.max(...normalizedInitialItinerary.map((item) => Number(item.dayNumber) || 1)) > 1
          ? "daily"
          : "hourly",
      hourCount: parseHourCount(initialData.duration),
      dayCount: Math.max(...normalizedInitialItinerary.map((item) => Number(item.dayNumber) || 1)),
      itinerary: normalizedInitialItinerary,
      price: initialData.priceValue ?? initialData.price ?? "",
      address: initialData.address ?? "",
      categoryIds:
        initialData.categoryIds ??
        (initialData.categories ?? []).map((category) => category.id).filter(Boolean),
      categorySlugs: (initialData.categories ?? []).map((category) => category.slug).filter(Boolean),
      mapsPlaceId: initialData.mapsPlaceId ?? "",
      latitude: initialData.latitude ?? "",
      longitude: initialData.longitude ?? "",
      files: [],
      existingImageUrls: initialData.existingImageUrls ?? initialData.imageUrls ?? [],
      existingImages:
        initialData.existingImages ??
        (initialData.imageUrls ?? []).map((url) => ({
          originalUrl: url,
          previewUrl: url
        }))
    });
  }, [initialData, normalizedInitialItinerary]);

  useEffect(() => {
    if (!form.files.length) {
      setPreviews([]);
      return undefined;
    }

    const nextPreviews = form.files.map((file) => ({
      id: `${file.name}-${file.lastModified}-${file.size}`,
      url: URL.createObjectURL(file)
    }));
    setPreviews(nextPreviews);

    return () => {
      nextPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [form.files]);

  const canRemoveActivity = useMemo(() => form.activities.length > 1, [form.activities.length]);
  const canRemoveHighlight = useMemo(() => form.highlights.length > 1, [form.highlights.length]);
  const canRemoveItinerary = useMemo(() => form.itinerary.length > 1, [form.itinerary.length]);
  const totalImages = form.existingImageUrls.length + form.files.length;
  const isEditMode = mode === "edit";
  const previewCoverImage = previews[0]?.url ?? form.existingImages[0]?.previewUrl ?? "";
  const previewCategoryLabels = CATEGORY_OPTIONS.filter((category) =>
    form.categorySlugs.includes(category.slug)
  ).map((category) => category.label);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function toggleCategory(category) {
    setForm((current) => {
      const isSelected = current.categorySlugs.includes(category.slug);

      return {
        ...current,
        categoryIds: isSelected
          ? current.categoryIds.filter((id) => id !== category.id)
          : current.categoryIds,
        categorySlugs: isSelected
          ? current.categorySlugs.filter((slug) => slug !== category.slug)
          : [...current.categorySlugs, category.slug]
      };
    });
    setErrors((current) => ({ ...current, categoryIds: "" }));
  }

  function updateListField(field, index, value) {
    setForm((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) => (itemIndex === index ? value : item))
    }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function addListItem(field) {
    setForm((current) => ({ ...current, [field]: [...current[field], ""] }));
  }

  function updateScheduleType(nextType) {
    setForm((current) => ({
      ...current,
      scheduleType: nextType,
      hourCount: nextType === "hourly" ? Math.max(current.hourCount || 1, 1) : current.hourCount,
      dayCount: nextType === "daily" ? Math.max(current.dayCount || 1, 2) : 1,
      itinerary: current.itinerary.map((item) => ({
        ...item,
        dayNumber:
          nextType === "daily"
            ? Math.min(Math.max(Number(item.dayNumber) || 1, 1), Math.max(current.dayCount || 1, 2))
            : 1
      }))
    }));
  }

  function updateDayCount(value) {
    if (value === "") {
      setForm((current) => ({
        ...current,
        dayCount: ""
      }));
      return;
    }

    const nextDayCount = Math.max(Number(value) || 1, 1);

    setForm((current) => ({
      ...current,
      dayCount: nextDayCount,
      itinerary: current.itinerary
        .map((item) => ({
          ...item,
          dayNumber: Math.min(Math.max(Number(item.dayNumber) || 1, 1), nextDayCount)
        }))
        .filter((item) => (current.scheduleType === "daily" ? item.dayNumber <= nextDayCount : true))
    }));
  }

  function normalizeDayCount() {
    setForm((current) => {
      const nextDayCount = Math.max(Number(current.dayCount) || 1, 1);

      return {
        ...current,
        dayCount: nextDayCount,
        itinerary: current.itinerary
          .map((item) => ({
            ...item,
            dayNumber: Math.min(Math.max(Number(item.dayNumber) || 1, 1), nextDayCount)
          }))
          .filter((item) =>
            current.scheduleType === "daily" ? item.dayNumber <= nextDayCount : true
          )
      };
    });
  }

  function addItineraryItem(dayNumber = 1) {
    setForm((current) => ({
      ...current,
      itinerary: [
        ...current.itinerary,
        {
          dayNumber,
          timeTag: "",
          title: "",
          description: ""
        }
      ]
    }));
  }

  function removeListItem(field, index) {
    setForm((current) => ({
      ...current,
      [field]: current[field].filter((_, itemIndex) => itemIndex !== index)
    }));
  }

  function updateItineraryField(index, field, value) {
    setForm((current) => ({
      ...current,
      itinerary: current.itinerary.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      )
    }));
  }

  function removeItineraryItem(index) {
    setForm((current) => ({
      ...current,
      itinerary: current.itinerary.filter((_, itemIndex) => itemIndex !== index)
    }));
  }

  const itinerarySections = useMemo(() => {
    if (form.scheduleType === "daily") {
      return Array.from({ length: Math.max(form.dayCount || 1, 1) }, (_, index) => ({
        dayNumber: index + 1,
        label: `Ngày ${index + 1}`,
        items: form.itinerary
          .map((item, itemIndex) => ({ ...item, _index: itemIndex }))
          .filter((item) => (Number(item.dayNumber) || 1) === index + 1)
      }));
    }

    return [
      {
        dayNumber: 1,
        label: "Theo giờ",
        items: form.itinerary.map((item, itemIndex) => ({ ...item, _index: itemIndex }))
      }
    ];
  }, [form.dayCount, form.itinerary, form.scheduleType]);

  const computedDuration = useMemo(
    () => buildDurationLabel(form.scheduleType, form.hourCount, form.dayCount),
    [form.dayCount, form.hourCount, form.scheduleType]
  );

  function mergeFiles(nextFiles) {
    if (!nextFiles.length) {
      return;
    }

    setForm((current) => {
      const existingKeys = new Set(
        current.files.map((file) => `${file.name}-${file.lastModified}-${file.size}`)
      );
      const mergedFiles = [
        ...current.files,
        ...nextFiles.filter(
          (file) => !existingKeys.has(`${file.name}-${file.lastModified}-${file.size}`)
        )
      ];

      return { ...current, files: mergedFiles };
    });
    setErrors((current) => ({ ...current, files: "" }));
  }

  function handleFilesChange(event) {
    mergeFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function handleDragEnter(event) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event) {
    event.preventDefault();
    if (event.currentTarget.contains(event.relatedTarget)) {
      return;
    }
    setIsDragging(false);
  }

  function handleDragOver(event) {
    event.preventDefault();
    setIsDragging(true);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    mergeFiles(Array.from(event.dataTransfer.files ?? []));
  }

  function removeSelectedFile(previewId) {
    setForm((current) => ({
      ...current,
      files: current.files.filter(
        (file) => `${file.name}-${file.lastModified}-${file.size}` !== previewId
      )
    }));
  }

  function removeExistingImage(imageUrl) {
    setForm((current) => ({
      ...current,
      existingImageUrls: current.existingImageUrls.filter((url) => url !== imageUrl),
      existingImages: current.existingImages.filter((image) => image.originalUrl !== imageUrl)
    }));
  }

  function validateForm() {
    const nextErrors = {};

    if (!form.title.trim()) nextErrors.title = "Vui lòng nhập tiêu đề.";
    if (!form.description.trim()) nextErrors.description = "Vui lòng nhập mô tả ngắn.";
    if (!form.contentDetail.trim()) nextErrors.contentDetail = "Vui lòng nhập nội dung chi tiết.";
    if (!form.price || Number(form.price) <= 0) nextErrors.price = "Giá phải lớn hơn 0.";
    if (!form.address.trim()) nextErrors.address = "Vui lòng nhập địa chỉ trải nghiệm.";
    if (!form.categoryIds.length) nextErrors.categoryIds = "Vui lòng chọn ít nhất 1 danh mục.";
    if (totalImages === 0) nextErrors.files = "Vui lòng giữ lại hoặc tải lên ít nhất 1 ảnh.";
    if (form.scheduleType === "hourly" && (!form.hourCount || Number(form.hourCount) <= 0)) {
      nextErrors.hourCount = "Vui lòng nhập số giờ hợp lệ.";
    }

    const cleanedActivities = form.activities.map((item) => item.trim()).filter(Boolean);
    const cleanedHighlights = form.highlights.map((item) => item.trim()).filter(Boolean);
    const cleanedItinerary = form.itinerary
      .map((item) => ({
        dayNumber: Number(item.dayNumber) > 0 ? Number(item.dayNumber) : 1,
        timeTag: item.timeTag?.trim() ?? "",
        title: item.title?.trim() ?? "",
        description: item.description?.trim() ?? ""
      }))
      .filter((item) => item.timeTag || item.title || item.description)
      .filter((item) => item.timeTag && item.title && item.description);

    if (!cleanedActivities.length) nextErrors.activities = "Cần ít nhất 1 hoạt động.";
    if (!cleanedHighlights.length) nextErrors.highlights = "Cần ít nhất 1 điểm nhấn.";

    setErrors(nextErrors);

    return {
      isValid: Object.keys(nextErrors).length === 0,
      errors: nextErrors,
      cleanedActivities,
      cleanedHighlights,
      cleanedItinerary
    };
  }

  function scrollToFirstError(nextErrors) {
    const fieldOrder = [
      "title",
      "description",
      "address",
      "categoryIds",
      "contentDetail",
      "activities",
      "highlights",
      "price",
      "hourCount",
      "files"
    ];

    const firstErrorField = fieldOrder.find((field) => nextErrors[field]);
    if (!firstErrorField) {
      return;
    }

    requestAnimationFrame(() => {
      const target = document.querySelector(`[data-field="${firstErrorField}"]`);
      if (!target) {
        return;
      }

      target.scrollIntoView({ behavior: "smooth", block: "center" });

      const focusable = target.querySelector("input, textarea, select, button");
      focusable?.focus?.({ preventScroll: true });
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setHasAttemptedSubmit(true);

    const { isValid, errors: nextErrors, cleanedActivities, cleanedHighlights, cleanedItinerary } =
      validateForm();
    if (!isValid) {
      scrollToFirstError(nextErrors);
      showToast({
        type: "error",
        title: "Thông tin chưa đầy đủ",
        message: "Hãy kiểm tra lại các trường bắt buộc trước khi lưu bài."
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...form,
        address: form.address.trim(),
        duration: computedDuration,
        mapsPlaceId: "",
        latitude: "",
        longitude: "",
        activities: cleanedActivities,
        highlights: cleanedHighlights,
        itinerary: cleanedItinerary,
        categoryIds: [],
        categorySlugs: form.categorySlugs
      };

      const savedExperience = isEditMode
        ? await updateExperience(initialData.id, payload)
        : await createExperience(payload);

      showToast({
        type: "success",
        title: isEditMode ? "Cập nhật thành công" : "Đăng bài thành công",
        message: isEditMode
          ? "Bài trải nghiệm đã được cập nhật."
          : "Bộ ảnh, địa chỉ và bài viết đã được lưu thành công trên hệ thống."
      });
      onSuccess?.(savedExperience);
    } catch (error) {
      showToast({
        type: "error",
        title: isEditMode ? "Cập nhật thất bại" : "Đăng bài thất bại",
        message:
          error.response?.data?.message ||
          "Không thể lưu bài viết lúc này. Vui lòng thử lại."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const visibleErrors = hasAttemptedSubmit ? errors : {};

  return (
    <>
      <AnimatePresence>
        {isSubmitting ? (
          <motion.div
            key="submit-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-[#163020]/45 px-6 backdrop-blur-[6px]"
            aria-live="polite"
            aria-busy="true"
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="w-full max-w-sm rounded-[32px] border border-white/40 bg-white/92 p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.22)]"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#2F5D46,#6E9C83)] text-white shadow-[0_16px_40px_rgba(47,93,70,0.28)]">
                <LoaderCircle size={28} className="animate-spin" />
              </div>
              <p className="mt-5 text-lg font-semibold text-stone-900">
                {isEditMode ? "Đang cập nhật bài đăng" : "Đang đăng bài trải nghiệm"}
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Vui lòng chờ trong giây lát. Nội dung đang được lưu và tạm thời bị khóa chỉnh sửa.
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="mx-auto w-full max-w-[1600px] px-6 pb-12 pt-32 sm:px-8 sm:pb-14 sm:pt-36 lg:px-12 xl:px-14 2xl:px-16">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]"
      >
        <div className="self-start rounded-[36px] border border-[#CFE3D7] bg-[linear-gradient(180deg,#F6FBF7,#EDF6F0)] p-4 shadow-[0_20px_50px_rgba(111,160,127,0.08)] lg:sticky lg:top-32 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto">
          <div className="mb-4 flex items-center justify-between gap-3 rounded-[24px] border border-[#DDEBE1] bg-white/80 px-4 py-3 backdrop-blur-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6E9C83]">
                Khu xem trước
              </p>
              <p className="mt-1 text-sm font-medium text-[#2F5D46]">
                Mô phỏng giao diện bài đăng ở web mini
              </p>
            </div>
            <span className="rounded-full bg-[#E8F3EE] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2F5D46]">
              Preview
            </span>
          </div>

          <LiveExperiencePreview
            title={form.title}
            description={form.description}
            contentDetail={form.contentDetail}
            address={form.address}
            coverImage={previewCoverImage}
            categoryLabels={previewCategoryLabels}
            duration={computedDuration}
            price={form.price}
            activities={form.activities}
            highlights={form.highlights}
            scheduleType={form.scheduleType}
          />
        </div>

        <div className="rounded-[36px] border border-slate-200 bg-white p-4 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-5">
          <div className="mb-5 flex items-center justify-between gap-3 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Khu nhập liệu
              </p>
              <p className="mt-1 text-sm font-medium text-stone-800">
                Điền nội dung bài đăng và bộ ảnh chi tiết
              </p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 shadow-sm">
              Form
            </span>
          </div>

          <form onSubmit={handleSubmit} className="relative space-y-8" aria-busy={isSubmitting}>
            <fieldset disabled={isSubmitting} className="space-y-8 disabled:cursor-wait">
              <SectionCard
              title="Thông tin cơ bản"
              description="Thiết lập những thông tin đầu tiên để du khách nhận ra trải nghiệm của bạn ngay từ cái nhìn đầu."
              >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Tiêu đề"
                  error={visibleErrors.title}
                  className="field:title sm:col-span-2"
                  input={
                    <input
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                    placeholder="[HOÀNG SU PHÌ] Hái trà Shan Tuyết"
                      className={inputClass(visibleErrors.title)}
                    />
                  }
                />

                <Field
                  label="Mô tả ngắn"
                  error={visibleErrors.description}
                  className="field:description sm:col-span-2"
                  input={
                    <textarea
                    value={form.description}
                    onChange={(event) => updateField("description", event.target.value)}
                    rows={3}
                      className={inputClass(visibleErrors.description)}
                    />
                  }
                />

                <Field
                  label="Địa chỉ trải nghiệm"
                  error={visibleErrors.address}
                  className="field:address sm:col-span-2"
                  helperText="Nhập địa chỉ chi tiết, ví dụ: Thôn Phìn Hồ, Thông Nguyên, Hoàng Su Phì, Hà Giang."
                  input={
                    <input
                    value={form.address}
                    onChange={(event) => updateField("address", event.target.value)}
                    placeholder="Ví dụ: Thôn Phìn Hồ, Thông Nguyên, Hoàng Su Phì, Hà Giang"
                      className={inputClass(visibleErrors.address)}
                    />
                  }
                />

                <CategoryChipsField
                  selectedSlugs={form.categorySlugs}
                  error={visibleErrors.categoryIds}
                  onToggle={toggleCategory}
                />
              </div>
              </SectionCard>

              <SectionCard
              title="Chi tiết trải nghiệm"
              description="Đây là phần kể chuyện chính. Hãy mô tả rõ hoạt động và những điều khiến hành trình của bạn đáng nhớ."
              >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Nội dung chi tiết"
                  error={visibleErrors.contentDetail}
                  className="field:contentDetail sm:col-span-2"
                  input={
                    <textarea
                    value={form.contentDetail}
                    onChange={(event) => updateField("contentDetail", event.target.value)}
                    rows={5}
                      className={inputClass(visibleErrors.contentDetail)}
                    />
                  }
                />

                <DynamicListField
                  label="Hoạt động"
                  fieldName="activities"
                  items={form.activities}
                  error={visibleErrors.activities}
                  onAdd={() => addListItem("activities")}
                  onChange={(index, value) => updateListField("activities", index, value)}
                  onRemove={(index) => removeListItem("activities", index)}
                  canRemove={canRemoveActivity}
                  placeholder="Ví dụ: Hái trà cùng host"
                />

                <DynamicListField
                  label="Điểm nhấn"
                  fieldName="highlights"
                  items={form.highlights}
                  error={visibleErrors.highlights}
                  onAdd={() => addListItem("highlights")}
                  onChange={(index, value) => updateListField("highlights", index, value)}
                  onRemove={(index) => removeListItem("highlights", index)}
                  canRemove={canRemoveHighlight}
                  placeholder="Ví dụ: View ruộng bậc thang"
                />
              </div>
              </SectionCard>

              <SectionCard
                title="Thiết lập giá & Lịch trình"
                description="Chọn giá, thời lượng và cách hiển thị lịch trình để khách dễ hình dung nhịp trải nghiệm."
              >
                <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Giá"
                  className="field:price"
                  error={visibleErrors.price}
                  input={
                    <input
                      type="number"
                      min="0"
                      value={form.price}
                      onChange={(event) => updateField("price", event.target.value)}
                    className={inputClass(visibleErrors.price)}
                    />
                  }
                />

              {form.scheduleType === "hourly" ? (
                <Field
                  label="Số giờ trải nghiệm"
                  className="field:hourCount"
                  error={visibleErrors.hourCount}
                  input={
                    <input
                      type="number"
                      min="1"
                      value={form.hourCount}
                      onChange={(event) => updateField("hourCount", event.target.value)}
                      className={inputClass(visibleErrors.hourCount)}
                    />
                  }
                  helperText={`Thời lượng sẽ tự động hiển thị là: ${computedDuration}`}
                />
              ) : (
                <div className="hidden sm:block" />
              )}

              <div className="space-y-4 rounded-[28px] bg-[#F1F7F3] p-4 sm:col-span-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-800">Kiểu lịch trình</label>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => updateScheduleType("hourly")}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        form.scheduleType === "hourly"
                          ? "bg-[#1A3021] text-white shadow-md"
                          : "bg-[#F8FCF9] text-[#486152] shadow-sm"
                      }`}
                    >
                      Theo Giờ
                    </button>
                    <button
                      type="button"
                      onClick={() => updateScheduleType("daily")}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        form.scheduleType === "daily"
                          ? "bg-[#1A3021] text-white shadow-md"
                          : "bg-[#F8FCF9] text-[#486152] shadow-sm"
                      }`}
                    >
                      Theo Ngày
                    </button>
                  </div>
                </div>

                {form.scheduleType === "daily" ? (
                  <Field
                    label="Số lượng ngày"
                    input={
                      <input
                        type="number"
                        min="1"
                        value={form.dayCount}
                        onChange={(event) => updateDayCount(event.target.value)}
                        onBlur={normalizeDayCount}
                        className={inputClass(false)}
                      />
                    }
                  />
                ) : null}
              </div>

                  <ItineraryFieldV2
                    scheduleType={form.scheduleType}
                    sections={itinerarySections}
                    onAdd={addItineraryItem}
                    onChange={updateItineraryField}
                    onRemove={removeItineraryItem}
                    canRemove={canRemoveItinerary}
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="Hình ảnh trải nghiệm"
                description="Chọn bộ ảnh đẹp nhất để kể câu chuyện thị giác và tăng sức hút cho bài đăng."
              >
                <div className="grid gap-5 sm:grid-cols-2">
              {isEditMode ? (
                <ExistingImageStrip
                  images={form.existingImages}
                  onRemove={removeExistingImage}
                />
              ) : null}

              <div data-field="files" className="sm:col-span-2">
                <MultiImageUpload
                  files={form.files}
                  previews={previews}
                  error={visibleErrors.files}
                  isDragging={isDragging}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onChange={handleFilesChange}
                  onRemove={removeSelectedFile}
                />
              </div>
                </div>
              </SectionCard>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onCancel ?? onSuccess}
                  className="rounded-full border border-[#CFE3D7] bg-white px-5 py-3 text-sm font-semibold text-[#486152]"
                >
                  Hủy và quay về trang chủ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-full bg-[#2F5D46] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2F5D46]/20 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting
                    ? isEditMode
                      ? "Đang cập nhật..."
                      : "Đang gửi bài..."
                    : isEditMode
                      ? "Lưu thay đổi"
                      : "Đăng bài trải nghiệm"}
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </motion.section>
      </div>
    </>
  );
}

function SectionCard({ title, description, children }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-[#FCFDFC] p-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
      <div className="mb-6 space-y-2">
        <h3 className="text-xl font-semibold text-stone-900">{title}</h3>
        <p className="text-sm leading-7 text-stone-600">{description}</p>
      </div>
      {children}
    </div>
  );
}

function LiveExperiencePreview({
  title,
  description,
  contentDetail,
  address,
  coverImage,
  categoryLabels,
  duration,
  price,
  activities,
  highlights,
  scheduleType
}) {
  const previewTitle = title.trim() || "Tiêu đề trải nghiệm sẽ hiện ở đây";
  const previewDescription =
    description.trim() || "Mô tả ngắn sẽ giúp host hình dung cách bài đăng xuất hiện với du khách.";
  const previewDetail =
    contentDetail.trim() || "Nội dung chi tiết sẽ hiện ở đây khi bạn bắt đầu kể câu chuyện trải nghiệm.";
  const previewAddress = address.trim() || "Địa chỉ trải nghiệm sẽ hiển thị ở đây";
  const previewPrice =
    price && Number(price) > 0 ? `${Number(price).toLocaleString("vi-VN")} VND` : "Giá sẽ cập nhật";
  const liveActivities = activities.map((item) => item.trim()).filter(Boolean).slice(0, 2);
  const liveHighlights = highlights.map((item) => item.trim()).filter(Boolean).slice(0, 2);
  const previewMode = scheduleType === "daily" ? "Theo ngày" : "Theo giờ";
  const shortDetail =
    previewDetail.length > 220 ? `${previewDetail.slice(0, 220).trim()}...` : previewDetail;

  return (
    <div className="rounded-[30px] border border-slate-100 bg-white p-5 shadow-[0_18px_45px_rgba(79,63,49,0.1)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-stone-900">Xem trước bài viết</p>
          <p className="mt-1 text-xs leading-6 text-stone-500">
            Bản xem trước này mô phỏng trang chi tiết ở web bản mini và sẽ cập nhật ngay khi bạn nhập.
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-600">
          Mini Web Preview
        </span>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-[#f5f7f6] shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <div className="border-b border-slate-200 bg-white/90 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#9BC4AE]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#CFE3D7]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#62c554]" />
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-500">
              /experience/preview
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-4 xl:grid-cols-[1.35fr_0.8fr]">
          <div className="space-y-4">
            <div className="relative aspect-[16/9] overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#edf4ee,#d9e8dc)]">
            <AnimatePresence mode="wait">
              {coverImage ? (
                <motion.img
                  key={coverImage}
                  src={coverImage}
                  alt="Xem trước bài viết"
                  className="h-full w-full object-cover"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                />
              ) : (
                <motion.div
                  key="empty-cover"
                  className="flex h-full items-center justify-center px-6 text-center text-sm leading-7 text-stone-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Ảnh bìa đầu tiên bạn chọn sẽ xuất hiện ở đây.
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-5 pb-5 pt-12">
              <div className="flex flex-wrap gap-2">
                {categoryLabels.length ? (
                  categoryLabels.map((label) => (
                    <span
                      key={label}
                      className="rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-stone-900"
                    >
                      {label}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-stone-700">
                    Chưa chọn danh mục
                  </span>
                )}
              </div>
            </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="rounded-full bg-[#E8F3EE] px-3 py-1.5 font-semibold text-[#2F5D46]">
                  Trải nghiệm nổi bật
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-800">
                  <MapPinned size={14} className="text-emerald-700" />
                  {previewAddress}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.h4
                  key={previewTitle}
                  className="text-2xl font-bold leading-tight text-[#1A3021]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.16 }}
                >
                  {previewTitle}
                </motion.h4>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.p
                  key={previewDescription}
                  className="text-sm leading-7 text-stone-600"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.16 }}
                >
                  {previewDescription}
                </motion.p>
              </AnimatePresence>

              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                  <Clock3 size={15} className="text-slate-600" />
                  {duration}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                  <UserRound size={15} className="text-[#486152]" />
                  Đăng bởi: Host địa phương
                </span>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-100 bg-white px-5 py-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                Mô tả hành trình
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{shortDetail}</p>
            </div>

            <div className="grid gap-3 text-xs md:grid-cols-2">
              <div className="rounded-[24px] bg-[#E8F3EE] p-4">
                <p className="uppercase tracking-[0.24em] text-[#5f7a64]">Hoạt động</p>
                <div className="mt-3 space-y-2">
                  {liveActivities.length ? (
                    liveActivities.map((item) => (
                      <p key={item} className="text-sm leading-6 text-[#1A3021]">
                        {item}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm leading-6 text-[#5f7a64]">Chưa có hoạt động</p>
                  )}
                </div>
              </div>

              <div className="rounded-[24px] bg-[#EAF5EE] p-4">
                <p className="uppercase tracking-[0.24em] text-[#5f7a64]">Điểm nhấn</p>
                <div className="mt-3 space-y-2">
                  {liveHighlights.length ? (
                    liveHighlights.map((item) => (
                      <p key={item} className="text-sm leading-6 text-[#2F5D46]">
                        {item}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm leading-6 text-[#5f7a64]">Chưa có điểm nhấn</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <aside>
            <div className="overflow-hidden rounded-[24px] border border-slate-100 bg-white shadow-sm">
              <div className="relative overflow-hidden px-5 py-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(26,48,33,0.05),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(148,163,184,0.08),transparent_26%)]" />
                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                      Booking card
                    </p>
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#1A3021] shadow-sm">
                      <ShieldCheck size={12} />
                      Xác nhận nhanh
                    </span>
                  </div>

                  <div className="mt-4 rounded-[20px] bg-[#E8F3EE] px-4 py-4">
                    <p className="text-sm font-medium text-slate-500">Giá trải nghiệm</p>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-[#1A3021]">
                      {previewPrice}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-5">
                <div className="grid gap-3 rounded-[20px] border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-500">Thời lượng</span>
                    <span className="font-semibold text-slate-900">{duration}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-500">Lịch trình</span>
                    <span className="font-semibold text-slate-900">{previewMode}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-slate-500">Địa điểm</span>
                    <span className="text-right font-semibold text-slate-900">{previewAddress}</span>
                  </div>
                </div>

                <div className="rounded-[20px] bg-[#EAF5EE] p-4">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#1A3021]">
                    <Sparkles size={15} className="text-[#2F5D46]" />
                    Điều khách sẽ thấy đầu tiên
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    Ảnh bìa, tiêu đề, giá và điểm nổi bật ở đây sẽ quyết định ấn tượng ban đầu của bài đăng.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ExistingImageStrip({ images, onRemove }) {
  return (
    <div className="space-y-4 sm:col-span-2">
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-800">Ảnh hiện tại</label>
        <span className="text-xs uppercase tracking-[0.24em] text-stone-500">{images.length} ảnh</span>
      </div>
      {images.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={image.originalUrl}
              className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm ${
                index === 0 ? "ring-2 ring-[#9BC4AE]" : "border-[#DDEBE1]"
              }`}
            >
              <img
                src={image.previewUrl}
                alt={`Ảnh hiện tại ${index + 1}`}
                className="aspect-square h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(image.originalUrl)}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#CFE3D7] bg-[#F1F7F3] px-4 py-6 text-sm text-stone-500">
          Bạn đã xóa hết ảnh cũ. Hãy thêm ảnh mới để tiếp tục lưu bài viết.
        </div>
      )}
    </div>
  );
}

function Field({ label, input, error, className = "", helperText = "" }) {
  return (
    <div
      data-field={className.includes("field:") ? className.split("field:")[1].split(" ")[0] : undefined}
      className={`space-y-2 ${className.replace(/field:[^\s]+/, "").trim()}`}
    >
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-stone-800">{label}</label>
        {error ? (
          <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600">
            Thiếu thông tin
          </span>
        ) : null}
      </div>
      {input}
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      {!error && helperText ? <p className="text-xs leading-6 text-stone-500">{helperText}</p> : null}
    </div>
  );
}

function CategoryChipsField({ selectedSlugs, error, onToggle }) {
  return (
    <div
      data-field="categoryIds"
      className={`space-y-3 rounded-[28px] p-4 sm:col-span-2 ${
        error ? "border border-red-300 bg-red-50/60" : "bg-[#F1F7F3]"
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-medium text-stone-800">Danh mục trải nghiệm</label>
          {error ? (
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600">
              Bắt buộc chọn
            </span>
          ) : null}
        </div>
        <p className="text-xs leading-6 text-stone-500">
          Chọn một hoặc nhiều nhóm phù hợp để du khách tìm thấy bài đăng dễ hơn.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {CATEGORY_OPTIONS.map((category) => {
          const isSelected = selectedSlugs.includes(category.slug);

          return (
            <button
              key={category.slug}
              type="button"
              onClick={() => onToggle(category)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                isSelected ? category.activeClass : category.className
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

function DynamicListField({
  label,
  fieldName,
  items,
  error,
  onAdd,
  onChange,
  onRemove,
  canRemove,
  placeholder
}) {
  return (
    <div
      data-field={fieldName}
      className={`space-y-3 rounded-[28px] p-4 ${
        error ? "border border-red-300 bg-red-50/60" : "bg-[#F1F7F3]"
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label className="text-sm font-medium text-stone-800">{label}</label>
          {error ? (
            <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-600">
              Cần bổ sung
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#2F5D46] shadow-sm"
        >
          <Plus size={14} />
          Thêm
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={`${label}-${index}`} className="flex gap-2">
            <input
              value={item}
              onChange={(event) => onChange(index, event.target.value)}
              placeholder={placeholder}
              className={inputClass(error)}
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              disabled={!canRemove}
              className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-[#CFE3D7] bg-white text-[#486152] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
    </div>
  );
}

function ItineraryField({ scheduleType, sections, onAdd, onChange, onRemove, canRemove }) {
  return (
    <div className="space-y-4 rounded-[28px] bg-[#F1F7F3] p-4 sm:col-span-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <label className="text-sm font-medium text-stone-800">Lịch trình chi tiết</label>
          <p className="mt-1 text-xs leading-6 text-stone-500">
            Thêm các mốc như 08:00, Buổi sáng, Buổi chiều để khách hình dung rõ hành trình.
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#2F5D46] shadow-sm"
        >
          <Plus size={14} />
          Thêm mốc thời gian
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id ?? `itinerary-${index}`} className="rounded-3xl bg-white p-4 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-[110px_180px_1fr]">
              <Field
                label="Ngày"
                input={
                  <input
                    type="number"
                    min="1"
                    value={item.dayNumber ?? 1}
                    onChange={(event) => onChange(index, "dayNumber", event.target.value)}
                    placeholder="1"
                    className={inputClass(false)}
                  />
                }
              />

              <Field
                label="Mốc thời gian"
                input={
                  <input
                    value={item.timeTag}
                    onChange={(event) => onChange(index, "timeTag", event.target.value)}
                    placeholder="Ví dụ: 08:00 hoặc Buổi sáng"
                    className={inputClass(false)}
                  />
                }
              />

              <Field
                label="Tiêu đề"
                input={
                  <input
                    value={item.title}
                    onChange={(event) => onChange(index, "title", event.target.value)}
                    placeholder="Ví dụ: Khởi hành từ trung tâm Hà Giang"
                    className={inputClass(false)}
                  />
                }
              />
            </div>

            <div className="mt-4 flex gap-3">
              <div className="flex-1">
                <Field
                  label="Mô tả"
                  input={
                    <textarea
                      value={item.description}
                      onChange={(event) => onChange(index, "description", event.target.value)}
                      rows={3}
                      placeholder="Mô tả ngắn gọn hoạt động diễn ra ở mốc này"
                      className={inputClass(false)}
                    />
                  }
                />
              </div>
              <button
                type="button"
                onClick={() => onRemove(index)}
                disabled={!canRemove}
                className="mt-8 flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-[#CFE3D7] bg-white text-[#486152] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ItineraryFieldV2({ scheduleType, sections, onAdd, onChange, onRemove, canRemove }) {
  return (
    <div className="space-y-4 rounded-[28px] bg-[#F1F7F3] p-4 sm:col-span-2">
      <div className="space-y-2">
        <label className="text-sm font-medium text-stone-800">Lịch trình chi tiết</label>
        <p className="text-xs leading-6 text-stone-500">
          {scheduleType === "daily"
            ? "Mỗi ngày có một timeline riêng để bạn thêm các mốc giờ và hoạt động phù hợp."
            : "Thêm các mốc giờ như 08:00, 10:00 để mô tả trọn nhịp trải nghiệm trong ngày."}
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.dayNumber} className="rounded-3xl bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#1A3021]">{section.label}</p>
                <p className="mt-1 text-xs text-stone-500">
                  {scheduleType === "daily"
                    ? "Thêm các mốc giờ và hoạt động riêng cho ngày này."
                    : "Timeline chung cho trải nghiệm theo giờ."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onAdd(section.dayNumber)}
                className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#2F5D46] shadow-sm"
              >
                <Plus size={14} />
                Thêm mốc thời gian
              </button>
            </div>

            <div className="space-y-4">
              {section.items.length ? (
                section.items.map((item) => (
                  <div
                    key={item.id ?? `itinerary-v2-${item._index}`}
                    className="rounded-[24px] border border-[#DDEBE1] bg-[#F8FCF9] p-4"
                  >
                    <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
                      <Field
                        label="Mốc thời gian"
                        input={
                          <input
                            value={item.timeTag}
                            onChange={(event) => onChange(item._index, "timeTag", event.target.value)}
                            placeholder="Ví dụ: 08:00 hoặc Buổi sáng"
                            className={inputClass(false)}
                          />
                        }
                      />

                      <Field
                        label="Tiêu đề"
                        input={
                          <input
                            value={item.title}
                            onChange={(event) => onChange(item._index, "title", event.target.value)}
                            placeholder="Ví dụ: Khởi hành từ trung tâm Hà Giang"
                            className={inputClass(false)}
                          />
                        }
                      />
                    </div>

                    <div className="mt-4 flex gap-3">
                      <div className="flex-1">
                        <Field
                          label="Mô tả"
                          input={
                            <textarea
                              value={item.description}
                              onChange={(event) => onChange(item._index, "description", event.target.value)}
                              rows={3}
                              placeholder="Mô tả ngắn gọn hoạt động diễn ra ở mốc này"
                              className={inputClass(false)}
                            />
                          }
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(item._index)}
                        disabled={!canRemove}
                        className="mt-8 flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-[#CFE3D7] bg-white text-[#486152] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[24px] border border-dashed border-[#CFE3D7] bg-[#F1F7F3] px-4 py-6 text-sm text-stone-500">
                  Chưa có mốc thời gian nào cho {section.label.toLowerCase()}.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function inputClass(hasError) {
  return `w-full rounded-2xl border bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 ${
    hasError
      ? "border-red-300 focus:border-red-500 ring-4 ring-red-50"
      : "border-[#CFE3D7] focus:border-[#6E9C83]"
  }`;
}

function parseHourCount(duration) {
  if (!duration) return 1;

  const match = String(duration).match(/(\d+)/);
  return match ? Math.max(Number(match[1]) || 1, 1) : 1;
}

function buildDurationLabel(scheduleType, hourCount, dayCount) {
  if (scheduleType === "daily") {
    const totalDays = Math.max(Number(dayCount) || 1, 1);
    return `${totalDays} ngày`;
  }

  const totalHours = Math.max(Number(hourCount) || 1, 1);
  return `${totalHours} giờ`;
}

export default CreateExperienceForm;
