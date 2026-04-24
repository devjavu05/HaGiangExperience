import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ExperienceDetail from "./ExperienceDetail";
import api, { toAbsoluteAssetUrl } from "../services/api";

function formatPrice(price) {
  if (price === null || price === undefined || Number.isNaN(Number(price))) {
    return "Lien he";
  }

  return `${new Intl.NumberFormat("vi-VN").format(Number(price))} VND`;
}

function normalizeReply(reply) {
  if (!reply) {
    return null;
  }

  return {
    hostName: reply.hostName || "Host",
    comment: reply.comment ?? "",
    createdAt: reply.createdAt
  };
}

function normalizeReview(review) {
  return {
    id: review.id,
    userId: review.userId,
    username: review.username || "Nguoi dung",
    avatarUrl: review.avatarUrl ? toAbsoluteAssetUrl(review.avatarUrl) : "",
    rating: review.rating ?? 0,
    comment: review.comment ?? "",
    reply: normalizeReply(review.reply),
    createdAt: review.createdAt
  };
}

function recalculateReviewSummary(reviews) {
  const totalReviews = reviews.length;

  if (!totalReviews) {
    return {
      totalReviews: 0,
      averageRating: 5
    };
  }

  const totalRating = reviews.reduce((sum, review) => sum + Number(review.rating ?? 0), 0);

  return {
    totalReviews,
    averageRating: Number((totalRating / totalReviews).toFixed(1))
  };
}

function normalizeExperience(item) {
  const itinerary = (item.itinerary ?? []).flatMap((dayItem) =>
    (dayItem.slots ?? []).map((slot) => ({
      id: slot.id,
      dayNumber: dayItem.day ?? 1,
      timeTag: slot.timeTag ?? "",
      title: slot.title ?? "",
      description: slot.description ?? ""
    }))
  );

  const reviews = (item.reviews ?? []).map(normalizeReview);
  const totalReviews = item.totalReviews ?? 0;
  const averageRating = totalReviews > 0 ? Number(item.averageRating ?? 0) : 5;

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    contentDetail: item.contentDetail,
    activities: item.activities ?? [],
    highlights: item.highlights ?? [],
    itinerary,
    duration: item.duration || "Dang cap nhat",
    price: formatPrice(item.price),
    priceValue: item.price,
    imageUrls: (item.imageUrls ?? []).map(toAbsoluteAssetUrl),
    location: item.address || "Ha Giang, Viet Nam",
    address: item.address || "",
    mapsPlaceId: item.mapsPlaceId || "",
    latitude: item.latitude ?? null,
    longitude: item.longitude ?? null,
    categories: item.categories ?? [],
    averageRating,
    totalReviews,
    reviews,
    ownerId: item.ownerId,
    authorName: item.authorName || "Nguoi dan ban dia",
    authorPhoneNumber: item.authorPhoneNumber || "",
    createdAt: item.createdAt
  };
}

function normalizePhoneForZalo(phoneNumber) {
  const normalized = String(phoneNumber ?? "").replace(/\D/g, "");

  if (!normalized) {
    return "";
  }

  if (normalized.startsWith("84")) {
    return normalized;
  }

  if (normalized.startsWith("0")) {
    return `84${normalized.slice(1)}`;
  }

  return normalized;
}

function ExperiencePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [experience, setExperience] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchExperience() {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/experiences/${id}`);
      setExperience(normalizeExperience(response.data));
      setError("");
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || "Khong the tai chi tiet trai nghiem.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchExperience();
  }, [id]);

  function handleReviewSubmitted(savedReview) {
    if (!savedReview) {
      return;
    }

    const normalizedReview = normalizeReview(savedReview);

    setExperience((currentExperience) => {
      if (!currentExperience) {
        return currentExperience;
      }

      const nextReviews = [...(currentExperience.reviews ?? [])];
      const existingIndex = nextReviews.findIndex((review) => review.id === normalizedReview.id);

      if (existingIndex >= 0) {
        nextReviews[existingIndex] = {
          ...nextReviews[existingIndex],
          ...normalizedReview
        };
      } else {
        const sameUserIndex = nextReviews.findIndex(
          (review) => review.userId === normalizedReview.userId
        );

        if (sameUserIndex >= 0) {
          nextReviews[sameUserIndex] = {
            ...nextReviews[sameUserIndex],
            ...normalizedReview
          };
        } else {
          nextReviews.unshift(normalizedReview);
        }
      }

      const summary = recalculateReviewSummary(nextReviews);

      return {
        ...currentExperience,
        reviews: nextReviews,
        averageRating: summary.averageRating,
        totalReviews: summary.totalReviews
      };
    });
  }

  function handleReplySubmitted(updatedReview) {
    if (!updatedReview) {
      return;
    }

    const normalizedReview = normalizeReview(updatedReview);

    setExperience((currentExperience) => {
      if (!currentExperience) {
        return currentExperience;
      }

      return {
        ...currentExperience,
        reviews: (currentExperience.reviews ?? []).map((review) =>
          review.id === normalizedReview.id
            ? {
                ...review,
                ...normalizedReview
              }
            : review
        )
      };
    });
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-[1600px] px-6 py-24 text-stone-500 sm:px-8 lg:px-12 xl:px-14 2xl:px-16">
        Dang tai trai nghiem...
      </div>
    );
  }

  if (error || !experience) {
    return (
      <div className="mx-auto w-full max-w-[1600px] px-6 py-24 text-terracotta-700 sm:px-8 lg:px-12 xl:px-14 2xl:px-16">
        {error || "Khong tim thay trai nghiem."}
      </div>
    );
  }

  return (
    <ExperienceDetail
      experience={experience}
      currentUser={user}
      onReviewSubmitted={handleReviewSubmitted}
      onReplySubmitted={handleReplySubmitted}
      onContact={() => {
        const zaloPhoneNumber = normalizePhoneForZalo(experience.authorPhoneNumber);
        if (!zaloPhoneNumber) {
          window.alert("Host chua cap nhat so dien thoai Zalo.");
          return;
        }

        window.open(`https://zalo.me/${zaloPhoneNumber}`, "_blank", "noopener,noreferrer");
      }}
    />
  );
}

export default ExperiencePage;
