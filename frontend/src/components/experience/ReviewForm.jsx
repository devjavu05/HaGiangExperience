import { useEffect, useState } from "react";
import { LoaderCircle, Star } from "lucide-react";
import { motion } from "framer-motion";
import { submitReview } from "../../services/experienceService";

function ReviewForm({ experienceId, review, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const isEditing = Boolean(review?.id);

  useEffect(() => {
    setRating(Number(review?.rating ?? 0));
    setComment(review?.comment ?? "");
    setError("");
    setSuccessMessage("");
  }, [review?.id, review?.rating, review?.comment]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!rating) {
      setError("Vui lòng chọn số sao đánh giá.");
      return;
    }

    if (!comment.trim()) {
      setError("Vui lòng nhập bình luận của bạn.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      setSuccessMessage("");

      const savedReview = await submitReview(experienceId, {
        rating,
        comment: comment.trim()
      });

      setSuccessMessage(
        isEditing
          ? "Đánh giá của bạn đã được cập nhật."
          : "Cảm ơn bạn đã chia sẻ trải nghiệm!"
      );
      onSubmitted?.(savedReview);
    } catch (submitError) {
      setError(
        submitError.response?.data?.message || "Không thể gửi đánh giá lúc này. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const activeRating = hoveredRating || rating;

  return (
    <form onSubmit={handleSubmit} className="rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          {isEditing ? "Chỉnh sửa đánh giá" : "Chia sẻ cảm nhận"}
        </p>
        <h3 className="text-2xl font-bold text-[#1A3021]">
          {isEditing ? "Cập nhật cảm nhận của bạn" : "Bạn thấy trải nghiệm này thế nào?"}
        </h3>
      </div>

      <div className="mt-5 flex items-center gap-2">
        {Array.from({ length: 5 }, (_, index) => {
          const starValue = index + 1;
          const isActive = starValue <= activeRating;

          return (
            <button
              key={starValue}
              type="button"
              onMouseEnter={() => setHoveredRating(starValue)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => {
                setRating(starValue);
                setError("");
              }}
              className="transition-transform hover:scale-110"
              aria-label={`Chọn ${starValue} sao`}
            >
              <Star
                size={28}
                className={isActive ? "text-yellow-400" : "text-slate-300"}
                fill={isActive ? "currentColor" : "transparent"}
                strokeWidth={1.8}
              />
            </button>
          );
        })}
      </div>

      <textarea
        value={comment}
        onChange={(event) => {
          setComment(event.target.value);
          setError("");
        }}
        rows={5}
        placeholder="Viết vài dòng về cảm nhận của bạn sau hành trình này..."
        className="mt-5 w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#6E9C83] focus:bg-white"
      />

      {error ? <p className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <motion.button
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1A3021] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1A3021]/15 transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? <LoaderCircle size={16} className="animate-spin" /> : null}
          {isSubmitting
            ? isEditing
              ? "Đang cập nhật..."
              : "Đang gửi đánh giá..."
            : isEditing
              ? "Cập nhật đánh giá"
              : "Gửi đánh giá"}
        </motion.button>

        {successMessage ? (
          <div className="rounded-full bg-[#EAF5EE] px-4 py-2 text-sm font-medium text-[#2F5D46]">
            {successMessage}
          </div>
        ) : null}
      </div>
    </form>
  );
}

export default ReviewForm;
