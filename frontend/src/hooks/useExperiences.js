import { useEffect, useState } from "react";
import api, { toAbsoluteAssetUrl } from "../services/api";

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
    categories: item.categories ?? [],
    averageRating,
    totalReviews,
    ownerId: item.ownerId,
    authorName: item.authorName || "Người dân bản địa",
    createdAt: item.createdAt
  };
}

export function useExperiences() {
  const [experiences, setExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchExperiences();
  }, []);

  async function fetchExperiences() {
    try {
      setIsLoading(true);
      const response = await api.get("/api/experiences");
      const normalized = (response.data ?? [])
        .map(normalizeExperience)
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

      setExperiences(normalized);
      setError("");
    } catch (fetchError) {
      setError(
        fetchError.response?.data?.message ||
          "Không thể tải danh sách trải nghiệm từ hệ thống."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return { experiences, isLoading, error, refreshExperiences: fetchExperiences };
}
